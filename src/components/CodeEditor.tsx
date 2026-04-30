"use client";
import { useState, useRef } from "react";
import dynamic from "next/dynamic";
import { SupportedLanguage, ReviewMode } from "@/types/reviews";
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
        />
        Loading editor...
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

  const [editorReady, setEditorReady] = useState(false);
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

        {/*spacer*/}
        <div className={cn("flex-1")} />

        {/*sample code dropdown*/}

        <SampleDropdown
          onSelect={(sample) => {
            onCodeChange(sample.code);
            onLanguageChange(sample.language);
          }}
        />

        {/*submit button*/}
        <button
          onClick={onSubmit}
          disabled={isStreaming || !code.trim()}
          className={cn(
            "flex items-center gap-1.5 bg-cyan-500 hover:bg-cyan-400 disabled:bg-zinc-700 disabled:text-zinc-500 text-zinc-950 font-medium text-xs px-4 py-1.5 rounded-lg transition-colors",
          )}
        >
          {isStreaming ? (
            <>
              <div
                className={cn(
                  "w-3 h-3 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin",
                )}
              />
              Reviewing...
            </>
          ) : (
            <>
              Review
              <kbd
                className={cn(
                  "hidden sm:inline text-[10px] bg-cyan-600/30 px-1 py-0.5 rounded",
                )}
              >
                ⌘↵
              </kbd>
            </>
          )}
        </button>
      </div>

      {/*monaco editor*/}
      <div className={cn("flex-1 min-h-0 relative")}>
        {!code && editorReady && (
          <div
            className={cn(
              "absolute inset-0 z-10 pointer-events-none flex items-center justify-center",
            )}
          >
            <div className={cn("text-center max-w-md px-6")}>
              <p className={cn("text-zinc-500 text-sm mb-4")}>
                Paste your code here, or click{" "}
                <span className="text-cyan-400">Load example</span> to try a
                demo
              </p>
              <div className={cn("text-zinc-600 text-xs space-y-1.5")}>
                <p>
                  <span className={cn("text-zinc-600 text-xs space-y-1.5")}>
                    Language
                  </span>{" "}
                  — sets syntax highlighting and tells AI what language to
                  review
                </p>
                <p>
                  <span className={cn("text-zinc-600 text-xs space-y-1.5")}>
                    ⚡ Quick
                  </span>{" "}
                  — fast scan, top 3-5 issues only
                </p>
                <p>
                  <span className={cn("text-zinc-600 text-xs space-y-1.5")}>
                    🔍 Deep
                  </span>{" "}
                  — thorough analysis with refactoring suggestions
                </p>
                <p>
                  <span className={cn("text-zinc-600 text-xs space-y-1.5")}>
                    🛡️ Security
                  </span>{" "}
                  — focused on vulnerabilities (XSS, injection, auth)
                </p>
              </div>
            </div>
          </div>
        )}
        <MonacoEditor
          height="100%"
          language={language}
          value={code}
          onChange={(value) => onCodeChange(value || "")}
          theme="vs-dark"
          onMount={() => setEditorReady(true)}
          beforeMount={(monaco) => {
            monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions(
              {
                noSemanticValidation: true,
                noSyntaxValidation: true,
              },
            );
            monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions(
              {
                noSemanticValidation: true,
                noSyntaxValidation: true,
              },
            );
          }}
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            lineHeight: 20,
            padding: { top: 12, bottom: 12 },
            scrollBeyondLastLine: false,
            wordWrap: "on",
            tabSize: 2,
            automaticLayout: true,
            scrollbar: {
              verticalScrollbarSize: 6,
              horizontalScrollbarSize: 6,
            },
            overviewRulerBorder: false,
            renderLineHighlight: "gutter",
            guides: { indentation: true },
          }}
        />
      </div>
    </div>
  );
}

function SampleDropdown({
  onSelect,
}: {
  onSelect: (sample: (typeof SAMPLE_CODES)[number]) => void;
}) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState({ top: 0, right: 0 });

  const handleOpen = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPos({
        top: rect.bottom + 4,
        right: window.innerWidth - rect.right,
      });
    }
    setOpen(!open);
  };

  return (
    <>
      <button
        ref={buttonRef}
        onClick={handleOpen}
        className="text-xs text-zinc-500 hover:text-zinc-300 px-2 py-1.5 hover:bg-zinc-800 rounded-lg transition-colors"
      >
        Load example
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            className="fixed w-48 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl z-50 overflow-hidden"
            style={{ top: pos.top, right: pos.right }}
          >
            {SAMPLE_CODES.map((sample, i) => (
              <button
                key={i}
                onClick={() => {
                  onSelect(sample);
                  setOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-xs text-zinc-300 hover:bg-zinc-700 transition-colors"
              >
                {sample.label}
              </button>
            ))}
          </div>
        </>
      )}
    </>
  );
}
