import { NextResponse } from "next/server";

import { generateSchema } from "@/lib/validations";

interface OpenRouterSuggestion {
  front?: string;
  back?: string;
}

interface OpenRouterChoice {
  message?: {
    content?: string | null;
  };
}

interface ParsedSuggestion {
  front: string;
  back: string;
}

function buildPrompt(sourceText: string, count: number) {
  return [
    "Generate high-quality flashcards from the source text.",
    `Create exactly ${count} flashcards.`,
    "Return only valid JSON as an array of objects with front and back string fields.",
    "Keep the cards concise, clear, and directly grounded in the source.",
    "Source text:",
    sourceText,
  ].join("\n\n");
}

function extractJson(content: string) {
  const trimmed = content.trim();
  const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  return fencedMatch ? fencedMatch[1].trim() : trimmed;
}

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = generateSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid generation request" }, { status: 400 });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  const baseUrl = process.env.OPENROUTER_BASE_URL ?? "https://openrouter.ai/api/v1";
  const model = process.env.OPENROUTER_MODEL ?? "openai/gpt-4o-mini";

  if (!apiKey) {
    return NextResponse.json({ suggestions: [] });
  }

  let response: Response;

  try {
    response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content: "You write precise flashcards as strict JSON arrays only.",
          },
          {
            role: "user",
            content: buildPrompt(parsed.data.sourceText, parsed.data.count),
          },
        ],
        temperature: 0.3,
      }),
    });
  } catch {
    return NextResponse.json({ error: "AI generation failed" }, { status: 502 });
  }

  if (response.status === 429) {
    const retryAfter = response.headers.get("retry-after");
    return NextResponse.json(
      { error: "Rate limited" },
      retryAfter ? { status: 429, headers: { "Retry-After": retryAfter } } : { status: 429 },
    );
  }

  if (!response.ok) {
    return NextResponse.json({ error: "AI generation failed" }, { status: 502 });
  }

  let body: unknown;

  try {
    body = await response.json();
  } catch {
    return NextResponse.json({ suggestions: [] });
  }

  const choices = (body as { choices?: OpenRouterChoice[] }).choices ?? [];
  const content = choices[0]?.message?.content;

  if (!content) {
    return NextResponse.json({ suggestions: [] });
  }

  try {
    const suggestions = JSON.parse(extractJson(content)) as OpenRouterSuggestion[];
    const cleanSuggestions = suggestions
      .filter((suggestion): suggestion is ParsedSuggestion => typeof suggestion.front === "string" && typeof suggestion.back === "string")
      .map((suggestion) => ({ front: suggestion.front.trim(), back: suggestion.back.trim() }))
      .filter((suggestion) => suggestion.front.length > 0 && suggestion.back.length > 0);

    return NextResponse.json({ suggestions: cleanSuggestions });
  } catch {
    return NextResponse.json({ suggestions: [] });
  }
}
