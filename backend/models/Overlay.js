import mongoose from 'mongoose';

const overlaySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['text', 'image'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  position: {
    x: {
      type: Number,
      required: true,
      default: 0
    },
    y: {
      type: Number,
      required: true,
      default: 0
    }
  },
  size: {
    width: {
      type: Number,
      required: true,
      default: 200
    },
    height: {
      type: Number,
      required: true,
      default: 100
    }
  },
  style: {
    color: {
      type: String,
      default: '#ffffff'
    },
    fontSize: {
      type: Number,
      default: 16
    },
    fontWeight: {
      type: String,
      default: 'normal'
    },
    backgroundColor: {
      type: String,
      default: 'transparent'
    }
  },
  visible: {
    type: Boolean,
    default: true
  },
  zIndex: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true
});

const Overlay = mongoose.model('Overlay', overlaySchema);

export default Overlay;
