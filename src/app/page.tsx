"use client";

import { useState } from "react";
import Header from "@/components/Header";
import { cn } from "@/lib/utils";
import { SupportedLanguage } from "@/types/reviews";
import { ReviewMode } from "@/types/reviews";
import { useReview } from "@/hooks/useReview";
import { ReviewHistoryItem } from "@/types/reviews";

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
      <main className={cn("flex-1 min-h-0 flex flex-col lg:flex-row")}> </main>
    </div>
  );
}
