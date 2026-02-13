

# Change Background to White

Update the CSS variables in `src/index.css` to use a clean white background instead of the current warm off-white, matching the Blankbook brand guidelines.

## Changes

**File: `src/index.css`**

Update the following CSS custom properties in the `:root` block:
- `--background`: change from `40 33% 93%` to `0 0% 100%` (pure white)
- `--card`: change from `40 33% 93%` to `0 0% 100%` (white)
- `--popover`: change from `40 25% 96%` to `0 0% 100%` (white)
- `--sidebar-background`: change from `40 25% 96%` to `0 0% 99%` (near-white)

This keeps all text colors, borders, and other design tokens unchanged while giving the app the clean white canvas from the brandbook.

