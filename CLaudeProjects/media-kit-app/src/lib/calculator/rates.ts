import type { CalculatorInput, CalculatorResult } from "@/types";

const PLATFORM_CPM: Record<string, number> = {
  instagram: 10,
  tiktok: 8,
  youtube: 25,
  twitter: 4,
  linkedin: 15,
  twitch: 12,
};

const CONTENT_MULTIPLIER: Record<string, number> = {
  post: 1,
  reel: 1.4,
  story: 0.5,
  video_short: 1.2,
  video_long: 2.5,
  ugc: 0.8,
  bundle: 2.2,
};

const USAGE_MULTIPLIER: Record<string, number> = {
  organic: 1,
  paid_3mo: 1.3,
  paid_6mo: 1.6,
  paid_12mo: 2,
};

export function calculateRate(input: CalculatorInput): CalculatorResult {
  const cpm = PLATFORM_CPM[input.platform] ?? 8;
  const contentMult = CONTENT_MULTIPLIER[input.contentType] ?? 1;
  const usageMult = USAGE_MULTIPLIER[input.usageRights ?? "organic"];
  const engagementMult = Math.max(0.5, input.engagementRate / 3);
  const exclusivityMult = input.exclusivity ? 1.25 : 1;

  const base = (input.followers / 1000) * cpm;
  const recommended = base * contentMult * usageMult * engagementMult * exclusivityMult;

  return {
    low: Math.round(recommended * 0.75),
    recommended: Math.round(recommended),
    high: Math.round(recommended * 1.35),
    currency: "USD",
    breakdown: [
      { factor: `${input.platform} CPM`, multiplier: cpm },
      { factor: `${input.contentType} content`, multiplier: contentMult },
      { factor: `usage: ${input.usageRights ?? "organic"}`, multiplier: usageMult },
      { factor: "engagement rate", multiplier: Number(engagementMult.toFixed(2)) },
      { factor: "exclusivity", multiplier: exclusivityMult },
    ],
  };
}
