/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState, useCallback } from 'react';
import { supabaseClient } from '../lib/supabase';
import { Pillar } from '../types';

interface PillarsState {
  pillars: Pillar[];
  loading: boolean;
  error: Error | null;
}

let pillarCache: Pillar[] | null = null;

export const usePillars = () => {
  const [state, setState] = useState<PillarsState>({
    pillars: pillarCache || [],
    loading: !pillarCache,
    error: null,
  });

  const fetchPillars = useCallback(async () => {
    // Return cached pillars if available
    if (pillarCache) {
      setState({
        pillars: pillarCache,
        loading: false,
        error: null,
      });
      return;
    }

    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const { data, error } = await supabaseClient
        .from('pillars')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;

      pillarCache = (data || []) as Pillar[];

      setState({
        pillars: pillarCache,
        loading: false,
        error: null,
      });
    } catch (err) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err : new Error('Failed to fetch pillars'),
      }));
    }
  }, []);

  useEffect(() => {
    fetchPillars();
  }, [fetchPillars]);

  return state;
};
