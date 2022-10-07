export const wait = async (waitTimeInMs?: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, waitTimeInMs);
  });
}

export const waitForExpect = async (
  expectation: () => void | Promise<void>,
  timeout = 5000,
): Promise<void> => {
  const maxAttempts = 5;
  let attempt = 1;

  return new Promise((resolve, reject) => {
    const rejectOrRerun = (error: Error) => {
      if (attempt > maxAttempts) {
        reject(error);
        return;
      }
      setTimeout(runExpectation, timeout / maxAttempts);
    };
    const runExpectation = async (): Promise<void> => {
      try {
        Promise.resolve(expectation())
          .then(() => resolve())
          .catch(rejectOrRerun);
      } catch (error) {
        rejectOrRerun(error as Error);
      }
      attempt++;
    };
    setTimeout(runExpectation, 0);
  })
}