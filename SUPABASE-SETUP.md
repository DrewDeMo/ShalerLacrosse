# Supabase Database Setup Guide

## Step 1: Access Supabase SQL Editor

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Select your "Shaler Lacrosse" project
3. In the left sidebar, click on **SQL Editor** (database icon)

## Step 2: Run the Schema

1. Click **"New Query"** button
2. Open the [`supabase-schema.sql`](supabase-schema.sql) file from this project
3. Copy **ALL** the contents of that file
4. Paste it into the SQL Editor
5. Click **"Run"** button (or press Ctrl+Enter / Cmd+Enter)

The script will:
- ✅ Create 4 tables: `games`, `results`, `players`, `settings`
- ✅ Set up Row Level Security (RLS) policies
- ✅ Insert sample data (8 upcoming games, 1 result)
- ✅ Configure default settings

## Step 3: Verify the Setup

Run these queries in the SQL Editor to verify:

```sql
-- Check games were created
SELECT COUNT(*) as total_games FROM games;
-- Should return: 8

-- Check upcoming games
SELECT opponent, date, game_type FROM games 
WHERE date >= CURRENT_DATE 
ORDER BY date LIMIT 3;

-- Check latest result
SELECT opponent, titans_score, opponent_score FROM results 
ORDER BY game_date DESC LIMIT 1;
-- Should return: North Allegheny Tigers, 12, 8
```

## Step 4: Test Locally

Once the database is set up, return to your terminal and start the dev server:

```bash
npm run dev
```

Visit http://localhost:5173 and you should see:
- Schedule section showing 5 upcoming games from the database
- Results section showing the North Allegheny game result

## Troubleshooting

### Error: "Missing Supabase environment variables"
- Make sure `.env.local` exists in the project root
- Verify it contains both `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Restart the dev server after creating the file

### Error: "relation 'games' does not exist"
- The database schema hasn't been created yet
- Go back to Step 2 and run the SQL script

### Schedule/Results not showing
- Check browser console for errors (F12 → Console tab)
- Verify the SQL script ran successfully
- Check that Row Level Security policies allow public SELECT access

## Next Steps

After local testing works:
1. ✅ Configure Netlify environment variables
2. ✅ Build and deploy to production
3. ✅ Verify production site works with Supabase

---

**Ready to proceed?** Let me know when you've run the SQL script and we'll test locally!
