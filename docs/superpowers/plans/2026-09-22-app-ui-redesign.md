# ABCA Full UI Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign every primary ABCA app tab into one coherent, mobile-first learning interface while preserving existing learning/data behavior.

**Architecture:** Keep the existing React/Vite single-view architecture and component public props. Replace visual structure within each screen, add a compact mobile More sheet inside BottomNav, and centralize common global surface/typography rules in index.css. No new state-management or routing dependency is introduced.

**Tech Stack:** React 19, TypeScript, Vite, Tailwind CSS 4, lucide-react.

**Spec:** `docs/superpowers/specs/2026-09-22-app-ui-redesign-design.md`

## Global Constraints
- Preserve existing data models and learning logic.
- Preserve storageService, speechService, aiTutorService behavior.
- No new runtime dependency.
- Mobile-first; 44px+ primary tap targets.
- Amber is the only primary accent; semantic red/emerald/blue remain where useful.
- Avoid long explanatory copy and nested-card visual noise.

## Review Focus
- Empty progress data must still render without NaN or missing-current-level crashes.
- Long German/Vietnamese lesson titles must wrap without breaking mobile layout.
- Bottom navigation must keep all eight views reachable on mobile.
- Existing interactive modes in Vocabulary, Conversation, Tutor, and Mistakes must remain reachable after the visual rewrite.
- Fixed bottom navigation must not cover the last actionable content on iPhone-sized screens.

---

### Task 1: Global shell and navigation
**Files:** `src/App.tsx`, `src/index.css`, `src/components/Navbar.tsx`, `src/components/BottomNav.tsx`
- [ ] Simplify app background/spacing and global UI primitives.
- [ ] Make desktop navigation compact and scannable.
- [ ] Make mobile bottom nav five primary tabs plus More sheet for remaining tabs.
- [ ] Verify all currentView values remain reachable.

### Task 2: Today dashboard
**Files:** `src/components/DailyDashboard.tsx`
- [ ] Preserve next-lesson, review, mistake, word-of-day, modal calculations.
- [ ] Replace marketing hero and rainbow tool cards with action-first sections.
- [ ] Keep specialized tools accessible as compact secondary actions.

### Task 3: Detailed roadmap
**Files:** `src/components/RoadmapView.tsx`
- [ ] Add level summary, current position, next milestone, chapter objective and progress.
- [ ] Add expandable topic sections and status-aware lesson rows.
- [ ] Infer compact skill labels from existing lesson fields without changing course data.

### Task 4: Vocabulary and Grammar
**Files:** `src/components/VocabularyView.tsx`, `src/components/GrammarView.tsx`
- [ ] Preserve existing filtering, study, audio, and note interactions.
- [ ] Recompose headers, controls, list/cards, and details into the new visual system.
- [ ] Reduce instructional text and surface primary actions.

### Task 5: Conversation and AI Tutor
**Files:** `src/components/ConversationView.tsx`, `src/components/AITutorView.tsx`
- [ ] Preserve scenario/practice and AI chat behavior.
- [ ] Make scenario selection and chat composer the primary visual focus.
- [ ] Compact quick modes and helper copy.

### Task 6: Mistakes and Progress
**Files:** `src/components/MistakesView.tsx`, `src/components/ProgressView.tsx`
- [ ] Preserve filters/practice/delete/reset behavior.
- [ ] Simplify correction cards and analytics hierarchy.
- [ ] Ensure empty states are concise and useful.

### Task 7: Verification and delivery
**Files:** all modified files
- [ ] Run TypeScript lint/build against a reconstructed project copy.
- [ ] Run browser smoke test at mobile and desktop widths if dev server is available.
- [ ] Package all changed files with correct repository-relative paths in one ZIP.
