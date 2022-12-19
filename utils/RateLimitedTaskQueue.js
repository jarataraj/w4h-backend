// An async task queue that limits the rate of task execution. Rejects
// tasks that have sat in the queue for `millisecTimeout` milliseconds
// without execution. Example use: limiting Nominatim requests to less than
// once per second, timeout after five seconds

class RateLimitedTaskQueue {
    constructor(minMillisecBetweenTasks, millisecTimeout) {
        this.minMillisecBetweenTasks = minMillisecBetweenTasks;
        this.taskQueue = [];
        this.running = false;
        this.timeout = millisecTimeout;
    }
    enqueue(func, timeout) {
        const result = new Promise((resolve, reject) => {
            // set timeout
            const timeoutId = setTimeout(() => {
                // at timeout, remove task from queue and reject task
                this.taskQueue = this.taskQueue.filter(
                    (task) => task.func !== func
                );
                reject("Timeout");
            }, timeout || this.timeout);
            // add task to queue
            this.taskQueue.push({ func, resolve, reject, timeoutId });
        });
        if (!this.running) {
            this.run();
        }
        return result;
    }
    dequeue() {
        if (this.taskQueue.length) {
            // if task in queue: remove earliest task available
            let { func, resolve, reject, timeoutId } = this.taskQueue.shift();
            // clear timeout
            clearTimeout(timeoutId);
            // start with Promise.resolve(func()) in order to handle funcs that do not return a promise
            Promise.resolve(func()).then(
                (result) => resolve(result),
                (error) => reject(error)
            );
            // wait timeout to try next execution
            setTimeout(() => this.dequeue(), this.minMillisecBetweenTasks);
        } else {
            // if no task in queue: stop execution
            this.running = false;
        }
    }
    run() {
        // set running flag and dequeue
        this.running = true;
        this.dequeue();
    }
}

module.exports = RateLimitedTaskQueue;
