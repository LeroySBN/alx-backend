// Can I have a seat?
const express = require('express');
const redis = require('redis');
const kue = require('kue');
const { promisify } = require('util');

const app = express();
const port = 1245;

// Create a Redis client
const client = redis.createClient();
const queue = kue.createQueue();

client.on('connect', () => {
  console.log('Redis client connected to the server');
});

client.on('error', (err) => {
  console.log(`Redis client not connected to the server: ${err.message}`);
});

const reserveSeat = (number) => {
  client.set('available_seats', number);
};

const asyncGet = promisify(client.get).bind(client);

const getCurrentAvailableSeats = async () => {
  try {
    const reply = await asyncGet('available_seats');
    return parseInt(reply, 10);
  } catch (err) {
    console.error(err);
    return 0;
  }
};

reserveSeat(50);
let reservationEnabled = true;

app.get('/available_seats', async (req, res) => {
  const numberOfAvailableSeats = await getCurrentAvailableSeats();
  res.json({ numberOfAvailableSeats });
});


app.get('/reserve_seat', (req, res) => {
  if (!reservationEnabled) {
    return res.json({ status: 'Reservation are blocked' });
  }

  const job = queue.create('reserve_seat').save((err) => {
    if (err) {
      return res.json({ status: 'Reservation failed' });
    }
    res.json({ status: 'Reservation in process' });
  });
});

app.get('/process', async (req, res) => {
  res.json({ status: 'Queue processing' });

  queue.process('reserve_seat', async (job, done) => {
    try {
      const availableSeats = await getCurrentAvailableSeats();
      if (availableSeats === 0) {
        reservationEnabled = false;
        done(null);
      } else if (availableSeats >= 1) {
        await reserveSeat(availableSeats - 1);
        if (availableSeats - 1 === 0) {
          reservationEnabled = false;
        }
        console.log(`Seat reservation job ${job.id} completed`);
        done();
      } else {
        done(new Error('Not enough seats available'));
      }
    } catch (error) {
      console.error(`Seat reservation job ${job.id} failed: ${error.message}`);
      done(error);
    }
  });
});


app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

