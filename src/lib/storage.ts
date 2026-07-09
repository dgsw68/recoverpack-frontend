import type {
  DamageType,
  IndirectSupport,
  EvidenceItem,
  ProjectState,
  TimelineEvent,
  UploadedFile,
} from "./types";
import { DEFAULT_INDIRECT_SUPPORT } from "./types";

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
    projectId: null,
    damageType: null,
    title: "",
    location: "",
    occurredAt: "",
    description: "",
    reporterName: "",
    reporterPhone: "",
    reporterAddress: "",
    residenceType: "",
    indirectSupport: { ...DEFAULT_INDIRECT_SUPPORT },
    files: [],
    evidence: [],
    timeline: [],
    createdAt: now,
    updatedAt: now,
  };
}

/** File 객체는 직렬화할 수 없으므로 저장 전에 제거합니다. */
function stripUnserializable(files: UploadedFile[]): UploadedFile[] {
  return files.map(({ file: _file, ...rest }) => rest);
}

/** localStorage에서 프로젝트 불러오기 (예전 스키마의 누락된 필드는 기본값으로 채움) */
export function loadProject(): ProjectState | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ProjectState>;
    return {
      ...createEmptyProject(),
      ...parsed,
      indirectSupport: {
        ...DEFAULT_INDIRECT_SUPPORT,
        ...(parsed.indirectSupport as Partial<IndirectSupport> | undefined),
      },
    };
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
  const next = { ...project, updatedAt: new Date().toISOString() };
  if (!isBrowser()) return next;
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...next, files: stripUnserializable(next.files) }),
    );
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

/** 프로젝트 초기화 */
export function resetProject(): ProjectState {
  const fresh = createEmptyProject();
  return saveProject(fresh);
}
