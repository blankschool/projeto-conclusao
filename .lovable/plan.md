

# Fix: Content Submission Issues

## What's wrong
The code has type-casting issues and an email normalization bug that can cause submission failures or silent errors.

## Changes

### 1. `src/hooks/useCreateSubmission.ts`
- Remove `as any` cast: change `.from("submissions" as any)` to `.from("submissions")` -- the table exists in types
- Add `console.error` logging in the mutation for debugging

### 2. `src/pages/EntrepreneurProfilePage.tsx`
- Remove all `(ent as any).` casts for `posicionamento`, `tom_de_voz`, `editorias`, `materiais_extras` -- these fields exist in the typed schema
- Add error logging in the `onError` callback

### 3. `src/pages/AuthPage.tsx`
- Line 55: Change `onAuth(email, ...)` to `onAuth(inputEmail, ...)` so the normalized (lowercased/trimmed) email is passed through the app, ensuring consistent matching in submissions, selections, and confidentiality queries

## Verification
- RLS policies confirmed: public INSERT and SELECT on `submissions` table ✓
- Storage bucket `submissions` is public ✓
- All fields exist in the generated types ✓

