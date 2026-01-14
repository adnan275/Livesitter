import DraggableOverlay from './DraggableOverlay';

const OverlayCanvas = ({ overlays, onUpdateOverlay, onDeleteOverlay }) => {
    return (
        <div className="overlay-canvas">
            {overlays.map((overlay) => (
                <DraggableOverlay
                    key={overlay._id}
                    overlay={overlay}
                    onUpdate={onUpdateOverlay}
                    onDelete={onDeleteOverlay}
                />
            ))}
        </div>
    );
};

export default OverlayCanvas;
