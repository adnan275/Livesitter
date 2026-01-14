import express from 'express';
import Overlay from '../models/Overlay.js';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const overlay = new Overlay(req.body);
        await overlay.save();
        res.status(201).json(overlay);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const overlays = await Overlay.find().sort({ zIndex: 1 });
        res.json(overlays);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const overlay = await Overlay.findById(req.params.id);
        if (!overlay) {
            return res.status(404).json({ error: 'Overlay not found' });
        }
        res.json(overlay);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const overlay = await Overlay.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!overlay) {
            return res.status(404).json({ error: 'Overlay not found' });
        }
        res.json(overlay);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const overlay = await Overlay.findByIdAndDelete(req.params.id);
        if (!overlay) {
            return res.status(404).json({ error: 'Overlay not found' });
        }
        res.json({ message: 'Overlay deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
