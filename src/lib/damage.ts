import type { DamageTypeMeta } from "@/lib/types";

export const DAMAGE_TYPES: DamageTypeMeta[] = [
  { type: "flood", label: "침수", description: "폭우·하천 범람·역류로 인한 실내 침수 피해" },
  { type: "fire", label: "화재", description: "화재·그을음·소방 활동으로 인한 피해" },
  { type: "heavy_snow", label: "폭설", description: "폭설·붕괴·동파로 인한 시설 피해" },
  { type: "typhoon", label: "태풍", description: "강풍·비산물·시설물 파손 피해" },
];
