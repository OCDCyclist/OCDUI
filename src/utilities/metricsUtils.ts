import { ReferenceLevel } from "../types/types";

export const wattsPerKilo = (watts: number | undefined, weightKg: number | undefined | null): number => {
    if (typeof watts === 'number' && typeof weightKg === 'number' && weightKg !== 0) {
        const result = watts / weightKg;
        return Math.round(result * 10) / 10; // rounding to 1 decimal place
    }
    return 0.0;
}

export const getLevelForPower = (
  referenceLevels: ReferenceLevel[],
  wattsPerKilo: number,
  period: number
): string | null => {
  if (!wattsPerKilo || ![60, 300, 1200].includes(period)) return null;

  type ReferenceKey = keyof ReferenceLevel;

  const periodKey = `sec${period.toString().padStart(4, "0")}` as ReferenceKey;

  // Find the highest matching level
  for (const ref of referenceLevels.slice().reverse()) {
    const refValue = ref[periodKey];
    if (typeof refValue === "number" && wattsPerKilo >= refValue) {
      return ref.level;
    }
  }

  return null;
};

