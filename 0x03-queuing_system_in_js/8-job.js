// Writing the job creation function
const createPushNotificationsJobs = (jobs, queue) => {
  if (!Array.isArray(jobs)) throw Error('Jobs is not an array');

  jobs.forEach(async (job) => {
    const jobQueue = queue.create('push_notification_code_3', job);

    jobQueue
      .on('enqueue', () => {
        console.log(`Notification job created: ${jobQueue.id}`);
      })
      .on('complete', () => {
        console.log(`Notification job ${jobQueue.id} completed`);
      })
      .on('failed', (err) => {
        console.log(`Notification job ${jobQueue.id} failed: ${err}`);
      })
      .on('progress', (progress) => {
        console.log(`Notification job ${jobQueue.id} ${progress}% complete`);
      });

    await jobQueue.save();
  });
}

module.exports = createPushNotificationsJobs;
