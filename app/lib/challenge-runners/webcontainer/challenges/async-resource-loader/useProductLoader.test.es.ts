import { describe, expect, it, vi } from "vitest";
import { useProductLoader, type Product } from "./useProductLoader";

describe("useProductLoader", () => {
  it("expone un estado inicial predecible", () => {
    const loader = vi.fn<() => Promise<Product[]>>();
    const { products, loading, error, load } = useProductLoader(loader);

    expect(products.value).toEqual([]);
    expect(loading.value).toBe(false);
    expect(error.value).toBe("");
    expect(load).toBeTypeOf("function");
  });

  it("obtiene los productos mediante la dependencia recibida", async () => {
    const expectedProducts = [
      { id: 7, name: "Webcam" },
      { id: 8, name: "Micrófono" },
    ];
    const loader = vi.fn().mockResolvedValue(expectedProducts);
    const { products, load } = useProductLoader(loader);

    await load();

    expect(loader).toHaveBeenCalledOnce();
    expect(products.value).toEqual(expectedProducts);
  });

  it("mantiene loading activo mientras la carga está pendiente", async () => {
    let resolveLoader!: (products: Product[]) => void;
    const loader = vi.fn(
      () => new Promise<Product[]>((resolve) => {
        resolveLoader = resolve;
      }),
    );
    const { loading, load } = useProductLoader(loader);

    const request = load();

    expect(loading.value).toBe(true);

    resolveLoader([{ id: 1, name: "Teclado" }]);
    await request;

    expect(loading.value).toBe(false);
  });

  it("expone un mensaje y finaliza la carga cuando la dependencia falla", async () => {
    const loader = vi.fn().mockRejectedValue(new Error("Network error"));
    const { error, loading, load } = useProductLoader(loader);

    await load();

    expect(error.value).toBe("No se pudieron cargar los productos.");
    expect(loading.value).toBe(false);
  });

  it("limpia un error anterior antes de volver a cargar", async () => {
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
