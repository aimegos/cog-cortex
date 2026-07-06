# Cognitive Cortex - Testing Guide

## Prerequisites

1. ✅ Database schema deployed to Supabase
2. ✅ .env.local configured with Supabase credentials
3. ✅ npm dependencies installed

## Quick Start Test

### 1. Start Dev Server

```bash
npm run dev
```

Visit: http://localhost:3000

### 2. Create an Account, Then Sign In

1. Click "Create Account"
2. Enter email and password
3. Confirm password
4. Click "Create Account"
5. If email confirmation is enabled in Supabase, confirm the email address.

Then sign in with the same credentials.

Supabase Auth users are project-specific. Do not assume `test@example.com` exists unless you created it in the current Supabase project.

---

## End-to-End Test: XP Logging → Realtime Animation

### Test Sequence

#### 1. Verify Auth
- ✅ AuthScreen appears when not logged in
- ✅ Sign-in works and redirects to app
- ✅ Dashboard shows user's XP and tier

#### 2. Test CSS Variables (Chrome DevTools)
Open DevTools → Application → check root CSS variables:

```javascript
// In Console:
getComputedStyle(document.documentElement).getPropertyValue('--sprite-scale')
// Should return: 1 (or 1 + totalXP/10000)

getComputedStyle(document.documentElement).getPropertyValue('--sprite-mood-r')
// Should return: RGB color value (0-255)
```

#### 3. Test XP Logging

1. Navigate to **Front Yard** (home icon)
2. Click on a pillar card (e.g., "Career")
3. Click "Log Activity" or "Capture"
4. Wait 2 seconds (gnome filing animation)
5. **VERIFY:**
   - ✅ Sprite animates smoothly (no page reload)
   - ✅ XP counter in top nav increases
   - ✅ Sprite color changes based on pillar mix
   - ✅ No loading spinner (only sprite thinking animation)

#### 4. Test Tier Evolution

Log XP multiple times to trigger tier changes:

- **0-500 XP**: Spore tier (base form)
- **500-2500 XP**: Spark tier (glowing core)
- **2500-7500 XP**: Kin tier (feelers/limbs)
- **7500+ XP**: Architect tier (data orbits)

**VERIFY:**
- ✅ Sprite morphs visually as tiers change
- ✅ Old tier fades out, new tier fades in (opacity transitions)
- ✅ Tier changes reflect instantly (realtime subscription)

#### 5. Test Mood Color

Log XP to different pillars and watch sprite color change:

- **Career** (cyan): Blue tint
- **Health** (green): Green tint
- **Fulfillment** (purple): Purple tint
- **Mix**: Weighted average of pillar colors

**VERIFY:**
- ✅ Sprite color updates instantly
- ✅ Color smoothly transitions (0.8s CSS transition)
- ✅ Glow effect follows mood color

#### 6. Test Resting State

1. Navigate to **Greenhouse**
2. Look at sprite in bottom-left corner
3. **VERIFY:**
   - ✅ Sprite enters slow breathing animation
   - ✅ Glow dims (opacity: 0.3)
   - ✅ Scale is smaller
   - ✅ Animation is slower (10s breath cycle)

Return to **Front Yard** and sprite returns to active state.

#### 7. Test Ambient States

**Processing State:**
- Observe the "Gnomes are filing..." indicator
- Sprite's glow should intensify (--glow-intensity: 0.5)

**No Loading Spinner:**
- There should be NO spinning loader or modal
- All state changes are ambient (sprite animations only)

---

## Browser Console Tests

### Check Realtime Subscription

```javascript
// In Console, after logging XP:
// Should see Supabase subscription working

// Open DevTools → Network tab
// Look for WebSocket connections to api.realtime.supabase.co
// Should see `INSERT` events when you log XP
```

### Validate CSS Variable Flow

```javascript
// After logging XP, check these in real-time:
const root = document.documentElement;

console.log({
  scale: root.style.getPropertyValue('--sprite-scale'),
  sporeOpacity: root.style.getPropertyValue('--spore-opacity'),
  sparkOpacity: root.style.getPropertyValue('--spark-opacity'),
  kinOpacity: root.style.getPropertyValue('--kin-opacity'),
  moodR: root.style.getPropertyValue('--sprite-mood-r'),
  moodG: root.style.getPropertyValue('--sprite-mood-g'),
  moodB: root.style.getPropertyValue('--sprite-mood-b'),
});
```

---

## Database Verification

### Check XP was Logged

Visit Supabase SQL Editor:

```sql
-- Should see your new XP entries
SELECT * FROM inputs_tracker 
WHERE user_id = 'your-user-id'
ORDER BY created_at DESC;

-- Check user tier was updated
SELECT total_xp, sprite_tier FROM user_preferences
WHERE user_id = 'your-user-id';
```

---

## Performance Checklist

- ⚡ No console errors
- ⚡ Realtime updates < 100ms latency
- ⚡ Smooth 60fps animations
- ⚡ CSS variable updates don't cause layout shifts
- ⚡ No memory leaks (DevTools Performance tab)

---

## Common Issues & Fixes

### "Realtime not updating"
- Check Supabase project tier (requires Pro+)
- Verify RLS policies are enabled
- Check network tab for WebSocket errors

### "Sprite not animating"
- Check CSS variables in DevTools
- Verify animations.css is imported in main.tsx
- Look for browser console errors

### "XP not logging"
- Check auth user is set
- Verify RLS policies allow INSERT
- Check Supabase quota limits

### "Mood color not changing"
- Verify `get_user_mood_color()` function exists
- Check pillar colors are set in database
- Look at CSS variable values in DevTools

---

## Success Criteria

✅ All items below should work without page reload:

- [ ] Auth system works (sign up, sign in)
- [ ] XP logging triggers realtime subscription
- [ ] Sprite animates on XP change
- [ ] Tier changes morph sprite visually
- [ ] Mood color updates based on pillar mix
- [ ] Resting state activates in Greenhouse
- [ ] CSS variables update in real-time
- [ ] No loading spinners (only ambient animations)
- [ ] Database reflects all changes

---

## Next Steps

If all tests pass:
1. ✅ Realtime system is working end-to-end
2. Deploy to production
3. Add remaining UI features (Playbooks, more zones)
4. Expand mood color calculation logic
