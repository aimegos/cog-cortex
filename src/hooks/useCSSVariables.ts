/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef } from 'react';

type CSSVariableValue = string | number;

interface CSSVariables {
  [key: string]: CSSVariableValue;
}

/**
 * Syncs reactive state to CSS custom properties for SVG animations.
 * This is the bridge between Supabase realtime data and SVG rendering.
 */
export const useCSSVariables = (variables: CSSVariables) => {
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Debounce updates to prevent excessive DOM operations
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      const root = document.documentElement;

      Object.entries(variables).forEach(([key, value]) => {
        // Ensure key starts with --
        const cssVarName = key.startsWith('--') ? key : `--${key}`;
        root.style.setProperty(cssVarName, String(value));
      });
    }, 0);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [variables]);
};

/**
 * Helper to calculate CSS variable values from data
 */
export const calculateSpriteScale = (totalXP: number): string => {
  return String(1.0 + totalXP / 10000);
};

export const calculateTierOpacities = (
  spriteTier: number
): { spore: string; spark: string; kin: string; architect: string } => {
  return {
    spore: spriteTier === 0 ? '1' : '0',
    spark: spriteTier === 1 ? '1' : '0',
    kin: spriteTier === 2 ? '1' : '0',
    architect: spriteTier === 3 ? '1' : '0',
  };
};

/**
 * Parse hex color to RGB for CSS custom property
 */
export const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 255, g: 255, b: 255 };
};

/**
 * Format RGB object as CSS rgb() string
 */
export const rgbToCss = (rgb: { r: number; g: number; b: number }): string => {
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
};
