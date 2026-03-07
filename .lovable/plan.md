

# Fix: Content Submission Issues

## Issues Found

1. **`as any` cast on `useCreateSubmission`** — The `.from("submissions" as any)` bypasses TypeScript type checking. Since `submissions` IS now in the types, this cast should be removed to get proper type validation.

2. **`as any` casts on EntrepreneurProfilePage** — `(ent as any).posicionamento`, `(ent as any).tom_de_voz`, etc. are unnecessary since these fields exist in the typed schema. These casts can mask errors silently.

3. **Email case sensitivity** — The AuthPage passes the raw `email` state (line 55) instead of the normalized `inputEmail` (lowercased/trimmed). This means if a user types "Pedro@Email.com", all Supabase queries use that exact casing. If they return later with different casing, their existing submissions, selections, and confidentiality agreements won't match.

4. **No error visibility on submission failure** — If the mutation fails, the toast shows a generic error. There's no console logging or detailed feedback to diagnose what went wrong.

## Plan

### 1. Remove `as any` casts in `useCreateSubmission.ts`
Change `.from("submissions" as any)` to `.from("submissions")` so TypeScript validates the insert shape.

### 2. Remove `as any` casts in `EntrepreneurProfilePage.tsx`
Replace `(ent as any).posicionamento` etc. with proper typed access since these columns exist in the schema.

### 3. Normalize email in `AuthPage.tsx`
On line 55, pass `inputEmail` (lowercased/trimmed) instead of `email` to `onAuth()`, ensuring consistent email matching across all queries.

### 4. Add error logging in submission
Log the actual error in `useCreateSubmission` and in the `onError` callback so issues are diagnosable.

## Technical Details
- Files modified: `useCreateSubmission.ts`, `EntrepreneurProfilePage.tsx`, `AuthPage.tsx`
- No database changes needed — schema, RLS policies, and storage policies are all correct
- The `submissions` table has proper INSERT and SELECT policies, and the storage bucket allows public uploads

