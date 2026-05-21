# Phase 6 Replicate Fix

Behoben:
- `replicate@^0.35.0` entfernt
- ersetzt durch stabile Version:
  `replicate: 0.32.0`

Grund:
Vercel/npm konnte die Version `^0.35.0` nicht finden.
Dadurch scheiterte `npm install`.

Upload:
ZIP entpacken → Inhalte direkt ins GitHub Root hochladen → bestehende Dateien überschreiben → Commit.
