import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';

const VideoPlayer = ({ streamUrl, isDirectUrl = false }) => {
    const videoRef = useRef(null);
    const hlsRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!streamUrl || !videoRef.current) return;

        const video = videoRef.current;
        setIsLoading(true);
        setError(null);

        if (isDirectUrl) {
            video.src = streamUrl;
            video.addEventListener('loadedmetadata', () => {
                setIsLoading(false);
            });
            video.addEventListener('error', () => {
                setError('Failed to load video stream');
                setIsLoading(false);
            });
            return;
        }

        if (Hls.isSupported()) {
            const hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true,
                backBufferLength: 90
            });

            hlsRef.current = hls;

            hls.loadSource(streamUrl);
            hls.attachMedia(video);

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                setIsLoading(false);
                console.log('HLS manifest loaded');
            });

            hls.on(Hls.Events.ERROR, (event, data) => {
                if (data.fatal) {
                    setError('Failed to load video stream');
                    setIsLoading(false);
                    console.error('HLS error:', data);
                }
            });

            return () => {
                hls.destroy();
            };
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = streamUrl;
            video.addEventListener('loadedmetadata', () => {
                setIsLoading(false);
            });
            video.addEventListener('error', () => {
                setError('Failed to load video stream');
                setIsLoading(false);
            });
        } else {
            setError('HLS is not supported in this browser');
            setIsLoading(false);
        }
    }, [streamUrl, isDirectUrl]);

    const togglePlay = () => {
        if (!videoRef.current) return;

        if (isPlaying) {
            videoRef.current.pause();
        } else {
            videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (videoRef.current) {
            videoRef.current.volume = newVolume;
        }
        setIsMuted(newVolume === 0);
    };

    const toggleMute = () => {
        if (!videoRef.current) return;

        const newMuted = !isMuted;
        setIsMuted(newMuted);
        videoRef.current.muted = newMuted;
    };

    return (
        <div className="video-player-container">
            <div className="video-wrapper">
                <video
                    ref={videoRef}
                    className="video-element"
                    playsInline
                />

                {isLoading && (
                    <div className="video-overlay loading">
                        <div className="spinner"></div>
                        <p>Loading stream...</p>
                    </div>
                )}

                {error && (
                    <div className="video-overlay error">
                        <p>{error}</p>
                        <p style={{ fontSize: '0.9rem', marginTop: '0.5rem', opacity: 0.7 }}>
                            Make sure FFmpeg is installed or use a direct HLS/MP4 URL
                        </p>
                    </div>
                )}
            </div>

            <div className="video-controls">
                <button
                    className="control-btn play-btn"
                    onClick={togglePlay}
                    disabled={isLoading || error}
                >
                    {isPlaying ? <FaPause /> : <FaPlay />}
                </button>

                <div className="volume-control">
                    <button className="control-btn" onClick={toggleMute}>
                        {isMuted || volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
                    </button>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={volume}
                        onChange={handleVolumeChange}
                        className="volume-slider"
                    />
                </div>
            </div>
        </div>
    );
};

export default VideoPlayer;
