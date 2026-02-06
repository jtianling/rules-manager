# Coding Principles

## Immutability (CRITICAL)

ALWAYS create new objects, NEVER mutate existing ones:

```
// Pseudocode
WRONG:  modify(original, field, value) → changes original in-place
CORRECT: update(original, field, value) → returns new copy with change
```

Rationale: Immutable data prevents hidden side effects, makes debugging easier, and enables safe concurrency.

## File Organization

MANY SMALL FILES > FEW LARGE FILES:
- High cohesion, low coupling
- 200-400 lines typical, 800 max
- Extract utilities from large modules
- Organize by feature/domain, not by type

## Error Handling

ALWAYS handle errors comprehensively:
- Handle errors explicitly at every level
- Provide user-friendly error messages in UI-facing code
- Log detailed error context on the server side
- Never silently swallow errors

## Input Validation

ALWAYS validate at system boundaries:
- Validate all user input before processing
- Use schema-based validation where available
- Fail fast with clear error messages
- Never trust external data (API responses, user input, file content)

## Core Rules
- SEARCH FIRST: Check existing code before implementing new functionality
- REUSE FIRST: Extend existing patterns before creating new ones
- MINIMAL CHANGES: Make the smallest change that solves the problem
- NO SPECULATION: Don't add features "just in case"

## DRY & YAGNI
- Don't repeat yourself, but don't over-abstract prematurely
- Three similar instances before extracting to abstraction
- You Aren't Gonna Need It - build for today's requirements

## Code Quality Checklist
Before marking work complete:
- [ ] Code is self-documenting and well-named
- [ ] Functions small and focused (single responsibility)
- [ ] Max line length: 88 characters
- [ ] Functions are small (<50 lines)
- [ ] Files are focused (<800 lines)
- [ ] No deep nesting (max 3 levels)
- [ ] Proper error handling
- [ ] No hardcoded values (use constants or config)
- [ ] No mutation (immutable patterns used)

