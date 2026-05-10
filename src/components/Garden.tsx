import { useState } from 'react';
import { motion } from 'motion/react';
import { Flower, Trees, FlaskRound as Flask, Shovel, Info, Map as MapIcon, Layers } from 'lucide-react';
import { Pillar, Aesthetic } from '../types';
import { cn } from '../lib/utils';

interface GardenProps {
  pillars: Pillar[];
  aesthetic: Aesthetic;
}

export const Garden = ({ pillars, aesthetic }: GardenProps) => {
  const [activeZoneId, setActiveZoneId] = useState<string>(pillars[1].id);

  const zones = [
    { id: pillars[0].id, name: pillars[0].name, icon: Flower, color: 'text-amber-400', bg: 'rgba(251, 191, 36, 0.05)', pillar: 'Essentials' },
    { id: pillars[1].id, name: pillars[1].name, icon: Trees, color: 'text-emerald-400', bg: 'rgba(52, 211, 153, 0.05)', pillar: 'Career' },
    { id: pillars[2].id, name: pillars[2].name, icon: Flask, color: 'text-sky-400', bg: 'rgba(6, 182, 212, 0.05)', pillar: 'Lifestyle' },
  ];

  const activeZone = zones.find(z => z.id === activeZoneId) || zones[0];
  const isHobbit = aesthetic === Aesthetic.HOBBIT;

  return (
    <div className={cn(
        "h-full flex flex-col",
        isHobbit ? "bg-[#151815]" : "bg-[#020202]"
    )}>
      {/* Garden Map Header */}
      <div className={cn(
        "p-8 flex items-center justify-between z-10",
        isHobbit ? "border-b border-white/5" : "glass"
      )}>
        <div className="flex items-center gap-4">
          <div className={cn(
            "p-3 rounded-2xl ring-1",
            isHobbit ? "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20" : "bg-sky-500/10 text-sky-400 ring-sky-500/20"
          )}>
            <MapIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl heading-serif">The Cognitive Map</h1>
            <p className="text-[10px] font-mono text-white/20 uppercase tracking-[0.3em] mt-1">Archival & Discovery</p>
          </div>
        </div>

        <div className="flex gap-3">
          {zones.map((zone) => (
            <button
              key={zone.id}
              onClick={() => setActiveZoneId(zone.id)}
              className={cn(
                "px-6 py-3 rounded-2xl font-mono text-[10px] uppercase tracking-[0.2em] transition-all",
                activeZoneId === zone.id 
                    ? "bg-emerald-500 text-black font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)]" 
                    : "text-white/20 hover:bg-white/5"
              )}
            >
              {zone.name}
            </button>
          ))}
        </div>
      </div>

      {/* Immersive Zone Content */}
      <div 
        className="flex-1 relative overflow-hidden transition-colors duration-1000 bg-[#151815]"
      >
        <div className="relative z-10 h-full flex items-center justify-center p-20 gap-20">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-1/3 flex flex-col items-center"
          >
             <div className="w-64 h-64 rounded-full flex items-center justify-center relative mb-12 bg-emerald-500/5 border border-emerald-500/20">
                <activeZone.icon className="w-32 h-32 opacity-20 blur-sm absolute" />
                <activeZone.icon className="w-24 h-24 relative z-10 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)]" />
                
                {/* Aura */}
                <div className="absolute inset-0 rounded-full blur-3xl opacity-10 bg-current" />
             </div>
             <h2 className="text-4xl avant-garde font-bold uppercase tracking-[0.2em] text-center">{activeZone.name}</h2>
             <span className="text-[10px] font-mono text-white/20 uppercase tracking-[0.4em] mt-6">Zone Active</span>
          </motion.div>

            <div className="w-1/2 grid grid-cols-2 gap-6 relative">
              {[1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-8 rounded-[42px] transition-all cursor-pointer group flex gap-6 bg-[#1a1c1a] border border-white/5 hover:border-emerald-500/30"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-500/10">
                     <Flower className="w-6 h-6 transition-colors text-emerald-500" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h3 className="text-sm avant-garde font-bold uppercase tracking-widest group-hover:text-emerald-400 transition-colors">Archived Seed {i}</h3>
                    <p className="text-[10px] text-white/30 font-mono tracking-wide mt-1">Deep Store • 2024</p>
                  </div>
                </motion.div>
              ))}

              <div className="col-span-2 mt-12 p-12 rounded-[64px] flex items-center gap-12 bg-emerald-500/5 border border-emerald-500/10">
                 <div className="p-6 bg-white/5 rounded-full">
                    <Info className="w-8 h-8 text-emerald-400/50" />
                 </div>
                 <div className="flex-1">
                    <h4 className="text-xl avant-garde font-bold uppercase tracking-widest mb-2">The Gnomes are archiving.</h4>
                    <p className="text-white/40 leading-relaxed text-sm max-w-xl font-sans">
                      Historical data is being retrieved from Google Drive and mapped to your {activeZone.pillar} Pillar. 
                      The ecosystem's complexity is growing as you capture more insights.
                    </p>
                 </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};
