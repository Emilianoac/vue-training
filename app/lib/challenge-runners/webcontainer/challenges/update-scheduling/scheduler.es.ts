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
  // TODO: deduplica por identidad, omite jobs disposed y programa un solo flush.
  queue.push(job);
  queueFlush();
}

export function queuePostJob(job: SchedulerJob) {
  // TODO: deduplica los jobs que deben ejecutarse después de la cola principal.
  pendingPostJobs.push(job);
  queueFlush();
}

export function queueWatcher(job: SchedulerJob, flush: FlushMode, ownerId: number) {
  // TODO: ejecuta sync ahora, encola post en su fase y marca pre con ownerId.
  void ownerId;
  if (flush === "sync") job();
  else if (flush === "post") queuePostJob(job);
  else queueJob(job);
}

export function nextTick<T>(callback?: () => T | Promise<T>): Promise<void | T> {
  // TODO: reutiliza la promesa del flush actual en vez de crear trabajo ajeno.
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
  // TODO: ordena por id/pre, procesa jobs nuevos y restaura siempre el estado.
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
  // TODO: ejecuta una copia estable y ordenada, permitiendo programar otro ciclo.
  pendingPostJobs.forEach((job) => {
    if (!job.disposed) job();
  });
  pendingPostJobs.length = 0;
}
