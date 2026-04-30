"use client";
import dynamic from "next/dynamic";
import { SupportedLanguage, ReviewMode } from "@/types/review";
import { SAMPLE_CODES } from "@/lib/sampleCodes";
import { cn } from "@/lib/utils";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div
      className={cn(
        "h-full bg-zinc-900 rounded-lg flex items-center justify-center",
      )}
    >
      <div className={cn("flex items-center gap-2 text-zinc-500 text-sm")}>
        <div
          className={cn(
            "w-4 h-4 border-2 border-zinc-600 border-t-cyan-400 rounded-full animate-spin",
          )}
        >
          Loading editor...
        </div>
      </div>
    </div>
  ),
});

const LANGUAGES: { value: SupportedLanguage; label: string }[] = [
  { value: "typescript", label: "TypeScript" },
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
];

const MODES: { value: ReviewMode; label: string; icon: string }[] = [
  { value: "quick", label: "Quick", icon: "⚡" },
  { value: "deep", label: "Deep", icon: "🔍" },
  { value: "security", label: "Security", icon: "🛡️" },
];

interface CodeEditorProps {
  code: string;
  language: SupportedLanguage;
  mode: ReviewMode;
  isStreaming: boolean;
  onCodeChange: (value: string) => void;
  onLanguageChange: (lang: SupportedLanguage) => void;
  onModeChange: (mode: ReviewMode) => void;
  onSubmit: () => void;
}

export default function CodeEditor({
  code,
  language,
  mode,
  isStreaming,
  onCodeChange,
  onLanguageChange,
  onModeChange,
  onSubmit,
}: CodeEditorProps) {
  const handKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key == "Enter") {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className={cn("flex flex-col h-full")} onKeyDown={handKeyDown}>
      <div
        className={cn(
          "flex flex-wrap items-center gap-2 px-3 py-2.5 border-b border-zinc-800 bg-zinc-900/50",
        )}
      >
        {/*language select*/}
        <select
          value={language}
          onChange={(e) =>
            onLanguageChange(e.target.value as SupportedLanguage)
          }
          className={cn(
            "bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500/50 cursor-pointer",
          )}
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>

        {/*mode toggle*/}
        <div
          className={cn(
            "flex bg-zinc-800 border border-zinc-700 rounded-lg p-0.5",
          )}
        >
          {MODES.map((m) => (
            <button
              key={m.value}
              onClick={() => onModeChange(m.value)}
              className={cn(
                `flex items-center gap-1 text-xs px-2.5 py-1 rounded-md transition-all ${
                  mode === m.value
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                    : "text-zinc-400 hover:text-zinc-200 border border-transparent"
                }`,
              )}
            >
              <span>{m.icon}</span>
              <span className={cn("hidden sm:inline")}>{m.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
