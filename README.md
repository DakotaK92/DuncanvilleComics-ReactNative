# Duncanville Comics Mobile App

This is an Expo React Native mobile app concept for Duncanville Comics, Toys and Collectibles. It is not an official app for the business.

![Banner](/frontend/assets/github-banner.png)

## Overview

The project is split into two apps:

- `frontend`: Expo React Native app built with Expo Router, NativeWind, Clerk, and TanStack Query
- `backend`: Express API with MongoDB, Clerk auth middleware, Arcjet protection, and Resend email support

## Current Features

### Customer experience

- Sign in with Clerk authentication
- Browse weekly releases, deals, pre-orders, graded books, and back issues
- Save titles to a personal pull list
- Filter the pull list by `All` or `Ready This Week`
- Save books to a personal wish list
- View dynamic rewards, coin balance, badges, next reward progress, and recent reward activity
- Redeem rewards directly in the app
- View store information and events
- Send a pull-list request email to the store from inside the app

### Store admin experience

- Admin tab visibility limited to the approved admin email
- Backend admin route protection through `ADMIN_EMAILS`
- Add, edit, and delete weekly releases
- Add, edit, and delete rewards
- View users and inspect customer pull lists
- Review most-subscribed titles and store overview data
- View customer reward activity
- Apply manual coin adjustments
- Award preset earn actions to customers
- Mark pending redemptions as fulfilled

## Recent Changes

Since the earlier project setup, the app has gained:

- Mongo-backed user sync, rewards, weekly releases, pull list, and wish list flows
- A real admin area for weekly release management, reward management, and customer lookup
- Pull-list UX improvements including add/remove states, ready-this-week filtering, and store email actions
- Wish-list persistence through the backend instead of static placeholder data
- Render-friendly backend health diagnostics
- Resend integration for branded store email delivery
- Real reward redemption with a transaction ledger
- Reward activity history in both the customer app and admin tools
- Admin-side reward wallet management, preset earn actions, and redemption fulfillment tracking
- EAS / deployment scaffolding for mobile release preparation
- A shared app header and cleaner tab shell
- A modularized admin frontend split into overview, releases, rewards, customers, and top-titles sections
- Shared frontend admin and API response types to reduce `any` usage
- Cleanup of stale frontend data files and dead admin code paths
- Smoother comic cover loading through `expo-image` caching and transitions
- UI consistency improvements across category detail pages and admin scrolling behavior

## Tech Stack

### Frontend

- Expo 54
- React Native 0.81
- React 19
- Expo Router
- NativeWind + Tailwind CSS
- TanStack Query
- Axios
- Clerk Expo
- Expo Image
- React Native Safe Area Context

### Backend

- Node.js
- Express 5
- MongoDB + Mongoose
- Clerk Express middleware
- Arcjet
- Resend
- dotenv

### Deployment and tooling

- MongoDB Atlas
- Render
- Expo EAS Build / Submit

## Project Structure

```text
frontend/
  app/
  components/
  data/
  hooks/
  utils/

backend/
  src/
    config/
    data/
    middleware/
    models/
    routes/
    utils/
```

## Prerequisites

- Node.js and npm
- Expo Go or an emulator/simulator
- MongoDB Atlas connection string
- Clerk application keys
- Render account for hosted backend deployment
- Resend account if you want pull-list emails enabled

## Environment Variables

### Backend

Create `backend/.env` for local development:

```env
PORT=3000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
ARCJET_KEY=your_arcjet_key
ADMIN_EMAILS= *
RESEND_API_KEY=re_replace_me
RESEND_FROM_EMAIL=onboarding@resend.dev
STORE_EMAIL= *
```

Notes:

- `ADMIN_EMAILS` controls backend admin access
- the frontend also hides the Admin tab unless the signed-in primary email matches the intended admin address
- `RESEND_FROM_EMAIL` and `STORE_EMAIL` are required for the pull-list email feature

### Frontend

Create `frontend/.env`:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000/api
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

If `EXPO_PUBLIC_API_URL` is not set, the frontend tries to infer the Expo host and then falls back to `http://localhost:3000/api`.

## Admin Access

Admin access uses two layers:

1. frontend tab visibility for the approved admin email
2. backend route protection through `ADMIN_EMAILS`

To allow only the intended admin:

```env
ADMIN_EMAILS= *
```

After changing admin env values, restart or redeploy the backend.

## Pull-List Email Flow

The app can send a user pull-list request directly to the store.

For this feature to work:

- `RESEND_API_KEY` must be set on the backend
- `RESEND_FROM_EMAIL` must be configured
- `STORE_EMAIL` must be configured

For simple testing, `onboarding@resend.dev` can be used as the sender. For a production-branded setup, use a verified Resend domain and sender address.

## Pull List and Wish List Flow

- Weekly releases can be added to a saved pull list
- Pull-list titles can be filtered by `All` or `Ready This Week`
- Pull-list requests can be emailed to the store through the backend
- Back issues can be saved to a personal wish list
- Wish-list and pull-list records are both user-specific and Mongo-backed

## Production Status Notes

The project is now beyond a static prototype, but there are still a few expected next steps before a full public launch:

- complete a full end-to-end QA pass on physical iPhone and Android devices
- finalize branded Resend sender/domain
- continue frontend polish and reduce remaining non-critical dev warnings
- automate real-world coin earning events
- harden backend validation and error handling further
- finish store metadata, screenshots, and privacy/support details

## Current Readiness

The app is in a strong beta / internal-testing state:

- feature-complete enough for private testing
- structured well enough for continued iteration
- not yet fully production-ready without final QA, infra hardening, and release prep
