import { MAX_RETRIES, THROTTLE_MS, REQUEST_TIMEOUT_MS } from "./constants.js";

const BASE_URL = "https://sumo-api.com/api";

let lastRequestTime = 0;

async function throttle(): Promise<void> {
  const now = Date.now();
  const elapsed = now - lastRequestTime;
  if (elapsed < THROTTLE_MS) {
    await new Promise((resolve) => setTimeout(resolve, THROTTLE_MS - elapsed));
  }
  lastRequestTime = Date.now();
}

export async function apiFetch<T>(path: string): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    await throttle();

    try {
      const url = `${BASE_URL}${path}`;
      console.log(`[api] GET ${url} (attempt ${attempt})`);

      const response = await fetch(url, {
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} ${response.statusText}`);
      }

      return (await response.json()) as T;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      console.warn(`[api] attempt ${attempt} failed: ${lastError.message}`);

      if (attempt < MAX_RETRIES) {
        const backoff = Math.pow(2, attempt) * 1000;
        console.log(`[api] retrying in ${backoff}ms...`);
        await new Promise((resolve) => setTimeout(resolve, backoff));
      }
    }
  }

  throw lastError;
}

export interface PaginatedResponse<T> {
  limit: number;
  skip: number;
  total: number;
  records: T[];
}

export async function fetchAllPages<T>(
  path: string,
  limit = 100,
): Promise<T[]> {
  const all: T[] = [];
  let skip = 0;

  while (true) {
    const res = await apiFetch<PaginatedResponse<T>>(
      `${path}?limit=${limit}&skip=${skip}`,
    );
    all.push(...res.records);

    if (skip + res.records.length >= res.total) break;
    skip += limit;
  }

  return all;
}
