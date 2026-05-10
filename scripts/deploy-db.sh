#!/bin/bash

# @license
# SPDX-License-Identifier: Apache-2.0

set -e

echo "🌱 Cognitive Cortex - Database Deployment"
echo "==========================================="
echo ""

# Check if Supabase project ref is provided
if [ -z "$SUPABASE_PROJECT_REF" ]; then
  echo "❌ Error: SUPABASE_PROJECT_REF not set"
  echo ""
  echo "Usage:"
  echo "  export SUPABASE_PROJECT_REF=your-project-ref"
  echo "  bash scripts/deploy-db.sh"
  echo ""
  echo "Find your project ref at: https://app.supabase.com/projects"
  exit 1
fi

echo "📦 Deploying schema to project: $SUPABASE_PROJECT_REF"
echo ""

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null; then
  echo "❌ Supabase CLI not found. Installing..."
  npm install -g supabase
fi

# Link project
echo "🔗 Linking to Supabase project..."
supabase link --project-ref "$SUPABASE_PROJECT_REF"

# Push schema
echo "📤 Deploying schema..."
supabase db push

# Verify deployment
echo ""
echo "✅ Database schema deployed successfully!"
echo ""
echo "📊 Next steps:"
echo "  1. Verify tables in Supabase dashboard: https://app.supabase.com/projects/$SUPABASE_PROJECT_REF/editor"
echo "  2. Check RLS policies are enabled"
echo "  3. Test realtime subscriptions in browser console"
echo ""
