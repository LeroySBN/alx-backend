// Writing the test for job creation
const { expect } = require('chai');
const kue = require('kue');
const createPushNotificationsJobs = require('./8-job');

describe('createPushNotificationsJobs', () => {
  let queue;

  before(() => {
    queue = kue.createQueue();
    queue.testMode.enter();
  });

  after(() => {
    queue.testMode.clear();
    queue.testMode.exit();
    queue.shutdown(1000, (err) => {
      console.log('Kue queue shut down:', err || 'No error');
    });
  });

  it('should throw an error if jobs is not an array', () => {
    expect(() => createPushNotificationsJobs('not an array', queue)).to.throw('Jobs is not an array');
  });

  it('should add jobs to the queue', () => {
    const jobs = [
      { data: { message: 'Notification 1' } },
      { data: { message: 'Notification 2' } },
    ];

    createPushNotificationsJobs(jobs, queue);
    const queuedJobs = queue.testMode.jobs;
    expect(queuedJobs.length).to.equal(2);
  });

  it('should handle job failure', (done) => {
    const jobs = [
      { data: { message: 'Notification 1' } },
    ];

    createPushNotificationsJobs(jobs, queue);
    const jobId = queue.testMode.jobs[0].id;

    queue.testMode.jobs[0].on('failed', (error) => {
      expect(error.message).to.equal('Job failed');
      done();
    });

    queue.testMode.jobs[0].emit('failed', new Error('Job failed'));
  });

  it('should handle job progress', (done) => {
    const jobs = [
      { data: { message: 'Notification 1' } },
    ];

    createPushNotificationsJobs(jobs, queue);
    const jobId = queue.testMode.jobs[0].id;

    queue.testMode.jobs[0].on('progress', (progress, data) => {
      expect(progress).to.equal(50);
      done();
    });

    queue.testMode.jobs[0].emit('progress', 50, { jobId });
  });

  it('should handle multiple jobs', () => {
    const jobs = [
      { data: { message: 'Notification 1' } },
      { data: { message: 'Notification 2' } },
    ];
  
    createPushNotificationsJobs(jobs, queue);
  
    expect(queue.testMode.jobs.length).to.equal(6); // Each job has created, progress, and completed events
  });
  
});

