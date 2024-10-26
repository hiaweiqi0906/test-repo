const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');
const { allStatus } = require('../config/status');

const settingSchema = mongoose.Schema(
  {
    user: { 
      type: mongoose.SchemaTypes.ObjectId, 
      ref: 'Users', 
      required: true, 
      unique: true 
    },
    notifications: { 
      type: Boolean, 
      default: true 
    },
    darkMode: { 
      type: Boolean, 
      default: false 
    },
    language: { 
      type: String, 
      default: 'en' 
    }, // Additional setting for UI language
    timeZone: { 
      type: String, 
      default: 'UTC' 
    }, // Optional time zone setting
    currency: { 
      type: String, 
      default: 'MYR' 
    }, // Optional currency setting  
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
settingSchema.plugin(toJSON);
settingSchema.plugin(paginate);

/**
 * @typedef Setting
 */
const Setting = mongoose.model('Setting', settingSchema);

module.exports = Setting;
