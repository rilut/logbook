const faker = require('faker');
const fs = require('fs');
const mongoose = require('mongoose');
const path = require('path');

module.exports = () => {
  const fakeLogCount = 100;

  console.log(`Seeding ${fakeLogCount} logs...`);

  const fakeLogs = [];
  const visitorSeedPath = path.resolve(`${__dirname}/generated/visitors.json`);
  const visitorSeedRaw = fs.readFileSync(visitorSeedPath, 'utf-8');
  const visitors = JSON.parse(visitorSeedRaw);

  const timeIn = faker.date.recent();
  const timeOut = faker.date.between(timeIn, new Date());
  for (let i = 0; i < fakeLogCount; i++) {
    fakeLogs.push({
      visitor: mongoose.Types.ObjectId(faker.random.arrayElement(visitors)._id),
      timeIn,
      timeOut,
      loginSuccessful: faker.random.boolean(),
      createdAt: timeIn,
      updatedAt: faker.date.between(timeIn, timeOut),
    });
  }

  fs.writeFileSync(path.resolve(`${__dirname}/generated/logs.json`),
    JSON.stringify(fakeLogs, null, 2));

  return {
    logs: fakeLogs,
  };
};
