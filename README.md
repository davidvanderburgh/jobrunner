# jobrunner

## background
Say you have the need to run jobs from arbitary places in your code.  These jobs are asynchronous under the hood, but you do not want to necessarily start them there on the spot.  Instead, you want to add them to a job queue which handles all of the jobs one by one in order asynchronously.
For example, imagine you are designing a 3d printer to queue up jobs. These jobs need to run in order because you can't have multiple jobs printing at the same time. Each must reach out to get its data from an API which is not guaranteed to complete in any amount of time.
The JobRunner class solves this issue.

## usage
```ts
import { Job, JobRunner } from './job-runner';
import { wait } from './test-utils';

const jobRunner = new JobRunner();

const getConsoleLogJob = (textToOutput: string, timeToProcess?: number): Job => ({
  start: async (): Promise<void> => {
    await wait(timeToProcess);
    console.log(textToOutput);
  }, 
});

//note that the first job takes 1 second to complete. The second job is added before the first is completed but only takes 100ms. It will wait for the first job to be done before moving on.

const firstJob: Job = getConsoleLogJob('first job', 1000); 
const secondJob: Job = getConsoleLogJob('second job', 100);
const thirdJob: Job = getConsoleLogJob('third job', 300);

jobRunner.run(firstJob);
jobRunner.run(secondJob);
jobRunner.run(thirdJob);

// console logs:
// first job
// second job
// third job