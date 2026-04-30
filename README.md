# AI Code Reviewer

An open-source, AI-powered code review tool that provides instant, structured feedback on your code. Paste your code, select a review mode, and get actionable insights — powered by GPT-4o with real-time streaming.

🔗 **Live Demo**: [https://aireviewer.zoemeng.com/](https://aireviewer.zoemeng.com/)

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)
![GPT-4o](https://img.shields.io/badge/GPT--4o-powered-10A37F?logo=openai&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue)

- **Real-time Streaming** — Watch the AI review appear token-by-token as it's generated
- **Three Review Modes** — Quick scan, deep analysis, or security audit
- **Monaco Editor** — VS Code's editor with syntax highlighting for 8+ languages
- **Structured Feedback** — Issues categorized by severity (Critical / Warning / Info) with line references
- **Code Score** — 0–100 quality score with visual indicator
- **Export** — Copy as markdown or download `.md` file for PR comments
- **Review History** — Automatically saves recent reviews with one-click reload
- **Keyboard Shortcuts** — `⌘ + Enter` to submit
- **Responsive** — Works on desktop and mobile

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Editor**: Monaco Editor (`@monaco-editor/react`)
- **AI**: OpenAI GPT-4o-mini (streaming)
- **State**: Zustand (with localStorage persistence)
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- An [OpenAI API key](https://platform.openai.com/api-keys)

### Installation

```bash
# Clone the repository
git clone https://github.com/zoeMeng1225/ai-code-reviewer.git
cd ai-code-reviewer

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local and add your OpenAI API key

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to use the app.

## Project Structure

```
src/
├── app/
│   ├── page.tsx                # Main page — split-pane layout
│   ├── layout.tsx              # Root layout, fonts, metadata
│   ├── globals.css             # Global styles
│   └── api/review/
│       └── route.ts            # POST endpoint — OpenAI streaming
├── components/
│   ├── CodeEditor.tsx          # Monaco wrapper + toolbar
│   ├── ReviewPanel.tsx         # Streaming result display + markdown renderer
│   └── Header.tsx              # App header + history dropdown
├── hooks/
│   └── useReview.ts            # Core hook — fetch, stream, abort, error handling
├── stores/
│   └── reviewStore.ts          # Zustand store — review history persistence
├── lib/
│   ├── prompts.ts              # System prompts for each review mode
│   ├── sampleCodes.ts          # Demo code snippets
│   └── exportMarkdown.ts       # Copy + download utilities
└── types/
    └── review.ts               # Shared TypeScript types
```

## Architecture Decisions

| Decision                                          | Rationale                                                                     |
| ------------------------------------------------- | ----------------------------------------------------------------------------- |
| Raw `ReadableStream` over Vercel AI SDK streaming | More explicit control over stream consumption; easier to debug and understand |
| Zustand over Redux                                | Minimal boilerplate for a small state surface (history only)                  |
| Custom markdown renderer over `react-markdown`    | Zero extra dependencies; tailored to the specific review output format        |
| In-memory rate limiting                           | Simple demo protection without external dependencies                          |
| Monaco dynamic import                             | Prevents 2MB+ bundle from blocking initial page load                          |

## License

[MIT](LICENSE)

## Author

**Zoe Meng** — Frontend Engineer

- Portfolio: [zoemeng.com](https://zoemeng.com)
- GitHub: [@zoeMeng1225](https://github.com/zoeMeng1225)
- Linkedin: [Zoe Meng](https://www.linkedin.com/in/zoe-meng/)
