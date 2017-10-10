const dotenv = require('dotenv');
const path = require('path');
const mongoSeed = require('mongo-seed');

dotenv.load({ path: '.env' });

const splittedBySlash = process.env.MONGODB_URI.split('/');

let mongoHost;
let mongoPort;
const dbName = splittedBySlash[3];
const splittedByColon = splittedBySlash[2].split(':');

if (splittedByColon.length === 2) {
  [mongoHost, mongoPort] = splittedByColon;
} else {
  mongoHost = `${splittedByColon[0]}:${splittedByColon[1]}`;
  mongoPort = splittedByColon[2];
}

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
