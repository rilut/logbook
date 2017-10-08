const bcrypt = require('bcrypt-nodejs');
const faker = require('faker');
const fs = require('fs');
const mongoose = require('mongoose');
const path = require('path');

const hash = (password) => {
  const salt = bcrypt.genSaltSync(10);

  return bcrypt.hashSync(password, salt);
};

module.exports = () => {
  const fakeUserCount = 10;
  const fakeUsers = [];

  console.log(`Seeding ${fakeUserCount} users...`);

  for (let i = 0; i < fakeUserCount; i++) {
    fakeUsers.push({
      _id: mongoose.Types.ObjectId(),
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      email: faker.internet.email(),
      role: faker.random.arrayElement(['Operator', 'Supervisor', 'Administrator']),
      password: hash(faker.random.words()),
      tokens: [],
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    });
  }

  fs.writeFileSync(path.resolve(`${__dirname}/generated/users.json`),
    JSON.stringify(fakeUsers, null, 2));

  return {
    users: fakeUsers,
  };
};
