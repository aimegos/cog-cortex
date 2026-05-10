# The Cognitive Cortex

A Personal OS for ND/PDA users. Real-time SVG animations powered by Supabase webhooks and React.

## Architecture

- **Backend**: Supabase (PostgreSQL + Realtime)
- **Frontend**: React 19 + TypeScript + Vite
- **UI**: SVG Sprite with CSS Variable Animations
- **State Management**: Supabase Realtime subscriptions + React hooks

## Features

- 🌱 **XP-driven sprite evolution** (Spore → Spark → Kin → Architect)
- 🎨 **Mood-based coloring** (weighted average of pillar colors)
- 🔄 **Real-time updates** (no page refresh needed)
- 📊 **Playbooks & Pillars** (structured life management)
- 🎭 **Ambient states** (no loading spinners; sprite enters thinking mode)

## Setup

### Prerequisites

- Node.js 18+
- Supabase project (schema deployed)
- GitHub account (for deployment)

### 1. Clone & Install

```bash
git clone https://github.com/aimegos/cog-cortex.git
cd cog-cortex
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Get these from: https://app.supabase.com/projects/[your-project]/settings/api

### 3. Deploy Database Schema

Option A: Using Supabase CLI (recommended)

```bash
npm install -g supabase
supabase link --project-ref your-project-id
supabase db push
```

Option B: Manual deployment

1. Go to Supabase dashboard → SQL Editor
2. Create a new query
3. Copy contents of `supabase_schema.sql`
4. Run the query

### 4. Run Locally

```bash
npm run dev
```

Visit http://localhost:3000

## Project Structure

```
src/
├── components/        # React components (Sprite, FrontYard, etc.)
├── hooks/            # Custom hooks (realtime subscriptions)
├── lib/              # Utilities (supabase client, mock data)
├── types.ts          # TypeScript interfaces
├── App.tsx           # Main app
└── styles/           # CSS (variables, animations)
supabase_schema.sql   # Database schema & functions
```

## Development

### Available Scripts

- `npm run dev` — Start dev server (port 3000)
- `npm run build` — Build for production
- `npm run lint` — Type check with TypeScript
- `npm run clean` — Remove dist folder

### CSS Custom Properties

The Sprite component is animated entirely via CSS variables. Update these in your hooks:

```typescript
useCSSVariables({
  '--sprite-scale': `${1.0 + (totalXP / 10000)}`,
  '--sprite-mood': moodColor,
  '--spore-opacity': spriteTier === 0 ? '1' : '0',
  '--spark-opacity': spriteTier === 1 ? '1' : '0',
  '--kin-opacity': spriteTier === 2 ? '1' : '0',
  '--glow-intensity': isProcessing ? '0.5' : '0.2',
});
```

## Database Schema

### Tables

- **pillars**: Life categories (Career, Health, Lifestyle, etc.)
- **playbooks**: Goal blueprints (Seedlings)
- **inputs_tracker**: XP log (voice, photo, text, mastery)
- **user_preferences**: User state (XP, tier, theme)

### Key Functions

- `get_user_mood_color(user_id)` — Weighted color from pillar distribution
- `update_user_xp_level()` — Trigger on XP insert (updates tier)

### Realtime Subscriptions

The frontend subscribes to:
- `inputs_tracker` (new XP events)
- `user_preferences` (tier changes, theme updates)

## Deployment

### GitHub Actions

GitHub Actions automatically:
1. Runs TypeScript type checking
2. Builds the app
3. Pushes to production on main branch

Configure in `.github/workflows/deploy.yml`

### Manual Deploy

```bash
npm run build
# Deploy dist/ to your hosting (Vercel, Netlify, etc.)
```

## Troubleshooting

### Realtime not updating?

- Check Supabase project tier (Realtime requires Pro or higher)
- Verify RLS policies are enabled
- Check browser console for connection errors

### CSS Variables not applying?

- Ensure `useCSSVariables` hook is called in App.tsx
- Check that `document.documentElement.style.setProperty()` is working
- Verify CSS uses `var(--variable-name)` syntax

### Build fails?

```bash
npm install
npm run lint  # Check for type errors
npm run build
```

## Resources

- [Supabase Docs](https://supabase.com/docs)
- [React 19 Docs](https://react.dev)
- [Framer Motion](https://www.framer.com/motion/)
- [Tailwind CSS](https://tailwindcss.com)

## License

Apache 2.0
