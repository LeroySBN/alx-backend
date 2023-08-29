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
      { message: 'Job 1', phoneNumber: '1234567890' },
      { message: 'Job 2', phoneNumber: '9876543210' },
    ];

    createPushNotificationsJobs(jobs, queue);

    expect(queue.testMode.jobs.length).to.equal(jobs.length);
  });

  it('should create two new jobs to the queue', () => {
    const jobs = [
      { message: 'Job 1', phoneNumber: '1234567890' },
      { message: 'Job 2', phoneNumber: '9876543210' },
    ];

    createPushNotificationsJobs(jobs, queue);

    expect(queue.testMode.jobs.map((job) => job.type)).to.have.members(['push_notification_code_3']);
  });

  
});

