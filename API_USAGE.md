# WorldGen API Usage Guide

## Starting the API Server

```bash
python api_server.py
```

The server will start on `http://localhost:8888` and the viewer will be available at `http://localhost:8080`.

## API Endpoints

### 1. Health Check
**Endpoint:** `GET /health`

**Example:**
```bash
curl http://localhost:8888/health
```

**Response:**
```json
{
  "status": "ok",
  "viewer_running": false,
  "device": "cuda"
}
```

### 2. Generate World
**Endpoint:** `POST /generate`

**Request Body:**
```json
{
  "prompt": "A cozy living room with a fireplace"
}
```

**Example using curl:**
```bash
curl -X POST http://localhost:8888/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "A beautiful mountain landscape"}'
```

**Example using Python:**
```python
import requests

response = requests.post(
    "http://localhost:8888/generate",
    json={"prompt": "A cozy living room with a fireplace"}
)

result = response.json()
print(f"Status: {result['status']}")
print(f"Viewer URL: {result['viewer_url']}")
```

**Example using JavaScript:**
```javascript
fetch('http://localhost:8888/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    prompt: 'A beautiful mountain landscape'
  })
})
  .then(response => response.json())
  .then(data => {
    console.log('Status:', data.status);
    console.log('Viewer URL:', data.viewer_url);
  });
```

**Response:**
```json
{
  "status": "complete",
  "viewer_url": "http://localhost:8080"
}
```

## Embedding the Viewer in Your Site

Once you've made a generate request, you can embed the viewer in your site using an iframe:

```html
<!DOCTYPE html>
<html>
<head>
    <title>My 3D World Viewer</title>
    <style>
        body, html {
            margin: 0;
            padding: 0;
            height: 100%;
            overflow: hidden;
        }
        iframe {
            width: 100%;
            height: 100%;
            border: none;
        }
    </style>
</head>
<body>
    <iframe src="http://localhost:8080"></iframe>
</body>
</html>
```

## Important Notes

1. **One Scene at a Time:** Each new generation request will stop and replace the previous viewer
2. **Synchronous Generation:** The API waits for generation to complete before responding (this may take 30-60 seconds)
3. **CORS:** If you need to access the API from a different origin, you may need to add CORS middleware to the FastAPI app
4. **GPU Required:** The generation requires a CUDA-capable GPU

## Adding CORS Support (if needed)

If you're accessing the API from a web app on a different origin, add this to `api_server.py`:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update this to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Troubleshooting

- **Port already in use:** Make sure no other process is using port 8888 or 8080
- **CUDA out of memory:** The API automatically detects low VRAM (<24GB) and enables low_vram mode
- **Generation takes too long:** This is normal - generation can take 30-90 seconds depending on your GPU
