import { apiRequest, apiRequestBlob } from "./client";

export function generatePackage(projectId: string): Promise<void> {
  return apiRequest<void>(`/api/projects/${projectId}/package`, {
    method: "POST",
    timeout: 30000,
  });
}

export function downloadPackage(projectId: string): Promise<Blob> {
  return apiRequestBlob(`/api/projects/${projectId}/download`, {
    method: "GET",
    timeout: 30000,
  });
}
