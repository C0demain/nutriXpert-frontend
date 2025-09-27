import type { UseFetchOptions } from "#app";

export function useAgentAPI<T>(url: string | (() => string), options?: UseFetchOptions<T>) {
  return useFetch(url, {
    ...options,
    $fetch: useNuxtApp().$aiApi as typeof $fetch
  })
}
