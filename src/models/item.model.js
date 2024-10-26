const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');
const { allStatus } = require('../config/status');

const itemSchema = mongoose.Schema(
  {
    owner: { 
      type: mongoose.SchemaTypes.ObjectId, 
      ref: 'Users', 
      required: true 
    },
    title: { 
      type: String, 
      required: true,
      default: ''
    },
    description: { 
      type: String,
      default: 'Seller is quite busy and left nothing here. Nothing to see here...',
    },
    price: { 
      type: Number, 
      required: true,
      default: 0,
    },
    tags: {
      type: [String],
      validate: {
        validator: function (value) {
          return value.length > 0;
        },
        message: 'There must be at least one tag',
      },
    },
    category: { 
      // for property type
      // contain of big two category: property to rent and to sell
      // subcategory: house, apartment, land, office, shop, warehouse, etc
      type: String, 
      enum: ['electronics', 'furniture', 'books', 'clothing', 'other'] 
    },
    sub_category: { 
      type: String, 
      enum: ['electronics', 'laptop', 'furniture', 'books', 'clothing', 'other'] 
    },
    images: {
      type: [{
        image_url: {
          type: String,
        },
        image_filename: {
          type: String,
        }
      }],
      default: [],
    },
    is_available: { 
      type: Boolean, 
      default: true 
    },
    condition: { 
      type: String, 
      enum: ['new', 'used', 'refurbished'] 
    },
    available_meetup_location: {
      type: [String],
      required: true,
      default: ['online'],
      validate: {
        validator: function (value) {
          return value.length > 0;
        },
        message: 'There must be at least one available meetup location',
      },
    },
    available_delivery_options: {
      type: [String],
      default: ['meetup'],
      required: true,
      validate: {
        validator: function (value) {
          return value.every(option => ['meetup', 'usell delivery'].includes(option));
        },
        message: 'Available delivery options must be either "meetup" or "usell delivery"',
      },
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
itemSchema.plugin(toJSON);
itemSchema.plugin(paginate);

/**
 * @typedef Item
 */
const Item = mongoose.model('Items', itemSchema);

module.exports = Item;
