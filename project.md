# Project Overview — GLP-1 Chatbot Frontend

This document is a thorough, plain-language guide to the Chatbot frontend project. It explains where things are, what they're for, how the app works, and how to run or modify it. This is aimed at both technical and non-technical readers — each section includes short explanations and the most important details to help you understand or contribute.

---

## One-line summary
A small Next.js frontend for a GLP-1 medication eligibility assistant that walks a user through a series of questions and gives a preliminary eligibility assessment.

---

## Table of contents
1. Project structure and what each item is for
2. Overview of the chat flow (how the app works)
3. Where the data & logic live
4. Main UI components and their responsibilities
5. How to run and test the app
6. How to update or extend the project
7. Notes about removed/cleaned files and build artifacts
8. Troubleshooting & FAQs

---

## 1) Project structure (file/folder map)

Top-level files:
- `package.json` — project dependencies, scripts to run and build the app.
- `README.md` / `QUICK_START.md` — short documentation about the project (starter info).
- `next.config.ts` — configuration for Next.js.
- `tsconfig.json` — TypeScript project configuration.
- `postcss.config.mjs`, `eslint.config.mjs` — style/lint configs.
- `project.md` — this file.

Main folders:
- `app/` — the main frontend app (Next.js "app" router). It contains UI, hooks, and page definitions.
- `public/` — static assets (icons, images). NOTE: This project currently has an empty `public/` folder after cleanup — add image files here if required.
- `node_modules/`, `.next/` — dependencies and compiled build artifacts (do not edit these manually).

`app/` folder breakdown:
- `app/layout.tsx` — global HTML wrapper for all pages, sets global layout and meta.
- `app/globals.css` — global project CSS.
- `app/page.tsx` — the root page of the app that renders the Chat UI. It is the entry point for the page.
- `app/components/` — UI component hierarchy split into small atoms, molecules, organisms, templates:
  - `atoms/` — small building blocks like `Button.tsx` and `Input.tsx`.
  - `molecules/` — slightly larger components, e.g., `MessageBubble.tsx` (a chat message bubble).
  - `organisms/` — composed UI groups like `MessageList.tsx`, `PatientDataSummary.tsx`, and `ProgressIndicator.tsx`.
  - `templates/` — page-level component composition used on the page, e.g., `ChatWindow.tsx`.
- `app/hooks/` — React hooks controlling application state and logic. The primary hook is `useQuestionFlow.ts`.
- `app/lib/` — small utilities and type definitions:
  - `types.ts` — shared TypeScript interfaces (ChatMessage, ChatState, etc.).
  - `api.ts` — a placeholder or helper file for API calls (empty previously; removed during cleanup in your workspace). If you have a backend, code lives here.
- `app/faker/` — `data.ts` contains the simulated or sample question definitions and small helper functions to get the next question, validate answers, or compute completion percentage.
- `app/styles/`, `app/tests/`, `app/components/pages/` — placeholder folders. They are empty in this workspace (kept for future work or tests).

Build artifacts and hidden files – maintained by the build system (do not edit):
- `.next/` — Next.js build output.
- `tsconfig.tsbuildinfo` — caching information for TypeScript.

Notes on removed content:
- Some unused files were removed from the repo (e.g., `useChatSession.ts`, `Textarea.tsx`, several `public/*.svg`, `.claude/settings.local.json`). If a missing piece is needed, it can be restored from backups or package history, or reimplemented.

---

## 2) Overview of the functionality & chat flow (how the app works)
This frontend is a chat-style Q&A assessment. The main user flow is:

1. The user opens the site (root page) which renders the chat window and displays the first system/welcome message.
2. The app shows a question to the user, retrieved from the `faker` data set. The question could be about age, weight, height, existing conditions, medications, or other medical info.
3. The user types an answer and sends it using the chat UI (Input component + Send Button).
4. The `useQuestionFlow` hook parses and validates the answer using logic in `faker/data.ts`. If the answer is invalid, it prompts the user to retry.
5. The app updates the local state (answers, messages) and shows the next question. It also keeps track of completion percentage and per-category progress.
6. For certain answers (height/weight), the app calculates BMI and includes it in the conversation as additional metadata.
7. Once all questions are answered (or a final state is reached), the app shows a summary and a preliminary eligibility assessment (eligible, ineligible, or pending). This result is not a medical diagnosis and requires a clinician for any official action.
8. The user can review answers, export them, or reset the session.

Key points about backend vs frontend handling:
- This repository is the frontend only. Some hooks (like `useChatSession`) can request an optional backend endpoint (`apiBase`) to do server-side parsing or analysis. In your current workspace, `useChatSession` was removed — `useQuestionFlow` is fully client-side and handles Q&A locally.
- Local storage is used to save progress (answers and messages), so reloading the page continues the flow.

---

## 3) Where data and logic live
- `app/faker/data.ts` — contains the question definitions and helper functions:
  - getAllQuestionsSequential() — returns the list of all questions in order.
  - getNextQuestion(answers) — picks the next question based on previous answers.
  - validateAnswer(question, answer) — checks if the answer format is acceptable.
  - getCompletionPercentage(answers) — returns percent completion based on answered items.
  - getCategoryProgress(answers) — progress per category (like personal, medical, goals).

- `app/hooks/useQuestionFlow.ts` — orchestrates the conversation: loads or initializes state, pushes and stores messages, parses answers, validates, determines the next question, computes BMI & eligibility, and writes to localStorage.
  - It exposes: `state` (all chat messages and question/answer progress), `sendUserMessage(text)` (handle a user-sent message), `reset()` (clear session), and `exportAnswers()` (download answers JSON).

