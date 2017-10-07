const dotenv = require('dotenv');
const path = require('path');
const mongoSeed = require('mongo-seed');

dotenv.load({ path: '.env' });

const dbName = process.env.MONGODB_URI.split('/')[3];
const [mongoHost, mongoPort] = process.env.MONGODB_URI.split('/')[2].split(':');

console.log('Start seeding...');
console.log(`Host: ${mongoHost}`);
console.log(`Port: ${mongoPort}`);
console.log(`DB name: ${dbName}`);

const seeds = [
  'UserSeed.js',
  'VisitorSeed.js',
];

seeds.forEach((seed) => {
  const seedPath = path.resolve(`${__dirname}/${seed}`);
  mongoSeed.load(mongoHost, mongoPort, dbName, seedPath, 'function', (err) => {
    console.error(err);
  });
});
