import { Job, JobRunner } from './job-runner';
import { wait } from './test-utils';

const jobRunner = new JobRunner();

const getConsoleLogJob = (textToOutput: string, timeToProcess?: number): Job => ({
  start: async (): Promise<void> => {
    await wait(timeToProcess);
    console.log(textToOutput);
  }, 
});

const firstJob: Job = getConsoleLogJob('first job', 1000); 
const secondJob: Job = getConsoleLogJob('second job', 100);
const thirdJob: Job = getConsoleLogJob('third job', 300);

jobRunner.run(firstJob);
jobRunner.run(secondJob);
jobRunner.run(thirdJob);