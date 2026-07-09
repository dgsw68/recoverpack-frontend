import { apiRequest } from "./client";
import type { EvidenceCategory } from "@/lib/types";

export interface RemoteEvidenceItem {
  id: string;
  fileId: string;
  fileUrl: string;
  category: EvidenceCategory;
  caption: string;
}

export function analyzeProject(projectId: string): Promise<RemoteEvidenceItem[]> {
  return apiRequest<RemoteEvidenceItem[]>(`/api/projects/${projectId}/analyze`, {
    method: "POST",
    timeout: 60000,
  });
}

export function updateEvidence(
  projectId: string,
  evidenceId: string,
  patch: { category?: EvidenceCategory; caption?: string },
): Promise<RemoteEvidenceItem> {
  return apiRequest<RemoteEvidenceItem>(
    `/api/projects/${projectId}/evidence/${evidenceId}`,
    {
      method: "PATCH",
      body: JSON.stringify(patch),
    },
  );
}
