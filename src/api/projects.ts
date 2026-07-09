import { apiRequest } from "./client";
import type { DamageType, IndirectSupport, Project } from "@/lib/types";

export interface CreateProjectPayload {
  damageType: DamageType;
  title: string;
  location: string;
  /** "YYYY-MM-DD HH:mm" */
  occurredAt: string;
}

export interface CreateProjectResponse {
  projectId: string;
}

export type CreateProjectResult = CreateProjectResponse | Project;

export type UpdateReporterPayload = Partial<{
  reporterName: string;
  reporterPhone: string;
  reporterAddress: string;
  residenceType: string;
  indirectSupport: IndirectSupport;
}>;

export function createProject(
  payload: CreateProjectPayload,
): Promise<CreateProjectResult> {
  return apiRequest<CreateProjectResult>("/api/projects", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateProjectReporter(
  projectId: string,
  payload: UpdateReporterPayload,
): Promise<Project> {
  return apiRequest<Project>(`/api/projects/${projectId}/reporter`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}
