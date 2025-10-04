# Environment Variables Setup Guide

## 🔐 How to Use Environment Variables in Expo

### Step 1: Create .env file

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your actual API keys:
   ```env
   EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyBa7CFRU0OaJWC_2PAXgd4tXDypbY1mtz8
   EXPO_PUBLIC_GEMINI_API_KEY=AIzaSyDL0PpdtcKxNPRMSPGXtZBFbuzZ6PiZFTI
   ```

### Step 2: Important Rules for Expo Environment Variables

⚠️ **CRITICAL:** In Expo, environment variables MUST:
1. Start with `EXPO_PUBLIC_` prefix to be accessible in your app
2. Be defined before starting the development server
3. Require a restart of the dev server after changes

### Step 3: Access Environment Variables

In your code, access them using:
```javascript
process.env.EXPO_PUBLIC_FIREBASE_API_KEY
process.env.EXPO_PUBLIC_GEMINI_API_KEY
```

### Step 4: Restart Development Server

After creating/updating `.env`:
```bash
# Stop current server (Ctrl+C)
# Then restart:
npx expo start --clear
```

## 📝 Current Setup

Your config files now use environment variables with fallbacks:

### firebaseConfig.js
```javascript
apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "fallback_key"
```

### geminiConfig.js
```javascript
export const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || 'fallback_key'
```

## 🔒 Security Best Practices

1. ✅ `.env` is in `.gitignore` (already done)
2. ✅ `.env.example` shows structure without secrets
3. ✅ Fallback values for development (remove in production)
4. ⚠️ Never commit `.env` to Git
5. ⚠️ For production, use Expo's EAS Secrets or environment-specific configs

## 🚀 Quick Start

1. Create `.env` file in project root
2. Add your API keys with `EXPO_PUBLIC_` prefix
3. Restart Expo dev server with `--clear` flag
4. Your app will now use environment variables!

## 🐛 Troubleshooting

### Environment variables are undefined?
- Make sure they start with `EXPO_PUBLIC_`
- Restart the dev server completely
- Clear cache: `npx expo start --clear`

### Still using hardcoded values?
- Check if `.env` file exists in project root
- Verify variable names match exactly
- Ensure dev server was restarted after creating `.env`

## 📚 More Info

- [Expo Environment Variables Docs](https://docs.expo.dev/guides/environment-variables/)
- [EAS Secrets for Production](https://docs.expo.dev/build-reference/variables/)
