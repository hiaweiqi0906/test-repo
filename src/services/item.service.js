const httpStatus = require('http-status');
const { Item, User } = require('../models');
const userService = require('./user.service');
const ApiError = require('../utils/ApiError');

/**
 * Create a item
 * @param {Object} itemBody
 * @returns {Promise<Item>}
 */
const createItem = async (itemBody) => {
  const user = await User.findById(itemBody.owner);
  if (!user) {
    throw new Error('User not found');
  }

  const item = await Item.create(itemBody);
  const updatedItemIds = [...user.items, item._id];
  await userService.updateUserById(itemBody.owner, { items: updatedItemIds });

  return item;
};

/**
 * Query for items
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryItems = async (filter, options) => {
  const items = await Item.paginate(filter, options);
  return items;
};

/**
 * Get item by id
 * @param {ObjectId} id
 * @returns {Promise<Item>}
 */
const getItemById = async (id) => {
  return Item.findById(id);
};

/**
 * Update item by id
 * @param {ObjectId} itemId
 * @param {Object} updateBody
 * @returns {Promise<Item>}
 */
const updateItemById = async (itemId, updateBody) => {
  const item = await getItemById(itemId);
  if (!item) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Item not found');
  }
  if (updateBody.email && (await Item.isEmailTaken(updateBody.email, itemId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(item, updateBody);
  await item.save();
  return item;
};

/**
 * Delete item by id
 * @param {ObjectId} itemId
 * @returns {Promise<Item>}
 */
const deleteItemById = async (itemId) => {
  const item = await updateItemById(itemId, { status: 'deleted' });
  return item;
};

/**
 * Update item image
 * @param {ObjectId} itemId
 * @param {Object} updateBody
 * @returns {Promise<Item>}
 */
const updateItemImage = async (itemId, imagesUploaded) => {
  const newImages = imagesUploaded.map((file) => ({
    image_url: file.path, // Cloudinary URL
    image_filename: file.filename,
  }));

  // Fetch the existing item from the database
  let item = await getItemById(itemId);
  if (!item) {
    throw new Error('Item not found');
  }

  // Append new images to the existing images array
  const updatedImages = [...item.images, ...newImages];

  // Update the item with the new images array
  item = await updateItemById(itemId, { images: updatedImages });
  return item;
}

module.exports = {
  createItem,
  queryItems,
  getItemById,
  updateItemImage,
  updateItemById,
  deleteItemById,
};
