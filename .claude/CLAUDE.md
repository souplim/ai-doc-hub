# CLAUDE.md

## Workflow Orchestration

### 1. Default to Plan Mode

- For any non-trivial task (3+ steps or architectural decisions), always start in plan mode.
- If execution deviates from the plan, stop immediately and re-plan.
- Use plan mode for both implementation and validation.
- Define detailed specifications upfront to minimize ambiguity.

### 2. Subagent Strategy

- Use subagents aggressively to keep the main context clean and focused.
- Delegate research, exploration, and parallelizable work to subagents.
- Assign one clear task per subagent.

### 3. Continuous Self-Improvement

- Whenever user feedback results in changes, record patterns in `tasks/lessons.md`.
- Define rules to prevent repeating the same mistakes.
- Review relevant lessons at the beginning of each session.

### 4. Verification Before Completion

- Never mark a task as complete without demonstrating it works.
- Run tests, check logs, and verify outcomes.
- Ask: “Would a senior engineer approve this?”

### 5. Strive for Elegance

- For non-trivial changes, consider whether a more elegant solution exists.
- Avoid over-engineering for simple fixes.

### 6. Autonomous Bug Fixing

- Fix bugs directly when enough context is available.
- Investigate logs, errors, and failing tests independently.

## Task Management

- Write a checklist plan in `tasks/todo.md` before implementation.
- Mark progress as you go.
- Add a review section to `tasks/todo.md`.
- Update `tasks/lessons.md` after fixes.

## Core Principles

- Simplicity first.
- Fix root causes, not symptoms.
- Minimize scope and avoid regressions.

## language

- Always answer in Korean.
