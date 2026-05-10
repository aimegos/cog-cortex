import { motion, AnimatePresence } from 'motion/react';
import { Mic, Camera, FileText, Sun, Cloud, Wind, MoreHorizontal, Sparkles } from 'lucide-react';
import { Sprite } from './Sprite';
import { Pillar, UserPreferences, SpriteTier, InputType, Aesthetic } from '../types';
import { cn } from '../lib/utils';

interface FrontYardProps {
  preferences: UserPreferences;
  moodColor: string;
  pillars: Pillar[];
  onCapture: (pillarId: string, type: InputType) => void;
  onOpenGuide: () => void;
  guideState: 'idle' | 'ready';
  aesthetic: Aesthetic;
  isLight: boolean;
}

export const FrontYard = ({ preferences, moodColor, pillars, onCapture, onOpenGuide, guideState, aesthetic, isLight }: FrontYardProps) => {
  const isHobbit = aesthetic === Aesthetic.HOBBIT;
  // Weather state based on system "health"
  // Mock logic: if XP > 1000 and total items > 5 then Sunny
  const systemHealth = preferences.total_xp > 1000 ? 'sunny' : 'overcast';

  return (
    <div className="relative h-full flex flex-col items-center justify-center p-8 overflow-hidden">
      {/* Background Weather Visuals */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <AnimatePresence mode="wait">
          {systemHealth === 'sunny' ? (
              <motion.div
                key="sunny"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute top-10 right-10"
              >
                <Sun className="w-32 h-32 text-yellow-500/20 blur-sm animate-pulse" />
              </motion.div>
            ) : (
              <motion.div
                key="overcast"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center"
              >
                <Cloud className="w-64 h-64 text-slate-500/10 blur-xl translate-x-20 -translate-y-10" />
                <Cloud className="w-48 h-48 text-slate-500/10 blur-xl -translate-x-20 translate-y-20" />
                <Wind className="w-full h-20 text-slate-500/5 absolute bottom-40" />
              </motion.div>
            )}
        </AnimatePresence>
      </div>

      {/* Main Cockpit - Central Sprite */}
      <div className="relative z-10 flex flex-col items-center gap-12 w-full max-w-2xl">
        <div className="text-center space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                "text-5xl heading-serif text-white/95 leading-tight",
                isLight && "text-black/90"
            )}
          >
            {systemHealth === 'sunny' ? "The skies are clear today." : "A soft fog rolls through your garden."}
          </motion.h1>
          <p className="text-white/30 font-mono text-[10px] uppercase tracking-[0.3em]">
            {preferences.total_xp} Total XP • Tier {preferences.sprite_tier}
          </p>
        </div>

        <Sprite 
          tier={preferences.sprite_tier} 
          moodColor={moodColor} 
        />

        {/* Quick Capture Buttons */}
        <div className="grid grid-cols-3 gap-6 w-full">
          {[
            { id: 'voice', icon: Mic, label: 'Voice', color: 'bg-cyan-500' },
            { id: 'photo', icon: Camera, label: 'Photo', color: 'bg-emerald-500' },
            { id: 'text', icon: FileText, label: 'Note', color: 'bg-amber-500' },
          ].map((action) => (
            <motion.button
              key={action.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onCapture(pillars[0].id, action.id as InputType)}
              className={cn(
                "p-6 rounded-3xl flex flex-col items-center gap-3 group transition-all",
                isHobbit ? "glass-hobbit" : "glass hover:bg-white/10",
                isLight && !isHobbit && "bg-black/5 hover:bg-black/10"
              )}
            >
              <div className={cn(
                "p-4 rounded-2xl transition-transform",
                isHobbit ? "bg-emerald-500/10 text-emerald-400 group-hover:scale-110" : `${action.color}/20 text-${action.color.split('-')[1]}-400 group-hover:scale-110`
              )}>
                <action.icon className="w-8 h-8" />
              </div>
              <span className="text-xs font-medium uppercase tracking-widest text-white/60 group-hover:text-white/90">
                {action.label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* The Guide's Hut Button */}
      <motion.button
        onClick={onOpenGuide}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        className="absolute bottom-10 right-10 z-20 group"
      >
        <div className="relative">
          <div className={cn(
            "p-6 rounded-full transition-all",
            isHobbit ? "bg-emerald-500/10 border border-emerald-500/30" : (isLight ? "bg-black/5 border border-black/10" : "glass"),
            guideState === 'ready' ? 'ring-2 ring-amber-500/50 bg-amber-500/10' : ''
          )}>
            <Sparkles className={cn(
                "w-8 h-8 transition-colors",
                isHobbit ? "text-emerald-400" : (guideState === 'ready' ? 'text-amber-400' : 'text-white/20')
            )} />
          </div>
          {guideState === 'ready' && (
            <motion.div 
              layoutId="guide-glow"
              className="absolute inset-0 bg-amber-500/20 rounded-full blur-xl -z-10"
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          )}
          <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-[#050505] scale-0 group-hover:scale-100 transition-transform" />
          <span className="absolute -top-10 right-0 whitespace-nowrap text-[10px] uppercase font-mono tracking-widest text-white/30 opacity-0 group-hover:opacity-100 transition-opacity">
            Knock on Hut
          </span>
        </div>
      </motion.button>
    </div>
  );
};
