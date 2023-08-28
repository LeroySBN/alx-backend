// Node Redis client and advanced operations
import { createClient } from 'redis';

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

const displaySchoolValue = async (schoolName) => {
  await client.get(schoolName, (err, reply) => {
    console.log(reply);
  });
}


displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');

