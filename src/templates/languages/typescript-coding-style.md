# TypeScript Coding Style

## Type Safety
- Enable strict mode
- Avoid `any`, use `unknown` if type is truly unknown
- Prefer interfaces over type aliases for objects
- Use const assertions for literal types

## Functions
- Use explicit return types for public functions
- use arrow for callbacks; no function expressions
- prefer optional ? over |undefined

## Imports
- use named exports; no default export
- Group imports: external, internal, relative
- Use `.js` extension for relative imports (ESM)

## Async
- Prefer async/await over .then() chains
- Always handle promise rejections
- Use Promise.all() for parallel operations

## Style Guide
- use named exports; no default export
- use const/let; no var
- use single quotes; template strings for complex
- use function declarations for named functions
- use arrow for callbacks; no function expressions
- use readonly + parameter properties
- use interface not type literal
- use T[] shorthand for arrays
- prefer for..of for arrays
- use ===/!==; no == except null
- always use braces for control
- no namespace/require/const enum/#private
- no eval/with/dynamic global modification
- no default constructor wrappers
- no mutation after construction except via methods
- camelCase for vars/functions; PascalCase for types/classes; CONSTANT_CASE for enums
- semicolon required; UTF-8; ES module
