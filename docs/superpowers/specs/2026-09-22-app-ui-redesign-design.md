# ABCA App UI Redesign

## Goal
Redesign the full German-learning app UI so every primary screen is easy to scan on mobile, uses a consistent visual system, and surfaces the next useful learning action without long explanatory copy.

## Scope
Redesign Navbar, BottomNav, Today dashboard, Roadmap, Vocabulary, Grammar, Conversation, AI Tutor, Mistakes, and Progress. Keep existing data models, learning logic, storage, AI service, speech service, and lesson player behavior intact.

## Design system
- Warm off-white app background, white surfaces, slate text, amber primary accent.
- Minimal gradients; no rainbow-card dashboard look.
- Compact radii, light borders, sparse shadows.
- Strong title hierarchy; descriptions are short and optional.
- Mobile-first layout with 44px+ touch targets and safe-area bottom padding.
- Reduce nested cards; prefer sections and rows.

## Navigation
Desktop keeps direct access to all learning areas. Mobile shows five primary destinations: Hôm nay, Lộ trình, Từ vựng, AI Tutor, Tiến độ. A More sheet exposes Ngữ pháp, Hội thoại, and Sổ lỗi.

## Today
Focus on today's next lesson, daily minutes, streak, review queue, mistakes, and compact shortcuts. Specialized tools are secondary.

## Roadmap
Roadmap must become more informative, not merely shorter. Level tabs show A0/A1/A2. The selected level shows current position, overall progress, next milestone, topic/chapter progress, a one-line learning objective, and expandable lesson rows with lesson number, title, duration, skill type, and status.

## Vocabulary
Lead with review-due count and a clear Review action, then search/category controls. Preserve existing study/list modes but simplify visual chrome and shorten help text.

## Grammar
Organize grammar content around searchable topic cards grouped by level/category. Cards show only title, level, and compact learning cue; details remain inside expanded/selected content.

## Conversation
Make scenario cards the primary UI. Each scenario shows title, situation, level/duration, and start action. Keep conversation practice behavior intact.

## AI Tutor
Chat is the visual center. Quick modes provide concise entry points: Nói chuyện, Sửa câu, Giải thích, Luyện A1/A2. Avoid large explanatory banners.

## Mistakes
Show count + Practice CTA first. Filters are compact. Each mistake row prioritizes the question and answer correction; explanation is secondary/collapsible where possible.

## Progress
Show current level and completion first. Secondary stats are compact. Level progress and SRS distribution are simplified into clear bars; destructive reset is visually separated at the bottom.

## Non-goals
Do not replace storage/AI/speech services, modify course data, change lesson scoring, or redesign modal learning flows in this pass.
