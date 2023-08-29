// Writing the job creation function
const queue = require('kue').createQueue();

const createPushNotificationsJobs = (jobs, queue) => {
  if (!Array.isArray(jobs)) throw Error('Jobs is not an array');
  jobs.forEach((job) => {
    const jobQueue = queue.create('push_notification_code_3', job).save((err) => {
      if (err) console.log('Notification job failed');
      else console.log(`Notification job created: ${jobQueue.id}`);
    });

    jobQueue.on('complete', () => {
      console.log(`Notification job ${jobQueue.id} completed`);
    });

    jobQueue.on('failed', (err) => {
      console.log(`Notification job ${jobQueue.id} failed: ${err}`);
    });

    jobQueue.on('progress', (progress) => {
      console.log(`Notification job ${jobQueue.id} ${progress}% complete`);
    });
  });
}

module.exports = createPushNotificationsJobs;
