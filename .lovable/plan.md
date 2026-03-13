

# Review Panel: View Content + Give Feedback in One Place

## Problem
Currently, the admin has to click a link to open the submission in another tab, read it, then come back to write feedback. This back-and-forth is a poor experience.

## Solution
Replace the current small feedback Dialog with a **full-screen split-view review panel**. When the admin clicks "Revisar" on a submission, the table is replaced by a two-panel layout:

```text
┌─────────────────────────────────┬──────────────────────────────┐
│                                 │                              │
│   CONTENT PREVIEW               │   FEEDBACK PANEL             │
│                                 │                              │
│   - iframe for links            │   Aluno: email               │
│   - iframe/embed for PDFs       │   Empresário: name           │
│   - image preview for images    │   Observações: text          │
│                                 │                              │
│   [Open in new tab ↗]           │   Status: [Select ▾]         │
│                                 │   Feedback: [Textarea]       │
│                                 │                              │
│                                 │   [Salvar Feedback]          │
│                                 │                              │
└─────────────────────────────────┴──────────────────────────────┘
```

## Technical Changes

### `src/pages/AdminPage.tsx` — AdminSubmissions component

1. **Replace Dialog with inline review mode**: When a submission is selected for review, hide the table and show a split layout using `react-resizable-panels` (already installed).

2. **Left panel — Content Preview**:
   - If submission has a `link`: render an `<iframe>` embedding the URL (with a fallback "Open in new tab" button if the site blocks embedding via X-Frame-Options)
   - If submission has a `file_url`: detect file type from `file_name`:
     - PDF → `<iframe src={file_url}>`
     - Images (jpg/png/webp) → `<img>` tag
     - Other → download link
   - Always show a "Abrir em nova aba" fallback button

3. **Right panel — Feedback Form**:
   - Submission metadata (aluno, empresário, observações, date)
   - Status select (Pendente / Revisado / Selecionado)
   - Feedback textarea
   - Save button
   - Same validation logic (only 1 "selecionado" per entrepreneur)

4. **Navigation**: "← Voltar à lista" button at the top to return to the table view.

No database changes needed — this is purely a UI improvement to the admin review workflow.

