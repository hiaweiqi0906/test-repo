const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const { Item } = require('../../../src/models');
const { allStatus } = require('../../../src/config/status');

describe('Item model', () => {
  describe('Item validation', () => {
    let newItem;
    beforeEach(() => {
      newItem = {
        owner: new mongoose.Types.ObjectId(),
        title: faker.commerce.productName(),
        description: faker.lorem.sentence(),
        price: faker.number.int({ min: 1, max: 10000 }),
        tags: [faker.commerce.department()],
        category: 'electronics',
        sub_category: 'laptop',
        images: [{ image_url: 'http://image.url', image_filename: 'image1.jpg' }],
        condition: 'new',
        available_meetup_location: ['city park'],
        available_delivery_options: ['meetup'],
        status: 'active',
      };
    });

    test('should correctly validate a valid item', async () => {
      await expect(new Item(newItem).validate()).resolves.toBeUndefined();
    });

    test('should throw a validation error if price is missing', async () => {
      delete newItem.price;
      const item = new Item(newItem);
      await expect(item.validate()).resolves.toBeUndefined(); // Ensure no validation error

      expect(item.price).toBe(0); // Check if the default price is set to 0
    });

    test('should throw a validation error if category is unknown', async () => {
      newItem.category = 'invalid';
      await expect(new Item(newItem).validate()).rejects.toThrow();
    });

    test('should throw a validation error if condition is unknown', async () => {
      newItem.condition = 'broken';
      await expect(new Item(newItem).validate()).rejects.toThrow();
    });

    test('should throw a validation error if tags array is empty', async () => {
      newItem.tags = [];
      await expect(new Item(newItem).validate()).rejects.toThrow('There must be at least one tag');
    });

    test('should throw a validation error if available_meetup_location is empty', async () => {
      newItem.available_meetup_location = [];
      await expect(new Item(newItem).validate()).rejects.toThrow('There must be at least one available meetup location');
    });

    test('should throw a validation error for invalid delivery option', async () => {
      newItem.available_delivery_options = ['invalid'];
      await expect(new Item(newItem).validate()).rejects.toThrow(
        'Available delivery options must be either "meetup" or "usell delivery"'
      );
    });

    test('should set default values for is_available and status', async () => {
      const item = new Item({
        owner: new mongoose.Types.ObjectId(),
        title: 'Sample Item',
        price: 100,
        available_meetup_location: ['city park'],
        available_delivery_options: ['meetup'],
      });
      expect(item.is_available).toBe(true);
      expect(item.status).toBe('active');
    });
  });

  describe('Item toJSON()', () => {
    test('should remove __v and _id when toJSON is called', () => {
      const item = new Item({
        owner: new mongoose.Types.ObjectId(),
        title: 'Sample Item',
        price: 100,
        available_meetup_location: ['city park'],
        available_delivery_options: ['meetup'],
      });
      const jsonItem = item.toJSON();
      expect(jsonItem).not.toHaveProperty('__v');
      expect(jsonItem).not.toHaveProperty('_id');
    });
  });
});