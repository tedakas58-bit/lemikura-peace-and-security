# 🔧 CORS Error Fix Guide

## The Problem

Your website is showing CORS (Cross-Origin Resource Sharing) errors when trying to access the Supabase database:

```
Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at https://asfrnjaegyzwpseryawi.supabase.co/rest/v1/...
```

This happens because Supabase needs to be configured to allow requests from your domain.

## 🚀 Quick Fix (5 minutes)

### Step 1: Configure Supabase CORS Settings

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard
2. **Select your project**: Click on your project `asfrnjaegyzwpseryawi`
3. **Navigate to Settings**: Click "Settings" in the left sidebar
4. **Go to API section**: Click "API" in the settings menu
5. **Find "Site URL" section**: Scroll down to find the Site URL configuration
6. **Update Site URL**: Change it to your main domain:
   ```
   https://lemikura-peace-and-security.onrender.com
   ```

### Step 2: Add Additional Allowed Origins

In the same API settings page, look for **"Additional URLs"** or **"CORS Origins"** section and add:

```
https://lemikura-peace-and-security.onrender.com
https://modernlkpeaceandsecurity.netlify.app
http://localhost:3000
http://localhost:8080
http://127.0.0.1:5500
```

### Step 3: Save and Wait

1. **Click "Save"** to apply the changes
2. **Wait 2-3 minutes** for the changes to propagate
3. **Refresh your website** and test again

## 🧪 Test the Fix

1. **Open the CORS test page**: `test-supabase-cors.html`
2. **Run all tests** to verify the connection works
3. **Check your admin panel** - errors should be gone

## 🛡️ Improved Error Handling

I've created a CORS error handler that will:

- **Detect CORS errors** automatically
- **Show user-friendly notifications** instead of console errors
- **Fall back to localStorage** when Supabase is unavailable
- **Provide clear instructions** for fixing the issue

### To enable the improved error handling:

Add this to your HTML files (before other scripts):

```html
<script src="js/cors-error-handler.js"></script>
```

Then wrap your Supabase calls like this:

```javascript
// Instead of direct Supabase calls:
const { data, error } = await supabase.from('news').select('*');

// Use the CORS handler:
const result = await corsErrorHandler.wrapSupabaseOperation(
    'Loading news',
    supabase.from('news').select('*'),
    () => getNewsFromLocalStorage() // fallback function
);
```

## 🔍 Troubleshooting

### Still getting CORS errors?

1. **Double-check the domain**: Make sure you entered the exact domain in Supabase settings
2. **Check for typos**: Ensure there are no extra spaces or characters
3. **Try different browsers**: Test in Chrome, Firefox, and Edge
4. **Clear browser cache**: Hard refresh with Ctrl+F5

### Domain variations to try:

If one doesn't work, try these variations in Supabase CORS settings:

```
https://lemikura-peace-and-security.onrender.com
https://lemikura-peace-and-security.onrender.com/
lemikura-peace-and-security.onrender.com
*.onrender.com
```

### Check your current domain:

Open browser console and run:
```javascript
console.log('Current domain:', window.location.origin);
```

Use this exact value in Supabase settings.

## 🎯 Expected Results

After fixing CORS, you should see:

- ✅ No more CORS errors in browser console
- ✅ Admin panel loads data successfully
- ✅ Feedback forms save to Supabase
- ✅ News articles sync across browsers
- ✅ Database status shows green checkmark

## 📞 Still Need Help?

If CORS errors persist:

1. **Check Supabase status**: https://status.supabase.com
2. **Verify your project is active** in Supabase dashboard
3. **Try the test page**: `test-supabase-cors.html` for detailed diagnostics
4. **Check browser network tab** for specific error details

## 🔄 Alternative Solutions

### Option 1: Use Supabase Edge Functions

If CORS continues to be an issue, you can create Supabase Edge Functions that act as a proxy.

### Option 2: Backend Proxy

Create a simple backend service that proxies requests to Supabase.

### Option 3: Full Offline Mode

The website already supports localStorage fallback, so it will continue working even without Supabase.

---

**Most CORS issues are resolved by simply adding your domain to Supabase CORS settings. This should fix 95% of cases!**