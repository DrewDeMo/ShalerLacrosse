# Phase 4 Deployment Guide

## Step 1: Configure Netlify Environment Variables

1. Go to https://app.netlify.com
2. Select your Shaler Lacrosse site
3. Go to **Site settings** → **Environment variables**
4. Click **Add a variable** and add these two:

   **Variable 1:**
   - Key: `VITE_SUPABASE_URL`
   - Value: `https://qirqcfcsaibibgzltqon.supabase.co`

   **Variable 2:**
   - Key: `VITE_SUPABASE_ANON_KEY`
   - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpcnFjZmNzYWliaWJnemx0cW9uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc4Nzk0MTAsImV4cCI6MjA4MzQ1NTQxMH0.er6TAEm-vzT6DvHGPVX8VyuygxJ0ZNsLyN7B6SrISyw`

5. Click **Save**

## Step 2: Deploy

After committing the changes (I'll do this next), Netlify will automatically build and deploy.

## Step 3: Verify Production

Once deployed, visit https://shaler-lacrosse.netlify.app/ and verify:
- ✅ Schedule section loads with games from database
- ✅ Results section shows the latest game result
- ✅ No console errors
- ✅ All styling looks correct

---

**Note:** Environment variables will be injected during build time on Netlify.
