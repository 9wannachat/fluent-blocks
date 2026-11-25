

🤓

Fluent Blocks — English Speaking Bible
Master Prompt for Codex | v1.0
You are the lead product engineer, curriculum designer, English-language educator, UX designer, and QA lead for Fluent Blocks. Build a mobile-first, self-paced English learning application for a Thai-speaking adult. This document is the product specification and implementation contract. Do not merely produce a mockup, landing page, or empty curriculum scaffold.

1. Learner and purpose
The learner understands relatively simple spoken English, particularly with English subtitles, and can often follow the topic of a podcast. The primary difficulty is producing original sentences, selecting auxiliaries, choosing natural words and phrases, placing them correctly, and connecting ideas when asking questions or explaining something. Formal proficiency has not been assessed; do not label the learner as A1/A2/B1 without evidence. Do not assume complete beginner status. Provide foundational review and a diagnostic that allows skipping mastered lessons.

Primary outcome: From Understanding to Expressing. Teach the learner to turn an intention into natural spoken English, not memorize isolated vocabulary or translate Thai word by word. Teach what, why, where, alternatives, and how to reuse each structure.

Use Thai explanations and natural English examples, with Thai translations and context. Prefer conversational English; mark informal, neutral, formal and dialect-specific expressions when relevant. Do not imply informal but idiomatic expressions are grammatically wrong (e.g. “I've been watching your show since forever” is playful informal English). Correct actual errors respectfully. Avoid rigid rules that fail in real conversation.

2. Mandatory development workflow
Phase 1 — Analyze (read only)
Inspect repository, existing stack, files, configuration, dependencies and any existing conventions. If empty, state that. Identify risks, constraints, content scope, deployment and offline requirements. Do not edit files, install packages, create scaffolds or run destructive operations.

Phase 2 — Propose (then stop)
Present architecture, file tree, UX flows, curriculum map, proposed changes, dependencies, milestones, expected behaviour, risks, and testing strategy. Identify assumptions and any scope trade-offs. Wait for explicit confirmation such as “confirm”, “ทำเลย”, or “go ahead”. Discussion is not confirmation.

Phase 3 — Implement
Implement only approved scope. Use small milestones and run relevant tests after every change; run full quality gates before completing a milestone. If approval is for the complete V1 plan, proceed through its milestones without requesting redundant approval, but stop for changes outside scope or destructive actions. Do not claim tests ran if they did not. Never commit secrets. Preserve unrelated changes. Do not deploy publicly or create external accounts without explicit approval.

Phase 4 — Verify and hand over
Report implemented vs planned features, test commands and actual outcomes, unresolved bugs, limitations, screenshots if available, local run and deployment instructions. Maintain docs/PROGRESS.md and docs/DECISIONS.md so another agent can continue without rereading this entire prompt.

3. Technology and architecture
Default for an empty repo: React + TypeScript (strict) + Vite, Tailwind CSS, shadcn/ui primitives where useful, React Router or equivalent, Markdown/structured JSON curriculum, IndexedDB (Dexie or a small typed wrapper), PWA via a maintained Vite plugin. Static Cloudflare Pages hosting; no backend, accounts, paid AI APIs or external database in V1. Existing sound conventions take priority over unnecessary migrations; propose deviations before implementing. Pin compatible dependencies and maintain lockfile. Use a single package manager.

Suggested layout:

src/
  app/                 # routing, shell, providers
  features/
    learning/          # roadmap and lesson reader
    sentence-builder/  # pure grammar engine and UI
    practice/          # exercise runner and feedback
    reference/         # patterns, words, search
    podcast-lab/       # manual sentence notebook and guided analysis
    conversation/      # scenario exercises
    review/            # spaced repetition
    progress/          # mastery and dashboard
  content/             # typed curriculum, examples, exercises, glossary
  domain/              # schemas and pure logic
  storage/             # versioned IndexedDB and backup
  components/          # reusable accessible UI
  lib/
  styles/
public/
docs/
tests/
Separate UI, domain logic and content. Keep all curriculum independently editable without React component edits. Validate content at build time with a runtime schema (e.g. Zod). Use stable IDs, explicit prerequisites, schema version and references. No unsafe HTML rendering; sanitize Markdown or disable raw HTML. Treat user imports and podcast text as untrusted. Never embed API keys. No analytics or transmission of study history by default.

4. Information architecture and UX
Three primary destinations: Learn, Practice, Reference. Home resumes the next lesson and shows due reviews and weak skills. Desktop sidebar and mobile bottom navigation (safe-area aware); no horizontal overflow at 320px. Secondary routes: lesson, topic, sentence builder, review, podcast notebook, settings. Search by English phrase, Thai meaning, tag, intention or grammar topic. Deep links work on static hosting and reload.

Design direction: calm editorial learning tool, readable Thai typography, warm neutral surfaces, restrained accent, clear hierarchy, small purposeful icons, accessible contrast, light/dark/system theme. Avoid generic AI dashboard, excessive gradients, oversized hero headings, decorative cards and gamification clutter. Prefer text and inline examples; use color plus labels for word roles (subject, auxiliary, main verb, complement/object, modifier, connector). No color-only semantics. Use Thai-capable fonts with system fallback. Support keyboard, screen reader labels, reduced motion, focus visibility and touch targets around 44px. No blocking sign-up. Keep answer reveal separate from learner input.

5. Curriculum — complete learning roadmap
Every module must explain the decision behind the structure, not only its formula. Teach common speech first, advanced nuances progressively. Diagnostic routes learners to relevant lessons; allow navigation freely. Each chapter needs actual authored content, examples, common mistakes, exercises, speaking task and review links.

Part	Lessons / skills
1 Foundation	Parts of speech; subject/object/possessive pronouns; noun number and countability; articles and determiners; adjectives vs adverbs; core prepositions; V1/V2/V3/V-ing; contractions
2 Sentence engineering	Subject + verb; SVO; subject + linking verb + complement; indirect objects; there is/are; be vs ordinary verbs; do/does/did; have/has/had; auxiliary stacking; agreement; affirmative/negative/questions; short answers
3 Time and intention	Present simple, continuous, past simple, past continuous, present perfect, present perfect continuous; future will vs going to vs arrangements; past perfect as extension; can/could, should, would, must, have to, may/might; tense/aspect contrasts; state verbs
4 Question building	Yes/no inversion and do-support; WH questions; subject vs object questions; follow-ups; indirect questions (Do you know where he is?); tag questions; polite requests; question intent selection
5 Word placement	Adverb positions with be, ordinary verbs and auxiliaries; degree modifiers; frequency; negation; still/yet/already/just; even; really; probably; right now; enough/too; scope changes; flexible positions
6 Sentence expansion	Time, place, manner, reason; noun phrases; complements; infinitives and gerunds; verb patterns; relative clauses; that/if/whether clauses; conditionals; reported speech basics
7 Connecting ideas	And/also/plus; but/however/although; because/since; so/that's why; if/unless; for example/like; first/then/after that; in other words; contrast, result, elaboration, concession and sequencing
8 Natural English	Discourse markers (so, well, actually, basically, I mean, you know, anyway, by the way); hedging (I guess, kind of, sort of, maybe); collocations; phrasal verbs; idiomatic chunks; register and pragmatic meaning
9 Conversation	Starting, responding, follow-up questions, opinions, agreement/disagreement, clarifying, buying time, repair, topic transitions, narrating experiences, describing changes, explaining technical ideas and giving examples
10 Listening to speaking	Podcast sentence breakdown, listening with/without subtitles, chunk recognition, connected speech, contractions, stress, shadowing, retelling, personalization, spontaneous response
Prioritize Parts 2–8 for this learner. Foundation is available as reference. Suggested 12-week route is flexible, not a promise of fluency: weeks 1–2 foundations and sentence types; 3–4 auxiliaries/questions/time; 5–6 word order and connectors; 7–8 chunks and sentence expansion; 9–10 podcast analysis; 11–12 conversation and review. Revisit earlier skills throughout.

5.1 Essential decision rule: meaning first
Start with a communicative intention. Ask: What do I want to say? Is it a state, action, habit, ongoing event, finished past event, experience/current relevance, possibility, recommendation or hypothetical? Choose aspect/modal accordingly. If forming a question, move the first existing auxiliary (including finite be) before the subject; if a simple present/past lexical verb has no auxiliary, add do/does/did and use the base verb. Subject WH questions and embedded questions are exceptions that require their own lessons. A modal takes base form; perfect takes past participle; progressive takes -ing. Be as linking verb takes a complement, not do-support. Teach these as meaningful contrasts, not as one-to-one Thai translations.

Intention	Example	Contrast
Habit/preference	Do you eat breakfast?	not Are you eat breakfast?
State	Are you hungry?	not Do you hungry?
Current action	Are you eating?	be + V-ing
Finished past	Did you eat before work?	did + base
Completion relevant now	Have you eaten yet?	have + V3; Did you eat yet? also common in American speech
Ongoing duration	Have you been working all day?	have + been + V-ing
Advice	What should I do?	modal + subject + base
Hypothetical	What would you do if you were me?	would for imagined situation
Include contrast sets: do vs be, did vs have, have vs have been, will vs would, can vs could, should vs must, since vs for, still vs yet vs already, even vs very, confusing vs confused, kind vs kind of vs kinds of, worth + noun vs worth + V-ing, think vs guess, abroad vs aboard. Explain that “yet” and “still” overlap in negatives but differ in expectation/emphasis. Explain that “even” generally focuses on an element and is not invariably adjacent to it. Include why “Does she like you?” loses the -s in likes. Include “Who likes you?” vs “Who do you like?” and “Do you know where she works?” not inverted embedded clause.

5.2 Word placement and chunks
Teach role, scope, position, alternatives, register, pronunciation and reusability. Examples:

I still remember. / I'm still here. / I still haven't finished.
It's even better. / Even I noticed. / I didn't even notice.
I kind of like it. / I'm kind of tired. / What kind of music do you like?
I've already eaten. / Have you eaten yet? / I'm working right now.
I guess so. / I guess you're right. / I think you're right.
It's worth trying. / It's worth a thousand baht. / It's worth it.
That would be nice. / It would be even better if we went together.
I've been watching your show for ages. / I've been watching your show since forever (informal exaggeration).
I've been through a lot. / I went abroad about ten years ago.
That's a confusing one. / I'm confused. / That's a tricky one.
I live vicariously through your travel videos. (less frequent, optional reference)
Honestly, I don't know. / It takes effort. / It's worth the effort.
Teach a LEGO-style expansion with explicit slots:
[discourse marker] + [stance] + [core clause] + [modifier/time] + [connector] + [second clause].
Start: It's difficult. → It's kind of difficult. → I guess it's kind of difficult. → I guess it's kind of difficult right now. → I guess it's kind of difficult right now, but it'll get easier over time. → So, I guess it's kind of difficult right now, but it'll get easier over time.
Explain that stance and discourse markers have different functions and the template is optional, not a mandatory sentence order.

5.3 Pattern library
Target at least 300 distinct, curated reusable patterns in complete V1 (not 300 near-identical filler variants). Organize by intent: opinion, uncertainty, agreement, experience, plans, questions, advice, comparison, change, reason, result, conditions, clarification, repair, transitions, narrative, technical explanations, daily life. Each pattern has slot restrictions and two or more natural examples. Prioritize high-frequency chunks, including I think…, I guess…, I'm not sure if…, I feel like…, I used to…, I've been…, I'm trying to…, It depends on…, The thing is…, What I mean is…, As far as I know…, How come…?, Have you ever…?, What do you think about…?, Would you mind…?, That's why…, Not really…, Yeah, just a little bit. Include differences in “I feel like + noun/-ing” vs “I feel like + clause”. Do not claim corpus frequency without evidence. Show contractions and optional variants.

6. Lesson and content contract
Each lesson follows: real-life hook → learning objective → concept in Thai → why and when → formula and word roles → progressive sentence examples → contrasts → natural conversation → common mistakes → guided exercises → independent speaking → retrieval/review. Show alternatives where multiple answers are valid; distinguish grammatical error from stylistic preference. Do not overload learners with terminology; define terms in Thai and English.

Suggested schema (adapt with approval):

interface Lesson {
  id: string; moduleId: string; titleEn: string; titleTh: string;
  objectives: string[]; prerequisites: string[]; tags: string[];
  estimatedMinutes: number; blocks: LessonBlock[];
  exerciseIds: string[]; reviewPatternIds: string[]; version: number;
}
interface Pattern {
  id: string; template: string; meaningTh: string; intent: string;
  register: 'informal' | 'neutral' | 'formal';
  slots: { name: string; rule: string; examples: string[] }[];
  examples: { en: string; th: string; context: string }[];
  whyTh: string; placementTh: string; alternatives: string[];
  commonMistakes: { wrong: string; corrected: string; whyTh: string }[];
  relatedLessonIds: string[]; tags: string[];
}
Exercise discriminated unions: multiple choice, word ordering, fill blank, auxiliary choice, tense contrast, sentence transformation, Thai-to-English, connector selection, sentence expansion, error repair, conversation response, self-assessed speaking. Store answer variants, hints, Thai explanation, error-specific feedback, objective IDs and difficulty. Validate all IDs and references; reject empty or duplicate content. No fabricated source quotations or wholesale podcast transcripts. Examples should be original or user-provided; attribute any licensed material and respect its terms.

7. Functional requirements
7.1 Learn and diagnostic
Provide a short, non-certifying diagnostic across sentence structure, auxiliaries, tense, word placement, connectors and natural speech. Recommend lessons from missed objectives rather than just a total score. Allow retaking and manual override. Lesson navigation, bookmarks, resume position, prerequisite links, completion and estimated study time must work. Completion and mastery are separate: reading a lesson is not proof of mastery.

7.2 Interactive Sentence Builder
Implement a deterministic grammar engine for supported subjects, verb families and sentence types. Controls: subject (I/you/he/she/it/we/they), intention/tense, compatible verb or complement, positive/negative/question, optional time or degree modifier. Display English sentence, Thai meaning, role-colored tokens, formula, step-by-step rationale, and a comparison with an alternative tense. Support contractions as an optional presentation. Prevent unsupported or ungrammatical combinations; do not pretend to parse arbitrary English. Explicitly handle irregular forms, be agreement, do-support, and modal base forms. Include question builder for yes/no and selected WH forms. Examples: She likes coffee → Does she like coffee? → She doesn't like coffee; You have eaten → Have you eaten yet?; I am tired → Am I tired?; Who likes coffee? vs Who do you like? Tests cover each supported combination, subject agreement, V3, contractions and invalid input.

7.3 Decision Lab
Ask learner to choose meaning first, then build the sentence. Include a navigable decision tree and exercises contrasting similar forms. Give error-specific reasons (e.g. “Does already carries present third-person agreement, so use like, not likes”). Never grade a contextually valid alternative as wrong merely because it differs from a canonical string. Provide short answers and follow-up prompts.

7.4 Natural English and Connector Lab
Interactive word-placement and sentence-expansion exercises. Change a modifier or connector and explain the resulting change of meaning, tone and grammatical requirements. Show contrast sets with plausible dialogue. Teach fragments as valid conversational responses when appropriate, e.g. Kind of. / Not really. / That would be nice. Include spoken markers, stance, hedging and register. Avoid teaching unnecessary filler as mandatory speech.

7.5 Practice and feedback
Use retrieval and production, not only multiple choice. Sequence recognition → guided assembly → unaided translation/production → new context → speaking. Learner answers before revealing hints and solutions; allow retries. For deterministic questions normalize case, punctuation, whitespace and explicitly supported contractions/variants. Do not use edit distance as a substitute for grammar judgment. For open answers provide examples, a self-check rubric and mark “self assessed” rather than claim AI evaluation. Include pronunciation guidance, optional device speech synthesis for English examples (feature detect, selectable voice/rate; availability varies; provide text fallback). Optional speech recognition only if supported and explicitly opted into; disclose possible device/vendor processing and do not promise offline speech scoring. Do not upload recordings by default.

7.6 Podcast Learning Lab
Allow manual entry of sentence, optional source URL/timestamp, context, Thai meaning, notes, selected chunks, grammar tags and personal example. Provide structured guided analysis and search related local patterns. Use authored sample cards, e.g. “So, did you notice any changes?” with So = discourse marker, did = past auxiliary, you = subject, notice = base verb, any changes = object phrase. Reuse as “So, did you + V1 …?” and prompt learner to create three examples. Include source URL field and manual timestamp navigation; do not promise automatic YouTube transcription, downloads, or arbitrary AI analysis in static V1. No copying full copyrighted transcripts. User may enter short excerpts they are studying. Any future AI-assisted analysis needs separate opt-in design and secure server-side credentials.

7.7 Conversation Lab
Branching authored scenarios: meeting someone, daily life, travel, restaurant, workplace, technical explanation, podcast-style interview, agreeing/disagreeing, clarification and storytelling. Provide context, interlocutor turn, multiple valid responses, optional open response and follow-up. Explain tone and grammar. Encourage answer + reason + example + follow-up where appropriate, without forcing this formula on every turn. Offer 30–90 second speaking tasks, replay model audio if available, and self-check: clarity, chosen auxiliary, order, connection and naturalness. No claim of live AI dialogue in V1.

7.8 Reference and spaced review
Search English/Thai, grammar, intent, tags, exact phrase and related variants. Vocabulary notebook supports add/edit/delete, examples, notes, source and linked patterns. Include previously discussed terms from section 5.2 and should, would, through, notice, effort, still, worth, guess, confusing, abroad, honestly. Use simple transparent review scheduling (e.g. 1, 3, 7, 14, 30 days with Again/Hard/Good/Easy), local calendar dates, and tests with injected clock. Explain algorithm as a learning aid, not a scientific optimum. Daily review queue and weak objectives; no guilt messaging or fabricated streaks. Track last practice, attempts, accuracy on deterministic questions, and self-assessment separately.

7.9 Persistence, backup and PWA
Version IndexedDB schema, migrations and failure recovery; save progress and user notebook locally. Export/import JSON with validation, preview, merge or replace with confirmation, stable IDs and backup before replacement. Explain that local data can be cleared by browser/OS and does not automatically sync across devices. Offline app shell and all shipped curriculum after successful initial load; explicitly show offline status; external links/audio may require network. Service worker update notification, manifest, icons, standalone display and HTTPS deployment. Provide iOS Add to Home Screen instructions. Do not cache personal exports or external podcast media. Ensure app upgrades preserve data. Static hosting fallback for client routes; provide Cloudflare Pages build command and output directory. No actual public deployment until approved.

8. Delivery scope and milestones
Propose realistic milestones before coding. Do not equate a skeleton with complete V1. Suggested M1: architecture + design system + persistence + actual core lessons for be/do/have/modal and question building + tested sentence engine. M2: complete foundation/time/word placement + natural English + connectors + exercises. M3: expansion, conversation, podcast notebook, search and review. M4: finish all curriculum, at least 300 distinct patterns, offline/backup, accessibility, mobile QA and deploy guide. Each lesson includes at least 5 original worked examples, 2 contrast sets where relevant, 5 graded exercises and one production task; each module includes a cumulative review. Propose exact lesson inventory and counts in Phase 2; flag any reduced scope for approval. Content quality is more important than inflated counts. If context limits intervene, record outstanding items and continue in subsequent milestones, never create placeholders labelled complete.

9. Agent and skill workflow
Create concise repository guidance (AGENTS.md) and scoped reusable instructions under a Codex-compatible skills directory if supported by the installed environment. Check actual conventions first; do not invent unsupported agent configuration. Use native subagents only if available; otherwise perform roles sequentially. Roles: Planner (scope/dependencies), Curriculum Designer (progression), English Reviewer (grammar, naturalness, Thai translations, register), Frontend Engineer (typed accessible UI), UX Reviewer (mobile and learning interaction), Grammar Engine Engineer (pure domain logic), QA/Test Writer (unit/integration/E2E), Security/Privacy Reviewer (local data, imports, XSS), PWA Reviewer (offline/update), Code Reviewer (maintainability). Each role has a clear deliverable and verification checklist. Avoid redundant full-repo scans and excessive token use: read targeted files, maintain concise progress and decisions, use shared schemas and test fixtures, summarize changes, load only relevant skill instructions. Never sacrifice verification to save tokens. Keep this specification as the source of truth; record approved changes.

10. Tests and acceptance criteria
Use Vitest and React Testing Library (or existing equivalent), Playwright for E2E. Scripts: lint, typecheck, test, build, test:e2e, validate:content. Run appropriate tests on every change and all gates before handover. Test content IDs, references, duplicate patterns, valid answer keys and examples; manual language review is required because schema validation cannot certify grammar. Test sentence builder including irregular verbs, subject WH, negatives and supported auxiliary sequences. Test correct and incorrect exercises, retry, reveal, valid variants, self-assessment, diagnostic routing, progress reload, due reviews, import/export, corrupted data, offline reload, service worker updates and direct route loading. Test mobile widths 320, 375, 390 and 768, desktop, light/dark, keyboard and accessibility. Include Safari/WebKit coverage where feasible, and disclose any lack of actual iPhone testing. Do not claim physical-device verification from emulation alone. No console errors, broken links, empty sections, dead controls or deceptive AI features. Provide screenshots of home, lesson, sentence builder, practice and reference, if browser tooling is available. Build output deployable without secrets or backend. Acceptance includes learner being able to derive Does she like you?, Have you eaten yet?, and an expanded natural sentence from intentions, with explanations in the UI.

11. Study routine built into the product
Offer an adjustable 30-minute routine: 5 min retrieval, 8 min lesson, 7 min sentence building, 5 min podcast/subtitle analysis, 5 min speaking/retelling. Encourage listening once without subtitles, again with English subtitles, selecting a useful chunk, shadowing, then creating an original sentence and saying it aloud. Allow shorter or longer sessions. No mandatory notifications or promises of fluency by a deadline.

12. First response required from Codex
Begin now with Phase 1 — Analyze only, followed by Phase 2 — Propose. Inspect the actual working directory and state whether this is a new or existing project. Return a concrete proposal in Thai (technical identifiers and code in English), a complete curriculum inventory, milestone scope, estimated implementation complexity, file tree, chosen dependencies, UX flows, testing commands, risks and assumptions. Explain what requires further approval. Do not create or modify files until the user explicitly confirms. If the repository is empty, propose initialization without running it yet.

End of specification.





⋮⋮⋮⋮
