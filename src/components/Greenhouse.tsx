import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, ChevronRight, FileEdit, FolderPlus, Search, Info } from 'lucide-react';
import Markdown from 'react-markdown';
import { Pillar, Playbook, Aesthetic } from '../types';
import { cn } from '../lib/utils';

interface GreenhouseProps {
  pillars: Pillar[];
  playbooks: Playbook[];
  onUpdatePlaybook: (id: string, updates: Partial<Playbook>) => void;
  onCreatePlaybook: (pillarId: string) => void;
  aesthetic: Aesthetic;
}

export const Greenhouse = ({ pillars, playbooks, onUpdatePlaybook, onCreatePlaybook, aesthetic }: GreenhouseProps) => {
  const [selectedPillarId, setSelectedPillarId] = useState<string | null>(null);
  const [activePlaybookId, setActivePlaybookId] = useState<string | null>(null);

  const selectedPillar = pillars.find(p => p.id === selectedPillarId);
  const filteredPlaybooks = playbooks.filter(p => p.pillar_id === selectedPillarId);
  const activePlaybook = playbooks.find(p => p.id === activePlaybookId);

  const isHobbit = aesthetic === Aesthetic.HOBBIT;

  useEffect(() => {
    if (pillars.length === 0) {
      setSelectedPillarId(null);
      return;
    }

    if (!selectedPillar || !selectedPillarId) {
      setSelectedPillarId(pillars[1]?.id ?? pillars[0].id);
    }
  }, [pillars, selectedPillar, selectedPillarId]);

  return (
    <div className={cn(
        "h-full grid grid-cols-12 overflow-hidden",
        isHobbit ? "bg-[#151815] gap-px" : "bg-black gap-0"
    )}>
      {/* Pillar Selection Sidebar */}
      <div className={cn(
        "col-span-3 flex flex-col border-r border-white/5",
        isHobbit ? "bg-[#1a1c1a]" : "glass"
      )}>
        <div className="p-6 border-bottom border-white/5">
          <h2 className="text-xs avant-garde uppercase tracking-[0.2em] text-white/30 mb-8">Pillars</h2>
          <div className="space-y-1">
            {pillars.map((pillar) => (
              <button
                key={pillar.id}
                onClick={() => {
                  setSelectedPillarId(pillar.id);
                  setActivePlaybookId(null);
                }}
                className={cn(
                  "w-full text-left p-4 rounded-2xl transition-all flex items-center justify-between group",
                  selectedPillarId === pillar.id 
                    ? (isHobbit ? "bg-emerald-500/10 text-emerald-400" : "bg-white/5 text-white") 
                    : "text-white/40 hover:text-white/70"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: pillar.base_color }} />
                  <span className="font-serif italic text-lg">{pillar.name}</span>
                </div>
                {selectedPillarId === pillar.id && <ChevronRight className="w-4 h-4 text-white/40" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Playbook List / Nursery */}
      <div className={cn(
        "col-span-4 border-r border-white/5 flex flex-col",
        isHobbit ? "bg-[#1a1c1a]" : "bg-white/2"
      )}>
        <div className="p-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold avant-garde uppercase tracking-widest mb-1">{selectedPillar?.name}</h2>
            <p className="text-[10px] text-white/20 font-mono uppercase tracking-[0.3em]">Nursery</p>
          </div>
          <button 
            onClick={() => selectedPillarId && onCreatePlaybook(selectedPillarId)}
            disabled={!selectedPillarId}
            className={cn("p-3 rounded-full transition-colors", isHobbit ? "glass-hobbit" : "glass hover:bg-white/10")}
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 space-y-4 pb-8">
          {filteredPlaybooks.length > 0 ? (
            filteredPlaybooks.map((playbook) => (
              <motion.button
                layout
                key={playbook.id}
                onClick={() => setActivePlaybookId(playbook.id)}
                className={cn(
                  "w-full text-left p-6 rounded-3xl transition-all group relative overflow-hidden",
                  activePlaybookId === playbook.id 
                    ? (isHobbit ? "glass-hobbit ring-1 ring-emerald-500/30" : "glass ring-1 ring-white/20") 
                    : "bg-white/5 hover:bg-white/10"
                )}
              >
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-white/30">{playbook.status}</span>
                    <span className={cn(
                        "text-[10px] font-mono",
                        isHobbit ? "text-emerald-400" : "text-sky-400"
                    )}>{playbook.completion_score}% Done</span>
                  </div>
                  <h3 className="text-lg avant-garde font-semibold mb-1 group-hover:text-emerald-400 transition-colors uppercase tracking-wider">{playbook.title}</h3>
                  <p className="text-[11px] font-sans text-white/40 line-clamp-1">{playbook.objective}</p>
                </div>
                
                {/* Seedling growth indicator */}
                <div className="absolute bottom-0 left-0 h-1 bg-white/5 w-full">
                  <motion.div 
                    className={cn(
                        "h-full shadow-[0_0_10px_rgba(16,185,129,0.5)]",
                        isHobbit ? "bg-emerald-500" : "bg-sky-500"
                    )}
                    initial={{ width: 0 }}
                    animate={{ width: `${playbook.completion_score}%` }}
                  />
                </div>
              </motion.button>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-40 text-center opacity-20">
              <FolderPlus className="w-12 h-12 mb-4" />
              <p className="text-sm font-mono uppercase tracking-widest">Nursery Empty</p>
            </div>
          )}
        </div>
      </div>

      {/* Editor / Blueprint View */}
      <div className={cn(
        "col-span-5 flex flex-col relative overflow-hidden",
        isHobbit ? "bg-[#151815]" : "bg-white/0"
      )}>
        <AnimatePresence mode="wait">
          {activePlaybook ? (
            <motion.div 
              key={activePlaybook.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col"
            >
              <div className={cn(
                  "p-8 border-b border-white/5 flex items-center justify-between sticky top-0 z-10",
                  isHobbit ? "bg-[#151815]/90 backdrop-blur-md" : "bg-black/50 backdrop-blur-md"
              )}>
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "p-3 rounded-2xl",
                    isHobbit ? "bg-emerald-500/10 text-emerald-400" : "glass text-sky-400"
                  )}>
                    <FileEdit className="w-5 h-5" />
                  </div>
                  <div>
                    <h1 className="text-xl avant-garde font-bold uppercase tracking-widest">{activePlaybook.title}</h1>
                    <p className="text-[10px] font-mono text-white/20 uppercase tracking-[0.3em]">Editing Playbook</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                   <button className={cn(
                    "px-6 py-2 rounded-xl text-xs font-mono uppercase tracking-widest transition-all",
                    isHobbit ? "bg-emerald-500 text-black font-bold" : "glass hover:bg-white/10"
                   )}>Save</button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-12 custom-scrollbar prose prose-invert max-w-none">
                <div className={cn(
                    "mb-12 p-8 rounded-3xl",
                    isHobbit ? "bg-emerald-500/5 border-emerald-500/20 border-2 border-dashed" : "glass border-dashed border-white/10 border-2"
                )}>
                  <div className="flex items-start gap-4 text-white/60 italic text-sm">
                    <Info className={cn("w-5 h-5 mt-0.5 flex-shrink-0", isHobbit ? "text-emerald-400" : "text-sky-500")} />
                    <p>The Gnomes noticed this playbook is missing a Google Drive link. I've holding space for it here.</p>
                  </div>
                </div>
                
                <h2 className="text-3xl avant-garde font-bold uppercase tracking-[0.1em] mb-6 text-white/90">Objective</h2>
                <p className="text-lg text-white/70 mb-12 leading-relaxed font-sans">{activePlaybook.objective}</p>

                <h3 className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/20 mb-8">Metadata Slots</h3>
                <div className="grid grid-cols-2 gap-4 mb-20">
                    {['Lead Name', 'Company URL', 'First Outreach', 'Follow-up Date'].map(slot => (
                      <div key={slot} className={cn(
                        "p-6 rounded-2xl transition-all cursor-pointer group",
                        isHobbit ? "bg-[#1e221e] border border-white/5 hover:border-emerald-500/30" : "glass border-white/5 hover:border-white/20"
                      )}>
                        <span className="text-[10px] font-mono text-white/30 uppercase mb-2 block tracking-widest">{slot}</span>
                        <div className="text-white/20 group-hover:text-white/40 transition-colors italic">Empty Slot</div>
                      </div>
                    ))}
                </div>

                <div className="markdown-body p-10 rounded-[42px] bg-black/30 border border-[#3a4a3e]/20 prose-headings:font-bold prose-headings:avant-garde prose-headings:uppercase prose-headings:tracking-widest">
                  <Markdown>
                    {`# Structure & Flow\n\nThis is a declarative blueprint for your **${activePlaybook.title}**. \n\n## 1. Capture Points\n- Voice memos from iPhone\n- LinkedIn DM screenshots\n\n## 2. Decision Logic\nIf lead fits avatar, then initiate "Intro" sequence.`}
                  </Markdown>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-20 text-center opacity-40">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-8 border border-white/10 animate-pulse">
                <Search className="w-8 h-8 text-white/20" />
              </div>
              <h3 className="avant-garde uppercase tracking-widest text-2xl font-light">Select a Seedling to examine its blueprint.</h3>
              <p className="text-sm font-mono mt-4 uppercase tracking-[0.2em]">The Playbook Factory</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
