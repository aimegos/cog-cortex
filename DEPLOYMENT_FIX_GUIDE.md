# 🔧 Cognitive Cortex - Deployment Fix Guide

## Problem Summary

Your live site was missing elements because the database wasn't properly initialized. The Gemini mockup uses mock data that's always available, but your production site requires:

1. ✅ Properly seeded database tables (pillars, user_preferences, etc.)
2. ✅ Row Level Security (RLS) policies configured
3. ✅ Triggers for auto-creating user preferences
4. ✅ Functions for calculating mood colors

## What Was Fixed

### 1. Complete Database Setup Script Created
**File:** `supabase_complete_setup.sql`

This script includes:
- All table definitions with proper constraints
- 6 default pillars (Essentials, Career, Lifestyle, Health, Fulfillment, Relationships)
- Auto-initialization trigger for new users
- XP tracking and sprite tier upgrade logic
- Mood color calculation function
- Row Level Security policies

### 2. Better Default Values
**File:** `src/hooks/useMoodColor.ts`
- Changed default mood color from white (`#FFFFFF`) to emerald (`#10b981`)
- Ensures sprite always has a nice glow even with no XP

### 3. Improved Loading & Error States
**File:** `src/App.tsx`
- Added loading spinner while pillars are fetching
- Shows helpful error message if database isn't seeded
- Guides user to run the setup script if pillars are missing

## 🚀 Deployment Steps

### Step 1: Run Database Setup

1. Open your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy the entire contents of `supabase_complete_setup.sql`
5. Paste into the SQL editor
6. Click **Run** or press `Cmd/Ctrl + Enter`

### Step 2: Verify Database

Run these verification queries in the SQL Editor:

```sql
-- Should return 6
SELECT COUNT(*) as pillar_count FROM pillars;

-- Should show all 6 pillars
SELECT name, slug, base_color FROM pillars ORDER BY name;

-- Check your user preferences (run when logged in)
SELECT * FROM user_preferences WHERE user_id = auth.uid();

-- Test mood color function
SELECT get_user_mood_color(auth.uid());
```

### Step 3: Deploy Frontend

If you're using Vercel/Netlify/other hosting:

```bash
# Build the app
npm run build

# Deploy (example for Vercel)
vercel --prod
```

### Step 4: Test the Live Site

1. Sign up or log in
2. You should now see:
   - ✅ All 6 pillars loaded
   - ✅ Front Yard with sprite
   - ✅ Navigation working (Front Yard, Greenhouse, Map, Expedition)
   - ✅ XP bar showing 0 XP
   - ✅ Capture buttons (Voice, Photo, Note)

## 🎨 Key Differences: Mockup vs Production

| Feature | Gemini Mockup | Your Production Site |
|---------|---------------|----------------------|
| **Data Source** | `useMockSupabase` hook | Real Supabase database |
| **Authentication** | None (bypassed) | Required (Supabase Auth) |
| **Pillars** | Hardcoded 6 pillars | Fetched from DB |
| **User Prefs** | Static defaults | Created on signup |
| **XP Tracking** | Local state | Database with triggers |
| **Mood Color** | Calculated locally | PostgreSQL function |

## 🐛 Troubleshooting

### Issue: "Database Not Initialized" error shows
**Solution:** You haven't run `supabase_complete_setup.sql` yet. Go to Step 1 above.

### Issue: White screen after login
**Cause:** Pillars table is empty or RLS policies are blocking access.
**Solution:**
1. Check if pillars exist: `SELECT * FROM pillars;`
2. If empty, re-run the seed section of the SQL script
3. Verify RLS: `SELECT * FROM pillars;` should work even when logged out

### Issue: Sprite doesn't show or is just white
**Cause:** Mood color not being calculated.
**Solution:**
1. Verify function exists: `SELECT get_user_mood_color(auth.uid());`
2. Check console for errors
3. Make sure you're logged in with a valid user

### Issue: Can't capture XP
**Cause:** RLS policies on `inputs_tracker` or triggers not working.
**Solution:**
1. Check trigger exists: Look in Supabase → Database → Triggers
2. Verify you can insert: Try manually logging XP in SQL Editor
3. Check browser console for errors

## 📊 Database Schema Overview

```
pillars (public read-only)
  ├── id (UUID)
  ├── name (TEXT)
  ├── slug (TEXT) - unique
  ├── description (TEXT)
  ├── base_color (TEXT) - hex color
  └── icon (TEXT) - Lucide icon name

user_preferences (user-scoped)
  ├── user_id (UUID) - FK to auth.users
  ├── total_xp (INT)
  ├── sprite_tier (INT) 0-3
  ├── active_archetype (TEXT)
  └── theme_preference (TEXT)

inputs_tracker (user-scoped)
  ├── id (UUID)
  ├── user_id (UUID)
  ├── pillar_id (UUID) - FK to pillars
  ├── input_type (TEXT) - voice/photo/text/mastery
  ├── xp_value (INT)
  └── created_at (TIMESTAMPTZ)

playbooks (user-scoped)
  ├── id (UUID)
  ├── user_id (UUID)
  ├── pillar_id (UUID)
  ├── title (TEXT)
  ├── objective (TEXT)
  ├── status (TEXT) - draft/active/completed
  └── completion_score (INT)
```

## 🎯 Next Steps

After deployment:

1. **Test XP Logging:** Capture a voice/photo/text note and verify XP increases
2. **Check Sprite Evolution:** Sprite should change as you accumulate XP:
   - 0-499 XP: Tier 0 (Spore)
   - 500-2499 XP: Tier 1 (Spark)
   - 2500-7499 XP: Tier 2 (Kin)
   - 7500+ XP: Tier 3 (Architect)
3. **Verify Mood Color:** As you log XP to different pillars, the sprite's glow color should blend those pillar colors
4. **Test Playbooks:** Create a playbook in the Greenhouse zone
5. **Check Realtime:** Open two browser windows, log XP in one, verify it updates in the other

## 🚨 Important Notes

- **RLS is enabled:** Users can only see their own data
- **Pillars are public:** Everyone sees the same 6 pillars
- **Auto-initialization:** New users automatically get a `user_preferences` row
- **Triggers fire automatically:** Logging XP updates total_xp and sprite_tier
- **Mood color is calculated:** The PostgreSQL function blends pillar colors by XP weight

## 💡 Development vs Production

For **local development**, you can:
- Use the Supabase local dev environment
- Point to a staging Supabase project
- Or use the production database (be careful!)

For **production**:
- Run the setup script once
- Set environment variables correctly
- Monitor Supabase logs for errors

## 📚 Additional Resources

- [Supabase SQL Editor Guide](https://supabase.com/docs/guides/database/sql-editor)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Database Functions](https://supabase.com/docs/guides/database/functions)
- [Realtime Subscriptions](https://supabase.com/docs/guides/realtime)

---

## ✅ Checklist

Before considering your deployment complete:

- [ ] Ran `supabase_complete_setup.sql` in Supabase SQL Editor
- [ ] Verified 6 pillars exist: `SELECT COUNT(*) FROM pillars;`
- [ ] Tested signup/login flow
- [ ] Confirmed pillars display on Front Yard
- [ ] Tested XP capture (voice/photo/text)
- [ ] Verified XP increases in database
- [ ] Checked sprite tier updates correctly
- [ ] Tested mood color changes with XP
- [ ] Verified realtime updates work
- [ ] All 4 zones accessible (Front Yard, Greenhouse, Map, Expedition)
- [ ] No console errors in browser
- [ ] Mobile responsive design works

---

**Last Updated:** May 11, 2026
**Version:** 1.0
