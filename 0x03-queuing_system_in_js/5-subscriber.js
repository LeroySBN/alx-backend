// Node Redis client subscriber
const redis = require('redis');
const client = redis.createClient();

client.on('connect', () => {
  console.log('Redis client connected to the server');
});

client.on('error', (err) => {
  console.log(`edis client not connected to the server: ${err.message}`);
});

const sub = client.duplicate();

sub.subscribe('holberton school channel');

sub.on('message', (channel, message) => {
  console.log(message);
  if (message === 'KILL_SERVER') {
    sub.unsubscribe();
    sub.quit();
  }
});
