import { useState } from 'react';
import { FaPlus, FaImage, FaFont, FaEye, FaEyeSlash, FaTrash } from 'react-icons/fa';
import { overlayAPI } from '../services/api';

const OverlayControls = ({ overlays, onOverlaysChange }) => {
    const [textContent, setTextContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [textColor, setTextColor] = useState('#ffffff');
    const [fontSize, setFontSize] = useState(16);
    const [showTextForm, setShowTextForm] = useState(false);
    const [showImageForm, setShowImageForm] = useState(false);

    const handleAddTextOverlay = async () => {
        if (!textContent.trim()) return;

        const newOverlay = {
            type: 'text',
            content: textContent,
            position: { x: 50, y: 50 },
            size: { width: 200, height: 100 },
            style: {
                color: textColor,
                fontSize: fontSize,
                fontWeight: 'normal',
                backgroundColor: 'rgba(0, 0, 0, 0.5)'
            },
            visible: true,
            zIndex: overlays.length + 1
        };

        try {
            const response = await overlayAPI.create(newOverlay);
            onOverlaysChange([...overlays, response.data]);
            setTextContent('');
            setShowTextForm(false);
        } catch (error) {
            console.error('Error creating text overlay:', error);
        }
    };

    const handleAddImageOverlay = async () => {
        if (!imageUrl.trim()) return;

        const newOverlay = {
            type: 'image',
            content: imageUrl,
            position: { x: 100, y: 100 },
            size: { width: 150, height: 150 },
            visible: true,
            zIndex: overlays.length + 1
        };

        try {
            const response = await overlayAPI.create(newOverlay);
            onOverlaysChange([...overlays, response.data]);
            setImageUrl('');
            setShowImageForm(false);
        } catch (error) {
            console.error('Error creating image overlay:', error);
        }
    };

    const toggleVisibility = async (overlay) => {
        const updated = { ...overlay, visible: !overlay.visible };
        try {
            await overlayAPI.update(overlay._id, updated);
            onOverlaysChange(overlays.map(o => o._id === overlay._id ? updated : o));
        } catch (error) {
            console.error('Error toggling visibility:', error);
        }
    };

    const deleteOverlay = async (id) => {
        try {
            await overlayAPI.delete(id);
            onOverlaysChange(overlays.filter(o => o._id !== id));
        } catch (error) {
            console.error('Error deleting overlay:', error);
        }
    };

    return (
        <div className="overlay-controls">
            <h2>Overlay Controls</h2>

            <div className="add-overlay-section">
                <button
                    className="add-btn text-btn"
                    onClick={() => {
                        setShowTextForm(!showTextForm);
                        setShowImageForm(false);
                    }}
                >
                    <FaFont /> Add Text Overlay
                </button>

                {showTextForm && (
                    <div className="overlay-form">
                        <input
                            type="text"
                            placeholder="Enter text..."
                            value={textContent}
                            onChange={(e) => setTextContent(e.target.value)}
                            className="form-input"
                        />
                        <div className="form-row">
                            <label>
                                Color:
                                <input
                                    type="color"
                                    value={textColor}
                                    onChange={(e) => setTextColor(e.target.value)}
                                    className="color-input"
                                />
                            </label>
                            <label>
                                Size:
                                <input
                                    type="number"
                                    value={fontSize}
                                    onChange={(e) => setFontSize(Number(e.target.value))}
                                    min="10"
                                    max="72"
                                    className="size-input"
                                />
                            </label>
                        </div>
                        <button onClick={handleAddTextOverlay} className="submit-btn">
                            <FaPlus /> Create
                        </button>
                    </div>
                )}

                <button
                    className="add-btn image-btn"
                    onClick={() => {
                        setShowImageForm(!showImageForm);
                        setShowTextForm(false);
                    }}
                >
                    <FaImage /> Add Image Overlay
                </button>

                {showImageForm && (
                    <div className="overlay-form">
                        <input
                            type="text"
                            placeholder="Enter image URL..."
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            className="form-input"
                        />
                        <button onClick={handleAddImageOverlay} className="submit-btn">
                            <FaPlus /> Create
                        </button>
                    </div>
                )}
            </div>

            <div className="overlay-list">
                <h3>Active Overlays ({overlays.length})</h3>
                {overlays.map((overlay) => (
                    <div key={overlay._id} className="overlay-item">
                        <div className="overlay-info">
                            <span className="overlay-type">
                                {overlay.type === 'text' ? <FaFont /> : <FaImage />}
                            </span>
                            <span className="overlay-content-preview">
                                {overlay.type === 'text'
                                    ? overlay.content.substring(0, 20)
                                    : 'Image'}
                            </span>
                        </div>
                        <div className="overlay-actions">
                            <button
                                onClick={() => toggleVisibility(overlay)}
                                className="action-btn"
                                title={overlay.visible ? 'Hide' : 'Show'}
                            >
                                {overlay.visible ? <FaEye /> : <FaEyeSlash />}
                            </button>
                            <button
                                onClick={() => deleteOverlay(overlay._id)}
                                className="action-btn delete"
                                title="Delete"
                            >
                                <FaTrash />
                            </button>
                        </div>
                    </div>
                ))}
                {overlays.length === 0 && (
                    <p className="empty-message">No overlays yet. Add one above!</p>
                )}
            </div>
        </div>
    );
};

export default OverlayControls;
