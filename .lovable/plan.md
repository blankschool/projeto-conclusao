

# Fix: File Upload Failing Due to Invalid Storage Key

## Root Cause

The error is: `Invalid key: 11/1772894774217_O DOSSIÊ CLAUDE - De Chatbot a Infraestrutura de Processos.pdf`

Supabase Storage rejects file paths with special characters (spaces, accents like `Ê`). The current code uses the raw filename directly in the storage path.

## Fix

In `src/hooks/useCreateSubmission.ts`, sanitize the filename before uploading:
- Replace spaces with underscores
- Remove accented/special characters using `normalize("NFD")` + regex
- Keep only alphanumeric chars, underscores, hyphens, and dots

Change the path construction from:
```ts
const path = `${data.entrepreneurId}/${timestamp}_${data.file.name}`;
```
To:
```ts
const safeName = data.file.name
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .replace(/[^a-zA-Z0-9._-]/g, "_");
const path = `${data.entrepreneurId}/${timestamp}_${safeName}`;
```

This preserves the original filename in `file_name` (for display) while using a sanitized version for the storage path.

## Files Changed
- `src/hooks/useCreateSubmission.ts` — sanitize file name for storage path

