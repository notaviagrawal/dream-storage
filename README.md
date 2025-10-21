# Dream Storage - Visualize Your Dreams in 3D

Ever wake up from a vivid dream and wish you could step back inside? Dream Storage turns your dream descriptions into explorable 3D worlds. Simply record what you dreamed about each morning, and watch as AI transforms your memories into immersive 3D environments you can revisit anytime.

## Why Dream Storage?

Dreams fade quickly after waking. Dream Storage helps you:
- **Preserve your dreams** as interactive 3D experiences
- **Build a personal dream library** to explore over time
- **Revisit meaningful dreams** whenever you want
- **Share dream worlds** with friends and family

## Quick Start

### Prerequisites

- Python 3.8+
- CUDA-capable GPU (16GB+ VRAM, 24GB recommended)
- Node.js 16+ (for the web interface)
- Modern web browser

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/dream-storage.git
cd dream-storage

# Install Python dependencies for the backend
pip install -r requirements.txt

# Install Node dependencies for the web viewer
cd dream-viewer
npm install
cd ..
```

### Running Dream Storage

You need to run both the backend API server and the frontend web viewer:

#### 1. Start the Backend API Server

```bash
cd backend
python api_server.py
```

This starts the API server on `http://localhost:8888` and reserves port `8080` for the 3D viewer.

#### 2. Start the Web Viewer

In a new terminal:

```bash
cd dream-viewer
npm run dev
```

The web interface will be available at `http://localhost:5173`

#### 3. Record Your Dreams

1. Open `http://localhost:5173` in your browser
2. Choose your input mode:
   - 🎤 **Voice**: Click the microphone and speak your dream (Chrome/Edge only)
   - ⌨️ **Text**: Click the text icon and type your dream description
3. Click "generate" and wait 30-90 seconds
4. Explore your dream world in the interactive 3D viewer

## Features

### Dream Viewer App
- **Voice Input** - Speak your dreams using Web Speech API (Chrome/Edge)
- **Text Input** - Type detailed dream descriptions
- **Galaxy Theme** - Beautiful animated starfield background
- **Smooth Animations** - Framer Motion powered transitions
- **3D Viewer** - Interactive embedded viewer with navigation controls
- **Responsive** - Works on desktop and mobile devices

### Backend API
- **FastAPI Server** - RESTful API for dream generation
- **Automatic GPU Detection** - Optimizes settings based on VRAM
- **CORS Support** - Access from any origin
- **Health Monitoring** - Check API and viewer status

## API Usage

If you want to integrate Dream Storage into your own application:

### Health Check
```bash
curl http://localhost:8888/health
```

Response:
```json
{
  "status": "ok",
  "viewer_running": false,
  "device": "cuda"
}
```

### Generate Dream World
```bash
curl -X POST http://localhost:8888/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "I was floating in a purple sky with clouds made of cotton candy"}'
```

Response:
```json
{
  "status": "complete",
  "viewer_url": "http://localhost:8080"
}
```

See `backend/API_USAGE.md` for more detailed API documentation.

## Tips for Better Dream Visualization

- **Be specific** about lighting, colors, and atmosphere
- **Describe the mood** and feeling of the dream
- **Mention spatial relationships** - what's near what
- **Include textures and materials** - soft, metallic, fuzzy, etc.
- **Note surreal elements** - impossible physics, strange combinations

**Example**: Instead of "a beach"

Try: "A sunset beach with glowing pink sand, calm turquoise water that sparkles like crystals, and giant palm trees with purple leaves swaying in warm golden light"

## System Requirements

- **GPU**: NVIDIA with 16GB+ VRAM (24GB recommended)
  - Auto-detects and enables low VRAM mode for GPUs <24GB
- **RAM**: 16GB+ system memory
- **Storage**: 5GB+ for model weights and generated worlds
- **Browser**:
  - Chrome/Edge (full support with voice input)
  - Firefox/Safari (text input only)

## Technical Stack

### Backend
- **WorldGen**: AI model for text-to-3D generation
- **Viser**: Interactive 3D visualization server
- **FastAPI**: Modern Python API framework
- **Gaussian Splatting**: High-quality real-time 3D rendering
- **PyTorch**: Deep learning backend
- **Uvicorn**: ASGI web server

### Frontend
- **React 19**: UI framework
- **Vite**: Fast build tool and dev server
- **Framer Motion**: Smooth animations
- **Web Speech API**: Voice recognition
- **Modern CSS**: Galaxy theme with animated stars

## Project Structure

```
dream-storage/
├── backend/
│   ├── api_server.py      # FastAPI server
│   └── API_USAGE.md       # API documentation
├── dream-viewer/
│   ├── src/               # React app source
│   ├── package.json       # Node dependencies
│   └── README.md          # Viewer docs
└── README.md              # This file
```

## Troubleshooting

**Port already in use**
- Make sure ports 8888 and 8080 are free
- Kill any existing processes using these ports

**CUDA out of memory**
- The API automatically enables low VRAM mode for GPUs <24GB
- Close other GPU-intensive applications

**Voice input not working**
- Use Chrome or Edge browser
- Grant microphone permissions when prompted
- Fall back to text input if needed

**Generation takes too long**
- Normal generation time: 30-90 seconds depending on GPU
- Ensure no other processes are using GPU resources


## Acknowledgments

Built with WorldGen AI technology for text-to-3D scene generation.
