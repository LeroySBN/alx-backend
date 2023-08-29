// Track progress and errors with Kue: Create the Job processor
const kue = require('kue');
const queue = kue.createQueue();

const blacklistedPhoneNumbers = ['4153518780', '4153518781'];

const sendNotification = (phoneNumber, message, job, done) => {
  let total = 0;
  if (blacklistedPhoneNumbers.includes(phoneNumber)) {
    return done(Error(`Phone number ${phoneNumber} is blacklisted`));
  }
  total += 1;
  job.progress(total, 100);
  console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);
  done();
}

queue.process('push_notification_code_2', 2, (job, done) => {
  if (job.data.phoneNumber && job.data.message) {
    sendNotification(job.data.phoneNumber, job.data.message, job, done);
  }
});
