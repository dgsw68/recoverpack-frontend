import type {
  DamageType,
  EvidenceItem,
  PackageEntry,
  UploadedFile,
} from "./types";

/**
 * 백엔드 API 헬퍼.
 *
 * 모든 호출은 백엔드가 없거나 실패하면 예외를 던지고,
 * 호출부(page)에서 목업 데이터로 fallback 하도록 설계되어 있습니다.
 * 따라서 백엔드 없이도 전체 플로우가 정상 동작합니다.
 */

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
  "http://localhost:8080";

const DEFAULT_TIMEOUT = 4000;

async function request<T>(
  path: string,
  init?: RequestInit,
  timeout = DEFAULT_TIMEOUT,
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        ...(init?.body && !(init.body instanceof FormData)
          ? { "Content-Type": "application/json" }
          : {}),
        ...init?.headers,
      },
    });
    if (!res.ok) {
      throw new Error(`요청 실패: ${res.status}`);
    }
    return (await res.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}

export interface CreateProjectResponse {
  projectId: string;
}

/** POST /api/projects — 프로젝트 생성 */
export async function createProject(
  damageType: DamageType,
): Promise<CreateProjectResponse> {
  return request<CreateProjectResponse>("/api/projects", {
    method: "POST",
    body: JSON.stringify({ damageType }),
  });
}

export interface UploadFilesResponse {
  projectId: string;
  files: { id: string; name: string }[];
}

/** POST /api/projects/:projectId/files — 파일 메타데이터 업로드 */
export async function uploadFiles(
  projectId: string,
  files: UploadedFile[],
): Promise<UploadFilesResponse> {
  return request<UploadFilesResponse>(`/api/projects/${projectId}/files`, {
    method: "POST",
    body: JSON.stringify({
      files: files.map((f) => ({
        id: f.id,
        name: f.name,
        size: f.size,
        mimeType: f.mimeType,
        fileType: f.fileType,
      })),
    }),
  });
}

export interface AnalyzeResponse {
  evidence: EvidenceItem[];
}

/** POST /api/projects/:projectId/analyze — AI 분류 실행 */
export async function analyzeProject(
  projectId: string,
): Promise<AnalyzeResponse> {
  return request<AnalyzeResponse>(
    `/api/projects/${projectId}/analyze`,
    { method: "POST" },
    15000,
  );
}

export interface PackageResponse {
  fileName: string;
  entries: PackageEntry[];
  downloadUrl?: string;
}

/** POST /api/projects/:projectId/package — 최종 패키지 생성 */
export async function generatePackage(
  projectId: string,
): Promise<PackageResponse> {
  return request<PackageResponse>(
    `/api/projects/${projectId}/package`,
    { method: "POST" },
    15000,
  );
}

/** 백엔드 헬스 체크 (선택) */
export async function pingBackend(): Promise<boolean> {
  try {
    await request("/api/health", { method: "GET" }, 2000);
    return true;
  } catch {
    return false;
  }
}
