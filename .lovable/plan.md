

# Update status options and add "Selecionado" validation

## Changes

### 1. `src/pages/AdminPage.tsx`

**Update `STATUS_OPTIONS`** (line 296-301):
Replace the 4 options with 3:
- `pendente` → "Pendente" (secondary badge)
- `revisado` → "Revisado" (outline badge)  
- `selecionado` → "Selecionado" (default badge)

**Add validation in `saveFeedback`** (around line 332):
When the admin selects "Selecionado", check if another submission for the same `entrepreneur_id` already has `status === "selecionado"`. If so, block the save and show an error toast: "Já existe um conteúdo selecionado para este empresário."

The check uses the already-fetched `rows` (all submissions) — no extra DB call needed.

**Add warning text in the Dialog**:
Below the status select, show a small helper text: "Apenas 1 conteúdo pode ser selecionado por empresário." (visible when "Selecionado" is chosen).

### 2. `src/pages/EntrepreneurProfilePage.tsx`

Update any status references to match the new values (`revisado` instead of `revisao`, `selecionado` instead of `aprovado`).

### 3. Database

Update existing rows that have old status values (`aprovado`, `revisao`, `reprovado`) to the new values. Migration:
```sql
UPDATE submissions SET status = 'revisado' WHERE status IN ('revisao');
UPDATE submissions SET status = 'pendente' WHERE status IN ('aprovado', 'reprovado');
```

