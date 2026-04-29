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
          "max-w-[1600px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between",
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
            GPT-4o
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
        </div>
      </div>
    </header>
  );
}
