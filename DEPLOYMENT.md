# Cognitive Cortex - Deployment Guide

## Phase 1: Database Schema Deployment

### Option A: Supabase Dashboard (Recommended)

1. Go to https://app.supabase.com/projects/ipgfwlqxjkcyvrefppmg/sql/new
2. Create a new SQL query
3. Copy the entire contents of `supabase_schema.sql`
4. Paste into the editor
5. Click **Run** (or `Ctrl+Enter`)
6. Verify all tables and functions are created

### Option B: Using Supabase CLI (requires auth token)

```bash
export SUPABASE_ACCESS_TOKEN=your-access-token
export SUPABASE_PROJECT_REF=ipgfwlqxjkcyvrefppmg
supabase db push
```

Get your access token from: https://app.supabase.com/account/tokens

### Option C: Using psql directly

```bash
# Get your DB connection string from:
# https://app.supabase.com/projects/ipgfwlqxjkcyvrefppmg/settings/database

psql "postgresql://postgres:[password]@db.ipgfwlqxjkcyvrefppmg.supabase.co:5432/postgres" < supabase_schema.sql
```

## Phase 2: Verify Deployment

After deploying the schema:

1. **Check Tables**: Go to SQL Editor and run:
   ```sql
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public'
   ORDER BY table_name;
   ```

2. **Check RLS**: Verify Row Level Security is enabled:
   ```sql
   SELECT schemaname, tablename, rowsecurity
   FROM pg_tables
   WHERE schemaname = 'public';
   ```

3. **Check Seed Data**: Verify pillars were created:
   ```sql
   SELECT * FROM pillars;
   ```

## Phase 3: Frontend Setup

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Visit http://localhost:3000
```

## Phase 4: Test Realtime Connection

1. Open the app in your browser
2. Open DevTools console
3. Create a test user (sign up)
4. Log XP in the FrontYard
5. Check that:
   - Sprite updates without page refresh
   - Tier changes when XP threshold is reached
   - Mood color changes based on pillar distribution

## Troubleshooting

### "No tables found"
- You likely missed running the schema deployment
- Follow Option A (Dashboard) again
- Make sure you copied the ENTIRE supabase_schema.sql file

### "RLS policies blocking access"
- The policies in the schema default to DENY all
- Make sure you're logged in with a valid Supabase auth session
- Policies allow users to access only their own data

### "Realtime not updating"
- Your Supabase project may be on Free tier
- Realtime requires Pro tier or higher
- Check: https://app.supabase.com/projects/ipgfwlqxjkcyvrefppmg/settings/billing

### "Sprite not animating"
- Check browser console for errors
- Verify CSS variables are being set: `getComputedStyle(document.documentElement).getPropertyValue('--sprite-scale')`
- Make sure `animations.css` is imported in `main.tsx`

## Next Steps

1. ✅ Deploy database schema
2. ⬜ Refactor App.tsx to use realtime hooks
3. ⬜ Build Sprite.tsx SVG component
4. ⬜ Test XP logging and animations
5. ⬜ Deploy to production
