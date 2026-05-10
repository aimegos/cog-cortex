import { motion } from 'motion/react';
import { 
  Calendar, 
  CheckCircle2, 
  Trophy, 
  CloudRain, 
  Sun, 
  Zap, 
  Clock, 
  MessageSquare, 
  ArrowRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Aesthetic } from '../types';

interface DashboardProps {
  aesthetic: Aesthetic;
  isLight: boolean;
}

export const Dashboard = ({ aesthetic, isLight }: DashboardProps) => {
  const gnomesActivity = [
    { id: 1, action: "Pruned outdated LinkedIn DMs", time: "2h ago", gnome: "Gimli" },
    { id: 2, action: "Mapped 'Career' playbook to Google Drive", time: "5h ago", gnome: "Pippin" },
    { id: 3, action: "Retrieved fresh research for 'Health' pillar", time: "1d ago", gnome: "Bilbo" },
  ];

  const badges = [
    { id: 'first-capture', icon: Zap, label: 'First Spark', color: 'text-amber-400' },
    { id: 'daily-streak', icon: Trophy, label: '3 Day Bloom', color: 'text-emerald-400' },
    { id: 'focus-master', icon: Award, label: 'Focus Sage', color: 'text-purple-400' },
  ];

  const tasks = [
    { id: 1, text: "Review 'Q3 Strategy' Playbook", done: false, priority: true },
    { id: 2, text: "Capture voice memo: 'Innovation Day' ideas", done: false },
    { id: 3, text: "Check Google Drive for 'Budget' updates", done: true },
  ];

  const isHobbit = aesthetic === Aesthetic.HOBBIT;

  return (
    <div className="h-full overflow-y-auto p-12 custom-scrollbar">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <h1 className="text-5xl avant-garde font-bold uppercase tracking-tight mb-6 leading-[0.9]">
              Your garden is <span className="text-emerald-500">thriving</span>.
            </h1>
            <p className="font-mono text-[10px] text-white/30 uppercase tracking-[0.3em] flex items-center gap-2">
              <Sun className="w-4 h-4 text-emerald-500" /> System Health: 98% Optimal • 12 Active Gnomes
            </p>
          </div>
          
          <div className="p-8 rounded-[32px] flex items-center gap-8 glass-hobbit">
            <div className="flex flex-col items-center">
              <span className="text-[10px] uppercase font-mono tracking-[0.2em] opacity-30">Weather</span>
              <CloudRain className="w-8 h-8 text-emerald-400 mt-2" />
            </div>
            <div className="h-12 w-px bg-white/5" />
            <div>
              <div className="text-3xl font-bold tracking-tighter avant-garde">22°C</div>
              <div className="text-[10px] uppercase tracking-[0.2em] font-mono opacity-30 mt-1">Gentle Rain Shower</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-10">
          {/* Main Quest / MIT */}
          <div className="col-span-12 lg:col-span-8 space-y-10">
            <section className="p-10 rounded-[48px] relative overflow-hidden glass-hobbit">
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-10">
                  <div className="p-2 bg-emerald-500/20 rounded-xl">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h2 className="text-sm font-mono uppercase tracking-[0.3em] text-white/40">Main Expedition</h2>
                </div>
                
                <div className="space-y-8">
                    <div className="flex items-center justify-between group cursor-pointer">
                        <div className="flex items-center gap-8">
                            <div className="w-14 h-14 rounded-2xl border-2 border-emerald-500/30 flex items-center justify-center font-bold text-emerald-400 bg-emerald-500/5">
                                1
                            </div>
                            <div>
                                <h3 className="text-xl avant-garde font-bold uppercase tracking-wider">Finalize the 'Deep Work' Playbook</h3>
                                <p className="opacity-40 text-[11px] font-mono uppercase tracking-widest mt-2">High Impact • Estimated 45m Effort</p>
                            </div>
                        </div>
                        <ArrowRight className="w-8 h-8 opacity-0 group-hover:opacity-100 group-hover:translate-x-3 transition-all text-emerald-500" />
                    </div>
                    
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                            className="h-full bg-emerald-500 shadow-[0_0_15px_#10b981]"
                            initial={{ width: 0 }}
                            animate={{ width: '65%' }}
                        />
                    </div>
                </div>
              </div>
              
              {/* Decorative background for Accomplishment */}
              <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-emerald-500/5 blur-[100px] rounded-full" />
            </section>

            <div className="grid grid-cols-2 gap-10">
              {/* Gnome Activity */}
              <div className="p-10 rounded-[48px] glass-hobbit">
                <h3 className="text-[10px] font-mono uppercase tracking-[0.3em] opacity-30 mb-8 flex items-center gap-3">
                  <MessageSquare className="w-4 h-4" /> Recent Gnome Forays
                </h3>
                <div className="space-y-8">
                    {gnomesActivity.map(a => (
                        <div key={a.id} className="flex gap-5">
                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xs font-bold border border-white/10 uppercase text-white/40">
                                {a.gnome[0]}
                            </div>
                            <div>
                                <div className="text-sm font-medium text-white/90">{a.action}</div>
                                <div className="text-[10px] opacity-30 uppercase mt-1 tracking-[0.2em] font-mono">{a.gnome} • {a.time}</div>
                            </div>
                        </div>
                    ))}
                </div>
              </div>

              {/* Task Mini-Widget */}
              <div className="p-10 rounded-[48px] glass-hobbit">
                <h3 className="text-[10px] font-mono uppercase tracking-[0.3em] opacity-30 mb-8 flex items-center gap-3">
                   <Clock className="w-4 h-4" /> Quick Sprints
                </h3>
                <div className="space-y-6">
                    {tasks.map(t => (
                        <div key={t.id} className="flex items-center gap-4">
                            <div className={cn(
                                "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors",
                                t.done ? "bg-emerald-500 border-emerald-500" : "border-white/10"
                            )}>
                                {t.done && <CheckCircle2 className="w-4 h-4 text-black" />}
                            </div>
                            <span className={cn(
                                "text-[13px] font-sans",
                                t.done ? "opacity-30 line-through" : "opacity-70"
                            )}>{t.text}</span>
                        </div>
                    ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="col-span-12 lg:col-span-4 space-y-10">
            {/* Awards & Badges */}
            <section className="p-10 rounded-[48px] glass-hobbit">
              <h3 className="text-[10px] font-mono uppercase tracking-[0.3em] opacity-30 mb-8">Awards Portfolio</h3>
              <div className="grid grid-cols-1 gap-8">
                {badges.map(b => (
                    <div key={b.id} className="flex items-center gap-5 group cursor-pointer hover:translate-x-3 transition-transform">
                        <div className={cn("p-5 rounded-2xl bg-white/5 border border-white/5 group-hover:border-emerald-500/30 transition-all", b.color)}>
                            <b.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">{b.label}</div>
                            <div className="text-[9px] opacity-30 uppercase tracking-[0.2em] font-mono mt-1">Unlocked 2 days ago</div>
                        </div>
                    </div>
                ))}
              </div>
              
              <div className="mt-10 p-6 rounded-3xl text-[10px] font-mono leading-relaxed opacity-40 bg-black/30 border border-white/5 uppercase tracking-widest text-center">
                Complete 2 more capture logs to unlock 'Windfall'.
              </div>
            </section>

            {/* Upcoming Appointments */}
            <section className="p-10 rounded-[48px] glass-hobbit">
               <h3 className="text-[10px] font-mono uppercase tracking-[0.3em] opacity-30 mb-8 flex items-center justify-between">
                 <span>Calendar Context</span>
                 <Calendar className="w-4 h-4" />
               </h3>
               <div className="space-y-8">
                 <div className="flex gap-5">
                    <div className="flex flex-col items-center">
                        <span className="text-2xl font-bold avant-garde">14</span>
                        <span className="text-[10px] uppercase font-mono opacity-30">May</span>
                    </div>
                    <div>
                        <div className="text-xs avant-garde font-bold uppercase tracking-wider text-white/90">Cannes Innovation Briefing</div>
                        <div className="text-[10px] opacity-30 mt-1 uppercase tracking-[0.2em] font-mono">10:00 AM • Zoom</div>
                    </div>
                 </div>
                 <div className="flex gap-5">
                    <div className="flex flex-col items-center">
                        <span className="text-2xl font-bold avant-garde">15</span>
                        <span className="text-[10px] uppercase font-mono opacity-30">May</span>
                    </div>
                    <div>
                        <div className="text-xs avant-garde font-bold uppercase tracking-wider text-white/90">Neurodiverse Founders Mixer</div>
                        <div className="text-[10px] opacity-30 mt-1 uppercase tracking-[0.2em] font-mono">4:30 PM • Soho House</div>
                    </div>
                 </div>
               </div>
            </section>
            
            {/* Visual Growth Indicator */}
            <div className="h-40 rounded-[48px] flex items-center justify-center relative overflow-hidden glass-hobbit">
                <div className="relative z-10 text-center">
                    <TrendingUp className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
                    <div className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/40">Seedling Growth: +14%</div>
                </div>
                <div className="absolute inset-x-0 bottom-0 h-1.5 bg-emerald-500/10 overflow-hidden">
                     <motion.div 
                        className="h-full bg-emerald-500 shadow-[0_0_25px_#10b981]"
                        initial={{ width: 0 }}
                        animate={{ width: '74%' }}
                     />
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
