// RecoverPack 공통 타입 정의

/** 재난 피해 유형 (백엔드 enum) */
export type DamageType = "flood" | "fire" | "heavy_snow" | "typhoon";

export interface DamageTypeMeta {
  type: DamageType;
  label: string;
  description: string;
}

/** 업로드 시 사용자가 지정하는 파일 분류 (백엔드 fileType) */
export type FileCategory = "image" | "receipt" | "estimate" | "disaster_alert";

export const FILE_CATEGORIES: { value: FileCategory; label: string }[] = [
  { value: "image", label: "피해 사진" },
  { value: "receipt", label: "영수증" },
  { value: "estimate", label: "수리 견적서" },
  { value: "disaster_alert", label: "재난문자 캡처" },
];

/** AI가 분류하는 증거 카테고리 (백엔드 enum) */
export type EvidenceCategory =
  | "floor_flooding"
  | "wall_damage"
  | "appliance_damage"
  | "furniture_damage"
  | "receipt"
  | "disaster_alert"
  | "estimate"
  | "other";

export const EVIDENCE_CATEGORIES: { value: EvidenceCategory; label: string }[] = [
  { value: "floor_flooding", label: "바닥 침수" },
  { value: "wall_damage", label: "벽면 오염" },
  { value: "appliance_damage", label: "가전 피해" },
  { value: "furniture_damage", label: "가구 손상" },
  { value: "receipt", label: "영수증" },
  { value: "disaster_alert", label: "재난문자" },
  { value: "estimate", label: "견적서" },
  { value: "other", label: "기타" },
];

/** 로컬에 보관하는 업로드 파일 메타데이터 (썸네일 미리보기용) */
export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  fileType: FileCategory;
  /** 실제 File 객체 (업로드 전송용, 세션 내에서만 존재) */
  file?: File;
  /** 이미지 미리보기용 data URL (이미지가 아니면 비어있음) */
  previewUrl?: string;
  isImage: boolean;
  createdAt: string;
  /** 서버 업로드 완료 후 부여되는 원격 파일 ID */
  remoteId?: string;
}

/** AI 분류 결과 카드 */
export interface EvidenceItem {
  id: string;
  fileId: string;
  fileName: string;
  fileUrl?: string;
  previewUrl?: string;
  isImage: boolean;
  category: EvidenceCategory;
  caption: string;
  /** 사용자가 직접 수정했는지 여부 */
  edited: boolean;
}

/** 타임라인 이벤트 */
export interface TimelineEvent {
  id: string;
  /** datetime-local input 값 */
  eventDate: string;
  title: string;
  description: string;
}

export interface IndirectSupport {
  gasUser: boolean;
  vehicleOwner: boolean;
  publicHousingRequest: boolean;
  familyCrisisSupport: boolean;
  healthInsuranceArrears: boolean;
  fineDeferralRequest: boolean;
  disasterLossDeduction: boolean;
  windFloodInsuranceOptIn: boolean;
}

export const DEFAULT_INDIRECT_SUPPORT: IndirectSupport = {
  gasUser: false,
  vehicleOwner: false,
  publicHousingRequest: false,
  familyCrisisSupport: false,
  healthInsuranceArrears: false,
  fineDeferralRequest: false,
  disasterLossDeduction: false,
  windFloodInsuranceOptIn: false,
};

export interface Project {
  id: string;
  damageType: DamageType;
  title: string;
  location: string;
  occurredAt: string;
  description: string;
  reporterName: string;
  reporterPhone: string;
  reporterAddress: string;
  residenceType: string;
  indirectSupport: IndirectSupport;
}

/** 전체 프로젝트 상태 (로컬 캐시) */
export interface ProjectState {
  projectId: string | null;
  damageType: DamageType | null;
  title: string;
  location: string;
  occurredAt: string;
  description: string;
  reporterName: string;
  reporterPhone: string;
  reporterAddress: string;
  residenceType: string;
  indirectSupport: IndirectSupport;
  files: UploadedFile[];
  evidence: EvidenceItem[];
  timeline: TimelineEvent[];
  createdAt: string;
  updatedAt: string;
}

/** 최종 패키지 구성 항목 (다운로드 미리보기용) */
export interface PackageEntry {
  name: string;
  description: string;
  kind: "pdf" | "xlsx" | "csv" | "txt" | "folder";
}

/** 인증된 사용자 */
export interface AuthUser {
  id?: string;
  email: string;
  name: string;
  [key: string]: unknown;
}

export interface AuthSession {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  user: AuthUser;
}

export type PackageStatus = "draft" | "pending" | "processing" | "completed" | "failed";

/** 마이페이지에서 보여주는 패키지 생성 기록 */
export interface MyPackage {
  projectId: string;
  packageId: string;
  title: string;
  damageType: DamageType;
  location: string;
  occurredAt: string;
  createdAt: string;
  updatedAt: string;
  status: PackageStatus;
  fileCount: number;
  evidenceCount: number;
  timelineCount: number;
  downloadAvailable: boolean;
}
