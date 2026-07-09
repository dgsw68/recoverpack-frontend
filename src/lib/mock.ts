import { uid } from "./storage";
import type {
  DamageType,
  EvidenceCategory,
  EvidenceItem,
  PackageEntry,
  TimelineEvent,
  UploadedFile,
} from "./types";

/**
 * 백엔드가 없을 때 사용하는 현실적인 목업 데이터.
 * AI는 보상 가능 여부를 판단하지 않고 분류/설명/정리만 수행합니다.
 */

const CAPTIONS: Record<EvidenceCategory, string[]> = {
  "바닥 침수": ["거실 바닥 전체에 물 고임 및 침수 흔적이 확인됩니다."],
  "벽면 오염": ["벽면 하단부에 수분 노출로 인한 오염 흔적이 확인됩니다."],
  "가전 피해": ["가전제품 주변으로 물 유입 정황이 확인됩니다."],
  "가구 손상": ["가구 하단부에 수분 흡수 및 변형 흔적이 확인됩니다."],
  영수증: ["수리비 또는 청소비로 보이는 영수증 자료입니다."],
  재난문자: ["행정안전부/지자체 재난문자 캡처 자료로 확인됩니다."],
  견적서: ["복구 공사 수리 견적서로 확인됩니다."],
  기타: ["피해 상황과 관련된 참고 자료로 확인됩니다."],
};

/** 파일 분류에 따라 AI 카테고리 후보를 매핑 */
function categoriesForFile(file: UploadedFile, index: number): EvidenceCategory {
  switch (file.fileType) {
    case "영수증":
      return "영수증";
    case "수리 견적서":
      return "견적서";
    case "재난문자 캡처":
      return "재난문자";
    case "피해 사진":
    default: {
      const rotation: EvidenceCategory[] = [
        "바닥 침수",
        "벽면 오염",
        "가전 피해",
        "가구 손상",
      ];
      return rotation[index % rotation.length];
    }
  }
}

function confidenceFor(category: EvidenceCategory): number {
  // 카테고리별로 그럴듯한 신뢰도 범위 (0.72 ~ 0.97)
  const base: Record<EvidenceCategory, number> = {
    "바닥 침수": 0.94,
    "벽면 오염": 0.88,
    "가전 피해": 0.83,
    "가구 손상": 0.79,
    영수증: 0.96,
    재난문자: 0.97,
    견적서: 0.92,
    기타: 0.72,
  };
  const jitter = Math.round((Math.random() * 0.04 - 0.02) * 100) / 100;
  return Math.min(0.98, Math.max(0.7, base[category] + jitter));
}

/** 업로드된 파일들로부터 목업 AI 분석 결과 생성 */
export function buildMockEvidence(files: UploadedFile[]): EvidenceItem[] {
  if (files.length === 0) {
    return buildSampleEvidence();
  }
  return files.map((file, index) => {
    const category = categoriesForFile(file, index);
    const captions = CAPTIONS[category];
    return {
      id: uid("ev"),
      fileId: file.id,
      fileName: file.name,
      previewUrl: file.previewUrl,
      isImage: file.isImage,
      category,
      caption: captions[0],
      confidence: confidenceFor(category),
      edited: false,
    };
  });
}

/** 업로드 파일이 하나도 없을 때 데모용 샘플 증거 */
function buildSampleEvidence(): EvidenceItem[] {
  const samples: { category: EvidenceCategory; name: string }[] = [
    { category: "바닥 침수", name: "거실_바닥_침수.jpg" },
    { category: "벽면 오염", name: "벽면_오염.jpg" },
    { category: "가전 피해", name: "세탁기_침수.jpg" },
    { category: "영수증", name: "청소비_영수증.jpg" },
  ];
  return samples.map((s) => ({
    id: uid("ev"),
    fileId: uid("file"),
    fileName: s.name,
    previewUrl: undefined,
    isImage: true,
    category: s.category,
    caption: CAPTIONS[s.category][0],
    confidence: confidenceFor(s.category),
    edited: false,
  }));
}

/** 피해 유형에 맞춘 기본 타임라인 이벤트 */
export function buildDefaultTimeline(damageType: DamageType | null): TimelineEvent[] {
  const today = new Date();
  const iso = (offsetHours: number) => {
    const d = new Date(today.getTime() - offsetHours * 60 * 60 * 1000);
    // datetime-local 형식: YYYY-MM-DDTHH:mm
    return d.toISOString().slice(0, 16);
  };

  const label = damageType ?? "침수";

  return [
    {
      id: uid("tl"),
      datetime: iso(30),
      title: "재난문자 수신",
      description: `${label} 관련 재난문자를 수신했습니다.`,
      source: "행정안전부 재난문자",
    },
    {
      id: uid("tl"),
      datetime: iso(26),
      title: "피해 발견",
      description: "귀가 후 실내 피해 상황을 최초로 확인했습니다.",
      source: "본인 확인",
    },
    {
      id: uid("tl"),
      datetime: iso(25),
      title: "피해 사진 촬영",
      description: "피해 현황을 사진으로 기록했습니다.",
      source: "휴대폰 사진",
    },
    {
      id: uid("tl"),
      datetime: iso(24),
      title: "집주인/관리사무소 연락",
      description: "피해 사실을 집주인 및 관리사무소에 통보했습니다.",
      source: "통화 기록",
    },
    {
      id: uid("tl"),
      datetime: iso(2),
      title: "수리비/청소비 발생",
      description: "복구를 위한 청소·수리 비용이 발생했습니다.",
      source: "영수증",
    },
  ];
}

/** 최종 패키지 구성 (요구된 고정 목록) */
export function buildPackageEntries(): PackageEntry[] {
  return [
    {
      name: "01_접수용_1페이지_요약표.pdf",
      description: "핵심 피해 내용을 한 장으로 요약한 접수용 문서",
      kind: "pdf",
    },
    {
      name: "02_첨부자료_색인표.xlsx",
      description: "모든 첨부 자료의 목록과 분류 색인",
      kind: "xlsx",
    },
    {
      name: "03_피해사진_원본/",
      description: "촬영한 원본 피해 사진 모음",
      kind: "folder",
    },
    {
      name: "04_피해사진_AI분류본/",
      description: "AI가 카테고리별로 정리한 사진 모음",
      kind: "folder",
    },
    {
      name: "05_재난문자_피해타임라인.pdf",
      description: "재난문자 수신부터 피해까지의 시간 순 정리",
      kind: "pdf",
    },
    {
      name: "06_복붙용_피해설명문.txt",
      description: "보험사·주민센터 제출용 복사/붙여넣기 설명문",
      kind: "txt",
    },
    {
      name: "07_영수증_견적서/",
      description: "수리비·청소비 영수증 및 견적서 모음",
      kind: "folder",
    },
    {
      name: "08_원본파일_검증목록.csv",
      description: "원본 파일 무결성 확인용 목록",
      kind: "csv",
    },
  ];
}

/** 피해 유형별 zip 파일명 */
export function packageFileName(damageType: DamageType | null): string {
  const label = damageType ?? "침수";
  return `${label}피해_증빙패키지.zip`;
}
