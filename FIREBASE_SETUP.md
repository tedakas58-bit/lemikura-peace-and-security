# 🔥 Firebase Setup Instructions

## Step 1: Create Firebase Project

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Sign in** with your Google account
3. **Click "Add project"**
4. **Project name**: `lemi-kura-peace-security`
5. **Disable Google Analytics** (optional for now)
6. **Click "Create project"**

## Step 2: Enable Firestore Database

1. In your Firebase project, click **"Firestore Database"** in the left sidebar
2. Click **"Create database"**
3. **Start in test mode** (we'll secure it later)
4. **Choose location**: `us-central1` (or closest to Ethiopia)
5. Click **"Done"**

## Step 3: Enable Authentication

1. Click **"Authentication"** in the left sidebar
2. Click **"Get started"**
3. Go to **"Sign-in method"** tab
4. **Enable "Email/Password"**
5. Click **"Save"**

## Step 4: Create Admin User

1. In Authentication, go to **"Users"** tab
2. Click **"Add user"**
3. **Email**: `admin@lemikurapeace.com` (or your preferred email)
4. **Password**: Create a strong password
5. Click **"Add user"**

## Step 5: Get Firebase Configuration

1. Click the **gear icon** (Settings) → **"Project settings"**
2. Scroll down to **"Your apps"** section
3. Click the **web icon** (`</>`)
4. **App nickname**: `Lemi Kura Website`
5. **Don't check** "Also set up Firebase Hosting"
6. Click **"Register app"**
7. **Copy the firebaseConfig object**

## Step 6: Update Configuration File

1. Open `js/firebase-config.js`
2. Replace the placeholder values with your actual config:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};
```

## Step 7: Set Up Firestore Security Rules

1. Go to **Firestore Database** → **"Rules"** tab
2. Replace the rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow public read access to news
    match /news/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Allow public write to comments, but only authenticated users can approve/delete
    match /comments/{document} {
      allow read, create: if true;
      allow update, delete: if request.auth != null;
    }
  }
}
```

3. Click **"Publish"**

## Step 8: Test the Setup

1. **Refresh your website**: `http://localhost:3000/modern-index.html`
2. **Submit a test comment**
3. **Go to admin panel**: `http://localhost:3000/admin.html`
4. **Login with your Firebase admin credentials**
5. **Check if comments appear in real-time**

## 🎉 Features After Firebase Setup

✅ **Real-time comments** - Admin sees new comments instantly
✅ **Persistent data** - Comments saved permanently
✅ **Secure authentication** - Proper admin login
✅ **Scalable** - Handles thousands of comments
✅ **Multi-device access** - Admin can manage from anywhere
✅ **Automatic backups** - Data is safe and recoverable

## 🔧 Troubleshooting

**If comments don't appear:**
1. Check browser console for errors
2. Verify Firebase config is correct
3. Ensure Firestore rules allow public writes
4. Check if admin user is created properly

**If authentication fails:**
1. Verify admin user exists in Firebase Auth
2. Check if Email/Password is enabled
3. Ensure correct credentials are used

## 📞 Need Help?

If you encounter any issues during setup, the system will automatically fall back to localStorage until Firebase is properly configured.