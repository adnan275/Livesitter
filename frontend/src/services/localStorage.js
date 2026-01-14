const STORAGE_KEYS = {
    OVERLAYS: 'livesitter_overlays',
    RTSP_URL: 'livesitter_rtsp_url',
    STREAM_STATUS: 'livesitter_stream_status'
};

export const localStorageService = {
    saveOverlays: (overlays) => {
        try {
            localStorage.setItem(STORAGE_KEYS.OVERLAYS, JSON.stringify(overlays));
        } catch (error) {
            console.error('Error saving overlays to localStorage:', error);
        }
    },

    getOverlays: () => {
        try {
            const overlays = localStorage.getItem(STORAGE_KEYS.OVERLAYS);
            return overlays ? JSON.parse(overlays) : [];
        } catch (error) {
            console.error('Error reading overlays from localStorage:', error);
            return [];
        }
    },

    saveRtspUrl: (url) => {
        try {
            localStorage.setItem(STORAGE_KEYS.RTSP_URL, url);
        } catch (error) {
            console.error('Error saving RTSP URL to localStorage:', error);
        }
    },

    getRtspUrl: () => {
        try {
            return localStorage.getItem(STORAGE_KEYS.RTSP_URL) || 'rtsp://rtsp.stream/pattern';
        } catch (error) {
            console.error('Error reading RTSP URL from localStorage:', error);
            return 'rtsp://rtsp.stream/pattern';
        }
    },

    saveStreamStatus: (status) => {
        try {
            localStorage.setItem(STORAGE_KEYS.STREAM_STATUS, JSON.stringify(status));
        } catch (error) {
            console.error('Error saving stream status to localStorage:', error);
        }
    },

    getStreamStatus: () => {
        try {
            const status = localStorage.getItem(STORAGE_KEYS.STREAM_STATUS);
            return status ? JSON.parse(status) : { isStreaming: false, streamUrl: '' };
        } catch (error) {
            console.error('Error reading stream status from localStorage:', error);
            return { isStreaming: false, streamUrl: '' };
        }
    },

    clearAll: () => {
        try {
            Object.values(STORAGE_KEYS).forEach(key => {
                localStorage.removeItem(key);
            });
        } catch (error) {
            console.error('Error clearing localStorage:', error);
        }
    }
};

export default localStorageService;
