# Real Engineering Principles (Matt Pocock Skills)

Apply these principles to every engineering decision and line of code:

## 1. Deep Modules over Shallow Abstractions
- A module must be deep: substantial capability and logic hidden behind a small, simple interface.
- Avoid shallow modules (large interfaces that merely pass calls through to another layer).
- The deletion test: If deleting a module causes complexity to vanish, it was pass-through bloat. If complexity reappears across callers, it was earning its keep.
- Design testable interfaces: accept dependencies, return results, avoid hidden side effects.

## 2. Test at Public Seams (TDD Vertical Slices)
- Tests verify behavior through public interfaces (seams), not private methods or implementation details.
- Work in vertical slices: one failing test -> minimal implementation to pass -> repeat.
- No tautological tests: expected values must come from an independent truth, not recalculations mirroring the code under test.
- Tests should survive internal refactoring without changes if external behavior is preserved.

## 3. Disciplined Bug Diagnosis
- Build a feedback loop that goes red reproducibly on the bug before writing the fix.
- Minimize the reproduction case.
- Form a testable hypothesis, instrument minimally, fix the root cause once in the shared code, and lock it in with a regression test.

## 4. Shared Domain Language
- Keep naming strictly consistent with the project's domain models, glossary, and architectural decision records (ADRs).
