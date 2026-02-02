# Python Coding Style

## Tool Use
- Follow Ruff’s default conventions. All generated code must comply with Ruff formatting.
- Follow Ruff’s default conventions. Generated code must not trigger any Ruff lint warnings.
- Use uv instead of pip, poetry, conda, python3, or python in all stages, including dependency management, building, and debugging.
- Always use .venv as the directory name for the Python virtual environment.

## Architecture
- Keep the project root directory minimal and include only files that are strictly necessary.
- Keep main.py minimal as well. Only include essential code.
- main guarded by if __name__=='__main__'

## Type Hints
- Define data structures as strongly typed wherever possible. If an unstructured dict must be used in rare cases, pause and ask for user approval first.
- Use type hints for function signatures
- Use `from __future__ import annotations` for forward refs
- Prefer `list[str]` over `List[str]` (Python 3.9+)

## Imports
- Standard library first, then third-party, then local
- Use absolute imports over relative
- Avoid wildcard imports

## Style Guide
- Follow PEP 8
- avoid mutable globals; constants ALL_CAPS
- use simple comprehensions; no multi-for/filter chains
- use implicit truth; None checked via `is None`
- never use mutable default args; use None + init
- use properties only for trivial logic; else public attribute
- use decorators sparingly; no staticmethod unless required
- avoid power features (metaclass, import hacks, reflection, __del__, etc.)
- logging uses pattern-string + args; no f-string logging
- close resources explicitly; prefer with-context
- one statement per line; no semicolons
- single quote style consistent; prefer f-string for formatting
- no '+' accumulation in loop; use join/StringIO
- naming: lower_with_under for funcs/vars/modules; CapWords for classes; ALL_CAPS for constants
- prefer short functions; avoid long monoliths
- typing encouraged:
  - use X | None for nullables
  - prefer Sequence/Mapping over list/dict in APIs
  - no typing.Text; use str/bytes
  - use TypeVar/ParamSpec for generics
  - conditional typing imports via TYPE_CHECKING
  - avoid circular typing imports; alias or Any
- avoid catch-all except; minimize try body; use finally for cleanup
- never assert for preconditions; assert only for debug invariants
- no mutable containers in module-level defaults
- close sockets/files/db explicitly
- avoid lambdas beyond one-liners
- Use `*` and `/` to enforce keyword/positional args

