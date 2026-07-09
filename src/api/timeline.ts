import { apiRequest } from "./client";

export interface RemoteTimelineEvent {
  id?: string;
  title: string;
  description: string;
  /** "YYYY-MM-DD HH:mm" */
  eventDate: string;
}

export function generateTimeline(
  projectId: string,
): Promise<RemoteTimelineEvent[]> {
  return apiRequest<RemoteTimelineEvent[]>(`/api/projects/${projectId}/timeline`, {
    method: "POST",
    body: JSON.stringify({ autoGenerate: true }),
    timeout: 30000,
  });
}

export function saveTimeline(
  projectId: string,
  events: RemoteTimelineEvent[],
): Promise<RemoteTimelineEvent[]> {
  return apiRequest<RemoteTimelineEvent[]>(`/api/projects/${projectId}/timeline`, {
    method: "POST",
    body: JSON.stringify({ autoGenerate: false, events }),
  });
}

export function getTimeline(projectId: string): Promise<RemoteTimelineEvent[]> {
  return apiRequest<RemoteTimelineEvent[]>(`/api/projects/${projectId}/timeline`, {
    method: "GET",
  });
}
