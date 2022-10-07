import { Job, JobRunner } from '../job-runner';
import { wait, waitForExpect } from '../test-utils';

describe(JobRunner, () => {
  const mockStart = jest.fn();
  const someJob = (options: {
    jobId: number, waitTimeInMs?: number
  }): Job => ({
    start: async (): Promise<void> => {
      mockStart(options.jobId);
      await wait(options.waitTimeInMs);
    },
  });

  let someJobRunner: JobRunner;

  beforeEach(() => {
    someJobRunner = new JobRunner();
  });

  describe('single job', () => {
    it('runs the given job', () => {
      someJobRunner.run(someJob({ jobId: 1 }));
      expect(mockStart).toHaveBeenCalledWith(1);
    });
  });

  describe('multiple jobs', () => {
    describe('jobs are all equal in time', () => {
      it('runs the given jobs in order', async () => {
        someJobRunner.run(someJob({ jobId: 3 }));
        someJobRunner.run(someJob({ jobId: 1 }));
        someJobRunner.run(someJob({ jobId: 2 }));
        await waitForExpect(() => expect(mockStart).toHaveBeenNthCalledWith(1, 3));
        await waitForExpect(() => expect(mockStart).toHaveBeenNthCalledWith(2, 1));
        await waitForExpect(() => expect(mockStart).toHaveBeenNthCalledWith(3, 2));
      });
    });

    describe('first job takes long and second job starts before it is done', () => {
      it('runs the given jobs in order', async () => {
        someJobRunner.run(someJob({ jobId: 2, waitTimeInMs: 100 }));
        someJobRunner.run(someJob({ jobId: 3, waitTimeInMs: 20 }));
        await waitForExpect(() => expect(mockStart).toHaveBeenNthCalledWith(1, 2));
        await waitForExpect(() => expect(mockStart).toHaveBeenNthCalledWith(2, 3));
      });
    });
  });
});
