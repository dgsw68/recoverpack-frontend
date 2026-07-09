import { getToken } from "@/stores/authStore";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "http://localhost:8080";

const DEFAULT_TIMEOUT = 10000;

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function parseErrorMessage(res: Response): Promise<string> {
  try {
    const data = await res.json();
    return data?.message || data?.error || `요청 실패 (${res.status})`;
  } catch {
    return `요청 실패 (${res.status})`;
  }
}

interface RequestOptions extends RequestInit {
  timeout?: number;
  /** 인증 토큰을 붙일지 여부 (기본 true) */
  auth?: boolean;
}

export async function apiRequest<T>(
  path: string,
  { timeout = DEFAULT_TIMEOUT, auth = true, headers, ...init }: RequestOptions = {},
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  const isFormData = init.body instanceof FormData;
  const token = auth ? getToken() : null;

  try {
    const res = await fetch(`${API_URL}${path}`, {
      ...init,
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
    });
    if (!res.ok) {
      throw new ApiError(await parseErrorMessage(res), res.status);
    }
    if (res.status === 204) return undefined as T;
    return (await res.json()) as T;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new ApiError("요청 시간이 초과됐어요. 다시 시도해 주세요.", 0);
    }
    throw new ApiError("서버에 연결할 수 없어요. 잠시 후 다시 시도해 주세요.", 0);
  } finally {
    clearTimeout(timer);
  }
}

/** JSON이 아닌 blob 응답(zip 다운로드 등)을 위한 요청 */
export async function apiRequestBlob(
  path: string,
  { timeout = 20000, auth = true, headers, ...init }: RequestOptions = {},
): Promise<Blob> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  const token = auth ? getToken() : null;

  try {
    const res = await fetch(`${API_URL}${path}`, {
      ...init,
      signal: controller.signal,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
    });
    if (!res.ok) {
      throw new ApiError(await parseErrorMessage(res), res.status);
    }
    return await res.blob();
  } catch (err) {
    if (err instanceof ApiError) throw err;
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new ApiError("요청 시간이 초과됐어요. 다시 시도해 주세요.", 0);
    }
    throw new ApiError("서버에 연결할 수 없어요. 잠시 후 다시 시도해 주세요.", 0);
  } finally {
    clearTimeout(timer);
  }
}
