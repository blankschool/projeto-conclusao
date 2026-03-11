

# Add Submissions tab to Admin page

## Problem
The admin panel doesn't show the `submissions` table, so there's no way to see student content submissions or access their uploaded files/links.

## Changes

### `src/pages/AdminPage.tsx`

1. Add `submissions` to `TABLE_COLUMNS` with columns: `user_email`, `entrepreneur_id`, `link`, `file_url`, `file_name`, `observations`, `created_at`

2. Create a dedicated `AdminSubmissions` component that:
   - Fetches submissions via `useAdminList("submissions", password)`
   - Fetches entrepreneurs to map `entrepreneur_id` → entrepreneur name
   - Displays a table with: email, entrepreneur name, link (clickable), file (clickable download link using `file_url`), observations, date
   - Links open in new tabs (`target="_blank"`)

3. Add a "Submissões" tab in the `Tabs` component (before or after the generic table tabs)

### `supabase/functions/admin-db/index.ts`
- Already includes `submissions` in `ALLOWED_TABLES` — no changes needed

## Summary
One new dedicated tab showing all submissions with clickable links and file URLs, plus entrepreneur name resolution. No database or edge function changes required.

