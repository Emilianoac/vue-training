---
documentId: update-scheduling-lesson
title: Scheduling Reactive Updates
level: basic
description: Understand how Vue batches jobs, orders updates, and coordinates nextTick and watcher flush timing.
---

## Separate invalidation from execution

When a reactive dependency changes, the system knows which effects became invalid. That does not require them to run immediately. A scheduler can sit between notification and execution:

```js
function triggerEffect(effect) {
  if (effect.scheduler) {
    effect.scheduler(effect.run);
  } else {
    effect.run();
  }
}
```

A synchronously executed effect observes every intermediate mutation. A scheduled effect can wait, be grouped with other invalidations, and run once with the final state of the synchronous block.

```js
count.value = 1;
count.value = 2;
count.value = 3;
```

All three writes still happen immediately. What is deferred is derived work, such as updating a component. If its job is deduplicated, rendering reads `3` directly and avoids producing intermediate interfaces for `1` and `2`.

The models in this lesson are reduced pedagogical implementations. They preserve the essential responsibilities of Vue's scheduler while omitting internal flags, optimizations, and complete handling of recursive edge cases.

---

## Work with stable jobs

The unit placed in the queue is a **job**: a function with a stable identity that represents pending work. For a component instance, it can be its update function:

```js
function setupRenderEffect(instance) {
  const update = () => renderComponent(instance);

  instance.update = update;
  instance.effect = effect(update, {
    scheduler: () => queueJob(update),
  });
}
```

Reusing the same `update` function is important. If the scheduler created a new wrapper on every invalidation, a `Set` could not recognize that they all represent the same work:

```js
// Loses identity on every call.
queueJob(() => instance.update());

// Preserves a deduplicable identity.
queueJob(instance.update);
```

A job can also carry metadata. An `id` enables component ordering, while a `pre` marker places a watcher before its owning instance's update.

```js
instance.update.id = instance.uid;
watcherJob.id = instance.uid;
watcherJob.pre = true;
```

---

## Deduplicate a queue

An array preserves execution order, while a `Set` records which jobs are already pending:

```js
const queue = [];
const queuedJobs = new Set();

function queueJob(job) {
  if (queuedJobs.has(job)) return;

  queuedJobs.add(job);
  queue.push(job);
  queueFlush();
}
```

If five properties used by the same component change in one synchronous block, all five can invalidate its effect. The first adds `instance.update`; the others find the same reference and create no duplicate entries.

Deduplicating jobs does not mean ignoring state changes. The state already contains every write when the job runs. The queue avoids repeating the consumer; it does not discard the mutations that invalidated it.

Two different components do have different jobs, even if they reacted to the same source. Each keeps its own entry because every instance must update its own subtree.

---

## Schedule one microtask

Adding a job should not create a new promise every time either. The scheduler shares one promise while a flush is pending:

```js
const resolvedPromise = Promise.resolve();
let currentFlushPromise = null;

function queueFlush() {
  if (currentFlushPromise) return;

  currentFlushPromise = resolvedPromise.then(flushJobs);
}
```

The current synchronous code finishes before the `then` callback runs. More jobs can enter the same queue during that interval and share the same microtask.

```text
current event or task
  ├─ mutation A → queueJob(update)
  ├─ mutation B → the same job is already pending
  └─ synchronous code ends
microtask
  └─ flushJobs() → one update
```

A microtask runs before the browser normally advances to the next task. Even so, Vue's useful guarantee should not be expressed as “the DOM changes after a certain number of milliseconds,” but as “pending updates complete on the next tick.”

---

## Flush the queue safely

Before executing, the scheduler orders its jobs. It then walks the queue and releases its state even if a job fails:

```js
let flushIndex = 0;

function flushJobs() {
  queue.sort(compareJobs);

  try {
    for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
      const job = queue[flushIndex];
      if (job.disposed) continue;

      job();
      queuedJobs.delete(job);
    }
  } finally {
    queue.length = 0;
    queuedJobs.clear();
    flushIndex = 0;

    flushPostJobs();
    currentFlushPromise = null;

    if (queue.length || pendingPostJobs.length) {
      return flushJobs();
    }
  }
}
```

The index allows traversal to see jobs added while the flush is active. The `finally` block prevents an exception from leaving the scheduler permanently marked as busy. Vue's production implementation also routes errors through the component error-handling system and detects excessive recursive updates.

A job can become obsolete before its turn. For example, if a parent unmounts a child, the child's pending update should no longer run. A `disposed` marker allows that work to be skipped without disturbing the rest of the queue.

