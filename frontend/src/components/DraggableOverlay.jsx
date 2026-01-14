import { Rnd } from 'react-rnd';
import { FaTimes } from 'react-icons/fa';
import { overlayAPI } from '../services/api';

const DraggableOverlay = ({ overlay, onUpdate, onDelete }) => {
    const handleDragStop = (e, d) => {
        const updatedOverlay = {
            ...overlay,
            position: { x: d.x, y: d.y }
        };
        onUpdate(updatedOverlay);
        overlayAPI.update(overlay._id, updatedOverlay).catch(console.error);
    };

    const handleResizeStop = (e, direction, ref, delta, position) => {
        const updatedOverlay = {
            ...overlay,
            size: {
                width: parseInt(ref.style.width),
                height: parseInt(ref.style.height)
            },
            position: { x: position.x, y: position.y }
        };
        onUpdate(updatedOverlay);
        overlayAPI.update(overlay._id, updatedOverlay).catch(console.error);
    };

    const handleDelete = () => {
        overlayAPI.delete(overlay._id)
            .then(() => onDelete(overlay._id))
            .catch(console.error);
    };

    if (!overlay.visible) return null;

    return (
        <Rnd
            default={{
                x: overlay.position.x,
                y: overlay.position.y,
                width: overlay.size.width,
                height: overlay.size.height
            }}
            position={{ x: overlay.position.x, y: overlay.position.y }}
            size={{ width: overlay.size.width, height: overlay.size.height }}
            onDragStop={handleDragStop}
            onResizeStop={handleResizeStop}
            bounds="parent"
            className="draggable-overlay"
            style={{ zIndex: overlay.zIndex }}
        >
            <div className="overlay-content">
                <button className="delete-btn" onClick={handleDelete}>
                    <FaTimes />
                </button>

                {overlay.type === 'text' ? (
                    <div
                        className="text-overlay"
                        style={{
                            color: overlay.style?.color || '#ffffff',
                            fontSize: `${overlay.style?.fontSize || 16}px`,
                            fontWeight: overlay.style?.fontWeight || 'normal',
                            backgroundColor: overlay.style?.backgroundColor || 'transparent',
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '8px',
                            wordWrap: 'break-word'
                        }}
                    >
                        {overlay.content}
                    </div>
                ) : (
                    <img
                        src={overlay.content}
                        alt="Overlay"
                        className="image-overlay"
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain'
                        }}
                    />
                )}
            </div>
        </Rnd>
    );
};

export default DraggableOverlay;
