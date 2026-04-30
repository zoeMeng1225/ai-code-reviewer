"use client";

import { useState } from "react";
import Header from "@/components/Header";
import { cn } from "@/lib/utils";
import { SupportedLanguage } from "@/types/reviews";
import { ReviewMode } from "@/types/reviews";
import { useReview } from "@/hooks/useReview";
import { ReviewHistoryItem } from "@/types/reviews";
import CodeEditor from "@/components/CodeEditor";

export default function Home() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState<SupportedLanguage>("typescript");
  const [mode, setMode] = useState<ReviewMode>("quick");

  const { result, isStreaming, error, submitReview, clearResult } = useReview();

  const handleSubmit = () => {
    if (!code.trim() || isStreaming) return;
    submitReview(code, language, mode);
  };

  const handleLoadHistory = (item: ReviewHistoryItem) => {
    setCode(item.code);
    setLanguage(item.language);
    setMode(item.mode);
    clearResult();
  };

  return (
    <div className={cn("flex flex-col h-screen bg-zinc-950 text-zinc-100")}>
      <Header onLoadHistory={handleLoadHistory} />
      <main className={cn("flex-1 min-h-0 flex flex-col lg:flex-row")}>
        {/*editor panel*/}
        <div
          className={cn(
            "flex-1 min-h-0 lg:min-w-0 border-b lg:border-b-0 lg:border-r border-zinc-800 flex flex-col",
          )}
        >
          <CodeEditor
            code={code}
            language={language}
            mode={mode}
            isStreaming={isStreaming}
            onCodeChange={setCode}
            onLanguageChange={setLanguage}
            onModeChange={setMode}
            onSubmit={handleSubmit}
          />
        </div>
      </main>
      <footer
        className={cn(
          "border-t border-zinc-800 px-4 py-2 flex items-center justify-between text-[11px] text-zinc-600",
        )}
      >
        <span>Built with Next.js, TypeScript & GPT-4o</span>
        <div className={cn("flex items-center gap-3")}>
          <span>{code.length > 0 && `${code.length} chars`}</span>
          <span className="flex items-center gap-1">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isStreaming ? "bg-cyan-400 animate-pulse" : "bg-emerald-500"
              }`}
            />
            {isStreaming ? "Streaming" : "Ready"}
          </span>
        </div>
      </footer>
    </div>
  );
}
