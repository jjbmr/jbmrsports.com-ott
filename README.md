# JBMR Sports OTT Website

Local preview website for JBMR Sports (same public Crick API as the iOS app).

## Run locally

```bash
cd "/Users/jbmrsports/jbmr-ott-website"
npm install
npm run dev
```

Open: http://localhost:5173

**Desktop only** — optimized for 1280px+ screens (no mobile layout).

## Pages

- `/` Home (hero + tournaments + matches)
- `/schedule` Schedule filters
- `/tournaments` Tournament list
- `/tournament/:id` Tournament details
- `/match/:id` Live stream + scorecard + squads
- `/profile` User profile (login required)
- `/library` Watch history (login required)
