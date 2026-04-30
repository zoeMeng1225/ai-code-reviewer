import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { getSystemPrompt, buildUserPrompt } from "@/lib/prompts";
import { ReviewMode, SupportedLanguage } from "@/types/reviews";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

//simple in-memory rate limiting
const requestCounts = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10; //request pre window
const RATE_WINDOW = 60 * 60 * 1000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = requestCounts.get(ip);

  if (!record || now > record.resetAt) {
    requestCounts.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT) {
    return false;
  }
  record.count++;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    //rate limit
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded. Please try again later",
        },
        { status: 429 },
      );
    }

    const body = await req.json();
    const { code, language, mode } = body as {
      code: string;
      language: SupportedLanguage;
      mode: ReviewMode;
    };

    //validation
    if (!code || !code.trim()) {
      return NextRequest.json(
        {
          error: "Code is required",
        },
        { status: 400 },
      );
    }
    if (code.length > 15000) {
      return NextResponse.json(
        {
          error: "Code exceeds maximum length of 15,000 characters.",
        },
        { status: 400 },
      );
    }

    const stream = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: getSystemPrompt(mode) },
        { role: "user", content: buildUserPrompt(code, language) },
      ],
      stream: true,
      temperature: 0.3,
      max_tokens: 2000,
    });

    //convert openai stream to readableStream
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content || "";
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("Review API error:", error);
    if (error instanceof OpenAI.APIError) {
      if (error.status === 429) {
        return NextResponse.json(
          { error: "API rate limit reached. Please wait a moment." },
          { status: 429 },
        );
      }
      return NextResponse.json(
        { error: "AI service error. Please try again." },
        { status: 502 },
      );
    }

    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 },
    );
  }
}
