const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');
const { allStatus } = require('../config/status');

const chatRoomSchema = mongoose.Schema(
  {
    participants: [{ 
      type: mongoose.SchemaTypes.ObjectId, 
      ref: 'Users' 
    }],
    item: {
      item_record: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Items',
      },
      chat_room_price: { 
        type: Number, 
        default: 0 
      },
      chat_room_status: { 
        type: String, 
        default: 'active' 
      },
    },
    messages: [{
      type: {
        sender: { 
          type: mongoose.SchemaTypes.ObjectId, 
          ref: 'Users' 
        },
        content: { 
          type: String, 
          required: true 
        },
        message_type: { 
          type: String, 
          enum: ['text', 'image', 'audio', 'video'] 
        },
        timestamp: { 
          type: Date, 
          default: Date.now 
        }
      },
      default: []
    }],  
    status: {
      type: String,
      enum: allStatus,
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
chatRoomSchema.plugin(toJSON);
chatRoomSchema.plugin(paginate);

/**
 * @typedef ChatRoom
 */
const ChatRoom = mongoose.model('ChatRoom', chatRoomSchema);

module.exports = ChatRoom;
