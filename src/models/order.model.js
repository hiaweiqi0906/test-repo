const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');
const { allStatus } = require('../config/status');

const chatRoomSchema = mongoose.Schema(
  {
    buyer: { 
      type: mongoose.SchemaTypes.ObjectId, 
      ref: 'Users', 
      required: true 
    },
    seller: { 
      type: mongoose.SchemaTypes.ObjectId, 
      ref: 'Users', 
      required: true 
    },
    item: { 
      type: mongoose.SchemaTypes.ObjectId, 
      ref: 'Items', 
      required: true 
    },
    chat_room: { 
      type: mongoose.SchemaTypes.ObjectId, 
      ref: 'ChatRooms', 
      required: true 
    },
    order_status: {
      type: String,
      enum: ['pending', 'completed', 'cancelled'],
      default: 'pending'
    },
    amount: {
      total_amount: {
        type: Number,
        required: true,
        default: 0,
      }
    },
    meetup_location: {
      type: String,
      required: true,
      default: 'online'
    },
    delivery_options: {
      type: String,
      enum: ['meetup', 'usell delivery'],
      required: true,
    },
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
 * @typedef Order
 */
const Order = mongoose.model('Orders', chatRoomSchema);

module.exports = Order;
