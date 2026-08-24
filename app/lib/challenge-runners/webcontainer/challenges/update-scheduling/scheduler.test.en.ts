import { beforeEach, describe, expect, it, vi } from "vitest";
// @ts-expect-error Virtual file mounted at /src/scheduler.ts by the challenge runner.
import {
  nextTick,
  queueJob,
  queuePostJob,
  queueWatcher,
  resetScheduler,
  type SchedulerJob,
} from "./scheduler";

describe("update scheduler", () => {
  beforeEach(resetScheduler);

  it("batches one stable job in a microtask", async () => {
    const job = vi.fn() as SchedulerJob;

    queueJob(job);
    queueJob(job);
    queueJob(job);

    expect(job).not.toHaveBeenCalled();
    await nextTick();
    expect(job).toHaveBeenCalledOnce();
  });

  it("sorts parents first and pre watchers before their owner update", async () => {
    const calls: string[] = [];
    const parent = makeJob(() => calls.push("parent"), { id: 1 });
    const child = makeJob(() => calls.push("child"), { id: 2 });
    const pre = makeJob(() => calls.push("pre"));

    queueJob(child);
    queueWatcher(pre, "pre", 2);
    queueJob(parent);
    await nextTick();

    expect(calls).toEqual(["parent", "pre", "child"]);
  });

  it("runs sync immediately and post after main jobs", async () => {
    const calls: string[] = [];
    const update = makeJob(() => calls.push("update"), { id: 1 });
    const sync = makeJob(() => calls.push("sync"));
    const post = makeJob(() => calls.push("post"));

    queueJob(update);
    queueWatcher(post, "post", 1);
    queueWatcher(sync, "sync", 1);

    expect(calls).toEqual(["sync"]);
    await nextTick();
    expect(calls).toEqual(["sync", "update", "post"]);
  });

  it("deduplicates post jobs", async () => {
    const post = vi.fn() as SchedulerJob;

    queuePostJob(post);
    queuePostJob(post);
    await nextTick();

    expect(post).toHaveBeenCalledOnce();
  });

  it("processes a job added while the main queue is flushing", async () => {
    const calls: string[] = [];
    const late = makeJob(() => calls.push("late"), { id: 2 });
    const first = makeJob(() => {
      calls.push("first");
      queueJob(late);
    }, { id: 1 });

    queueJob(first);
    await nextTick();

    expect(calls).toEqual(["first", "late"]);
  });

  it("finishes work queued from the post phase before nextTick resolves", async () => {
    const calls: string[] = [];
    const followUp = makeJob(() => calls.push("follow-up"), { id: 2 });
    const post = makeJob(() => {
      calls.push("post");
      queueJob(followUp);
    });

    queuePostJob(post);
    await nextTick();

    expect(calls).toEqual(["post", "follow-up"]);
  });

  it("skips disposed work", async () => {
    const job = vi.fn() as SchedulerJob;
    job.disposed = true;

    queueJob(job);
    queuePostJob(job);
    await nextTick();

    expect(job).not.toHaveBeenCalled();
  });

  it("runs a nextTick callback after the current flush", async () => {
    const calls: string[] = [];
    queueJob(makeJob(() => calls.push("update"), { id: 1 }));

    await nextTick(() => calls.push("tick"));

    expect(calls).toEqual(["update", "tick"]);
  });
});

function makeJob(run: () => void, metadata: Partial<SchedulerJob> = {}) {
  return Object.assign(run, metadata) as SchedulerJob;
}
