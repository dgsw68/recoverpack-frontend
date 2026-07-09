import type { DamageType, PackageEntry } from "./types";
import { DAMAGE_TYPES } from "./damage";

/** 최종 패키지 구성 미리보기 (실제 ZIP 내용과 동일한 고정 목록) */
export function buildPackageEntries(): PackageEntry[] {
  return [
    {
      name: "01_접수용_1페이지_요약표.pdf",
      description: "핵심 피해 내용을 한 장으로 요약한 접수용 문서",
      kind: "pdf",
    },
    {
      name: "01_자연재난_피해신고서_작성보조본.pdf",
      description: "신고인 정보와 피해 내용을 바탕으로 작성한 피해신고서 보조본",
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
  const label = DAMAGE_TYPES.find((d) => d.type === damageType)?.label ?? "침수";
  return `${label}피해_증빙패키지.zip`;
}
