// Node Redis client and advanced operations
const redis = require('redis');
import { createClient } from 'redis';

const client = createClient();

client.on('connect', () => {
  console.log('Redis client connected to the server');
});

client.on('error', (err) => {
  console.log(`edis client not connected to the server: ${err.message}`);
});

// Store a hash value using hset
client.hset(
  'HolbertonSchools',
  'Portland',
  50,
  redis.print
);

client.hset(
  'HolbertonSchools',
  'Seattle',
  80,
  redis.print
);

client.hset(
  'HolbertonSchools',
  'New York',
  20,
  redis.print
);

client.hset(
  'HolbertonSchools',
  'Bogota',
  20,
  redis.print
);

client.hset(
  'HolbertonSchools',
  'Cali',
  40,
  redis.print
);

client.hset(
  'HolbertonSchools',
  'Paris',
  2,
  redis.print
);

// Display the hash value using hgetall
client.hgetall('HolbertonSchools', (err, result) => {
  if (err) {
    console.error('Error:', err);
  } else {
    // console.log('Hash value stored in Redis:');
    console.log(result);
  }

  // Close the Redis connection
  client.quit();
});
