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

## Themes, palette and density

The app now has light, system and dark themes. They can be switched from the sidebar and from Settings. Dark remains the default. The blue is now a clear, saturated #2563eb for actions, with matching accent tones in each theme. A lighter type scale reduces heading sizes and weights and drops negative tracking. Spacing is larger and content is narrower, and the desktop sidebar is a compact single-line list. The Learn page lists lessons as full-row links with a number or done marker, the English title, a status badge and duration, plus a per-module read count. Vitest passed 28 tests and Playwright passed 30 checks on Chromium and WebKit, including axe on the main routes in light mode.

The desktop sidebar is reduced to an icon and a Thai label per row, with English kept as the accessible name. Settings and a compact theme switcher share one footer row. Spaced review is now the sixth Practice card instead of a trailing underlined link.

Follow-up polish: The Learn page's 12-week plan is a compact card with an expandable six-step grid. Reference pattern rows are full-row links, with slot placeholders shown as chips and a register badge. Topic and lesson lists in Reference use the same row style. Sentence Builder controls are numbered steps (label column and pill chips), with a sticky sentence preview. Word-role cards are equal height. The theme now follows the localStorage mirror when no settings record exists, and it listens for OS changes from mount, which closes two reload and race gaps. Playwright passed 30 checks on Chromium and WebKit.
Buttons across the app, including icon buttons, are now pill-shaped.
Back links on every subpage use a shared BackLink pill with an arrow icon instead of an underlined ← text link.
The mobile tab bar now shows an icon and a single Thai label, with the active icon in a soft pill on a translucent bar. English stays as the accessible name.

## Consistency pass

- Lesson pages wait for saved progress before rendering the section tabs, using a shimmer placeholder, so section 1 no longer flashes before the resume point.
- Each exercise shows its latest saved outcome when reopened: ครั้งก่อนตอบถูกแล้ว, ครั้งก่อนยังไม่ถูก or ประเมินตนเองแล้ว. The diagnostic opts out. Typed answer text is still not stored.
- The Sentence Builder intro lives in the page heading.
- Inputs, selects and text areas share a rounded, raised field style with an accent focus ring and an invalid state.
- Remaining pages were brought in line. Conversation scenarios are hover cards. Podcast, Notebook and Review have back links. The Review empty state explains how to add patterns. The diagnostic hides "next" until answered. Bookmarks, related lessons and pattern links use the shared RowLink.
- Vitest passed 30 tests and Playwright passed 30 checks. axe runs in light mode on 16 routes, and a one-off dark sweep of the same routes was clean.
Examples are lighter raised cards with an inset accent edge, quieter Thai and notes, and a small round audio button. The Reference glossary is a divided list.

## Everyday English Lab

Entry points are Practice → คำศัพท์ในชีวิตประจำวัน and Reference → คำศัพท์ในชีวิตประจำวัน. The dedicated routes cover discovery and detail, verb phrases, comparisons, collocations and sentence patterns, seven contextual exercise types, guided sentence expansion, and vocabulary review. Search supports English, Thai, phrases and inflected forms, with filters for category or base verb, difficulty and learned state.

The first release targets 60 contextual words in eight categories, 30 multi-word verbs in nine base-verb groups, 30 collocations, 30 sentence-pattern views and 17 comparisons. The larger brief targets remain a future curriculum expansion. Content is bundled through the existing PWA. Learner data remains local and round-trips in existing JSON backups.

Reference checks for the initial editorial pass include Cambridge Dictionary's [multi-word verb grammar](https://dictionary.cambridge.org/uk/grammar/british-grammar/phrasal-verbs), [participial adjective grammar](https://dictionary.cambridge.org/us/grammar/british-grammar/-ing-and-ed-adjectives), and [pour](https://dictionary.cambridge.org/pronunciation/english/pour) and [wear](https://dictionary.cambridge.org/pronunciation/english/wear) pronunciations. The app has authored examples and uses the device voice when available.

The initial inventory validated at 60 words, 30 multi-word verbs, 30 collocations, 30 sentence-pattern views, 17 comparisons and 21 contextual activities. Content validation, typecheck, lint and production build passed. Vitest passed 34 tests across 11 suites. Playwright passed 44 checks on Chromium and WebKit, including Thai query and category filtering, return to previous filters, learned state and review persistence, production answer variants, interactive expansion, 320 px and desktop accessibility, and offline vocabulary deep links.

## Everyday integration follow-up

Contextual search now displays and opens the matching sense. Selected meanings can link to related vocabulary, collocations, comparisons, patterns and activities. Vocabulary-to-sentence workshops for pour, wear and take off share the existing exercise and expansion engines. Pour and wear also offer direct Builder presets. The review queue accepts cards for a selected sense and resolves earlier headword review IDs. The app still uses the existing theme tokens and version-1 backups.

Follow-up verification passed content validation, TypeScript, ESLint, 34 Vitest tests, production build, and all 48 Chromium/WebKit Playwright checks. Coverage includes matching Thai queries to secondary senses, reviewing a selected meaning, v1 backup round-tripping, all three contextual workshops, 320 px and desktop axe checks, and the offline vocabulary deep link.

## Travel, dining, shopping and assistance

The approved expansion adds four dedicated labs under Learn → ภาษาอังกฤษตามสถานการณ์. The inventory is Travel (8 lessons), Restaurant & Dining (11), Shopping (9), and Travel Problems & Emergency (9). Each module links to cumulative practice. New authored scenarios appear by lab alongside the original Conversation Lab catalog. The ingredient Builder preset starts from an explicit noun and shows do-support with `Does it contain peanuts?`, which can be used when the dish is already understood.

Content validation, TypeScript, ESLint, the production build, 39 Vitest tests and 56 Chromium/WebKit Playwright checks passed. Browser coverage includes branching roleplay feedback, review persistence, the offline lesson-to-Builder path, and accessibility scans at 320 and 1280 px. Learner progress and review items round-trip through version-1 backups.
