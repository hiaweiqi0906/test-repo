const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');
const { allStatus } = require('../config/status');
const { userEmailProvider } = require('../config/user');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
        const emailDomain = value.split('@')[1];
        if (!userEmailProvider.includes(emailDomain)) {
          throw new Error(`Email must be from one of the following providers: ${userEmailProvider.join(', ')}`);
        }
      },
    },
    tel_num: {
      type: String,
      required: true,
      trim: true,
    },
    date_of_birth: {
      type: Date,
      required: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error('Password must contain at least one letter and one number');
        }
      },
      private: true, // used by the toJSON plugin
    },
    status: {
      type: String,
      enum: allStatus,
      default: 'active',
    },
    address: {
      address1: { type: String, default: '' },
      address2: { type: String, default: '' },
      address3: { type: String, default: '' },
      postcode: { type: String, default: '' },
      city: { type: String, default: 'Gelugor' },
      state: { type: String, default: 'Pulau Pinang' },
      country: { type: String, default: 'Malaysia' },
    },
    role: {
      type: String,
      enum: roles,
      default: 'user',
    },
    is_email_verified: {
      type: Boolean,
      default: false,
    },
    profile_pic_url: {
      type: String,
      default: '',
    },
    settings: {
      type: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Settings'
      }],
      default: [],
    },
    items: {
      type: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Items'
      }],
      default: [],
    },
    orders: {
      type: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Order'
      }],
      default: [],
    },
    chat_rooms: {
      type: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'ChatRoom'
      }],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if username is taken
 * @param {string} username - The user's username
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isUserNameTaken = async function (username, excludeUserId) {
  const user = await this.findOne({ username, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if tel_num is taken
 * @param {string} tel_num - The user's tel_num
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isTelNumTaken = async function (tel_num, excludeUserId) {
  const user = await this.findOne({ tel_num, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

/**
 * @typedef User
 */
const User = mongoose.model('Users', userSchema);

module.exports = User;
