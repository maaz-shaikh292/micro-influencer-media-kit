export type Platform =
  | "instagram"
  | "tiktok"
  | "youtube"
  | "twitter"
  | "linkedin"
  | "twitch";

export type ContentType =
  | "post"
  | "reel"
  | "story"
  | "video_short"
  | "video_long"
  | "ugc"
  | "bundle";

export interface PlatformStats {
  platform: Platform;
  handle: string;
  followers: number;
  avgViews?: number;
  engagementRate?: number;
}

export interface RateCardItem {
  contentType: ContentType;
  platform: Platform;
  price: number;
  currency: string;
  notes?: string;
}

export interface InfluencerProfile {
  id: string;
  userId: string;
  displayName: string;
  niche: string;
  bio: string;
  avatarUrl?: string;
  location?: string;
  email?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MediaKit {
  id: string;
  profileId: string;
  slug: string;
  headline: string;
  stats: PlatformStats[];
  rates: RateCardItem[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CalculatorInput {
  platform: Platform;
  contentType: ContentType;
  followers: number;
  engagementRate: number;
  niche: string;
  usageRights?: "organic" | "paid_3mo" | "paid_6mo" | "paid_12mo";
  exclusivity?: boolean;
}

export interface ExtractedMetrics {
  /** Best-guess platform shown in the screenshot (e.g. "instagram"). */
  platform: string;
  /** Whether the image actually looks like a social-media analytics screenshot. */
  detected: boolean;
  followers: number | null;
  following: number | null;
  posts: number | null;
  reach: number | null;
  impressions: number | null;
  /** Engagement rate as a percentage, e.g. 4.2 means 4.2%. */
  engagementRate: number | null;
  avgLikes: number | null;
  avgComments: number | null;
  profileVisits: number | null;
  /** Time range the stats cover, e.g. "Last 30 days". */
  periodLabel: string | null;
  /** Anything notable or uncertain the model wants to flag. */
  notes: string | null;
}

export interface CalculatorResult {
  low: number;
  recommended: number;
  high: number;
  currency: string;
  breakdown: Array<{ factor: string; multiplier: number }>;
}
