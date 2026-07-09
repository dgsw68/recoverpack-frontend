import type { DamageType } from "@/lib/types";

export interface DamageTypeMeta {
  type: DamageType;
  emoji: string;
  description: string;
}

export const DAMAGE_TYPES: DamageTypeMeta[] = [
  { type: "침수", emoji: "🌊", description: "폭우·하천 범람·역류로 인한 실내 침수 피해" },
  { type: "화재", emoji: "🔥", description: "화재·그을음·소방 활동으로 인한 피해" },
  { type: "폭설", emoji: "❄️", description: "폭설·붕괴·동파로 인한 시설 피해" },
  { type: "태풍", emoji: "🌀", description: "강풍·비산물·시설물 파손 피해" },
];
