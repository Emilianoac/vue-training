export type FlushMode = "pre" | "post" | "sync";

export type SchedulerJob = (() => void) & {
  id?: number;
  pre?: boolean;
  disposed?: boolean;
};

const queue: SchedulerJob[] = [];
const queuedJobs = new Set<SchedulerJob>();
const pendingPostJobs: SchedulerJob[] = [];
const queuedPostJobs = new Set<SchedulerJob>();
const resolvedPromise = Promise.resolve();

let currentFlushPromise: Promise<void> | null = null;
let isFlushing = false;
let flushIndex = 0;

export function queueJob(job: SchedulerJob) {
  if (job.disposed || queuedJobs.has(job)) return;

  queuedJobs.add(job);

  if (!isFlushing) {
    queue.push(job);
  } else {
    let index = queue.length;
    while (index > flushIndex + 1 && compareJobs(job, queue[index - 1]!) < 0) {
      index -= 1;
    }
    queue.splice(index, 0, job);
  }

  queueFlush();
}

export function queuePostJob(job: SchedulerJob) {
  if (job.disposed || queuedPostJobs.has(job)) return;

  queuedPostJobs.add(job);
  pendingPostJobs.push(job);
  queueFlush();
}

export function queueWatcher(job: SchedulerJob, flush: FlushMode, ownerId: number) {
  if (job.disposed) return;

  if (flush === "sync") {
    job();
  } else if (flush === "post") {
    queuePostJob(job);
  } else {
    job.id = ownerId;
    job.pre = true;
    queueJob(job);
  }
}

export function nextTick<T>(callback?: () => T | Promise<T>): Promise<void | T> {
  const promise = currentFlushPromise ?? resolvedPromise;
  return callback ? promise.then(callback) : promise;
}

export function resetScheduler() {
  queue.length = 0;
  queuedJobs.clear();
  pendingPostJobs.length = 0;
  queuedPostJobs.clear();
  currentFlushPromise = null;
  isFlushing = false;
  flushIndex = 0;
}

function queueFlush() {
  if (!currentFlushPromise) {
    currentFlushPromise = resolvedPromise.then(flushJobs);
  }
  return currentFlushPromise;
}

function flushJobs() {
  isFlushing = true;
  queue.sort(compareJobs);

  try {
    for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
      const job = queue[flushIndex]!;
      if (!job.disposed) job();
      queuedJobs.delete(job);
    }
  } finally {
    queue.length = 0;
    queuedJobs.clear();
    flushIndex = 0;

    flushPostJobs();
    isFlushing = false;
    currentFlushPromise = null;

    if (queue.length || pendingPostJobs.length) flushJobs();
  }
}

function flushPostJobs() {
  if (!pendingPostJobs.length) return;

  const jobs = [...pendingPostJobs].sort(compareJobs);
  pendingPostJobs.length = 0;
  queuedPostJobs.clear();

  for (const job of jobs) {
    if (!job.disposed) job();
  }
}

function compareJobs(first: SchedulerJob, second: SchedulerJob) {
  const firstId = first.id ?? Number.POSITIVE_INFINITY;
  const secondId = second.id ?? Number.POSITIVE_INFINITY;

  if (firstId !== secondId) return firstId - secondId;
  if (first.pre && !second.pre) return -1;
  if (!first.pre && second.pre) return 1;
  return 0;
}
