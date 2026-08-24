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
  // TODO: deduplicate by identity, skip disposed jobs, and schedule one flush.
  queue.push(job);
  queueFlush();
}

export function queuePostJob(job: SchedulerJob) {
  // TODO: deduplicate jobs that must run after the main queue.
  pendingPostJobs.push(job);
  queueFlush();
}

export function queueWatcher(job: SchedulerJob, flush: FlushMode, ownerId: number) {
  // TODO: run sync now, queue post in its phase, and mark pre with ownerId.
  void ownerId;
  if (flush === "sync") job();
  else if (flush === "post") queuePostJob(job);
  else queueJob(job);
}

export function nextTick<T>(callback?: () => T | Promise<T>): Promise<void | T> {
  // TODO: reuse the current flush promise instead of creating unrelated work.
  return callback ? Promise.resolve().then(callback) : Promise.resolve();
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
  // TODO: sort by id/pre, process newly queued jobs, and always restore state.
  isFlushing = true;
  queue.forEach((job) => {
    if (!job.disposed) job();
  });
  queue.length = 0;
  flushPostJobs();
  isFlushing = false;
  currentFlushPromise = null;
}

function flushPostJobs() {
  // TODO: run a stable, ordered copy and allow it to schedule another cycle.
  pendingPostJobs.forEach((job) => {
    if (!job.disposed) job();
  });
  pendingPostJobs.length = 0;
}
