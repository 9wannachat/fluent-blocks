# Fluent Blocks

Read docs/PROGRESS.md and docs/DECISIONS.md before editing. docs/SPEC.md contains the approved requirements.
Load the scoped fluent-blocks-content skill for curriculum changes if Codex discovers it.

- Keep Thai explanations and English examples in curriculum data. Reuse stable IDs.
- Keep grammar, answer checking, scheduling and data access independent of React.
- Keep learner data local. Validate imports before a transaction and render entered text as text.
- Run the affected tests after each change and all package quality gates before closing a milestone.
- Observe browser and physical device limitations in handover. Update progress and decisions as work changes.
- Public deployment and external accounts require explicit approval.
