const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker');
const User = require('../../src/models/user.model');
const { userEmailProvider } = require('../../src/config/user');

const password = 'password1';
const salt = bcrypt.genSaltSync(8);
const hashedPassword = bcrypt.hashSync(password, salt);

const userOne = {
  _id: new mongoose.Types.ObjectId(),
  username: faker.internet.displayName(),
  email: faker.internet.email({provider: userEmailProvider[0]}).toLowerCase(),
  name: faker.person.fullName(),
  tel_num: "0123456789",
  address: {
    address1: "address1",
    address2: "address2",
    address3: "address3",
    postcode: "12345",
    city: "city",
    state: "state",
    country: "country",
  },
  date_of_birth: "2001-01-01T00:00:00.000Z",
  password,
  role: 'user',
  is_email_verified: false,
};

const userTwo = {
  _id: new mongoose.Types.ObjectId(),
  name: faker.person.fullName(),
  username: faker.internet.displayName(),
  email: faker.internet.email({provider: userEmailProvider[0]}).toLowerCase(),
  password,
  role: 'user',
  tel_num: "0123456782",
  address: {
    address1: "address1",
    address2: "address2",
    address3: "address3",
    postcode: "12345",
    city: "city",
    state: "state",
    country: "country",
  },
  date_of_birth: "2001-01-01T00:00:00.000Z",
  is_email_verified: false,
};

const admin = {
  _id: new mongoose.Types.ObjectId(),
  name: faker.person.fullName(),
  username: faker.internet.displayName(),
  email: faker.internet.email({provider: userEmailProvider[0]}).toLowerCase(),
  password,
  role: 'admin',
  tel_num: "0123456781",
  address: {
    address1: "address1",
    address2: "address2",
    address3: "address3",
    postcode: "12345",
    city: "city",
    state: "state",
    country: "country",
  },
  date_of_birth: "2001-01-01T00:00:00.000Z",
  is_email_verified: false,
};

const insertUsers = async (users) => {
  await User.insertMany(users.map((user) => ({ ...user, password: hashedPassword })));
};

module.exports = {
  userOne,
  userTwo,
  admin,
  insertUsers,
};
