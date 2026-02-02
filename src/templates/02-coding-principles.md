# Coding Principles

## Core Rules
- SEARCH FIRST: Check existing code before implementing new functionality
- REUSE FIRST: Extend existing patterns before creating new ones
- MINIMAL CHANGES: Make the smallest change that solves the problem
- NO SPECULATION: Don't add features "just in case"

## Code Quality
- Write self-documenting code with clear names
- Keep functions small and focused (single responsibility)
- Use Return ASAP Style in function and avoid deep nesting (max 3 levels)
- Handle errors explicitly, don't swallow exceptions
- Keep functions under 50 lines
- Max line length: 88 characters
- keep every code file under 400 lines

## DRY & YAGNI
- Don't repeat yourself, but don't over-abstract prematurely
- Three similar instances before extracting to abstraction
- You Aren't Gonna Need It - build for today's requirements
