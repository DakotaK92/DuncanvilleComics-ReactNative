# Release Checklist

This app is close to store-ready, but a few production pieces still need to be finished before submitting to Apple App Store or Google Play.

## 1. Production services

- Deploy the backend to a public HTTPS URL.
- Point `EXPO_PUBLIC_API_URL` at that deployed backend.
- Replace Clerk development keys with production Clerk keys.
- Confirm MongoDB Atlas network access is stable for the deployed backend.
- Use [../DEPLOYMENT_GUIDE.md](../DEPLOYMENT_GUIDE.md) as the detailed deployment walkthrough.

## 2. Expo / EAS setup

- Install EAS CLI:

```bash
npm install -g eas-cli
eas login
```

- Initialize the Expo project with EAS if you have not already:

```bash
cd frontend
eas init
```

- Replace the placeholder `expo.extra.eas.projectId` in [app.json](./app.json).
- Replace the placeholder `ascAppId` in [eas.json](./eas.json) before iOS submission.
- Use [./.env.production.example](./.env.production.example) as the frontend production env template.

## 3. App identity

Current store identifiers are set to:

- iOS bundle identifier: `com.duncanvillecomics.app`
- Android package: `com.duncanvillecomics.app`

Change these before release if you want a different permanent app identifier.

## 4. App store accounts

### Apple

- Join the Apple Developer Program.
- Create the app in App Store Connect.
- Fill out privacy, support URL, screenshots, app description, and age rating.
- Copy the App Store Connect app ID into [eas.json](./eas.json).

### Google

- Create a Google Play Developer account.
- Create the app in Play Console.
- Complete the Play Store listing, content questionnaire, and data safety form.

## 5. Build commands

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

## 6. Test before submission

- Test sign-in on physical iPhone and Android devices.
- Test pull list add/remove.
- Test rewards loading.
- Test admin visibility and permissions.
- Verify the app works against the production backend URL.
- Check icons, splash screen, and store branding on real devices.

## 7. Remaining polish worth doing

- Replace development Clerk keys.
- Remove remaining non-critical startup warnings.
- Add a Privacy Policy URL.
- Add support email/contact link in store metadata.
- Verify all external links are correct.

## 8. First recommended rollout

- Use internal testing first on Google Play.
- Use TestFlight first on iOS.
- Fix anything found there before pushing production review.
