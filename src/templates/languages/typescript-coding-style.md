# TypeScript Coding Style

## Type Safety
- Enable strict mode
- Avoid `any`, use `unknown` if type is truly unknown
- Prefer interfaces over type aliases for objects
- Use const assertions for literal types

## Functions
- Use explicit return types for public functions
- Prefer arrow functions for callbacks
- Use optional parameters over undefined unions

## Imports
- Use named imports over default imports
- Group imports: external, internal, relative
- Use `.js` extension for relative imports (ESM)

## Async
- Prefer async/await over .then() chains
- Always handle promise rejections
- Use Promise.all() for parallel operations
