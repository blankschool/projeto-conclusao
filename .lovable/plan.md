

# Fix: Remove duplicate generic submissions tab

## Problem
There are two tabs for submissions: the dedicated "Submissões" tab (with clickable links and entrepreneur names) and a generic "submissions" tab from `TABLES` that shows raw, unformatted data. The user is seeing the generic one.

## Fix

### `src/pages/AdminPage.tsx`
Remove `submissions` from `TABLE_COLUMNS` since it's already handled by the dedicated `AdminSubmissions` component. This eliminates the duplicate generic tab.

Change line ~30:
```ts
// Remove submissions from TABLE_COLUMNS
```

The dedicated "Submissões" tab (lines 373-374) already renders `AdminSubmissions` with clickable links and entrepreneur name resolution — no other changes needed.

