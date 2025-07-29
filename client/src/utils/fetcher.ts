import { appconfig } from "./app.config";

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface FetcherOptions {
  method?: Method;
  body?: any;
  headers?: HeadersInit;
  credentials?: RequestCredentials;
  next?: NextFetchRequestConfig; 
}

const BASE_URL = appconfig.apiBaseUrl || "";

export const fetcher = async <T = any>(
  endpoint: string,
  options: FetcherOptions = {}
): Promise<T> => {
  const {
    method = "GET",
    body,
    headers = {},
    credentials = "include",
    next, 
  } = options;

  const fetchOptions: RequestInit = {
    method,
    credentials,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    ...(body && { body: JSON.stringify(body) }),
    ...(next && { next }),
  };

  const res = await fetch(`${BASE_URL}${endpoint}`, fetchOptions);

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message || `Request failed: ${res.status}`);
  }

  return res.json();
};
