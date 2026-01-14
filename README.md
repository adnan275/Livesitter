# RTSP Livestream Overlay Web Application

A full-stack web application that plays livestream video from an RTSP source and allows users to create, manage, and display custom overlays on top of the video in real-time.

## Features

### 🎥 Video Streaming
- RTSP stream playback converted to HLS for browser compatibility
- Play, Pause, and Volume controls
- Real-time video streaming with low latency

### 🎨 Overlay Management
- **Text Overlays**: Add custom text with configurable color and font size
- **Image Overlays**: Add images/logos via URL
- **Drag & Drop**: Freely position overlays anywhere on the video
- **Resizable**: Adjust overlay size with resize handles
- **Real-time Updates**: Changes are immediately visible on the stream
- **Persistent Storage**: All overlays saved to MongoDB

### 💎 Premium UI/UX
- Modern dark theme with bluish accents
- Glassmorphism effects and smooth animations
- Responsive layout for all screen sizes
- Intuitive controls and visual feedback

## Tech Stack

### Backend
- **Node.js** with **Express** - REST API server
- **MongoDB** with **Mongoose** - Database and ODM
- **FFmpeg** - RTSP to HLS stream conversion
- **fluent-ffmpeg** - FFmpeg wrapper for Node.js

### Frontend
- **React** with **Vite** - Modern frontend framework
- **HLS.js** - HLS video playback in browser
- **react-rnd** - Draggable and resizable components
- **Axios** - HTTP client
- **React Icons** - Icon library

## Prerequisites

Before running this application, ensure you have:

1. **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
2. **MongoDB** - [Download](https://www.mongodb.com/try/download/community) or use MongoDB Atlas
3. **FFmpeg** - Required for RTSP to HLS conversion
   - **macOS**: `brew install ffmpeg`
   - **Ubuntu**: `sudo apt install ffmpeg`
   - **Windows**: Download from [ffmpeg.org](https://ffmpeg.org/download.html)

## Installation

### 1. Clone or Navigate to Project
```bash
cd /Users/adnanrizvi/Desktop/livesitter
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Configure environment variables in `.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/livesitter
RTSP_URL=rtsp://rtsp.stream/pattern
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

## Running the Application

### Start MongoDB
Make sure MongoDB is running on your system:
```bash
# macOS/Linux
mongod

# Or use MongoDB Atlas cloud database
```

### Start Backend Server
```bash
cd backend
npm run dev
```
Backend will run on `http://localhost:5000`

### Start Frontend Development Server
```bash
cd frontend
npm run dev
```
Frontend will run on `http://localhost:5173`

## Usage

1. **Open the Application**: Navigate to `http://localhost:5173` in your browser

2. **Start Stream**:
   - Enter an RTSP URL (default: `rtsp://rtsp.stream/pattern`)
   - Click "Start Stream" button
   - Wait for the video to load

3. **Add Text Overlay**:
   - Click "Add Text Overlay"
   - Enter your text
   - Choose color and font size
   - Click "Create"
   - Drag and resize the overlay on the video

4. **Add Image Overlay**:
   - Click "Add Image Overlay"
   - Enter an image URL
   - Click "Create"
   - Drag and resize the overlay on the video

5. **Manage Overlays**:
   - Toggle visibility with the eye icon
   - Delete overlays with the trash icon
   - All changes are saved automatically

## API Endpoints

### Overlays
- `POST /api/overlays` - Create new overlay
- `GET /api/overlays` - Get all overlays
- `GET /api/overlays/:id` - Get single overlay
- `PUT /api/overlays/:id` - Update overlay
- `DELETE /api/overlays/:id` - Delete overlay

### Stream
- `POST /api/stream/start` - Start RTSP to HLS conversion
- `POST /api/stream/stop` - Stop stream conversion
- `GET /api/stream/status` - Get stream status

### Health
- `GET /api/health` - Server health check

## Project Structure

```
livesitter/
├── backend/
│   ├── models/
│   │   └── Overlay.js          # Mongoose overlay schema
│   ├── routes/
│   │   ├── overlays.js         # Overlay CRUD routes
│   │   └── stream.js           # Stream management routes
│   ├── .env                    # Environment variables
│   ├── server.js               # Main server file
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── VideoPlayer.jsx       # HLS video player
│   │   │   ├── DraggableOverlay.jsx  # Individual overlay
│   │   │   ├── OverlayCanvas.jsx     # Overlay container
│   │   │   └── OverlayControls.jsx   # Control panel
│   │   ├── services/
│   │   │   └── api.js                # API service layer
│   │   ├── App.jsx                   # Main app component
│   │   ├── index.css                 # Global styles
│   │   └── main.jsx                  # Entry point
│   └── package.json
│
└── README.md
```

## Testing RTSP Sources

### Free RTSP Test Streams
- `rtsp://rtsp.stream/pattern` - Test pattern
- `rtsp://rtsp.stream/movie` - Sample movie
- Use [RTSP.me](https://rtsp.me/) to create temporary streams from videos

### Custom RTSP URL
You can use any valid RTSP URL from:
- IP cameras
- Streaming servers
- Custom RTSP sources

## Troubleshooting

### Stream Not Loading
- Verify FFmpeg is installed: `ffmpeg -version`
- Check RTSP URL is valid and accessible
- Ensure backend server is running
- Check browser console for errors

### MongoDB Connection Error
- Verify MongoDB is running
- Check `MONGO_URI` in backend `.env` file
- For MongoDB Atlas, ensure IP whitelist is configured

### Overlays Not Saving
- Check backend server logs
- Verify MongoDB connection
- Ensure API endpoints are accessible

### CORS Errors
- Backend CORS is configured for all origins
- If issues persist, check browser console

## Browser Compatibility

- ✅ Chrome/Edge (Recommended)
- ✅ Firefox
- ✅ Safari (native HLS support)
- ⚠️ Older browsers may not support HLS.js

## Performance Notes

- HLS streaming introduces 2-10 seconds of latency
- For lower latency, consider WebRTC alternatives
- FFmpeg conversion uses server resources
- Recommended: 4GB RAM minimum for smooth operation

## License

This project is created for internship assignment purposes.

## Author

Adnan Rizvi

---

**Note**: This application requires FFmpeg for RTSP to HLS conversion. Make sure it's installed and accessible in your system PATH.
