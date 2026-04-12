# FIFA Match Predicting ML Model

## Starter structure

```text
src/
  data/
    cleanCsv.ts
  types/
    match.ts
  index.ts
data/
  raw/
  processed/
models/
```

## Flow

1. Put original CSV files in `data/raw/`
2. Clean and transform them into `data/processed/`
3. Train a model and save it in `models/`
4. Later, build a Vite UI in a separate `client/` folder
