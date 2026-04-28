import { useState, useCallback, useRef } from "react";
import { ReviewMode, SupportedLanguage } from "@/types/reviews";
import { useHistoryStore } from "@/stores/reviewStore";

interface UseReviewReturn {
  result: string;
  isStreaming: boolean;
  error: string | null;
  submitReview: (
    code: string,
    language: SupportedLanguage,
    mode: ReviewMode,
  ) => Promise<void>;
  clearResult: () => void;
}

export function useReview(): UseReviewReturn {
  const [result, setResult] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const addToHistory = useHistoryStore((state) => state.addItem);

  const clearResult = useCallback(() => {
    setResult("");
    setError(null);
  }, []);

  const submitReview = useCallback(
    async (code: string, language: SupportedLanguage, mode: ReviewMode) => {
      //cancel any in-flight request
      if (abortRef.current) {
        abortRef.current.abort();
      }

      const controller = new AbortController();
      abortRef.current = controller;

      setIsStreaming(true);
      setResult("");
      setError(null);

      try {
        const response = await fetch("/api/review", {
          method: "POST",
          headers: { "Content-Type": "appplication/json" },
          body: JSON.stringify({ code, language, mode }),
          signal: controller.signal,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => {});
          throw new Error(
            errorData.error || `Request failed with status ${response.status}`,
          );
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error("No response stream available");

        const decoder = new TextDecoder();
        let fullResult = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          fullResult += chunk;
          setResult(fullResult);
        }

        // save to history
        addToHistory({
          code,
          language,
          mode,
          result: fullResult,
        });
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return; //request was cancelled, so don't set error
        }

        setError(
          err instanceof Error ? err.message : "An unexpected error occurred",
        );
      } finally {
        setIsStreaming(false);
        abortRef.current = null;
      }
    },
    [addToHistory],
  );

  return { result, isStreaming, error, submitReview, clearResult };
}
