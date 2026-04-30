"use client";

import { useState } from "react";
import { ReviewMode, SupportedLanguage } from "@/types/reviews";
import {
  exportAsMarkdown,
  copyToClipboard,
  downloadMarkdown,
} from "@/lib/exportMarkdown";

interface ReviewPanelProps {
  result: string;
  isStreaming: boolean;
  error: string | null;
  language: SupportedLanguage;
  mode: ReviewMode;
}

export default function ReviewPanel({
  result,
  isStreaming,
  error,
  language,
  mode,
}: ReviewPanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const md = exportAsMarkdown(result, language, mode);
    await copyToClipboard(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const md = exportAsMarkdown(result, language, mode);
    downloadMarkdown(md, `code-review-${Date.now()}.md`);
  };

  // empty state
  if (!result && !isStreaming && !error) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="text-center max-w-xs">
          <div className="w-16 h-16 rounded-2xl bg-zinc-800/50 border border-zinc-700/50 flex items-center justify-center mx-auto mb-4">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-zinc-600"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>
          <p className="text-sm text-zinc-400 mb-1">No review yet</p>
          <p className="text-xs text-zinc-600">
            Paste your code, select a review mode, and click{" "}
            <span className="text-cyan-500">Review</span> to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* toolbar */}
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-zinc-800 bg-zinc-900/50">
        <div className="flex items-center gap-2 flex-1">
          {isStreaming && (
            <div className="flex items-center gap-2 text-cyan-400">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
              <span className="text-xs">Analyzing...</span>
            </div>
          )}
          {!isStreaming && result && (
            <span className="text-xs text-zinc-500">Review complete</span>
          )}
        </div>

        {result && !isStreaming && (
          <div className="flex items-center gap-1">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-200 px-2.5 py-1.5 hover:bg-zinc-800 rounded-lg transition-colors"
            >
              {copied ? (
                <>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    className="text-emerald-400"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  Copy
                </>
              )}
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-200 px-2.5 py-1.5 hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Export .md
            </button>
          </div>
        )}
      </div>

      {/* content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5">
        {error && (
          <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-red-400 mt-0.5 shrink-0"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
            <div>
              <p className="text-sm font-medium text-red-300">Review failed</p>
              <p className="text-xs text-red-400/70 mt-1">{error}</p>
            </div>
          </div>
        )}

        {result && (
          <div className="review-content prose prose-invert prose-sm max-w-none">
            <MarkdownRenderer content={result} />
            {isStreaming && (
              <span className="inline-block w-2 h-4 bg-cyan-400 ml-0.5 animate-pulse rounded-sm" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/*simple markdown renderer — no external dependency needed*/
function MarkdownRenderer({ content }: { content: string }) {
  const lines = content.split("\n");

  const rendered = lines.map((line, i) => {
    // h2
    if (line.startsWith("## ")) {
      const text = line.slice(3);
      // score line gets special treatment
      if (text.toLowerCase().startsWith("score")) {
        const scoreMatch = text.match(/(\d+)\/100/);
        const score = scoreMatch ? parseInt(scoreMatch[1]) : null;
        return (
          <div
            key={i}
            className="flex items-center gap-3 mt-6 mb-3 pb-2 border-b border-zinc-800"
          >
            <h2 className="text-base font-semibold text-zinc-100 m-0">Score</h2>
            {score !== null && (
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      score >= 80
                        ? "bg-emerald-500"
                        : score >= 60
                          ? "bg-amber-500"
                          : "bg-red-500"
                    }`}
                    style={{ width: `${score}%` }}
                  />
                </div>
                <span
                  className={`text-sm font-bold ${
                    score >= 80
                      ? "text-emerald-400"
                      : score >= 60
                        ? "text-amber-400"
                        : "text-red-400"
                  }`}
                >
                  {score}/100
                </span>
              </div>
            )}
          </div>
        );
      }
      return (
        <h2
          key={i}
          className="text-base font-semibold text-zinc-100 mt-6 mb-3 pb-2 border-b border-zinc-800"
        >
          {text}
        </h2>
      );
    }

    //h3 — issue titles
    if (line.startsWith("### ")) {
      const text = line.slice(4);
      return (
        <h3 key={i} className="text-sm font-semibold text-zinc-200 mt-4 mb-1">
          {text}
        </h3>
      );
    }

    // bold lines (like **Line 15** | category)
    if (line.startsWith("**") && line.includes("|")) {
      return (
        <p key={i} className="text-xs text-zinc-500 mb-1 font-mono">
          {line.replace(/\*\*/g, "")}
        </p>
      );
    }

    // suggestion lines
    if (line.startsWith("**Suggestion:**")) {
      const text = line.replace("**Suggestion:**", "").trim();
      return (
        <div
          key={i}
          className="mt-1.5 mb-3 pl-3 border-l-2 border-cyan-500/30 text-xs text-cyan-300/80"
        >
          💡 {text}
        </div>
      );
    }

    // bullet points
    if (line.startsWith("- ")) {
      const text = line.slice(2);
      return (
        <div key={i} className="flex gap-2 text-sm text-zinc-300 ml-1 my-1">
          <span className="text-zinc-600 mt-1">•</span>
          <span>{text}</span>
        </div>
      );
    }

    // numbered list
    if (/^\d+\.\s/.test(line)) {
      const match = line.match(/^(\d+)\.\s(.*)$/);
      if (match) {
        return (
          <div key={i} className="flex gap-2.5 text-sm text-zinc-300 ml-1 my-1">
            <span className="text-zinc-600 text-xs mt-0.5 min-w-[16px]">
              {match[1]}.
            </span>
            <span>{match[2]}</span>
          </div>
        );
      }
    }

    // code blocks
    if (line.startsWith("```")) {
      return null; // skip code fences — simplified rendering
    }

    // empty lines
    if (line.trim() === "") {
      return <div key={i} className="h-2" />;
    }

    // default paragraph
    return (
      <p key={i} className="text-sm text-zinc-300 leading-relaxed my-1">
        {line}
      </p>
    );
  });

  return <>{rendered}</>;
}
