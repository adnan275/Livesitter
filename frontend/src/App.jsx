import { useState, useEffect } from 'react';
import VideoPlayer from './components/VideoPlayer';
import OverlayCanvas from './components/OverlayCanvas';
import OverlayControls from './components/OverlayControls';
import { overlayAPI, streamAPI } from './services/api';
import localStorageService from './services/localStorage';
import './index.css';

function App() {
  const [overlays, setOverlays] = useState(() => localStorageService.getOverlays());
  const [streamUrl, setStreamUrl] = useState('');
  const [rtspInput, setRtspInput] = useState(() => localStorageService.getRtspUrl());
  const [isStreaming, setIsStreaming] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOverlays();
    checkStreamStatus();
  }, []);

  useEffect(() => {
    localStorageService.saveOverlays(overlays);
  }, [overlays]);

  useEffect(() => {
    localStorageService.saveRtspUrl(rtspInput);
  }, [rtspInput]);

  const fetchOverlays = async () => {
    try {
      const response = await overlayAPI.getAll();
      setOverlays(response.data);
    } catch (error) {
      console.error('Error fetching overlays:', error);
    }
  };

  const checkStreamStatus = async () => {
    try {
      const response = await streamAPI.getStatus();
      if (response.data.isStreaming) {
        setIsStreaming(true);
        setStreamUrl(`http://localhost:5001${response.data.hlsUrl}`);
      }
    } catch (error) {
      console.error('Error checking stream status:', error);
    }
  };

  const handleStartStream = async () => {
    setLoading(true);
    try {
      const isDirectStream = rtspInput.includes('.m3u8') ||
        rtspInput.includes('.mp4') ||
        rtspInput.startsWith('http');

      if (isDirectStream) {
        setStreamUrl(rtspInput);
        setIsStreaming(true);
        setLoading(false);
      } else {
        const response = await streamAPI.start(rtspInput);
        setStreamUrl(`http://localhost:5001${response.data.hlsUrl}`);
        setIsStreaming(true);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error starting stream:', error);
      alert('Failed to start stream. Make sure the URL is valid and FFmpeg is installed for RTSP streams.');
      setLoading(false);
    }
  };

  const handleStopStream = async () => {
    try {
      const isDirectStream = rtspInput.includes('.m3u8') ||
        rtspInput.includes('.mp4') ||
        rtspInput.startsWith('http');

      if (isDirectStream) {
        setStreamUrl('');
        setIsStreaming(false);
      } else {
        await streamAPI.stop();
        setStreamUrl('');
        setIsStreaming(false);
      }
    } catch (error) {
      console.error('Error stopping stream:', error);
      setStreamUrl('');
      setIsStreaming(false);
    }
  };

  const handleUpdateOverlay = (updatedOverlay) => {
    setOverlays(overlays.map(o =>
      o._id === updatedOverlay._id ? updatedOverlay : o
    ));
  };

  const handleDeleteOverlay = (id) => {
    setOverlays(overlays.filter(o => o._id !== id));
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>RTSP Livestream Overlay</h1>
        <p>Real-time video streaming with custom overlays</p>
      </header>

      <div className="main-container">
        <div className="video-section">
          <div className="stream-controls">
            <input
              type="text"
              placeholder="Enter RTSP URL or direct HLS/MP4 URL..."
              value={rtspInput}
              onChange={(e) => setRtspInput(e.target.value)}
              className="rtsp-input"
              disabled={isStreaming}
            />
            {!isStreaming ? (
              <button
                onClick={handleStartStream}
                className="stream-btn start"
                disabled={loading}
              >
                {loading ? 'Starting...' : 'Start Stream'}
              </button>
            ) : (
              <button
                onClick={handleStopStream}
                className="stream-btn stop"
              >
                Stop Stream
              </button>
            )}
          </div>

          <div className="video-container">
            {streamUrl ? (
              <>
                <VideoPlayer
                  streamUrl={streamUrl}
                  isDirectUrl={rtspInput.includes('.m3u8') || rtspInput.includes('.mp4') || rtspInput.startsWith('http')}
                />
                <OverlayCanvas
                  overlays={overlays}
                  onUpdateOverlay={handleUpdateOverlay}
                  onDeleteOverlay={handleDeleteOverlay}
                />
              </>
            ) : (
              <div className="placeholder">
                <h2>No Stream Active</h2>
                <p>Enter an RTSP URL or direct video URL and click "Start Stream"</p>
                <div style={{ marginTop: '1rem', fontSize: '0.9rem', opacity: 0.7 }}>
                  <p>Examples:</p>
                  <p>• RTSP: rtsp://rtsp.stream/pattern</p>
                  <p>• HLS: https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8</p>
                  <p>• MP4: https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="controls-section">
          <OverlayControls
            overlays={overlays}
            onOverlaysChange={setOverlays}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
