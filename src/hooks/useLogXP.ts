/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback } from 'react';
import { supabaseClient } from '../lib/supabase';
import { InputType } from '../types';

interface LogXPState {
  isLoading: boolean;
  error: Error | null;
}

export const useLogXP = (userId: string | null) => {
  const [state, setState] = useState<LogXPState>({
    isLoading: false,
    error: null,
  });

  const logXP = useCallback(
    async (pillarId: string, amount: number = 25, type: InputType = InputType.TEXT) => {
      if (!userId) {
        throw new Error('No user logged in');
      }

      try {
        setState({ isLoading: true, error: null });

        const { error } = await supabaseClient.from('inputs_tracker').insert({
          user_id: userId,
          pillar_id: pillarId,
          xp_value: amount,
          input_type: type,
          metadata: {
            timestamp: new Date().toISOString(),
          },
        });

        if (error) throw error;

        setState({ isLoading: false, error: null });
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to log XP');
        setState({ isLoading: false, error });
        throw error;
      }
    },
    [userId]
  );

  return {
    logXP,
    isLoading: state.isLoading,
    error: state.error,
  };
};
