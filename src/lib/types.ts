// RecoverPack 공통 타입 정의

/** 재난 피해 유형 */
export type DamageType = "침수" | "화재" | "폭설" | "태풍";

/** 업로드 시 사용자가 지정하는 파일 분류 */
export type FileCategory = "피해 사진" | "영수증" | "수리 견적서" | "재난문자 캡처";

export const FILE_CATEGORIES: FileCategory[] = [
  "피해 사진",
  "영수증",
  "수리 견적서",
  "재난문자 캡처",
];

/** AI가 분류하는 증거 카테고리 */
export type EvidenceCategory =
  | "바닥 침수"
  | "벽면 오염"
  | "가전 피해"
  | "가구 손상"
  | "영수증"
  | "재난문자"
  | "견적서"
  | "기타";

export const EVIDENCE_CATEGORIES: EvidenceCategory[] = [
  "바닥 침수",
  "벽면 오염",
  "가전 피해",
  "가구 손상",
  "영수증",
  "재난문자",
  "견적서",
  "기타",
];

/** 업로드된 파일 (localStorage 저장용 메타데이터) */
export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  fileType: FileCategory;
  /** 이미지 미리보기용 data URL (이미지가 아니면 비어있음) */
  previewUrl?: string;
  isImage: boolean;
  createdAt: string;
}

/** AI 분류 결과 카드 */
export interface EvidenceItem {
  id: string;
  fileId: string;
  fileName: string;
  previewUrl?: string;
  isImage: boolean;
  category: EvidenceCategory;
  caption: string;
  /** 0 ~ 1 사이 신뢰도 */
  confidence: number;
  /** 사용자가 직접 수정했는지 여부 */
  edited: boolean;
}

/** 타임라인 이벤트 */
export interface TimelineEvent {
  id: string;
  datetime: string; // datetime-local input 값
  title: string;
  description: string;
  source: string;
}

/** 전체 프로젝트 상태 */
export interface ProjectState {
  projectId: string;
  /** 백엔드 연동 성공 여부 (false면 목업으로 진행 중) */
  backendConnected: boolean;
  damageType: DamageType | null;
  files: UploadedFile[];
  evidence: EvidenceItem[];
  timeline: TimelineEvent[];
  createdAt: string;
  updatedAt: string;
}

/** 최종 패키지 구성 항목 */
export interface PackageEntry {
  name: string;
  description: string;
  kind: "pdf" | "xlsx" | "csv" | "txt" | "folder";
}
