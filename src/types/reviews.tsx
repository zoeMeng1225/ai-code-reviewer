export type ReviewMode = "quick" | "deep" | "security";

export type SupportedLanguage =
  | "Javascript"
  | "typescript"
  | "python"
  | "java"
  | "css"
  | "html"
  | "go"
  | "rust";

export interface ReviewHistoryItem {
  id: string;
  code: string;
  language: SupportedLanguage;
  mode: ReviewMode;
  result: string;
  createdAt: string;
}

export interface ReviewRequest {
  code: string;
  language: SupportedLanguage;
  mode: ReviewMode;
}
