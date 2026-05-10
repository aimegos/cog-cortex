/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, Settings, User, Trophy, Home, Sprout, Map as MapIcon, Moon, Sun } from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import {
  useSupabaseRealtimeXP,
  useMoodColor,
  useUserPreferences,
  usePillars,
  useLogXP,
  useCSSVariables,
  calculateSpriteScale,
  calculateTierOpacities,
  hexToRgb,
} from './hooks';
import { FrontYard } from './components/FrontYard';
import { Greenhouse } from './components/Greenhouse';
import { Garden } from './components/Garden';
import { Guide } from './components/Guide';
import { Sprite } from './components/Sprite';
import { Background3D } from './components/Background3D';
import { Dashboard } from './components/Dashboard';
import { InputType, Aesthetic, Archetype } from './types';
import { cn } from './lib/utils';

function AppContent() {
  const { user, isLoading: authLoading } = useAuth();
  const { pillars, loading: pillarsLoading } = usePillars();
  const { xpLogs, totalXP, spriteTier } = useSupabaseRealtimeXP(user?.id || null);
  const { preferences } = useUserPreferences(user?.id || null);
  const { moodColor } = useMoodColor(user?.id || null);
  const { logXP, isLoading: xpLoading } = useLogXP(user?.id || null);

  const [activeZone, setActiveZone] = useState<string>('front-yard');
  const [guideIsOpen, setGuideIsOpen] = useState(false);
  const [aesthetic, setAesthetic] = useState<Aesthetic>(Aesthetic.HOBBIT);
  const [isLight, setIsLight] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Sync theme to body class for global CSS targeting
  useEffect(() => {
    document.body.className = `theme-hobbit ${isLight ? 'theme-light' : ''}`;
  }, [isLight]);

  // Sync realtime data to CSS variables for SVG animations
  const tierOpacities = calculateTierOpacities(spriteTier);
  const rgb = hexToRgb(moodColor);

  useCSSVariables({
    '--sprite-scale': calculateSpriteScale(totalXP),
    '--spore-opacity': tierOpacities.spore,
    '--spark-opacity': tierOpacities.spark,
    '--kin-opacity': tierOpacities.kin,
    '--architect-opacity': tierOpacities.architect,
    '--sprite-mood-r': rgb.r.toString(),
    '--sprite-mood-g': rgb.g.toString(),
    '--sprite-mood-b': rgb.b.toString(),
    '--glow-intensity': isProcessing ? '0.5' : '0.2',
  });

  const handleCapture = async (pillarId: string, type: InputType) => {
    try {
      setIsProcessing(true);
      await logXP(pillarId, 25, type);
      // Realtime subscription handles UI update automatically
    } catch (error) {
      console.error('Failed to log XP:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreatePlaybook = async (pillarId: string) => {
    try {
      // TODO: Implement Supabase playbook creation
      // For now, log XP as a placeholder
      await logXP(pillarId, 50, InputType.TEXT);
    } catch (error) {
      console.error('Failed to create playbook:', error);
    }
  };

  const handleUpdatePlaybook = (id: string, updates: any) => {
    // TODO: Implement Supabase playbook update
    console.log('Update playbook:', id, updates);
  };

  const navItems = [
    { id: 'front-yard', label: 'Front Yard', icon: Home },
    { id: 'greenhouse', label: 'Greenhouse', icon: Sprout },
    { id: 'garden', label: 'Map', icon: MapIcon },
    { id: 'expedition', label: 'Expedition', icon: Trophy },
  ];

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col font-sans select-none">
      {/* Top Navigation / Status Rail */}
      <nav className={cn(
        "h-20 flex items-center justify-between px-8 z-50 border-b border-[#3a4a3e]/30",
        isLight ? "bg-[#e8ece8] border-[#3a4a3e]/10" : "bg-[#1a1c1a]"
      )}>
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-5">
             <div className="w-10 h-10 rounded-xl flex items-center justify-center p-2 shadow-lg bg-[#3a4a3e] shadow-emerald-900/20 border border-emerald-500/20">
                <Compass className="text-white" />
             </div>
             <div className="hidden sm:block">
                <h1 className="text-lg avant-garde tracking-[0.35em] leading-none text-white/90">cognitive cortex</h1>
             </div>
          </div>

          <div className="flex bg-[#1a1c1a] border border-[#3a4a3e]/30 rounded-2xl p-1 shadow-inner">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveZone(item.id)}
                className={cn(
                  "flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-mono uppercase tracking-[0.2em] transition-all",
                  activeZone === item.id 
                    ? "bg-emerald-500 text-black font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                    : "text-white/30 hover:text-white/60"
                )}
              >
                <item.icon className="w-4 h-4" />
                <span className="hidden md:block">{item.label}</span>
              </button>
            ))}
          </div>

          <button 
             onClick={() => setIsLight(!isLight)}
             className="ml-4 p-2.5 bg-[#1a1c1a] border border-[#3a4a3e]/30 rounded-full text-white/30 hover:text-white/80 transition-all"
          >
            {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
             <div className="flex items-center gap-2">
                <div className="w-24 h-1.5 glass rounded-full overflow-hidden">
                   <motion.div
                    className="h-full bg-gradient-to-r from-cyan-500 to-amber-500"
                    animate={{ width: `${(totalXP % 2500) / 25}%` }}
                   />
                </div>
                <span className="text-[10px] font-mono text-amber-500">{totalXP} XP</span>
             </div>
             <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest mt-1">Tier {spriteTier} Energy</span>
          </div>
          
          <button className="p-3 rounded-full glass hover:bg-white/10 transition-colors">
            <Settings className="w-5 h-5 text-white/40" />
          </button>
          <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 overflow-hidden">
             <User className="w-6 h-6 text-white/20" />
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className={cn(
        "flex-1 relative overflow-hidden grid-lines"
      )}>
        <Background3D />
        <AnimatePresence mode="wait">
          <motion.div
            key={activeZone}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            {activeZone === 'front-yard' && (
              <FrontYard
                preferences={preferences || {
                  user_id: user?.id || '',
                  total_xp: totalXP,
                  active_archetype: Archetype.GARDENER,
                  sprite_tier: spriteTier,
                  last_interaction: new Date().toISOString(),
                  theme_preference: 'system',
                  current_theme: isLight ? 'light' : 'dark',
                }}
                moodColor={moodColor}
                pillars={pillars}
                onCapture={handleCapture}
                onOpenGuide={() => setGuideIsOpen(true)}
                guideState="ready"
                aesthetic={aesthetic}
                isLight={isLight}
              />
            )}
            {activeZone === 'greenhouse' && (
              <Greenhouse
                pillars={pillars}
                playbooks={[]}
                onUpdatePlaybook={handleUpdatePlaybook}
                onCreatePlaybook={handleCreatePlaybook}
                aesthetic={aesthetic}
              />
            )}
            {activeZone === 'garden' && (
              <Garden pillars={pillars} aesthetic={aesthetic} />
            )}
            {activeZone === 'expedition' && (
              <Dashboard aesthetic={aesthetic} isLight={isLight} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Overlays */}
      <Guide
        isOpen={guideIsOpen}
        onClose={() => setGuideIsOpen(false)}
        preferences={preferences || {
          user_id: user?.id || '',
          total_xp: totalXP,
          active_archetype: Archetype.GARDENER,
          sprite_tier: spriteTier,
          last_interaction: new Date().toISOString(),
          theme_preference: 'system',
          current_theme: isLight ? 'light' : 'dark',
        }}
        pillars={pillars}
        playbooks={[]}
      />

      {/* Sprite Hover Portal (Always present if not in front yard) */}
      {activeZone !== 'front-yard' && (
        <div className="fixed bottom-6 left-6 z-[60] pointer-events-none">
          <div className="pointer-events-auto cursor-pointer" onClick={() => setGuideIsOpen(true)}>
             <div className="relative">
                <div className="absolute inset-0 bg-white/5 blur-2xl rounded-full" />
                <div className="transform scale-50 origin-bottom-left transition-all hover:scale-75 active:scale-60">
                   <Sprite tier={spriteTier} moodColor={moodColor} isResting={activeZone === 'greenhouse'} aesthetic={aesthetic} />
                </div>
             </div>
          </div>
        </div>
      )}

      {/* Processing Gnome Indicator */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] glass px-6 py-3 rounded-full flex items-center gap-3"
          >
            <div className="flex gap-1">
              {[0, 1, 2].map(i => (
                <motion.div 
                   key={i}
                  className="w-1.5 h-1.5 bg-cyan-400 rounded-full"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.2 }}
                />
              ))}
            </div>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/60">Gnomes are filing...</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Version Footer */}
      <div className="fixed bottom-6 right-8 z-[60] pointer-events-none flex items-center gap-6">
        <p className="text-[9px] font-mono uppercase tracking-[0.3em] text-white/20 select-none">
          Personal OS v1.0 • Built for Flow
        </p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
