# Fluent Blocks V1 progress

The approved private working tree implements M1–M4. The build targets a static Cloudflare Pages origin. Deployment and physical-device acceptance remain separate.

| Milestone | Delivered |
| --- | --- |
| M1 | React application shell, Thai-first lesson reader, diagnostic, local progress, and deterministic Sentence Builder and Decision Lab |
| M2 | Foundation, tense and intention, questions, word placement, connectors and natural spoken English with graded and self-assessed practice |
| M3 | Sentence expansion, conversation and listening lessons, ten authored branching scenarios, Podcast Lab, bilingual search, vocabulary notebook, spaced review and adjustable study routine |
| M4 | Full curriculum and pattern library, build-time content checks, PWA offline/update, JSON backup and recovery, browser tests and hosting guide |

The inventory is 86 lessons in 10 modules with a linked cumulative review route for each module. Minimums for examples, contrast sets, exercises, speaking tasks and pattern examples are enforced by the build-time validator. Scenario content, objective links, answer choices, ordering tiles and prerequisites are included in validation.

## Run and verify

See DEPLOY.md. Use npm run validate:content, npm run lint, npm run typecheck, npm test, npm run build, and npm run test:e2e. Playwright expects Chromium and WebKit to be installed. Its tests generate mobile screenshots of Home, Lesson, Builder, Practice, and Reference.

## Handover boundaries

- English and Thai were reviewed while authoring and by the content contributors. An independent curriculum audit can be tracked separately from schema and browser checks.
- Sentence Builder supports a finite lexicon and declared forms. For open speaking and unrecognized written variants, the app provides models and a self-check instead of attempting to certify grammar.
- Real iPhone install, device voices, and real-device screen-reader testing have not been performed. WebKit results refer to Playwright on macOS.
- The working tree has no public deployment or external account configuration. Browser-local data does not sync between origins, browsers, or devices.

## Latest verified build

- Content validation passed with 86 lessons, 459 worked lesson examples, 430 exercise items, 308 patterns with 616 pattern examples, and 10 scenarios with 20 authored branches.
- ESLint and strict TypeScript passed.
- Vitest passed 26 tests across nine suites.
- Production build and Workbox precache generation passed.
- Playwright passed all 24 tests across Chromium and WebKit. Coverage includes deep links, bookmark and resume persistence, diagnostic retake, review scheduling, grammar feedback and retry, natural expansion and self-assessment, 320–1,200 px layouts, keyboard focus, axe in light and dark, offline navigation and service-worker updates using two production builds.

## Dashboard redesign

The dashboard now uses a dark-only palette, shadcn/ui cards, actions, and lesson-position progress. It highlights the next lesson, displays curriculum completion as a ring, and groups review, diagnostic, routines, and practice results. Desktop navigation now includes an Overview entry. Tests verify the dark palette under a light system theme, current lesson resume, and accessible layouts from 320 to 1,440 px. All 26 Vitest and 24 Playwright tests passed on the redesigned build.

## Site-wide shadcn/ui and blue palette

Shared shadcn/ui cards, buttons, form controls, tabs, disclosures, navigation actions and alerts are used across all routes. The app uses a near-black background and charcoal surfaces, with blue accents for controls and PWA branding. Typecheck, lint, content validation and production build passed. Vitest and Playwright each passed 26 checks, including narrow mobile notebook layouts and automated accessibility checks on Chromium and WebKit.

## Exercise feedback

Graded exercises now show a distinct result state: a green check for ถูกต้อง and a red cross for ยังไม่ถูก, with the field or chosen option marked invalid. A wrong graded answer stays editable and the main action becomes ตรวจอีกครั้ง. Hint and answer reveal appear after the first attempt. The answer is shown only through ดูเฉลย, or as ดูคำอธิบาย after a correct answer. Short graded answers use a single-line English input that submits on Enter. Open speaking and expansion tasks keep a textarea. The check button stays enabled and explains an empty submit instead of appearing disabled. Vitest passed 28 tests and Playwright passed 26 checks on Chromium and WebKit, including axe.

Some authored targeted feedback, such as the m2-06 Are/Do note, states the full model answer. A content pass can rephrase these as reasons only.

## Navigation

The mobile bottom navigation now has four destinations, with Overview first, matching the desktop sidebar. Overview shows as current on the home route. Labels stay on one line down to 320 px. Lesson section tabs are a single numbered row of four. When the tab area is narrower than 700 px, compact labels are shown (หลักการ, ตัวอย่าง, ฝึก, พูด) and the full section name stays the accessible name. Below 460 px, the number sits above each label. Hover on an inactive tab shows only an outline, so it can no longer be mistaken for the active tab. The active tab has an accent underline. Tab backgrounds no longer animate, so the jump to the saved section on load does not flash two highlighted tabs. Vitest passed 28 tests and Playwright passed 28 checks on Chromium and WebKit.

## Home and Practice

Home's resume bar now reads as a position in the lesson, for example ส่วน 3 จาก 4 · ลองฝึก, rather than a score. Before any lesson is marked read, the progress ring is replaced by the curriculum size and a prompt to use บันทึกว่าอ่านจบ. Before any attempt, the practice results card explains what it will show and links to Practice, instead of showing zero counts. Practice tool cards drop the link underline and highlight the whole card on hover. In Sentence Builder, sentence type, subject, predicate and modifier are tappable chips that show English with the Thai gloss. Intention stays a native select because it has 17 long Thai options. Vitest passed 28 tests and Playwright passed 28 checks on Chromium and WebKit, including axe.
