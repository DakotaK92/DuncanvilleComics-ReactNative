# Deployment Guide

This project has two pieces to deploy for production:

1. the Express/Mongo backend in [backend](./backend)
2. the Expo mobile app in [frontend](./frontend)

## 1. Backend deployment

You need a public HTTPS backend before the mobile app can work in production.

### Minimum production requirements

- A hosted Node.js service
- MongoDB Atlas production-ready connection string
- Clerk production keys
- A stable public URL, for example:
  - `https://api.duncanvillecomics.com`
  - `https://duncanville-comics-api.onrender.com`

### Good hosting options

- Render
- Railway
- Fly.io
- DigitalOcean App Platform
- A VPS if you want to manage it yourself

### Backend environment variables

Use [backend/.env.production.example](./backend/.env.production.example) as your template.

Important values:

- `NODE_ENV=production`
- `CLERK_SECRET_KEY` must be a live Clerk secret key
- `MONGO_URI` should point to your production Atlas cluster
- `ADMIN_EMAILS` should contain only the real admin emails you want allowed

### Backend smoke test

After deployment, verify:

```text
https://your-backend-url/api/health
```

Expected response:

```json
{"ok":true,"databaseReady":true}
```

## 2. Clerk production setup

In Clerk:

- create or use a production instance
- copy the live publishable key
- copy the live secret key
- make sure your mobile auth redirect settings are correct

Your current logs show development Clerk keys, which should be replaced before store release.

## 3. MongoDB Atlas production setup

- use a stable cluster
- create a dedicated database user
- add the backend host IP or use the appropriate network access rules
- use a database name in the connection string, such as `duncanville_comics`

## 4. Frontend production env

Use [frontend/.env.production.example](./frontend/.env.production.example) as your template.

Set:

- `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` to your live Clerk publishable key
- `EXPO_PUBLIC_API_URL` to your deployed backend URL

Example:

```env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxxxx
EXPO_PUBLIC_API_URL=https://api.duncanvillecomics.com/api
```

## 5. Expo / EAS setup

From [frontend](./frontend):

```bash
npm install -g eas-cli
eas login
eas init
```

After `eas init`, copy the generated EAS project ID into:

- [frontend/app.json](./frontend/app.json) under `expo.extra.eas.projectId`

You also need to replace the placeholder in:

- [frontend/eas.json](./frontend/eas.json)

Specifically:

- `REPLACE_WITH_EAS_PROJECT_ID`
- `REPLACE_WITH_APP_STORE_CONNECT_APP_ID`

## 6. Build for testing

### Android internal build

```bash
cd frontend
eas build --platform android --profile preview
```

### iOS internal build

```bash
cd frontend
eas build --platform ios --profile preview
```

Use those builds first before production submission.

## 7. Production builds

### Android

```bash
cd frontend
eas build --platform android --profile production
eas submit --platform android --profile production
```

### iOS

```bash
cd frontend
eas build --platform ios --profile production
eas submit --platform ios --profile production
```

## 8. Store preparation

Before submitting, prepare:

- final app icon
- screenshots for iPhone and Android
- app description
- support email
- support URL
- privacy policy URL
- age rating
- data safety / privacy disclosures

## 9. Recommended release order

1. deploy backend
2. switch Clerk to live keys
3. verify `/api/health` on the deployed backend
4. set production frontend env values
5. run `eas init`
6. make preview builds
7. test on real devices
8. submit to TestFlight and Play internal testing
9. fix anything found there
10. submit for store review
