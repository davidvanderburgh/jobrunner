export type Job = {
  start: () => Promise<void>,
}

export class JobRunner {
  private isJobRunning = false;
  private queue: Job[] = [];

  private async runNextJob () {
    if (!this.isJobRunning) {
      this.isJobRunning = true;
      
      if (this.queue.length > 0) {
        await this.queue[0].start();
        this.queue.shift();
      }
  
      this.isJobRunning = false;
      if (this.queue.length > 0) {
        await this.runNextJob();
      }
    }
  }

  public run(job: Job) {
    this.queue.push(job);
    this.runNextJob();
  }
};
