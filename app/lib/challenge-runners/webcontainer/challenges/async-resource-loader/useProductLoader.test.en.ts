import { describe, expect, it, vi } from "vitest";
import { useProductLoader, type Product } from "./useProductLoader";

describe("useProductLoader", () => {
  it("exposes predictable initial state", () => {
    const loader = vi.fn<() => Promise<Product[]>>();
    const { products, loading, error, load } = useProductLoader(loader);

    expect(products.value).toEqual([]);
    expect(loading.value).toBe(false);
    expect(error.value).toBe("");
    expect(load).toBeTypeOf("function");
  });

  it("loads products through the received dependency", async () => {
    const expectedProducts = [
      { id: 7, name: "Webcam" },
      { id: 8, name: "Microphone" },
    ];
    const loader = vi.fn().mockResolvedValue(expectedProducts);
    const { products, load } = useProductLoader(loader);

    await load();

    expect(loader).toHaveBeenCalledOnce();
    expect(products.value).toEqual(expectedProducts);
  });

  it("keeps loading active while the request is pending", async () => {
    let resolveLoader!: (products: Product[]) => void;
    const loader = vi.fn(
      () => new Promise<Product[]>((resolve) => {
        resolveLoader = resolve;
      }),
    );
    const { loading, load } = useProductLoader(loader);

    const request = load();

    expect(loading.value).toBe(true);

    resolveLoader([{ id: 1, name: "Keyboard" }]);
    await request;

    expect(loading.value).toBe(false);
  });

  it("exposes a message and finishes loading when the dependency fails", async () => {
    const loader = vi.fn().mockRejectedValue(new Error("Network error"));
    const { error, loading, load } = useProductLoader(loader);

    await load();

    expect(error.value).toBe("Products could not be loaded.");
    expect(loading.value).toBe(false);
  });

  it("clears a previous error before loading again", async () => {
    const loader = vi
      .fn<() => Promise<Product[]>>()
      .mockRejectedValueOnce(new Error("Network error"))
      .mockResolvedValueOnce([{ id: 3, name: "Monitor" }]);
    const { error, products, load } = useProductLoader(loader);

    await load();
    await load();

    expect(error.value).toBe("");
    expect(products.value).toEqual([{ id: 3, name: "Monitor" }]);
  });
});
