// Node Redis client and advanced operations
import { createClient } from 'redis';
const { promisify } = require('util');

const client = createClient();

client.on('connect', () => {
  console.log('Redis client connected to the server');
});

client.on('error', (err) => {
  console.log(`edis client not connected to the server: ${err.message}`);
});

function setNewSchool(schoolName, value) {
  client.set(schoolName, value, (err, reply) => {
    console.log(`Reply: ${reply}`);
  });
}

const asyncGet = promisify(client.get).bind(client);

const displaySchoolValue = async (schoolName) => {
  try {
    const reply = await asyncGet(schoolName);
    console.log(reply);
  } catch (err) {
    console.error(err);
  }
};


displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');

