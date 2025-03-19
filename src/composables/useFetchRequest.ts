import { ref, type Ref } from "vue";

type FetchRequestConfig = RequestInit & {
  url?: string;
  baseUrl?: string;
  params?: Record<string, string>;
};

export function useFetchRequest(baseConfig: FetchRequestConfig = {}) {
  const data: Ref<any> = ref(null);
  const error: Ref<Error | null> = ref(null);
  const loading: Ref<boolean> = ref(false);
  const status: Ref<number | null> = ref(null);
  const controller: Ref<AbortController | null> = ref(null);

  const buildUrl = (url: string, params?: Record<string, string>) => {
    if (!params) return url;

    const query = new URLSearchParams(params).toString();
    return `${url}?${query}`;
  };

  const execute = async (overrideConfig: FetchRequestConfig = {}) => {
    const config: FetchRequestConfig = {
      ...baseConfig,
      ...overrideConfig,
      headers: {
        "Content-Type": "application/json",
        ...baseConfig.headers,
        ...overrideConfig.headers,
      },
    };

    const fullUrl = buildUrl(config.url || baseConfig.url || "", config.params || baseConfig.params);

    controller.value = new AbortController();
    loading.value = true;
    error.value = null;

    try {
      const response = await fetch(fullUrl, {
        ...config,
        signal: controller.value.signal,
      });

      status.value = response.status;

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }

      const contentType = response.headers.get("content-type");
      data.value = contentType?.includes("application/json") ? await response.json() : await response.text();
    } catch (err) {
      error.value = err as Error;
      data.value = null;
    } finally {
      loading.value = false;
      controller.value = null;
    }
  };

  const abort = () => {
    if (controller.value) {
      controller.value.abort();
      controller.value = null;
    }
  };

  return {
    data,
    error,
    loading,
    status,
    execute,
    abort,
  };
}
