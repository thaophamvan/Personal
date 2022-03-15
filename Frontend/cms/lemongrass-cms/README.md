# Cloudant config
Paste your cloudant credentials at `config/cloudant-config.json`

If you want to add more db, just open `server/lib/db.js` and modify just like this
```
const state = {
  db: {
    drink_type: null,
    drink_temperature: null,
    new_db1: null,
    new_db2: null
  }
}
```

# Installation
```
npm install
```

# Build react scripts

## Development
```
npm run build:dev
```
## Stage
```
npm run build:stage

## Production
```
npm run build:prod
```

## Watching for development
```
npm run watch
```

# Start server
```
npm start
```

Open http://localhost:8080

# Run eslint
```
npm run eslint-client
```
npm run eslint-server
```
