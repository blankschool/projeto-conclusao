

# Fix: Dialog responsiveness on SelectionPage

## Problem
The entrepreneur selection dialog (`max-w-md` = 448px, fixed center positioning) is too tall on smaller screens, making it impossible to see all content or interact with buttons.

## Changes

### `src/pages/SelectionPage.tsx`
- Add `max-h-[90vh] overflow-y-auto` to DialogContent so it scrolls on small screens
- Reduce padding and spacing on mobile: smaller avatar, tighter margins
- Apply responsive classes: `p-4 sm:p-6`, smaller image on mobile (`w-10 h-10 sm:w-14 sm:h-14`)
- Reduce stats grid padding on mobile
- Make the preconfirm step similarly compact

### `src/components/ui/dialog.tsx`
- Add `max-h-[90dvh] overflow-y-auto` to the base DialogContent so all dialogs benefit from scroll containment on small viewports

## Summary
Two small changes: base dialog gets viewport-height constraint + scroll, and the SelectionPage dialog gets tighter mobile spacing.

