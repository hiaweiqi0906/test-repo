const Joi = require('joi');
const { password, objectId, email } = require('./custom.validation');

const createItem = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string(),
    price: Joi.number().required(),
    tags: Joi.array().items(Joi.string()).min(1).required(),
    category: Joi.string().required(),
    sub_category: Joi.string().required(),
    condition: Joi.string().required(),
    available_meetup_location: Joi.array().items(Joi.string()).min(1).required(),
    available_delivery_options: Joi.array().items(Joi.string()).min(1).required(),
  }),
};

const getItems = {
  query: Joi.object().keys({
    title: Joi.string(),
    description: Joi.string(),
    price: Joi.string(),
    tags: Joi.string(),
    category: Joi.string(),
    sub_category: Joi.string(),
    available_delivery_options: Joi.string(),
    available_meetup_location: Joi.string(),
    condition: Joi.string(),

    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    populate: Joi.string(),
  }),
};

const getItem = {
  params: Joi.object().keys({
    itemId: Joi.string().custom(objectId),
  }),
};

const updateItem = {
  params: Joi.object().keys({
    itemId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({      
      title: Joi.string().required(),
      description: Joi.string(),
      price: Joi.number().required(),
      tags: Joi.array().items(Joi.string()).min(1).required(),
      category: Joi.string().required(),
      sub_category: Joi.string().required(),
      condition: Joi.string().required(),
      available_meetup_location: Joi.array().items(Joi.string()).min(1).required(),
      available_delivery_options: Joi.array().items(Joi.string()).min(1).required(),
      images: Joi.array().items(Joi.object().keys({
        image_url: Joi.string(),
        image_filename: Joi.string(),
        _id: Joi.string(),
      })).min(1).required(),
      is_available: Joi.boolean(),
      status: Joi.string().valid('pending', 'approved', 'rejected', 'active'),
    }),
};

const deleteItem = {
  params: Joi.object().keys({
    itemId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createItem,
  getItems,
  getItem,
  updateItem,
  deleteItem,
};
