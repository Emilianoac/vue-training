export async function dataFetcher<T>(url: string): Promise<T> {
  const { data, error } = await useFetch<T>(url);
  if (error.value) {
    throw new Error(error.value.data);
  }

  if (data.value === null) {
    throw new Error("Data not found");
  }
  return data.value as T;
}