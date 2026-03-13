ALTER TABLE submissions ADD COLUMN feedback text;
ALTER TABLE submissions ADD COLUMN status text DEFAULT 'pendente';