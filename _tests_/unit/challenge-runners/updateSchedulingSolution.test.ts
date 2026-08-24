import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  nextTick,
  queueJob,
  queuePostJob,
  queueWatcher,
  resetScheduler,
  type SchedulerJob,
} from "../../../app/lib/challenge-runners/webcontainer/challenges/update-scheduling/scheduler.solution.en";

describe("update scheduling challenge solution", () => {
  beforeEach(resetScheduler);

  it("batches and orders stable jobs", async () => {
    const calls: string[] = [];
    const parent = makeJob(() => calls.push("parent"), { id: 1 });
    const child = makeJob(() => calls.push("child"), { id: 2 });
    const pre = makeJob(() => calls.push("pre"));

    queueJob(child);
    queueJob(child);
    queueWatcher(pre, "pre", 2);
    queueJob(parent);

    expect(calls).toEqual([]);
    await nextTick();
    expect(calls).toEqual(["parent", "pre", "child"]);
  });

  it("runs sync immediately and completes post work within nextTick", async () => {
    const calls: string[] = [];
    const update = makeJob(() => calls.push("update"), { id: 1 });
    const sync = makeJob(() => calls.push("sync"));
    const post = makeJob(() => calls.push("post"));

    queueJob(update);
    queueWatcher(post, "post", 1);
    queueWatcher(post, "post", 1);
    queueWatcher(sync, "sync", 1);

    expect(calls).toEqual(["sync"]);
    await nextTick(() => calls.push("tick"));
    expect(calls).toEqual(["sync", "update", "post", "tick"]);
  });

  it("processes work queued during main and post phases", async () => {
    const calls: string[] = [];
    const fromMain = makeJob(() => calls.push("from-main"), { id: 2 });
    const fromPost = makeJob(() => calls.push("from-post"), { id: 3 });
    const first = makeJob(() => {
      calls.push("first");
      queueJob(fromMain);
    }, { id: 1 });
    const post = makeJob(() => {
      calls.push("post");
      queueJob(fromPost);
    });

    queueJob(first);
    queuePostJob(post);
    await nextTick();

    expect(calls).toEqual(["first", "from-main", "post", "from-post"]);
  });

  it("does not execute disposed jobs", async () => {
    const job = vi.fn() as SchedulerJob;
    job.disposed = true;

    queueJob(job);
    queuePostJob(job);
    await nextTick();

    expect(job).not.toHaveBeenCalled();
  });
});

function makeJob(run: () => void, metadata: Partial<SchedulerJob> = {}) {
  return Object.assign(run, metadata) as SchedulerJob;
}
