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

Promise.resolve(
  mongoSeed.load(mongoHost, mongoPort, dbName, path.resolve(`${__dirname}/UserSeed.js`), 'function')
).then(() =>
  mongoSeed.load(mongoHost, mongoPort, dbName, path.resolve(`${__dirname}/VisitorSeed.js`), 'function')
).then(() =>
  mongoSeed.load(mongoHost, mongoPort, dbName, path.resolve(`${__dirname}/LogSeed.js`), 'function')
);
