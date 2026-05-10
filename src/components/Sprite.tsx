/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { SpriteTier, Aesthetic } from '../types';
import { cn } from '../lib/utils';

interface SpriteProps {
  tier: SpriteTier;
  moodColor: string;
  isResting?: boolean;
  aesthetic?: Aesthetic;
}

export const Sprite = ({ tier, moodColor, isResting, aesthetic = Aesthetic.HOBBIT }: SpriteProps) => {
  const size = isResting ? 80 : 200;
  const isHobbit = aesthetic === Aesthetic.HOBBIT;

  return (
    <motion.div
      layout
      className={cn(
        'cortex-sprite relative flex items-center justify-center p-4 transition-opacity',
        isResting && 'is-resting',
        !isResting && 'is-floating'
      )}
      style={{
        width: size,
        height: size,
        transform: `scale(var(--sprite-scale))`,
      }}
      animate={{
        y: isResting ? [0, -4, 0] : [0, -15, 0],
        opacity: isResting ? 0.4 : 1,
      }}
      transition={{
        duration: isResting ? 10 : 3,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {/* Sprite Glow Aura */}
      <motion.div
        className="absolute inset-0 rounded-full sprite-filter"
        style={{
          backgroundColor: isHobbit ? '#10b981' : `rgb(var(--sprite-mood-r), var(--sprite-mood-g), var(--sprite-mood-b))`,
          filter: isHobbit
            ? 'blur(20px)'
            : 'blur(var(--glow-blur))',
          opacity: `var(--glow-intensity)`,
        }}
        animate={{
          scale: isResting ? [1, 1.1] : [1, 1.4, 1],
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      <svg
        viewBox="0 0 100 100"
        className="sprite-core relative z-10 w-full h-full"
        style={{
          filter: isHobbit
            ? `drop-shadow(0 0 10px #10b981)`
            : `drop-shadow(0 0 var(--glow-blur) rgb(var(--sprite-mood-r), var(--sprite-mood-g), var(--sprite-mood-b)))`,
        }}
      >
        <defs>
          <radialGradient id="spriteGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="white" />
            <stop
              offset="100%"
              stopColor={
                isHobbit
                  ? '#059669'
                  : `rgb(var(--sprite-mood-r), var(--sprite-mood-g), var(--sprite-mood-b))`
              }
            />
          </radialGradient>

          <filter id="goo">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation={isHobbit ? '1' : '4'}
              result="blur"
            />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
              result="goo"
            />
          </filter>
        </defs>

        <g filter="url(#goo)">
          {/* Tier 0: Spore - Base Orb */}
          <g style={{ opacity: `var(--spore-opacity)` }} className="sprite-spore">
            {isHobbit ? (
              <motion.g
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <rect x="35" y="35" width="30" height="30" fill="#059669" />
                <rect x="30" y="40" width="10" height="20" fill="#059669" />
                <rect x="60" y="40" width="10" height="20" fill="#059669" />
                <rect x="40" y="30" width="20" height="10" fill="#059669" />
                <rect x="40" y="60" width="20" height="10" fill="#059669" />
              </motion.g>
            ) : (
              <motion.circle
                cx="50"
                cy="50"
                r="20"
                fill="url(#spriteGradient)"
                animate={{
                  r: [18, 22, 18],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            )}
          </g>

          {/* Tier 1: Spark - Pulse Core */}
          <g style={{ opacity: `var(--spark-opacity)` }} className="sprite-spark">
            {isHobbit ? (
              <motion.g
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <rect x="35" y="35" width="30" height="30" fill="#0ea5e9" />
                <rect x="30" y="40" width="10" height="20" fill="#0ea5e9" />
                <rect x="60" y="40" width="10" height="20" fill="#0ea5e9" />
                <rect x="40" y="30" width="20" height="10" fill="#0ea5e9" />
                <rect x="40" y="60" width="20" height="10" fill="#0ea5e9" />
              </motion.g>
            ) : (
              <>
                <motion.circle
                  cx="50"
                  cy="50"
                  r="25"
                  fill="url(#spriteGradient)"
                  animate={{
                    r: [23, 27, 23],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="10"
                  fill="white"
                  animate={{ opacity: [0.3, 0.8, 0.3], scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </>
            )}
          </g>

          {/* Tier 2: Kin - Feelers/Limbs */}
          <g style={{ opacity: `var(--kin-opacity)` }} className="sprite-kin">
            {isHobbit ? (
              <motion.g
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <rect x="35" y="35" width="30" height="30" fill="#a855f7" />
                <rect x="30" y="40" width="10" height="20" fill="#a855f7" />
                <rect x="60" y="40" width="10" height="20" fill="#a855f7" />
                <rect x="40" y="30" width="20" height="10" fill="#a855f7" />
                <rect x="40" y="60" width="20" height="10" fill="#a855f7" />
              </motion.g>
            ) : (
              <>
                <motion.circle
                  cx="50"
                  cy="50"
                  r="25"
                  fill="url(#spriteGradient)"
                  animate={{
                    r: [23, 27, 23],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="10"
                  fill="white"
                  animate={{ opacity: [0.3, 0.8, 0.3], scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                {[0, 90, 180, 270].map((angle) => (
                  <motion.circle
                    key={angle}
                    cx={50 + 30 * Math.cos((angle * Math.PI) / 180)}
                    cy={50 + 30 * Math.sin((angle * Math.PI) / 180)}
                    r="8"
                    fill={`rgb(var(--sprite-mood-r), var(--sprite-mood-g), var(--sprite-mood-b))`}
                    animate={{
                      cx: [
                        50 + 25 * Math.cos((angle * Math.PI) / 180),
                        50 + 35 * Math.cos((angle * Math.PI) / 180),
                        50 + 25 * Math.cos((angle * Math.PI) / 180),
                      ],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      delay: angle / 360,
                    }}
                  />
                ))}
              </>
            )}
          </g>

          {/* Tier 3: Architect - Data Bits / Orbits */}
          <g style={{ opacity: `var(--architect-opacity)` }} className="sprite-architect">
            {isHobbit ? (
              <motion.g
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <rect x="35" y="35" width="30" height="30" fill="#ec4899" />
                <rect x="30" y="40" width="10" height="20" fill="#ec4899" />
                <rect x="60" y="40" width="10" height="20" fill="#ec4899" />
                <rect x="40" y="30" width="20" height="10" fill="#ec4899" />
                <rect x="40" y="60" width="20" height="10" fill="#ec4899" />
              </motion.g>
            ) : (
              <>
                <motion.circle
                  cx="50"
                  cy="50"
                  r="25"
                  fill="url(#spriteGradient)"
                  animate={{
                    r: [23, 27, 23],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="10"
                  fill="white"
                  animate={{ opacity: [0.3, 0.8, 0.3], scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                {[0, 90, 180, 270].map((angle) => (
                  <motion.circle
                    key={angle}
                    cx={50 + 30 * Math.cos((angle * Math.PI) / 180)}
                    cy={50 + 30 * Math.sin((angle * Math.PI) / 180)}
                    r="8"
                    fill={`rgb(var(--sprite-mood-r), var(--sprite-mood-g), var(--sprite-mood-b))`}
                    animate={{
                      cx: [
                        50 + 25 * Math.cos((angle * Math.PI) / 180),
                        50 + 35 * Math.cos((angle * Math.PI) / 180),
                        50 + 25 * Math.cos((angle * Math.PI) / 180),
                      ],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      delay: angle / 360,
                    }}
                  />
                ))}
                <motion.circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke={`rgb(var(--sprite-mood-r), var(--sprite-mood-g), var(--sprite-mood-b))`}
                  strokeWidth="0.5"
                  strokeDasharray="4 4"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />
              </>
            )}
          </g>
        </g>

        {/* Face for higher tiers */}
        <g style={{ opacity: `calc(var(--kin-opacity) + var(--architect-opacity))` }}>
          <circle cx="43" cy="45" r="2" fill={isHobbit ? '#10b981' : '#151619'} />
          <circle cx="57" cy="45" r="2" fill={isHobbit ? '#10b981' : '#151619'} />
          {!isHobbit && (
            <motion.path
              d="M 45 55 Q 50 60 55 55"
              stroke="#151619"
              strokeWidth="1"
              fill="none"
              animate={{
                d: [
                  'M 45 55 Q 50 60 55 55',
                  'M 45 56 Q 50 58 55 56',
                  'M 45 55 Q 50 60 55 55',
                ],
              }}
              transition={{ duration: 5, repeat: Infinity }}
            />
          )}
        </g>
      </svg>
    </motion.div>
  );
};
