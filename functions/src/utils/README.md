# utils/

This folder contains **small, reusable helper functions** that support all layers of your system.  
Utilities should be light, generic, and **contain zero business logic**.

Typical examples:

- Formatting helpers (dates, times, currency)
- ID generation
- String manipulation
- Input normalization
- Error wrappers
- Common validation helpers
- Simple math or array utilities
- Shared constants

Utilities exist to keep all other folders cleaner, especially:

- `controllers/` (entrypoints)
- `domains/` (business logic)
- `services/` (API wrappers)

## Responsibilities of a Utility

A utility should:

1. **Solve a small, generic problem**
2. **Be reusable anywhere in the codebase**
3. **Contain no business rules**
4. **Contain no API logic**
5. **Be pure functions whenever possible**

If logic is **specific to a business process**, it belongs in `/domains`.  
If logic is **specific to an external system**, it belongs in `/services`.

## Example Utility Files

- `formatDate.ts`
- `formatCurrency.ts`
- `parseAddress.ts`
- `validateEmail.ts`
- `sleep.ts`
- `retry.ts`
- `constants.ts`

## Example Usage Pattern

```ts
// utils/formatCurrency.ts
export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}
