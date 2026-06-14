import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

// The Anthropic SDK needs the Node.js runtime (not Edge).
export const runtime = "nodejs";
export const maxDuration = 60;

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"] as const;
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

const MetricsSchema = z.object({
  platform: z
    .string()
    .describe('Platform shown, lowercase, e.g. "instagram", "tiktok", "youtube". Use "unknown" if unclear.'),
  detected: z
    .boolean()
    .describe("True only if this image is actually a social-media analytics/insights screenshot."),
  followers: z.number().nullable().describe("Follower/subscriber count, or null if absent."),
  following: z.number().nullable(),
  posts: z.number().nullable(),
  reach: z.number().nullable(),
  impressions: z.number().nullable(),
  engagementRate: z
    .number()
    .nullable()
    .describe("Engagement rate as a percentage number, e.g. 4.2 for 4.2%. Null if not shown."),
  avgLikes: z.number().nullable(),
  avgComments: z.number().nullable(),
  profileVisits: z.number().nullable(),
  periodLabel: z.string().nullable().describe('Time range the stats cover, e.g. "Last 30 days".'),
  notes: z
    .string()
    .nullable()
    .describe("Brief note on anything uncertain or worth flagging. Null if nothing notable."),
});

const SYSTEM_PROMPT = `You read screenshots of social-media analytics/insights dashboards \
(Instagram, TikTok, YouTube, X, etc.) and extract the creator's metrics into structured data.

Rules:
- Only set "detected" true if the image is genuinely an analytics/insights screenshot. \
For unrelated images, set detected=false and leave all metrics null.
- Convert abbreviated numbers to integers: "12.5K" -> 12500, "1.2M" -> 1200000.
- For counts, return whole numbers. For engagementRate, return a percentage number.
- If a metric is not visible, return null for it. Never guess a value that isn't shown.`;

export async function POST(request: NextRequest) {
  // Require an authenticated user — this endpoint calls a paid API, so leaving
  // it open would let anyone run up the bill.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "Server is missing ANTHROPIC_API_KEY. Add it to .env.local." },
      { status: 500 },
    );
  }

  let file: File | null = null;
  try {
    const formData = await request.formData();
    const value = formData.get("image");
    if (value instanceof File) file = value;
  } catch {
    return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
  }

  if (!file) {
    return NextResponse.json({ error: "No image provided." }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type as (typeof ALLOWED_TYPES)[number])) {
    return NextResponse.json(
      { error: "Unsupported file type. Upload a PNG, JPEG, WebP, or GIF image." },
      { status: 415 },
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Image is too large (max 10 MB)." }, { status: 413 });
  }

  const base64 = Buffer.from(await file.arrayBuffer()).toString("base64");
  const client = new Anthropic();

  try {
    const response = await client.messages.parse({
      model: "claude-opus-4-8",
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: file.type as (typeof ALLOWED_TYPES)[number],
                data: base64,
              },
            },
            {
              type: "text",
              text: "Extract this creator's metrics from the screenshot.",
            },
          ],
        },
      ],
      output_config: { format: zodOutputFormat(MetricsSchema) },
    });

    const metrics = response.parsed_output;
    if (!metrics) {
      return NextResponse.json(
        { error: "Could not read metrics from that image. Try a clearer screenshot." },
        { status: 422 },
      );
    }

    return NextResponse.json({ metrics });
  } catch (error) {
    if (error instanceof Anthropic.APIError) {
      return NextResponse.json(
        { error: `Analysis failed (${error.status}). Please try again.` },
        { status: 502 },
      );
    }
    return NextResponse.json({ error: "Unexpected error during analysis." }, { status: 500 });
  }
}
