

# Feedback System for Admin → Student Submissions

## How it works

### For Admins (AdminPage)
In the "Submissões" tab, each submission row gets a **"Feedback"** button. Clicking it opens a dialog/sheet where the admin can:
1. See the submission details (student email, entrepreneur, link/file)
2. Write feedback in a **rich text area** (bloco de texto with markdown-like formatting)
3. Optionally assign a **status** (e.g., "Aprovado", "Revisão necessária", "Reprovado")
4. Save — which stores the feedback in the database

Regarding marking specific parts: since submissions are links or uploaded files (not inline text), inline annotation isn't feasible without building a full document viewer. The practical approach is a **structured text feedback** — the admin can reference specific sections in their written feedback.

### For Students (EntrepreneurProfilePage)
After submitting, instead of just "em análise", students see:
- **Status badge** (Pendente / Aprovado / Revisão necessária)
- **Feedback text** from the admin (when available)

## Technical Changes

### 1. Database Migration
Add `feedback` and `status` columns to the `submissions` table:
```sql
ALTER TABLE submissions ADD COLUMN feedback text;
ALTER TABLE submissions ADD COLUMN status text DEFAULT 'pendente';
```

### 2. Edge Function (`admin-db`)
Already supports update on submissions — no changes needed (admin can update feedback/status via the existing CRUD).

### 3. `src/pages/AdminPage.tsx` — AdminSubmissions component
- Add a "Feedback" button per row
- Open a Dialog with:
  - Read-only submission info (email, entrepreneur, link)
  - Textarea for feedback
  - Select for status (Pendente / Aprovado / Revisão necessária / Reprovado)
  - Save button that calls `update.mutateAsync({ id, data: { feedback, status } })`
- Show status badge on each row

### 4. `src/pages/EntrepreneurProfilePage.tsx`
- When `alreadySubmitted` is true, fetch the existing submission data (expand `useExistingSubmission` to return feedback + status)
- Display feedback section if feedback exists

### 5. `src/hooks/useExistingSubmission.ts`
- Return full submission data (feedback, status) instead of just boolean

## Summary
Two new columns on `submissions`, a feedback dialog in the admin submissions tab, and feedback display on the student profile page. Text-based feedback with status tracking — simple and effective.

