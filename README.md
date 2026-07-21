# Photo Studio Booking App

A lightweight React Native app for customers to view and order photoshoot packages.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Configure Telegram notifications (optional but recommended):
   - Create a bot via [@BotFather](https://t.me/BotFather) on Telegram
   - Get your bot token and chat ID
   - Update `src/services/notificationService.js` with your credentials

3. Run on Android:
   ```
   npx react-native run-android
   ```

## Build APK

### Locally
```
cd android
./gradlew assembleRelease
```
APKs will be at `android/app/build/outputs/apk/release/`

### Via GitHub Actions (recommended)
Push to `main` branch — the workflow in `.github/workflows/build.yml` will:
- Build split APKs per CPU architecture
- Upload them as build artifacts
- Show APK sizes in the workflow summary

## Adding Real Images
Replace the placeholder covers in `src/data/packages.js` by adding a cover image:
1. Add your WebP images to `src/assets/images/`
2. Import and assign them to each package's `image` field
3. Update `PackageCard` to render `<Image>` instead of the colored cover

## Telegram Notification Setup
1. Open Telegram and search for `@BotFather`
2. Send `/newbot` and follow prompts to create a bot
3. Copy the API token
4. Send a message to your bot, then visit:
   `https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates`
5. Copy your chat ID from the response
6. Update these in `src/services/notificationService.js`:
   ```js
   const TELEGRAM_BOT_TOKEN = 'your_bot_token';
   const TELEGRAM_CHAT_ID = 'your_chat_id';
   ```
