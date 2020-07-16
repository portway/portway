
import Queue from 'bee-queue'
import { QUEUES } from './constants/queues'


const queue = Queue(QUEUES.PROJECT_EXPORT);

queue.on('ready', function () {
  queue.process(async (job, done) => {
    console.log('processing job ' + job.id);
    await Promise.resolve()
    done(null, job.data.x, job.data.y)
  });

  console.log('processing jobs...');
});