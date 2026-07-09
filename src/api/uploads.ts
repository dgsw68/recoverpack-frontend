import { apiRequest } from "./client";
import type { FileCategory } from "@/lib/types";

export interface UploadFilesResponse {
  projectId: string;
  files: { id: string; name: string }[];
}

/** 같은 fileType(카테고리)의 파일들을 한 번에 업로드합니다. */
export function uploadFiles(
  projectId: string,
  files: File[],
  fileType: FileCategory,
): Promise<UploadFilesResponse> {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));
  formData.append("fileType", fileType);

  return apiRequest<UploadFilesResponse>(`/api/projects/${projectId}/uploads`, {
    method: "POST",
    body: formData,
    timeout: 30000,
  });
}
