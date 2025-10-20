import viser
import torch
import os
import numpy as np
from PIL import Image
from typing import Optional
import time
from pathlib import Path
from worldgen.utils.splat_utils import SplatFile
from worldgen import WorldGen
import threading
import signal
import sys
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
from scipy.spatial.transform import Rotation as R


class GenerateRequest(BaseModel):
    prompt: str


class GenerateResponse(BaseModel):
    status: str
    viewer_url: str


class ViserServerManager:
    """Manages the Viser server lifecycle for API usage"""

    def __init__(self):
        self.server = None
        self.server_thread = None
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.worldgen = None
        self.is_running = False

    def stop_server(self):
        """Stop the current Viser server if running"""
        if self.server is not None:
            print("Stopping existing Viser server...")
            try:
                # Properly close the Viser server to release the port
                self.server.stop()
            except Exception as e:
                print(f"Error stopping server: {e}")

            self.is_running = False
            self.server = None
            self.server_thread = None
            # Give the port time to be released
            time.sleep(2)

    def generate_and_serve(self, prompt: str, port: int = 8080):
        """Generate world and start Viser server"""
        # Stop any existing server
        self.stop_server()

        # Initialize WorldGen if needed
        if self.worldgen is None:
            print("Initializing WorldGen...")
            self.worldgen = WorldGen(
                mode="t2s",
                inpaint_bg=False,
                resolution=1600,
                device=self.device,
                low_vram=torch.cuda.get_device_properties(0).total_memory / (1024 ** 3) < 24
            )

        # Generate the world
        print(f"Generating world for prompt: '{prompt}'")
        scene = self.worldgen.generate_world(prompt, return_mesh=False)

        # Create new Viser server
        print(f"Starting Viser server on port {port}...")
        self.server = viser.ViserServer(port=port)
        self.server.scene.set_up_direction("-y")
        self.server.scene.enable_default_lights(False)

        # Add the generated scene
        self._add_gs(scene)
        self._set_bg(scene)
        self._add_original_camera()

        print(f"✨ World successfully generated and served at http://localhost:{port}")
        self.is_running = True

        # Set up client connection handlers
        @self.server.on_client_connect
        def connect(client: viser.ClientHandle) -> None:
            self._create_ui(client)

        return f"http://localhost:{port}"

    def _add_gs(self, splat: SplatFile):
        """Add gaussian splats to the scene"""
        # Convert to float32 to avoid BFloat16 errors
        centers = np.asarray(splat.centers, dtype=np.float32)
        rgbs = np.asarray(splat.rgbs, dtype=np.float32)
        opacities = np.asarray(splat.opacities, dtype=np.float32)
        covariances = np.asarray(splat.covariances, dtype=np.float32)

        self.scene_gs_handle = self.server.scene.add_gaussian_splats(
            "/scene_gs",
            centers=centers,
            rgbs=rgbs,
            opacities=opacities,
            covariances=covariances,
        )

    def _set_bg(self, splat: SplatFile):
        """Set background color based on farthest splat points"""
        position = np.linalg.norm(splat.centers, axis=1)
        indices = np.argsort(position)[-5:]
        farthest_point_color = splat.rgbs[indices]
        farthest_point_color = np.mean(farthest_point_color, axis=0)
        bg_img = np.ones((1, 1, 3)) * farthest_point_color
        self.server.scene.set_background_image(bg_img)

    def _add_original_camera(self):
        """Add the original camera frustum"""
        h, w = 1080, 1920
        fov = np.deg2rad(90)
        aspect = w / h
        self.original_camera = self.server.scene.add_camera_frustum(
            "original_camera", fov, aspect
        )
        self.original_camera.visible = False

    def _create_ui(self, client):
        """Create minimal UI for the viewer"""
        initial_fov_rad = self.original_camera.fov
        client.camera.position = (0, 0, 0)
        client.camera.wxyz = (1, 0, 0, 0)
        client.camera.fov = initial_fov_rad
        client.camera.far = 10000
        client.camera.near = 0.01

        # Disable the scene tree only, keep other GUI elements
        client.scene.show_scene_tree = False

        @self.original_camera.on_click
        def _(_):
            with client.atomic():
                client.camera.wxyz = self.original_camera.wxyz
                client.camera.position = self.original_camera.position
                client.camera.fov = self.original_camera.fov


# Initialize FastAPI app and ViserServerManager
app = FastAPI(title="WorldGen API", version="1.0.0")

# Add CORS middleware to allow requests from any origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (file:// and http://)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

viser_manager = ViserServerManager()


@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {
        "status": "ok",
        "viewer_running": viser_manager.is_running,
        "device": str(viser_manager.device)
    }


@app.post("/generate", response_model=GenerateResponse)
def generate_world(request: GenerateRequest):
    """Generate a 3D world from a text prompt"""
    try:
        # Validate prompt
        if not request.prompt or len(request.prompt.strip()) == 0:
            raise HTTPException(status_code=400, detail="Prompt cannot be empty")

        # Generate and serve
        viewer_url = viser_manager.generate_and_serve(request.prompt, port=8080)

        return GenerateResponse(
            status="complete",
            viewer_url=viewer_url
        )

    except Exception as e:
        print(f"Error during generation: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Generation failed: {str(e)}")


@app.on_event("shutdown")
def shutdown_event():
    """Clean up on server shutdown"""
    viser_manager.stop_server()


if __name__ == "__main__":
    print("=" * 70)
    print("🚀 Starting WorldGen API Server on http://localhost:8888")
    print("=" * 70)
    print("\nEndpoints:")
    print("  POST /generate - Generate a 3D world from a prompt")
    print("  GET  /health   - Check server health")
    print("\nViewer will be available at http://localhost:8080")
    print("=" * 70)

    # Handle Ctrl+C gracefully
    def signal_handler(sig, frame):
        print("\nShutting down API server...")
        viser_manager.stop_server()
        sys.exit(0)

    signal.signal(signal.SIGINT, signal_handler)

    # Run the FastAPI server
    uvicorn.run(app, host="0.0.0.0", port=8888, log_level="info")