- `app/lib/types.ts` — TypeScript interfaces used throughout the UI to keep data consistent. Notable types:
  - `ChatMessage` — `id`, `role` (user | assistant | system), `text`, `time`, `metadata`.
  - `ChatState` — messages + patient data + eligibility state.

- UI components read from `state` and display messages or summary data.

---

## 4) Main UI components & responsibilities
This project follows component design patterns (atoms, molecules, organisms, templates) — here’s how they map to the UI with simple explanations.

Atoms (small pieces)
- `Button.tsx`: Generic button, used in the chat and other actions (send, reset, export). Props for `variant` and `ariaLabel`.
- `Input.tsx`: Main text input — accepts user messages and forwards text to the send handler.

Molecules (combined small pieces)
- `MessageBubble.tsx`: Handles rendering a single chat message (user / assistant / system). Can show BMI metadata and a timestamp.

Organisms (groups of components)
- `MessageList.tsx`: Renders a list of `MessageBubble` items. Has auto-scrolling behavior to keep the view at the bottom.
- `PatientDataSummary.tsx`: Displays a summary of the patient’s answers, BMI, and eligibility status in a friendly card.
- `ProgressIndicator.tsx`: Visualizes progress and completion by categories.

Templates (page-level combos)
- `ChatWindow.tsx`: Uses `MessageList`, `Input`, `Button` and the hook `useQuestionFlow` to render the chat UI, typing indicators, current question, and action buttons.

Pages
- `page.tsx`: Sets up the page and uses `ChatWindow` as the main interface on the site.
- `layout.tsx`: Global layout and CSS wrapper.

---

## 5) How to run & test this project locally (step-by-step)
Prerequisites:
- Node.js (v18 or later recommended)
- npm or yarn

Commands:
1. Install dependencies

```powershell
npm install
```

2. Start development server

```powershell
npm run dev
```

- Visit `http://localhost:3000` to see the app.
- Open the browser devtools to watch console logs and localStorage.

3. Build & production

```powershell
npm run build
npm run start
```

4. Optionally run code checks (lint, tests) — depending on project scripts

```powershell
npm run lint
npm run test
```

Notes:
- If you see stale errors related to deleted files (e.g., missing imports from removed files), rebuild the app after cleaning `.next/` and `tsconfig.tsbuildinfo`.
- To remove build cache and start from scratch:

```powershell
rimraf .next
rimraf node_modules
rimraf tsconfig.tsbuildinfo
npm install
npm run dev
```

---

## 6) How to add or modify functionality (developers / maintainers)
Add a question:
1. Edit or add a new question in `app/faker/data.ts`.
2. Ensure the question has: id, type (number, boolean, select, multiselect, text), optional helper text, category and validation rules (if needed).
3. Update `getNextQuestion` logic if you need branching logic (which question next depending on answers).
4. Add UI elements if you want a custom input type.

Add a new component:
- Add new small components in `atoms/` for reuse. Combine them into `molecules/` and `organisms/` and then add to `templates/`.

Hook and state updates:
- The `useQuestionFlow` hook (or a similar hook) should handle validation, messaging, local storage, and state transitions. Keep the message push and state updates consistent so that `MessageList` and `MessageBubble` render correctly.

Linking to backend:
- If you have a server to analyze or preprocess answers, you can reintroduce the `api.ts` helper and use `fetch` or `axios` from `useQuestionFlow` to post text for processing. Keep `useQuestionFlow` logic as a fallback when server fails.

---

## 7) Notes about removed files & cleanup
- The following were removed from this workspace (these may have existed before):
  - `app/hooks/useChatSession.ts` — (a hook with a different approach for local parsing / server integration).
  - `app/components/atoms/Textarea.tsx` — a textarea atom component.
  - `app/lib/api.ts` — a helper file that was empty.
  - `public/*.svg` files — static icons (vercel, next, globe, file, window) were deleted.
  - `.claude/settings.local.json` — a tool-specific local settings file removed for privacy.
- If needed, restore these from a commit or backup. They were removed because they weren't being used by main files.
- Build artifacts (`.next/`, `tsconfig.tsbuildinfo`) will continue to reference various file names until you rebuild from scratch.

---

## 8) Troubleshooting & FAQs
Q: The project fails on startup complaining about missing components that used to exist.
A: Confirm you’ve rebuilt the app and cleared cached build outputs: `rimraf .next` and `npm run build`. Also verify your imports do not reference deleted files.

Q: I want a server to analyze responses. Where do I add that?
A: Implement REST endpoints (e.g., `/api/eligibility/check`) on a standalone backend and ensure `useQuestionFlow` or your hook can call it via `fetch` using an `apiBase` configuration.

Q: I’m not a developer — how do I use this app?
A: Start the dev server (`npm run dev`) and open the site at `http://localhost:3000`. Begin by answering the chat questions. The app shows your progress and a summary when finished. No registration or backend is needed.

Q: I changed a question in `faker/data.ts` and now the flow looks wrong.
A: Check `getNextQuestion` and `validateAnswer` in `faker/data.ts` — they define order and validation for questions. Adjust them to ensure the flow and allowed answers are consistent.

---

## Final notes and suggestions
- Consider adding tests under the `app/tests/` folder to cover state transitions and message parsing.
- If you want the app to support real backend checks, implement server endpoints and keep `api.ts` to centralize fetch logic.
- Keep `app/lib/types.ts` updated as the glue for shared interfaces.
- Add `README.md` and `QUICK_START.md` to help future maintainers and keep this `project.md` inside the repo root to help non-technical stakeholders.

If you'd like, I can now:
- (A) Add a small diagram illustrating message flow and components
- (B) Add sample images to `public/` to replace removed icons
- (C) Commit this change to a branch for review
- (D) Recreate a deleted file if you want it restored

Please tell me the next step you prefer.