---

## Keep deterministic order

Vue normally creates a parent instance before its descendants, so their identifiers increase in that order. Sorting by `id` produces parent-to-child updates:

```js
function compareJobs(first, second) {
  const firstId = first.id ?? Infinity;
  const secondId = second.id ?? Infinity;

  if (firstId !== secondId) return firstId - secondId;
  if (first.pre && !second.pre) return -1;
  if (!first.pre && second.pre) return 1;
  return 0;
}
```

Updating the parent first matters because it can change the child's props or unmount it completely. In the latter case, the scheduler can skip the child job that was still pending.

A `pre` watcher uses the same `id` as its component update but sorts immediately before it. It can therefore react to the latest state after the parent has had a chance to update it and before the DOM belonging to its own instance changes.

Order should not accidentally depend on which dependency called `trigger` first. Metadata turns the queue into a predictable sequence.

---

## Place watchers within the flush

Watchers can choose when their callback runs through `flush`:

- `pre` is the default. The callback runs before its own component's DOM update.
- `post` runs after Vue has updated the DOM and is suitable for reading that result.
- `sync` runs the callback during the trigger without batching.

A reduced scheduler can select the channel when creating the watcher:

```js
function scheduleWatcher(job, flush, owner) {
  if (flush === 'sync') {
    job();
  } else if (flush === 'post') {
    queuePostJob(job);
  } else {
    job.id = owner.uid;
    job.pre = true;
    queueJob(job);
  }
}
```

`post` callbacks use a separate queue that is flushed after the main updates:

```js
const pendingPostJobs = [];
const queuedPostJobs = new Set();

function queuePostJob(job) {
  if (queuedPostJobs.has(job)) return;
  queuedPostJobs.add(job);
  pendingPostJobs.push(job);
  queueFlush();
}
```

A `sync` watcher can be useful for a small signal that demands an immediate response, but it observes every mutation and loses deduplication. It is a poor choice for a collection that can be changed many times synchronously.

---

## Complete the post phase

The post phase must also be deduplicated and use a stable copy before execution:

```js
function flushPostJobs() {
  if (!pendingPostJobs.length) return;

  const jobs = [...new Set(pendingPostJobs)].sort(compareJobs);
  pendingPostJobs.length = 0;
  queuedPostJobs.clear();

  for (const job of jobs) {
    if (!job.disposed) job();
  }
}
```

Vue runs work that needs the already updated tree in this phase, including `post` watchers and other callbacks that follow rendering. A post callback can still mutate state and add new work. That is why `flushJobs` checks the queues again before considering the cycle complete.

The phases are not three independent timers. `pre`, updates, and `post` are ordered parts of the same flush. That relationship makes it possible to reason about which version of the DOM each callback can observe.

---

## Wait with nextTick

`nextTick` does not force a render or create an update by itself. It returns the current flush promise; when no work is pending, it uses an already resolved promise:

```js
function nextTick(callback) {
  const promise = currentFlushPromise ?? resolvedPromise;
  return callback ? promise.then(callback) : promise;
}
```

```js
count.value++;

console.log(element.textContent); // Previous DOM.
await nextTick();
console.log(element.textContent); // Updated DOM.
```

The promise resolves after the pending flush phases complete. `nextTick` can therefore wait for an update caused by an earlier mutation.

If no update was queued, `await nextTick()` merely yields until a later microtask; it does not invent work or guarantee that asynchronous operations outside Vue have finished. It does not replace a `post` watcher either: the watcher declares that a reaction always belongs to the post phase, while `nextTick` waits imperatively at one specific point in a flow.

---

## Prevent cycles and stale work

A job can mutate a dependency that schedules the same job again. Some repetitions are intentional and stabilize; others create an infinite cycle:

```js
watch(count, () => {
  count.value++;
});
```

A production scheduler limits recursive repetitions and keeps enough information to explain which component or watcher caused them. Deduplication within a batch reduces accidental repetition, but it cannot prove that every recursive mutation is safe.

Lifetime matters as well. Stopping a watcher or unmounting an instance must prevent its pending jobs from acting afterward. Marking a job as disposed or removing it from its queues keeps scheduling aligned with ownership of the work.

The scheduler therefore coordinates four separate decisions: **which** job represents the update, **how many times** it should appear in the batch, **in what order** it runs, and **when** the observable cycle completes through `nextTick`. Reactive state changes immediately; the queue turns its invalidations into a minimal and predictable sequence of work.
