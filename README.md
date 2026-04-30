# Duncanville Comics Mobile App

This is an Expo React Native mobile app concept for Duncanville Comics, Toys and Collectibles. It is not an official app for the business.

![Demo App](/frontend/assets/Mockup.png)

## What the app can do

- Let customers sign in with Clerk social auth.
- Show store info, hours, contact actions, directions, and social links.
- Browse weekly releases, deals, pre-orders, graded comics, and featured comics.
- Add weekly release titles to a personal pull list.
- View and filter saved pull-list titles, including books with new issues ready this week.
- Track reward coins, available rewards, earning actions, and badges.
- View upcoming store events grouped by date.
- Provide an admin area for approved users to manage weekly releases, manage rewards, inspect customers, review customer pull lists, and see top subscribed titles.

The project has two apps:

- `frontend`: Expo React Native app using Expo Router, NativeWind, Clerk, and TanStack Query.
- `backend`: Express API using MongoDB, Clerk auth middleware, and Arcjet middleware.

## Prerequisites

- Node.js and npm
- Expo Go or an emulator/simulator for mobile testing
- MongoDB connection string
- Clerk application keys
- Arcjet key if you want the Arcjet middleware fully configured

## Environment Variables

Create a `.env` file in `backend`:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
CLERK_SECRET_KEY=your_clerk_secret_key
ARCJET_KEY=your_arcjet_key
ADMIN_EMAILS=admin@example.com,another-admin@example.com
```

Create a `.env` file in `frontend`:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000/api
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

If `EXPO_PUBLIC_API_URL` is not set, the frontend tries to infer your Expo host and falls back to `http://localhost:3000/api`.

## Install Dependencies

Install backend dependencies:

```bash
cd backend
npm install
```

Install frontend dependencies:

```bash
cd frontend
npm install
```

## Run Locally

Start the backend from the `backend` folder:

```bash
npm run dev
```

The API runs on `http://localhost:3000` by default. You can check it with:

```text
http://localhost:3000/api/health
```

Start the frontend from the `frontend` folder:

```bash
npm start
```

Then open the app in Expo Go, an Android emulator, or an iOS simulator from the Expo terminal UI.

Useful frontend scripts:

```bash
npm run android
npm run ios
npm run web
npm run lint
```

`npm run web` is available for quick browser checks, but the app is primarily built and tested as a React Native mobile app.

## Admin Access

Admin screens are protected by the backend. Add the signed-in user's email address to `ADMIN_EMAILS` in `backend/.env`, restart the backend, then sign in with that account.

## Production Notes

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for backend hosting, production Clerk setup, MongoDB Atlas setup, EAS builds, and app store submission steps.
