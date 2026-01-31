import { useState, useEffect, useCallback } from "react";
import { axiosInstance } from "../../services/api";
import { queryCache } from "./queryCache";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface BaseOptions {
  url: string;
  retry?: number;
  enabled?: boolean;
  staleTime?: number;
  queryKey?: string[];
}

interface QueryOptions<T> extends BaseOptions {
  method: "GET";
  params?: Record<string, any>;
}

interface MutationOptions<T, V> extends BaseOptions {
  method: Exclude<HttpMethod, "GET">;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

interface QueryResult<T> {
  data?: T;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

interface MutationResult<T, V> {
  data?: T;
  isLoading: boolean;
  error: Error | null;
  mutate: (variables: V) => Promise<void>;
  mutateAsync: (variables: V) => Promise<T>;
}

function getCacheKey(url: string, params?: Record<string, any>, queryKey?: string[]) {
  if (queryKey?.length) return JSON.stringify(queryKey);
  if (!params) return url;
  const sorted = Object.keys(params).sort().map(k => `${k}=${JSON.stringify(params[k])}`).join("&");
  return `${url}?${sorted}`;
}

function replaceUrlParams(url: string, vars: any) {
  if (!vars || typeof vars !== 'object') return url;
  let result = url;
  Object.keys(vars).forEach(k => {
    result = result.replace(`:${k}`, String(vars[k])).replace(`{${k}}`, String(vars[k]));
  });
  return result;
}

function extractUrlParams(url: string): string[] {
  return [...(url.match(/:(\w+)/g)?.map(p => p.slice(1)) || []),
          ...(url.match(/\{(\w+)\}/g)?.map(p => p.slice(1, -1)) || [])];
}

function separateParams(vars: any, urlParams: string[]) {
  if (!vars || typeof vars !== 'object') return { urlParams: {}, bodyData: vars };
  const urlParamsObj: Record<string, any> = {};
  const bodyData: Record<string, any> = {};
  Object.keys(vars).forEach(k => (urlParams.includes(k) ? urlParamsObj : bodyData)[k] = vars[k]);
  return { urlParams: urlParamsObj, bodyData };
}

async function retryRequest<T>(fn: () => Promise<T>, count: number): Promise<T> {
  for (let i = 0; i <= count; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === count) throw err;
      await new Promise(r => setTimeout(r, Math.pow(2, i + 1) * 1000));
    }
  }
  throw new Error("Request failed");
}

export function useCustomQuery<T>(options: QueryOptions<T>): QueryResult<T>;
export function useCustomQuery<T, V>(options: MutationOptions<T, V>): MutationResult<T, V>;

export function useCustomQuery<T, V = void>(options: QueryOptions<T> | MutationOptions<T, V>) {
  const { method, url, retry = 1, enabled = true } = options;
  const [data, setData] = useState<T>();
  const [isLoading, setIsLoading] = useState(method === "GET");
  const [error, setError] = useState<Error | null>(null);

  if (method === "GET") {
    const { params, staleTime = 5 * 60 * 1000, queryKey } = options as QueryOptions<T>;
    const cacheKey = getCacheKey(url, params, queryKey);

    const fetchData = useCallback(async () => {
      if (!enabled) return setIsLoading(false);

      const cached = queryCache.get<T>(cacheKey);
      if (cached && Date.now() - cached.updatedAt < staleTime) {
        setData(cached.data);
        return setIsLoading(false);
      }

      setIsLoading(true);
      setError(null);
      try {
        const res = await retryRequest(() => axiosInstance({ method: "GET", url, params }), retry);
        queryCache.set(cacheKey, res.data);
        setData(res.data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    }, [url, JSON.stringify(params), enabled, retry, staleTime, cacheKey]);

    useEffect(() => { fetchData(); }, [fetchData]);

    return { 
      data, 
      isLoading, 
      error, 
      refetch: async () => { queryCache.invalidate(cacheKey); await fetchData(); }
    };
  }

  const { onSuccess, onError } = options as MutationOptions<T, V>;

  const executeMutation = async (variables: V): Promise<T> => {
    setIsLoading(true);
    setError(null);
    try {
      const urlParams = extractUrlParams(url);
      const { urlParams: urlParamsObj, bodyData } = separateParams(variables, urlParams);
      const finalUrl = replaceUrlParams(url, urlParamsObj);
      const hasBody = bodyData && Object.keys(bodyData).length > 0;

      const res = await retryRequest(
        () => axiosInstance({ method, url: finalUrl, data: hasBody ? bodyData : undefined }),
        retry
      );
      setData(res.data);
      onSuccess?.(res.data);
      return res.data;
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      setError(errorObj);
      onError?.(errorObj);
      throw errorObj;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    data,
    isLoading,
    error,
    mutate: async (vars: V) => { try { await executeMutation(vars); } catch {} },
    mutateAsync: executeMutation,
  };
}