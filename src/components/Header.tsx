"use client";

import { useState } from "react";
import { ReviewHistoryItem } from "@/types/reviews";
import { useHistoryStore } from "@/stores/reviewStore";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onLoadHistory: (item: ReviewHistoryItem) => void;
}

export default function Header({ onLoadHistory }: HeaderProps) {
  const [showHistory, setShowHistory] = useState(false);
  const { items, removeItem, clearAll } = useHistoryStore();

  return (
    <header
      className={cn(
        "border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-50",
      )}
    >
      <div
        className={cn(
          "mx-auto px-4 sm:px-6 h-14 flex items-center justify-between",
        )}
      >
        <div className={cn("flex items-center gap-2.5")}>
          <div
            className={cn(
              "w-7 h-7 rounded-lg bg-cyan-500/20 flex items-center justify-center",
            )}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-cyan-400"
            >
              {" "}
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </svg>
          </div>
          <h1
            className={cn(
              "text-base font-semibold text-zinc-100 tracking-tight",
            )}
          >
            {" "}
            AI Code Reviewer
          </h1>
          <span
            className={cn(
              "hidden sm:inline text-[10px] font-medium px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20",
            )}
          >
            GPT-4o-mini
          </span>
        </div>
        {/*action*/}
        <div className={cn("flex items-center gap-2")}>
          {/*history button*/}
          <div className="relative">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 rounded-lg transition-colors"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span className="hidden sm:inline">History</span>
              {items.length > 0 && (
                <span
                  className={cn(
                    "text-[10px] bg-zinc-700 text-zinc-300 px-1.5 py-0.5 rounded-full min-w-[18px] text-center",
                  )}
                >
                  {items.length}
                </span>
              )}
            </button>
            {/*history Dropdown*/}
            {showHistory && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowHistory(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-80 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl z-50 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
                    <span className="text-sm font-medium text-zinc-200">
                      Review History
                    </span>
                    {items.length > 0 && (
                      <button
                        onClick={clearAll}
                        className="text-xs text-zinc-500 hover:text-red-400 transition-colors"
                      >
                        Clear all
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {items.length === 0 ? (
                      <div className="px-4 py-8 text-center text-sm text-zinc-500">
                        No reviews yet
                      </div>
                    ) : (
                      items.map((item) => (
                        <div
                          key={item.id}
                          className="group flex items-start gap-3 px-4 py-3 hover:bg-zinc-800/50 cursor-pointer border-b border-zinc-800/50 last:border-0"
                          onClick={() => {
                            onLoadHistory(item);
                            setShowHistory(false);
                          }}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">
                                {item.language}
                              </span>
                              <span className="text-xs text-zinc-500 capitalize">
                                {item.mode}
                              </span>
                            </div>
                            <p className="text-xs text-zinc-500 mt-1 truncate font-mono">
                              {item.code.slice(0, 60)}...
                            </p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeItem(item.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-red-400 transition-all p-1"
                          >
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <line x1="18" y1="6" x2="6" y2="18" />
                              <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
          {/*github link*/}
          <a
            href="https://github.com/zoeMeng1225/ai-code-reviewer"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 rounded-lg transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </div>
    </header>
  );
}
