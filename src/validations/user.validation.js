const Joi = require('joi');
const { password, objectId, email } = require('./custom.validation');

const createUser = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    username: Joi.string().required(),
    email: Joi.string()
      .required()
      .email()
      .custom(email),
    tel_num: Joi.string().required(),
    date_of_birth: Joi.string().required(),
    password: Joi.string().required().custom(password),
    address: Joi.object().keys({
      address1: Joi.string().optional(),
      address2: Joi.string().optional(),
      address3: Joi.string().optional(),
      postcode: Joi.string().optional(),
      city: Joi.string().optional(),
      state: Joi.string().optional(),
      country: Joi.string().optional(),
    }),
    role: Joi.string().required().valid('user', 'admin'),
    profile_pic_url: Joi.string().optional(),
  }),
};

const getUsers = {
  query: Joi.object().keys({
    username: Joi.string(),
    name: Joi.string(),
    address: Joi.object().keys({
      address1: Joi.string().optional(),
      address2: Joi.string().optional(),
      address3: Joi.string().optional(),
      postcode: Joi.string().optional(),
      city: Joi.string().optional(),
      state: Joi.string().optional(),
      country: Joi.string().optional(),
    }),

    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({      
      username: Joi.string(),
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      name: Joi.string(),
      tel_num: Joi.string(),
      profile_pic_url: Joi.string(),
      date_of_birth: Joi.string(),
      address: Joi.object().keys({
        address1: Joi.string(),
        address2: Joi.string(),
        address3: Joi.string(),
        postcode: Joi.string(),
        city: Joi.string(),
        state: Joi.string(),
        country: Joi.string(),
      }),
      role: Joi.string().valid('user', 'admin'),
    })
    .min(1),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
