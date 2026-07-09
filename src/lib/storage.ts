import type {
  DamageType,
  EvidenceItem,
  ProjectState,
  TimelineEvent,
  UploadedFile,
} from "./types";

const STORAGE_KEY = "recoverpack:project";

/** 브라우저 환경인지 확인 (SSR 안전) */
function isBrowser(): boolean {
  return typeof window !== "undefined";
}

/** 간단한 고유 ID 생성 */
export function uid(prefix = "id"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now()
    .toString(36)
    .slice(-4)}`;
}

/** 빈 프로젝트 상태 생성 */
export function createEmptyProject(): ProjectState {
  const now = new Date().toISOString();
  return {
    projectId: uid("proj"),
    backendConnected: false,
    damageType: null,
    files: [],
    evidence: [],
    timeline: [],
    createdAt: now,
    updatedAt: now,
  };
}

/** localStorage에서 프로젝트 불러오기 */
export function loadProject(): ProjectState | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ProjectState;
  } catch {
    return null;
  }
}

/** 프로젝트가 없으면 새로 만들어 저장 후 반환 */
export function loadOrCreateProject(): ProjectState {
  const existing = loadProject();
  if (existing) return existing;
  const fresh = createEmptyProject();
  saveProject(fresh);
  return fresh;
}

/** 프로젝트 전체 저장 */
export function saveProject(project: ProjectState): ProjectState {
  if (!isBrowser()) return project;
  const next = { ...project, updatedAt: new Date().toISOString() };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // 용량 초과(이미지 data URL 다수) 등은 조용히 무시
  }
  return next;
}

/** 부분 업데이트 헬퍼 */
export function patchProject(patch: Partial<ProjectState>): ProjectState {
  const current = loadOrCreateProject();
  return saveProject({ ...current, ...patch });
}

export function setDamageType(damageType: DamageType): ProjectState {
  return patchProject({ damageType });
}

export function setFiles(files: UploadedFile[]): ProjectState {
  return patchProject({ files });
}

export function setEvidence(evidence: EvidenceItem[]): ProjectState {
  return patchProject({ evidence });
}

export function setTimeline(timeline: TimelineEvent[]): ProjectState {
  return patchProject({ timeline });
}

export function setBackendConnected(connected: boolean): ProjectState {
  return patchProject({ backendConnected: connected });
}

/** 프로젝트 초기화 */
export function resetProject(): ProjectState {
  const fresh = createEmptyProject();
  return saveProject(fresh);
}
