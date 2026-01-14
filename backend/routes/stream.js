import express from 'express';
import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

let streamProcess = null;
let isStreaming = false;

router.post('/start', async (req, res) => {
    try {
        const { rtspUrl } = req.body;

        if (!rtspUrl) {
            return res.status(400).json({ error: 'RTSP URL is required' });
        }

        if (isStreaming) {
            return res.status(400).json({ error: 'Stream is already running' });
        }

        const hlsDir = path.join(__dirname, '..', 'hls');
        if (!fs.existsSync(hlsDir)) {
            fs.mkdirSync(hlsDir, { recursive: true });
        }

        const outputPath = path.join(hlsDir, 'stream.m3u8');

        streamProcess = ffmpeg(rtspUrl)
            .addOptions([
                '-c:v copy',
                '-c:a aac',
                '-hls_time 2',
                '-hls_list_size 10',
                '-hls_flags delete_segments',
                '-start_number 1',
                '-f hls'
            ])
            .output(outputPath)
            .on('start', (commandLine) => {
                console.log('FFmpeg process started:', commandLine);
                isStreaming = true;
            })
            .on('error', (err) => {
                console.error('FFmpeg error:', err.message);
                isStreaming = false;
                streamProcess = null;
            })
            .on('end', () => {
                console.log('Stream ended');
                isStreaming = false;
                streamProcess = null;
            });

        streamProcess.run();

        res.json({
            message: 'Stream started successfully',
            hlsUrl: '/hls/stream.m3u8'
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/stop', async (req, res) => {
    try {
        if (!isStreaming || !streamProcess) {
            return res.status(400).json({ error: 'No stream is currently running' });
        }

        streamProcess.kill('SIGKILL');
        streamProcess = null;
        isStreaming = false;

        res.json({ message: 'Stream stopped successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/status', async (req, res) => {
    res.json({
        isStreaming,
        hlsUrl: isStreaming ? '/hls/stream.m3u8' : null
    });
});

export default router;
