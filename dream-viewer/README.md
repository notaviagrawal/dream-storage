# Dream Viewer

A beautiful, dreamy React app for generating 3D worlds from text prompts using voice or text input.

## Features

- 🎤 **Voice Input** - Use Web Speech API to speak your prompts
- ⌨️ **Text Input** - Type your prompts manually
- 🌌 **Galaxy Theme** - Deep purple/blue gradient with animated stars
- ✨ **Smooth Animations** - Framer Motion powered transitions
- 🖼️ **3D Viewer** - Embedded viewer with rounded canvas
- 📱 **Responsive** - Works on desktop and mobile

## Getting Started

### Prerequisites

Make sure the API server is running:
```bash
# In the parent directory
python api_server.py
```

### Installation

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev
```

The app will be available at `http://localhost:5173`

## Usage

1. **Choose Input Mode**
   - Click the microphone icon for voice input
   - Click the text icon for manual text input

2. **Enter Your Prompt**
   - Voice: Click the mic button and speak your vision
   - Text: Type your description in the text area

3. **Generate**
   - Click the "generate" button that fades in
   - Wait 30-90 seconds for your world to be created
   - View your 3D world in the rounded canvas viewer

4. **Navigate**
   - Click "back" to return to input page
   - Try again with a new prompt

## Tech Stack

- **React** - UI framework
- **Vite** - Build tool
- **Framer Motion** - Animations
- **Web Speech API** - Voice recognition (Chrome/Edge only)

## Browser Support

- ✅ Chrome/Edge - Full support including voice input
- ✅ Firefox/Safari - Text input only (no voice support)

## API Integration

The app connects to `http://localhost:8888` for world generation. Make sure the API server is running before using the app.

## Customization

### Colors
Edit `src/styles/globals.css` to change the galaxy gradient colors.

### Animations
Modify Framer Motion settings in component files for different animation effects.

## License

MIT
