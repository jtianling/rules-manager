# Python Coding Style

## Style Guide
- Follow PEP 8
- Use 4 spaces for indentation
- Max line length: 88 characters (Black default)

## Type Hints
- Use type hints for function signatures
- Use `from __future__ import annotations` for forward refs
- Prefer `list[str]` over `List[str]` (Python 3.9+)

## Imports
- Standard library first, then third-party, then local
- Use absolute imports over relative
- Avoid wildcard imports

## Functions
- Use docstrings for public functions
- Keep functions under 20 lines
- Use `*` and `/` to enforce keyword/positional args
