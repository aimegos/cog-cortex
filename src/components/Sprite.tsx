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
  // SVG based sprite that evolves
  const size = isResting ? 80 : 200;
  const isHobbit = aesthetic === Aesthetic.HOBBIT;
  
  return (
    <motion.div
      layout
      className="relative flex items-center justify-center p-4"
      animate={{
        y: isResting ? [0, -4, 0] : [0, -15, 0],
        scale: isResting ? [1, 1.02, 1] : [1, 1.05, 1],
        opacity: isResting ? 0.4 : 1,
      }}
      transition={{
        duration: isResting ? 6 : 4,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      style={{ width: size, height: size }}
    >
      {/* Sprite Glow Aura */}
      <motion.div
        className={cn(
            "absolute inset-0 rounded-full",
            isHobbit ? "blur-[20px] opacity-20" : "blur-[60px] opacity-30"
        )}
        animate={{
          backgroundColor: isHobbit ? '#10b981' : moodColor,
          scale: isResting ? [1, 1.1] : [1, 1.4, 1],
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-full relative z-10"
        style={{ filter: isHobbit ? `drop-shadow(0 0 10px #10b981)` : `drop-shadow(0 0 25px ${moodColor})` }}
      >
        <defs>
          <radialGradient id="spriteGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="white" />
            <stop offset="100%" stopColor={isHobbit ? '#059669' : moodColor} />
          </radialGradient>
          
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation={isHobbit ? "1" : "4"} result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
          </filter>
        </defs>

        <g filter="url(#goo)">
          {/* Base Orb */}
          {isHobbit ? (
              <motion.g
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                  {/* Pixelated Body */}
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
                r={tier === SpriteTier.SPORE ? 20 : 25}
                fill="url(#spriteGradient)"
                animate={{
                  r: tier === SpriteTier.SPORE ? [18, 22, 18] : [23, 27, 23],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
          )}

          {/* Tier 1: Spark - Pulse Core */}
          {tier >= SpriteTier.SPARK && (
            <motion.circle
              cx="50"
              cy="50"
              r={isHobbit ? "4" : "10"}
              fill={isHobbit ? "#10b981" : "white"}
              animate={{ opacity: [0.3, 0.8, 0.3], scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}

          {/* Tier 2: Kin - Feelers/Limbs */}
          {tier >= SpriteTier.KIN && (
            <g>
              {[0, 90, 180, 270].map((angle) => (
                isHobbit ? (
                    <motion.rect
                        key={angle}
                        x={48 + 30 * Math.cos((angle * Math.PI) / 180)}
                        y={48 + 30 * Math.sin((angle * Math.PI) / 180)}
                        width="4" height="4"
                        fill="#10b981"
                        animate={{
                            opacity: [0.2, 1, 0.2]
                        }}
                        transition={{ duration: 2, repeat: Infinity, delay: angle / 360 }}
                    />
                ) : (
                    <motion.circle
                      key={angle}
                      cx={50 + 30 * Math.cos((angle * Math.PI) / 180)}
                      cy={50 + 30 * Math.sin((angle * Math.PI) / 180)}
                      r="8"
                      fill={moodColor}
                      animate={{
                        cx: [
                          50 + 25 * Math.cos((angle * Math.PI) / 180),
                          50 + 35 * Math.cos((angle * Math.PI) / 180),
                          50 + 25 * Math.cos((angle * Math.PI) / 180)
                        ]
                      }}
                      transition={{ duration: 4, repeat: Infinity, delay: angle / 360 }}
                    />
                )
              ))}
            </g>
          )}

          {/* Tier 3: Architect - Data Bits / Orbits */}
          {tier >= SpriteTier.ARCHITECT && (
            <motion.circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke={isHobbit ? "#10b981" : moodColor}
              strokeWidth="0.5"
              strokeDasharray={isHobbit ? "1 2" : "4 4"}
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />
          )}
        </g>
        
        {/* Face for Kin and above */}
        {tier >= SpriteTier.KIN && !isResting && (
          <g>
            <circle cx="43" cy="45" r="2" fill={isHobbit ? "#10b981" : "#151619"} />
            <circle cx="57" cy="45" r="2" fill={isHobbit ? "#10b981" : "#151619"} />
            {!isHobbit && (
                <motion.path
                    d="M 45 55 Q 50 60 55 55"
                    stroke="#151619"
                    strokeWidth="1"
                    fill="none"
                    animate={{ d: ["M 45 55 Q 50 60 55 55", "M 45 56 Q 50 58 55 56", "M 45 55 Q 50 60 55 55"] }}
                    transition={{ duration: 5, repeat: Infinity }}
                />
            )}
          </g>
        )}
      </svg>
    </motion.div>
  );
};
