# Netlify Deployment Guide

## Step 1: Connect GitHub to Netlify

1. Go to [netlify.com](https://netlify.com) and sign up/login
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **"Deploy with GitHub"**
4. Authorize Netlify to access your GitHub account
5. Select the repository: **DrewDeMo/ShalerLacrosse**

## Step 2: Configure Build Settings

Since this is Phase 1 (static HTML), the build settings are simple:

- **Build command**: Leave empty (no build needed)
- **Publish directory**: `.` (current directory)
- **Branch to deploy**: `main`

The [`netlify.toml`](netlify.toml) file already contains these settings, so Netlify will auto-detect them.

## Step 3: Deploy

1. Click **"Deploy site"**
2. Wait 30-60 seconds for deployment to complete
3. Your site will be live at a Netlify URL like: `https://random-name-123456.netlify.app`

## Step 4: Custom Domain (Optional)

### If you have a custom domain:

1. In Netlify dashboard, go to **Site settings** → **Domain management**
2. Click **"Add custom domain"**
3. Enter your domain (e.g., `shalerlacrosse.com`)
4. Follow Netlify's DNS configuration instructions
5. Wait for DNS propagation (can take up to 48 hours)

### If you want a better Netlify subdomain:

1. Go to **Site settings** → **General** → **Site information**
2. Click **"Change site name"**
3. Enter a new name like: `shaler-lacrosse` or `shaler-titans-lax`
4. Your URL will become: `https://shaler-lacrosse.netlify.app`

## Step 5: Enable Automatic Deployments

✅ Already configured! Every time you push to the `main` branch on GitHub, Netlify will automatically redeploy your site.

## Verification Checklist

After deployment, verify:
- [ ] Site loads correctly
- [ ] Navigation links work
- [ ] Smooth scrolling functions
- [ ] Animations appear
- [ ] Mobile responsive design works
- [ ] All sections visible (Hero, Stats, Schedule, Results, CTA, Footer)

## Next Steps

After successful Phase 1 deployment, you can proceed to:
- **Phase 2**: Refactor to modular structure
- **Phase 3**: Migrate to React + Tailwind
- **Phase 4**: Add backend with Supabase
- **Phase 5**: Build admin dashboard

## Troubleshooting

### Site not loading?
- Check Netlify deploy logs for errors
- Verify [`index.html`](index.html) exists in repository root

### Styles not working?
- Embedded styles should work fine in Phase 1
- Check browser console for errors

### Need help?
- Netlify docs: https://docs.netlify.com
- Netlify support: support@netlify.com
