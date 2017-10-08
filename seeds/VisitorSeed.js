const faker = require('faker');
const fs = require('fs');
const mongoose = require('mongoose');
const path = require('path');

const randomNumber = (length) => {
  const min = 10 * (length - 1);
  const max = Number('9'.repeat(length));

  return faker.random.number({ min, max });
};

const dob = () => {
  const randomAge = faker.random.number(({ min: 22, max: 80 }));
  return faker.date.past(randomAge);
};

const nric = () => {
  const randomPrefix = faker.random.arrayElement(['S', 'F', 'G']);
  const randomSuffix = faker.random.arrayElement('ABCDEFGHIJKLMNOPQRSTUVWXYZ');

  return `${randomPrefix}${randomNumber(7)}${randomSuffix}`;
};

const membershipId = () => {
  const studentMembershipId = `ST${randomNumber(4)}`;

  const subsidiaryMembershipSuffix = faker.random.arrayElement(['S', 'J1', 'J2']);
  const subsidiaryMembershipId1 = `L${randomNumber(5)}${subsidiaryMembershipSuffix}`;
  const subsidiaryMembershipId2 = `${randomNumber(7)}${subsidiaryMembershipSuffix}`;

  return faker.random.arrayElement([
    studentMembershipId,
    subsidiaryMembershipId1,
    subsidiaryMembershipId2,
  ]);
};

module.exports = () => {
  const fakeVisitorCount = 1000;
  const fakeVisitors = [];

  console.log(`Seeding ${fakeVisitorCount} visitors...`);

  const userSeedPath = path.resolve(`${__dirname}/generated/users.json`);
  const userSeedRaw = fs.readFileSync(userSeedPath, 'utf-8');
  const users = JSON.parse(userSeedRaw);

  for (let i = 0; i < fakeVisitorCount; i++) {
    const isDeleted = faker.random.boolean();

    fakeVisitors.push({
      _id: mongoose.Types.ObjectId(),
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      dob: dob(),
      nric: nric(),
      membershipId: membershipId(),
      membershipExpiry: faker.date.between('2012-01-01', '2022-12-31'),
      remarks: faker.random.words(),
      otherId: faker.lorem.words(),
      otherFields: [{
        label: faker.random.word(),
        value: faker.random.word(),
      }],
      deleted: isDeleted,
      deletedAt: isDeleted ? faker.date.recent() : null,
      deletedBy: isDeleted ? mongoose.Types.ObjectId(faker.random.arrayElement(users)._id) : null,
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    });
  }

  fs.writeFileSync(path.resolve(`${__dirname}/generated/visitors.json`),
    JSON.stringify(fakeVisitors, null, 2),
    (err) => {
      if (err) {
        return console.error(err);
      }

      console.log('The file was saved!');
    });

  return {
    visitors: fakeVisitors,
  };
};
