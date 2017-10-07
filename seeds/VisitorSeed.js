const faker = require('faker');

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

  for (let i = 0; i < 1000; i++) {
    fakeVisitors.push({
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
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    });
  }

  return {
    visitors: fakeVisitors,
  };
};
