import { beforeEach, describe, expect, it, vi } from "vitest";
// @ts-expect-error Archivo virtual montado en /src/scheduler.ts por el runner del challenge.
import {
  nextTick,
  queueJob,
  queuePostJob,
  queueWatcher,
  resetScheduler,
  type SchedulerJob,
} from "./scheduler";

describe("scheduler de actualizaciones", () => {
  beforeEach(resetScheduler);

  it("agrupa un job estable dentro de una microtask", async () => {
    const job = vi.fn() as SchedulerJob;

    queueJob(job);
    queueJob(job);
    queueJob(job);

    expect(job).not.toHaveBeenCalled();
    await nextTick();
    expect(job).toHaveBeenCalledOnce();
  });

  it("ordena padres primero y watchers pre antes del update de su owner", async () => {
    const calls: string[] = [];
    const parent = makeJob(() => calls.push("padre"), { id: 1 });
    const child = makeJob(() => calls.push("hijo"), { id: 2 });
    const pre = makeJob(() => calls.push("pre"));

    queueJob(child);
    queueWatcher(pre, "pre", 2);
    queueJob(parent);
    await nextTick();

    expect(calls).toEqual(["padre", "pre", "hijo"]);
  });

  it("ejecuta sync inmediatamente y post después de los jobs principales", async () => {
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

  it("deduplica jobs post", async () => {
    const post = vi.fn() as SchedulerJob;

    queuePostJob(post);
    queuePostJob(post);
    await nextTick();

    expect(post).toHaveBeenCalledOnce();
  });

  it("procesa un job añadido mientras se vacía la cola principal", async () => {
    const calls: string[] = [];
    const late = makeJob(() => calls.push("tardío"), { id: 2 });
    const first = makeJob(() => {
      calls.push("primero");
      queueJob(late);
    }, { id: 1 });

    queueJob(first);
    await nextTick();

    expect(calls).toEqual(["primero", "tardío"]);
  });

  it("termina el trabajo añadido desde post antes de resolver nextTick", async () => {
    const calls: string[] = [];
    const followUp = makeJob(() => calls.push("seguimiento"), { id: 2 });
    const post = makeJob(() => {
      calls.push("post");
      queueJob(followUp);
    });

    queuePostJob(post);
    await nextTick();

    expect(calls).toEqual(["post", "seguimiento"]);
  });

  it("omite trabajo disposed", async () => {
    const job = vi.fn() as SchedulerJob;
    job.disposed = true;

    queueJob(job);
    queuePostJob(job);
    await nextTick();

    expect(job).not.toHaveBeenCalled();
  });

  it("ejecuta una callback nextTick después del flush actual", async () => {
    const calls: string[] = [];
    queueJob(makeJob(() => calls.push("update"), { id: 1 }));

    await nextTick(() => calls.push("tick"));

    expect(calls).toEqual(["update", "tick"]);
  });
});

function makeJob(run: () => void, metadata: Partial<SchedulerJob> = {}) {
  return Object.assign(run, metadata) as SchedulerJob;
}
