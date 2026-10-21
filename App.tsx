import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BarChart3,
  Brain,
  BrainCircuit,
  Calendar,
  Check,
  ChevronRight,
  Clock3,
  FileText,
  Flame,
  Headphones,
  Home,
  Lightbulb,
  Map,
  Menu,
  MessageSquareText,
  MoreHorizontal,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Send,
  Sparkles,
  Target,
  Trash2,
  Trophy,
  UploadCloud,
  Volume2,
  X,
  Zap,
} from 'lucide-react';

type View = 'overview' | 'recall' | 'gaps' | 'rankings' | 'timeline' | 'debate';
type StudyTab = 'debate' | 'flashcards' | 'podcast' | 'mindmap';
type Rating = 'Hard' | 'Good' | 'Easy';
type PodcastMode = 'eli5' | 'brief' | 'deep';
type UploadedFile = { name: string; type: string; size: string };
type ChatRole = 'ai' | 'user';
type ChatMessage = { id: number; role: ChatRole; text: string; defenseOptions?: DefenseOption[]; resolved?: 'correct' | 'wrong' };
type DefenseOption = { letter: 'A' | 'B' | 'C'; text: string; correct: boolean };

/* ---- Hardcoded debate scenario ---- */
const biologyDebate: DefenseOption[] = [
  { letter: 'A', text: 'Because they have a rigid cell wall that creates turgor pressure to stop the water.', correct: true },
  { letter: 'B', text: 'Because they close their stomata.', correct: false },
  { letter: 'C', text: 'The water just evaporates.', correct: false },
];

const debateScenarios = [
  {
    id: 0,
    aiPrompt: 'I scanned your biology PDF. It claims water moves to balance concentration (osmosis). But if that\'s true, why don\'t plant cells just explode when it rains heavily? Prove me wrong.',
    options: biologyDebate,
    successReply: 'Correct. You didn\'t rely on a silent leap in logic. The cell wall is the missing premise — it creates back-pressure that limits water intake. +50 Mastery Points awarded.',
    wrongReply: 'Not quite. Stomata control gas exchange, not water intake pressure. The real answer is the rigid cell wall — it creates turgor pressure that physically resists further water entry. Try again.',
  },
  {
    id: 1,
    aiPrompt: 'Your notes say mitochondria are the "powerhouse of the cell." That\'s a vague cliché. If mitochondria make ATP, why can\'t the cell just use glucose directly for energy instead of converting it? Defend the process.',
    options: [
      { letter: 'A' as const, text: 'ATP is a universal, immediately usable energy currency; glucose releases energy too slowly and uncontrolledly for cellular work.', correct: true },
      { letter: 'B' as const, text: 'Because glucose is toxic to the cell in high amounts.', correct: false },
      { letter: 'C' as const, text: 'Mitochondria store glucose for later use.', correct: false },
    ],
    successReply: 'Exactly. ATP provides quick, controlled energy release at the right moment for specific reactions. Glucose oxidation is too blunt an instrument. +50 Mastery Points awarded.',
    wrongReply: 'Incorrect. Glucose isn\'t toxic — it\'s the starting fuel. The point is that ATP is a controlled, universal energy currency. Glucose releases energy in large, uncontrolled bursts that the cell can\'t direct. Try again.',
  },
];

const modules = [
  { title: 'Cell Biology', meta: '8 debates · 22 min', color: 'emerald', icon: Brain, progress: 72 },
  { title: 'Neural Networks', meta: '12 debates · 34 min', color: 'teal', icon: Zap, progress: 48 },
  { title: 'UX Research Methods', meta: '6 debates · 14 min', color: 'sky', icon: Target, progress: 91 },
];

const flashcards = [
  { question: 'What is osmosis?', answer: 'The net movement of water across a partially permeable membrane from a region of higher water potential to a region of lower water potential.' },
  { question: 'Why don\'t plant cells burst in water?', answer: 'The rigid cell wall creates turgor pressure that pushes back against water entry, preventing the cell from bursting.' },
  { question: 'What is turgor pressure?', answer: 'The pressure exerted by fluid inside a plant cell against the cell wall, providing structural support.' },
  { question: 'What does ATP stand for?', answer: 'Adenosine triphosphate — the universal energy currency of cells.' },
  { question: 'Why is ATP preferred over glucose for cellular work?', answer: 'ATP releases energy in small, controlled amounts that can be directed to specific reactions, unlike glucose which releases energy in large uncontrolled bursts.' },
];

const peers = [
  { name: 'Nadia Karim', points: 2680, initials: 'NK', color: 'bg-amber-500' },
  { name: 'You', points: 2460, initials: 'AS', color: 'bg-emerald-500', current: true },
  { name: 'Daniel Wong', points: 2240, initials: 'DW', color: 'bg-teal-500' },
  { name: 'Mei Ling', points: 1980, initials: 'ML', color: 'bg-sky-500' },
  { name: 'Ravi Kumar', points: 1760, initials: 'RK', color: 'bg-rose-500' },
];

const suggestedQuestions = [
  'Can you summarize the main idea?',
  'What is the most important concept?',
  'Give me a real-world example',
  'What should I memorize for the exam?',
];

const podcastScripts: Record<PodcastMode, string> = {
  eli5: "Okay, imagine your brain is a big toy box. When you learn something new, you drop a toy in. But if you never take it out and play with it, you forget where it is! Active recall is like taking the toy out and looking at it again and again. Every time you try to remember without peeking, your brain builds a stronger path to that toy. Spaced repetition is like setting a timer — you check on the toy right before you forget it. That makes the memory stick for a really long time!",
  brief: "Active recall is the practice of actively retrieving information from memory rather than passively re-reading. Research shows this is far more effective for long-term retention. Spaced repetition complements this by scheduling reviews at increasing intervals, right before you forget. Together, these techniques form the backbone of evidence-based study strategies.",
  deep: "Active recall refers to retrieving information from long-term memory without external cues. The testing effect, documented by Roediger and Karpicke in 2006, demonstrates that retrieval itself produces more learning than equivalent study time. Spaced repetition leverages the spacing effect, first described by Ebbinghaus in 1885. The optimal interval places the review just as the forgetting curve descends. Algorithms like SM-2 dynamically adjust intervals based on performance. Combined with interleaving, these methods promote transfer of learning to novel contexts.",
};

const podcastAnswers: Record<string, string> = {
  'Can you summarize the main idea?': 'The core idea is that actively retrieving information from memory — testing yourself — strengthens long-term retention far more than passively re-reading. Pair that with spaced repetition for a highly effective strategy.',
  'What is the most important concept?': 'The testing effect: the act of pulling information out of your memory is itself a powerful learning event, not just a measure of what you know.',
  'Give me a real-world example': 'Instead of re-reading your notes on osmosis, close them and write down everything you remember. Struggling to recall is what strengthens the memory. Repeat tomorrow, then in three days.',
  'What should I memorize for the exam?': 'Focus on osmosis and turgor pressure, the role of ATP versus glucose, and the testing effect. Those are the high-yield concepts likely to appear.',
};

const initialMindNodes = [
  { id: 'center', label: 'Active recall', sub: 'Core method', kind: 'center' as const },
  { id: 'top', label: 'Retrieval', sub: 'Pull knowledge out', kind: 'top' as const, children: ['Quiz yourself', 'Free recall', 'Practice tests'] },
  { id: 'right', label: 'Spacing', sub: 'Return over time', kind: 'right' as const, children: ['Daily review', 'Increasing intervals'] },
  { id: 'bottom', label: 'Feedback', sub: 'Notice the gaps', kind: 'bottom' as const, children: ['Self-check', 'Correct mistakes'] },
  { id: 'left', label: 'Elaboration', sub: 'Connect ideas', kind: 'left' as const, children: ['Analogies', 'Explain aloud'] },
];

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function App() {
  const [view, setView] = useState<View>('overview');
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [points, setPoints] = useState(2460);

  const navSections: { heading: string; items: { label: string; icon: typeof Home; view: View; badge?: string }[] }[] = [
    {
      heading: 'Workspace',
      items: [
        { label: 'Overview', icon: Home, view: 'overview' },
        { label: 'Active-Recall Hub', icon: Brain, view: 'recall' },
        { label: 'Cognitive Gaps', icon: Target, view: 'gaps' },
      ],
    },
    {
      heading: 'Your journey',
      items: [
        { label: 'Mastery Rankings', icon: Trophy, view: 'rankings', badge: '#2' },
        { label: 'Repetition Timeline', icon: Calendar, view: 'timeline' },
      ],
    },
  ];

  const go = (v: View) => { setView(v); setShowMobileNav(false); };

  return (
    <div className="min-h-screen overflow-hidden bg-zinc-950 text-zinc-200">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="aurora aurora-emerald" />
        <div className="aurora aurora-teal" />
        <div className="grid-overlay" />
      </div>
      <div className="relative z-10 flex min-h-screen">
        {/* ---- Sidebar ---- */}
        <aside className="hidden w-[250px] shrink-0 flex-col border-r border-zinc-800/80 bg-zinc-900/50 px-5 py-7 backdrop-blur-xl lg:flex">
          <Brand />
          <div className="mt-10 flex flex-1 flex-col">
            {navSections.map((section) => (
              <div key={section.heading} className="mb-6">
                <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">{section.heading}</p>
                <nav className="space-y-1">
                  {section.items.map(({ label, icon: Icon, view: itemView, badge }) => (
                    <button key={label} onClick={() => go(itemView)} className={`nav-item ${view === itemView ? 'nav-item-active' : ''}`}>
                      <Icon size={18} strokeWidth={view === itemView ? 2.2 : 1.8} />
                      <span>{label}</span>
                      {badge && <span className="ml-auto rounded-md bg-zinc-800 px-1.5 py-0.5 text-[10px] font-bold text-zinc-500">{badge}</span>}
                    </button>
                  ))}
                </nav>
              </div>
            ))}
            <div className="mt-auto rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
              <div className="mb-2 flex items-center gap-2"><Sparkles size={15} className="text-emerald-400" /><span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Pro tip</span></div>
              <p className="text-xs leading-5 text-zinc-500">Defend your knowledge out loud. If you can\'t explain it, you don\'t own it.</p>
            </div>
          </div>
          <div className="mt-5 flex items-center gap-3 border-t border-zinc-800 pt-5">
            <div className="avatar">AS</div>
            <div className="min-w-0"><p className="truncate text-sm font-semibold text-zinc-200">Aina Sofea</p><p className="text-[11px] text-zinc-600">Level 12 · Skeptic</p></div>
            <MoreHorizontal size={16} className="ml-auto text-zinc-600" />
          </div>
        </aside>

        {/* ---- Main ---- */}
        <main className="min-w-0 flex-1">
          <header className="flex h-[72px] items-center justify-between border-b border-zinc-800/80 bg-zinc-950/60 px-5 backdrop-blur-md sm:px-8 lg:px-10">
            <div className="flex items-center gap-4">
              <button onClick={() => setShowMobileNav(!showMobileNav)} className="rounded-lg border border-zinc-800 bg-zinc-900 p-2 lg:hidden"><Menu size={18} /></button>
              <div className="lg:hidden"><Brand compact /></div>
              <div className="hidden text-sm text-zinc-600 sm:block">CogniSync / {view.charAt(0).toUpperCase() + view.slice(1)}</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 sm:flex">
                <Zap size={14} className="text-emerald-400" />
                <span className="text-xs font-bold text-zinc-200">{points.toLocaleString()}</span>
                <span className="text-[10px] text-zinc-600">Mastery</span>
              </div>
              <div className="avatar">AS</div>
            </div>
          </header>

          <AnimatePresence>
            {showMobileNav && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="absolute left-4 right-4 top-[66px] z-30 rounded-2xl border border-zinc-800 bg-zinc-900 p-3 shadow-2xl lg:hidden">
                {navSections.flatMap((s) => s.items).map(({ label, icon: Icon, view: itemView, badge }) => (
                  <button key={label} onClick={() => go(itemView)} className={`nav-item ${view === itemView ? 'nav-item-active' : ''}`}>
                    <Icon size={18} /><span>{label}</span>
                    {badge && <span className="ml-auto rounded-md bg-zinc-800 px-1.5 py-0.5 text-[10px] font-bold text-zinc-500">{badge}</span>}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {view === 'overview' && <Overview key="overview" points={points} onGo={go} onDebate={() => go('recall')} />}
            {view === 'recall' && <RecallHub key="recall" points={points} setPoints={setPoints} onBack={() => go('overview')} />}
            {view === 'gaps' && <DraftView key="gaps" title="Cognitive Gaps" icon={<Target size={28} />} onBack={() => go('overview')} />}
            {view === 'rankings' && <Rankings key="rankings" onBack={() => go('overview')} />}
            {view === 'timeline' && <DraftView key="timeline" title="Repetition Timeline" icon={<Calendar size={28} />} onBack={() => go('overview')} />}
            {view === 'debate' && <RecallHub key="debate" points={points} setPoints={setPoints} onBack={() => go('overview')} />}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`flex items-center gap-2.5 ${compact ? '' : 'px-3'}`}>
      <div className="brand-mark"><BrainCircuit size={19} /></div>
      <span className="text-[17px] font-bold tracking-[-0.04em] text-zinc-100">cogni<span className="text-emerald-400">sync</span></span>
    </div>
  );
}

/* ============ Overview ============ */

function Overview({ points, onGo, onDebate }: { points: number; onGo: (v: View) => void; onDebate: () => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35 }} className="mx-auto max-w-[1200px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
      <div className="mb-8">
        <p className="mb-2 text-sm font-medium text-emerald-400">The Skeptical Peer Engine</p>
        <h1 className="text-3xl font-bold tracking-[-0.04em] text-zinc-50 sm:text-[40px]">Defend what you know.</h1>
        <p className="mt-2 max-w-lg text-sm text-zinc-500">Standard AI tutors are passive. CogniSync acts as a combative study partner — it challenges your understanding with deliberate misconceptions and forces you to prove you actually know the material.</p>
      </div>

      {/* ---- Upload zone ---- */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); }}
        className={`upload-zone mb-8 ${dragging ? 'upload-zone-active' : ''}`}
      >
        <div className="upload-icon"><UploadCloud size={26} /></div>
        <div>
          <h2 className="text-lg font-bold text-zinc-100">Upload your syllabus or lecture PDF to initiate a debate.</h2>
          <p className="mx-auto mt-1.5 max-w-md text-sm text-zinc-500">The AI will scan your material, find the weakest links in your understanding, and challenge you to defend them.</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button onClick={() => fileRef.current?.click()} className="primary-button"><UploadCloud size={16} />Choose a file</button>
          <button onClick={onDebate} className="secondary-button"><Sparkles size={15} />Try a sample debate</button>
        </div>
        <p className="text-[11px] font-medium text-zinc-600">PDF, Word (.docx), PowerPoint (.pptx) up to 25 MB</p>
        <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.ppt,.pptx" className="hidden" onChange={() => onDebate()} />
      </div>

      {/* ---- Stats ---- */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <StatCard icon={<Zap size={19} />} label="Mastery Points" value={points.toLocaleString()} change="+50 this session" accent="emerald" />
        <StatCard icon={<Flame size={19} />} label="Day Streak" value="5 days" change="Personal best: 12" accent="amber" />
        <StatCard icon={<Clock3 size={19} />} label="Focus Hours" value="6.4h" change="+22% vs last week" accent="sky" />
      </div>

      {/* ---- Modules + Leaderboard ---- */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div><h2 className="section-title">Recent debates</h2><p className="mt-1 text-xs text-zinc-600">Pick up where you left off</p></div>
            <button onClick={() => onGo('rankings')} className="subtle-button">View all<ChevronRight size={14} /></button>
          </div>
          <div className="grid gap-4 md:grid-cols-3">{modules.map((m) => <ModuleCard key={m.title} module={m} onClick={onDebate} />)}</div>
        </section>
        <aside className="space-y-5">
          <StreakCard onStart={onDebate} />
          <Leaderboard />
        </aside>
      </div>
    </motion.div>
  );
}

function StatCard({ icon, label, value, change, accent }: { icon: React.ReactNode; label: string; value: string; change: string; accent: 'emerald' | 'amber' | 'sky' }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon stat-${accent}`}>{icon}</div>
      <div className="mt-5 flex items-end justify-between gap-2">
        <div><p className="text-xs text-zinc-500">{label}</p><p className="mt-1 text-2xl font-bold tracking-tight text-zinc-50">{value}</p></div>
        <span className="mb-1 rounded-md bg-emerald-500/10 px-2 py-1 text-[10px] font-semibold text-emerald-400">{change.split(' ')[0]}</span>
      </div>
      <p className="mt-2 text-[10px] text-zinc-600">{change}</p>
    </div>
  );
}

function ModuleCard({ module, onClick }: { module: typeof modules[number]; onClick: () => void }) {
  const Icon = module.icon;
  return (
    <button onClick={onClick} className="module-card group text-left">
      <div className={`module-icon module-${module.color}`}><Icon size={20} /></div>
      <div className="mt-5 flex items-start justify-between gap-2">
        <div><h3 className="text-sm font-semibold text-zinc-100">{module.title}</h3><p className="mt-1 text-[11px] text-zinc-600">{module.meta}</p></div>
        <ChevronRight size={15} className="mt-0.5 text-zinc-700 transition group-hover:text-emerald-400" />
      </div>
      <div className="mt-5 flex items-center gap-3">
        <div className="progress-track"><div className={`progress-fill fill-${module.color}`} style={{ width: `${module.progress}%` }} /></div>
        <span className="text-[10px] font-semibold text-zinc-500">{module.progress}%</span>
      </div>
    </button>
  );
}

function StreakCard({ onStart }: { onStart: () => void }) {
  return (
    <div className="streak-card">
      <div className="flex items-start justify-between">
        <div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-amber-500">Keep the momentum</p><p className="mt-2 text-2xl font-bold text-zinc-50">5 <span className="text-sm font-medium text-zinc-500">day streak</span></p></div>
        <div className="flame-orb"><Flame size={22} /></div>
      </div>
      <div className="mt-5 flex gap-2">{['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
        <div key={`${day}-${i}`} className={`streak-day ${i < 5 ? 'streak-day-active' : ''}`}><span>{day}</span>{i < 5 ? <Check size={11} /> : <span className="h-1 w-1 rounded-full bg-zinc-700" />}</div>
      ))}</div>
      <p className="mt-5 text-xs leading-5 text-zinc-500">One more debate today keeps your streak alive.</p>
      <button onClick={onStart} className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-amber-500 transition hover:text-amber-400">Continue learning<ArrowRight size={14} /></button>
    </div>
  );
}

function Leaderboard() {
  return (
    <div className="panel p-5">
      <div className="mb-5 flex items-center justify-between"><div><h2 className="section-title">Mastery Rankings</h2><p className="mt-1 text-[11px] text-zinc-600">This month</p></div><Trophy size={20} className="text-amber-500" /></div>
      <div className="space-y-3">{peers.map((peer, i) => (
        <div key={peer.name} className={`flex items-center gap-3 ${peer.current ? 'rounded-xl bg-emerald-500/[0.06] px-3 py-2.5 ring-1 ring-emerald-500/10' : ''}`}>
          <span className={`w-4 text-center text-xs font-bold ${i < 3 ? 'text-zinc-300' : 'text-zinc-700'}`}>{i + 1}</span>
          <div className={`flex h-7 w-7 items-center justify-center rounded-full text-[9px] font-bold text-white ${peer.color}`}>{peer.initials}</div>
          <span className={`min-w-0 flex-1 truncate text-xs ${peer.current ? 'font-semibold text-zinc-100' : 'text-zinc-500'}`}>{peer.name}</span>
          <span className="text-[11px] font-semibold text-zinc-400">{peer.points.toLocaleString()}</span>
        </div>
      ))}</div>
    </div>
  );
}

/* ============ Recall Hub (Study session with tabs) ============ */

function RecallHub({ points, setPoints, onBack }: { points: number; setPoints: (fn: (v: number) => number) => void; onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<StudyTab>('debate');
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeStep, setAnalyzeStep] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    setUploadedFiles((prev) => [{ name: file.name, type: file.type || 'file', size: formatSize(file.size) }, ...prev]);
    setIsAnalyzing(true);
  };

  const handleDemoUpload = () => {
    setUploadedFiles((prev) => [{ name: 'Biology — Lecture 04.pdf', type: 'application/pdf', size: '2.4 MB' }, ...prev]);
    setIsAnalyzing(true);
  };

  useEffect(() => {
    if (!isAnalyzing) return;
    setAnalyzeStep(0);
    const timer = window.setInterval(() => {
      setAnalyzeStep((s) => {
        if (s >= 3) { window.clearInterval(timer); window.setTimeout(() => setIsAnalyzing(false), 600); return s; }
        return s + 1;
      });
    }, 850);
    return () => window.clearInterval(timer);
  }, [isAnalyzing]);

  const currentCard = flashcards[cardIndex];
  const sessionProgress = Math.round(((cardIndex + (flipped ? 0.5 : 0)) / flashcards.length) * 100);

  const rateCard = (rating: Rating) => {
    const award = rating === 'Easy' ? 30 : rating === 'Good' ? 20 : 10;
    setPoints((v) => v + award);
    setFlipped(false);
    setCardIndex((v) => (v + 1) % flashcards.length);
  };

  const tabs: { id: StudyTab; label: string; icon: typeof Brain }[] = [
    { id: 'debate', label: 'Skeptical Peer', icon: MessageSquareText },
    { id: 'flashcards', label: 'Flashcards', icon: FileText },
    { id: 'podcast', label: 'Podcast', icon: Headphones },
    { id: 'mindmap', label: 'Mind map', icon: Map },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35 }} className="mx-auto max-w-[1000px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
      <button onClick={onBack} className="mb-8 flex items-center gap-2 text-xs font-semibold text-zinc-600 transition hover:text-emerald-400"><ArrowLeft size={15} />Back to overview</button>

      {/* ---- Upload inside session ---- */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
        className="mb-7 flex items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900/60 px-5 py-4"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400"><UploadCloud size={18} /></div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-zinc-200">Upload lecture material for this session</p>
          <p className="mt-0.5 text-[11px] text-zinc-600">Drag a PDF, Word, or PPTX here — the AI will analyze it and build your debate.</p>
        </div>
        <button onClick={() => fileRef.current?.click()} className="secondary-button"><UploadCloud size={14} />Browse</button>
        <button onClick={handleDemoUpload} className="secondary-button"><Sparkles size={14} />Sample</button>
        <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.ppt,.pptx" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
      </div>

      {uploadedFiles.length > 0 && (
        <div className="mb-6 space-y-2">
          {uploadedFiles.map((f, i) => (
            <div key={`${f.name}-${i}`} className="panel flex items-center gap-3 px-4 py-3">
              <FileText size={16} className="text-emerald-400" />
              <span className="min-w-0 flex-1 truncate text-xs font-medium text-zinc-300">{f.name}</span>
              <span className="text-[10px] text-zinc-600">{f.size}</span>
              <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400">Analyzed</span>
              <button onClick={() => setUploadedFiles((prev) => prev.filter((_, idx) => idx !== i))} className="rounded p-1 text-zinc-700 hover:text-rose-400"><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
      )}

      <div className="mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold text-emerald-400"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />Active-Recall Hub / Cell Biology</div>
          <h1 className="text-2xl font-bold tracking-[-0.04em] text-zinc-50 sm:text-3xl">Prove you know it.</h1>
        </div>
        <div className="w-full sm:w-48">
          <div className="mb-2 flex justify-between text-[10px] font-semibold uppercase tracking-wider text-zinc-600"><span>Progress</span><span className="text-emerald-400">{sessionProgress}%</span></div>
          <div className="progress-track h-1.5"><div className="progress-fill fill-emerald" style={{ width: `${Math.max(sessionProgress, 4)}%` }} /></div>
        </div>
      </div>

      <div className="study-tabs">{tabs.map(({ id, label, icon: Icon }) => (
        <button key={id} onClick={() => setActiveTab(id)} className={`study-tab ${activeTab === id ? 'study-tab-active' : ''}`}><Icon size={16} />{label}</button>
      ))}</div>

      <AnimatePresence mode="wait">
        {activeTab === 'debate' && <DebatePanel key="debate" points={points} setPoints={setPoints} />}
        {activeTab === 'flashcards' && <FlashcardPanel key="flashcards" currentCard={currentCard} cardIndex={cardIndex} flipped={flipped} setFlipped={setFlipped} rateCard={rateCard} />}
        {activeTab === 'podcast' && <PodcastPanel key="podcast" />}
        {activeTab === 'mindmap' && <MindMapPanel key="mindmap" />}
      </AnimatePresence>

      <AnimatePresence>
        {isAnalyzing && <AnalyzeModal step={analyzeStep} name={uploadedFiles[0]?.name || ''} onClose={() => setIsAnalyzing(false)} />}
      </AnimatePresence>
    </motion.div>
  );
}

/* ============ Skeptical Peer Chat ============ */

function DebatePanel({ points, setPoints }: { points: number; setPoints: (fn: (v: number) => number) => void }) {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 0, role: 'ai', text: debateScenarios[0].aiPrompt, defenseOptions: debateScenarios[0].options },
  ]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }); }, [messages, isThinking]);

  const handleDefense = (msgId: number, option: DefenseOption) => {
    const scenario = debateScenarios[scenarioIdx];
    setMessages((prev) => prev.map((m) => m.id === msgId ? { ...m, resolved: option.correct ? 'correct' : 'wrong' } : m));

    if (option.correct) {
      setPoints((v) => v + 50);
      setShowConfetti(true);
      window.setTimeout(() => setShowConfetti(false), 2000);
      window.setTimeout(() => {
        setMessages((prev) => [...prev, { id: prev.length, role: 'ai', text: scenario.successReply }]);
      }, 600);
    } else {
      setIsThinking(true);
      window.setTimeout(() => {
        setIsThinking(false);
        setMessages((prev) => [...prev, { id: prev.length, role: 'ai', text: scenario.wrongReply }]);
      }, 1200);
    }
  };

  const nextScenario = () => {
    const next = (scenarioIdx + 1) % debateScenarios.length;
    setScenarioIdx(next);
    setIsThinking(true);
    window.setTimeout(() => {
      setIsThinking(false);
      setMessages((prev) => [...prev, { id: prev.length, role: 'ai', text: debateScenarios[next].aiPrompt, defenseOptions: debateScenarios[next].options }]);
    }, 1400);
  };

  const lastMsg = messages[messages.length - 1];
  const hasUnresolvedOptions = lastMsg?.defenseOptions && !lastMsg.resolved;
  const lastResolvedCorrect = messages.some((m) => m.resolved === 'correct');

  return (
    <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} className="mx-auto max-w-3xl">
      <div className="mb-5 flex items-center justify-between">
        <div><h2 className="text-lg font-bold text-zinc-50">Skeptical Peer</h2><p className="mt-1 text-xs text-zinc-600">The AI will challenge you. Defend your knowledge.</p></div>
        <div className="flex items-center gap-2">
          <span className="points-badge"><Zap size={13} />{points.toLocaleString()}</span>
          {lastResolvedCorrect && !hasUnresolvedOptions && (
            <button onClick={nextScenario} className="primary-button"><ArrowRight size={15} />Next challenge</button>
          )}
        </div>
      </div>

      <div className="chat-container">
        <div ref={scrollRef} className="max-h-[520px] overflow-y-auto">
          {messages.map((msg) => (
            <div key={msg.id}>
              {msg.role === 'ai' ? (
                <div className="chat-msg-ai">
                  <div className="chat-avatar-ai"><BrainCircuit size={18} /></div>
                  <div className="chat-bubble-ai">
                    <span className="chat-name-ai">Skeptical Peer</span>
                    <p className="chat-text">{msg.text}</p>
                    {msg.defenseOptions && (
                      <div className="mt-4 space-y-2.5">
                        {msg.defenseOptions.map((opt) => {
                          const showResult = msg.resolved !== undefined;
                          return (
                            <button
                              key={opt.letter}
                              onClick={() => !msg.resolved && handleDefense(msg.id, opt)}
                              disabled={!!msg.resolved}
                              className={`defense-button ${showResult ? (opt.correct ? 'defense-correct' : 'defense-wrong') : ''}`}
                            >
                              <span className="defense-letter">{showResult && opt.correct ? <Check size={14} /> : showResult && !opt.correct ? <X size={14} /> : opt.letter}</span>
                              <span className="defense-text">{opt.text}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                    {msg.resolved === 'correct' && (
                      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mt-3">
                        <span className="points-badge"><Check size={13} />+50 Mastery Points awarded</span>
                      </motion.div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="chat-msg-user">
                  <div className="chat-avatar-user">AS</div>
                  <div className="chat-bubble-user">
                    <span className="chat-name-user">You</span>
                    <p className="chat-text-user">{msg.text}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
          {isThinking && (
            <div className="chat-msg-ai">
              <div className="chat-avatar-ai"><BrainCircuit size={18} /></div>
              <div className="flex items-center gap-1.5 pt-2">
                <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confetti animation */}
      <AnimatePresence>
        {showConfetti && (
          <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2">
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 1, y: 0, x: 0, rotate: 0 }}
                  animate={{ opacity: 0, y: 120 + Math.random() * 80, x: (Math.random() - 0.5) * 200, rotate: Math.random() * 360 }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                  className="absolute h-2 w-2 rounded-sm"
                  style={{ background: ['#10b981', '#34d399', '#14b8a6', '#fbbf24', '#38bdf8'][i % 5] }}
                />
              ))}
            </div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ============ Flashcards ============ */

function FlashcardPanel({ currentCard, cardIndex, flipped, setFlipped, rateCard }: { currentCard: typeof flashcards[number]; cardIndex: number; flipped: boolean; setFlipped: (v: boolean) => void; rateCard: (r: Rating) => void }) {
  return (
    <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} className="mx-auto max-w-3xl">
      <div className="mb-4 flex items-center justify-between text-[11px] font-semibold text-zinc-600">
        <span>Question {cardIndex + 1} of {flashcards.length}</span>
        <span className="flex items-center gap-1.5"><RotateCcw size={13} /> Active recall</span>
      </div>
      <button onClick={() => setFlipped(!flipped)} className="flashcard group">
        <div className="relative flex h-full flex-col items-center justify-center px-8 text-center sm:px-20">
          {flipped ? (
            <><span className="card-label card-label-answer">Answer</span><p className="mt-5 max-w-xl text-xl font-semibold leading-8 tracking-[-0.02em] text-zinc-50 sm:text-2xl">{currentCard.answer}</p></>
          ) : (
            <><span className="card-label">Question</span><p className="mt-5 max-w-xl text-xl font-semibold leading-8 tracking-[-0.02em] text-zinc-50 sm:text-2xl">{currentCard.question}</p><p className="absolute bottom-8 text-[11px] font-medium text-zinc-600 transition group-hover:text-emerald-400">Click card to reveal answer</p></>
          )}
        </div>
      </button>
      <div className="mt-5 grid grid-cols-3 gap-3">
        <button onClick={() => rateCard('Hard')} className="rating-button rating-hard"><X size={15} />Hard</button>
        <button onClick={() => rateCard('Good')} className="rating-button rating-good"><Check size={15} />Good</button>
        <button onClick={() => rateCard('Easy')} className="rating-button rating-easy"><Zap size={15} />Easy</button>
      </div>
    </motion.div>
  );
}

/* ============ Podcast ============ */

type QAItem = { role: 'user' | 'ai'; text: string };
function PodcastPanel() {
  const [mode, setMode] = useState<PodcastMode>('brief');
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [question, setQuestion] = useState('');
  const [qaList, setQaList] = useState<QAItem[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);
  const intervalRef = useRef<number | null>(null);

  const script = podcastScripts[mode];
  const bars = useMemo(() => Array.from({ length: 48 }, (_, i) => 18 + ((i * 17) % 42)), []);

  const stopAudio = () => {
    if (intervalRef.current) { window.clearInterval(intervalRef.current); intervalRef.current = null; }
    if (utterRef.current) { window.speechSynthesis.cancel(); utterRef.current = null; }
    setIsPlaying(false);
  };

  const playAudio = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = mode === 'eli5' ? 0.95 : mode === 'deep' ? 0.92 : 1;
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find((v) => /en-US|en_GB|en-GB/i.test(v.lang));
    if (preferred) u.voice = preferred;
    u.onend = () => { setIsPlaying(false); if (intervalRef.current) { window.clearInterval(intervalRef.current); intervalRef.current = null; } setProgress(0); };
    u.onerror = () => { setIsPlaying(false); if (intervalRef.current) { window.clearInterval(intervalRef.current); intervalRef.current = null; } };
    utterRef.current = u;
    window.speechSynthesis.speak(u);
    setIsPlaying(true);
    setProgress(0);
    const totalSecs = Math.max(10, Math.round(text.length / 15));
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    intervalRef.current = window.setInterval(() => setProgress((p) => Math.min(p + 100 / totalSecs, 100)), 1000);
  };

  const togglePlay = () => { if (isPlaying) { stopAudio(); setProgress(0); } else playAudio(script); };
  const switchMode = (m: PodcastMode) => { stopAudio(); setProgress(0); setMode(m); };
  useEffect(() => () => stopAudio(), []);

  const sendQuestion = (text: string) => {
    const q = text.trim();
    if (!q) return;
    setQaList((prev) => [...prev, { role: 'user', text: q }]);
    setQuestion('');
    setIsThinking(true);
    stopAudio();
    const answer = podcastAnswers[q] || `Based on your lecture, here is how I would answer "${q}": the key idea is that active retrieval — trying to remember without looking — is what builds durable memory. Apply it by closing your notes and writing down everything you can recall, then checking what you missed.`;
    window.setTimeout(() => { setIsThinking(false); setQaList((prev) => [...prev, { role: 'ai', text: answer }]); playAudio(answer); }, 1100);
  };

  const formatTime = (pct: number) => {
    const total = Math.round(script.length / 15);
    const current = Math.round((pct / 100) * total);
    return `${String(Math.floor(current / 60)).padStart(2, '0')}:${String(current % 60).padStart(2, '0')}`;
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="mx-auto max-w-3xl">
      <div className="mb-5"><h2 className="text-lg font-bold text-zinc-50">Recap podcast</h2><p className="mt-1 text-xs text-zinc-600">Listen to an AI-narrated recap. Choose a style and ask questions.</p></div>
      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        {(['eli5', 'brief', 'deep'] as PodcastMode[]).map((m) => (
          <button key={m} onClick={() => switchMode(m)} className={`mode-chip flex-col !items-start gap-1 !rounded-xl !p-4 ${mode === m ? 'mode-chip-active' : ''}`}>
            <span className="flex items-center gap-2">{m === 'eli5' && <Lightbulb size={15} />}{m === 'brief' && <FileText size={15} />}{m === 'deep' && <BrainCircuit size={15} />}{m === 'eli5' ? 'Explain like I\'m 5' : m === 'brief' ? 'Normal brief' : 'Deep dive'}</span>
            <span className={`text-[10px] font-medium ${mode === m ? 'text-emerald-900' : 'text-zinc-600'}`}>{m === 'eli5' ? 'Simple words, fun analogies' : m === 'brief' ? 'Clear, balanced summary' : 'Thorough, detailed walk-through'}</span>
          </button>
        ))}
      </div>
      <div className="podcast-card">
        <div className="flex items-center gap-4">
          <div className="podcast-art"><Headphones size={28} /></div>
          <div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400">{isPlaying ? 'Now playing' : 'Recap'}</p><h3 className="mt-2 text-base font-bold text-zinc-50">{mode === 'eli5' ? 'ELI5' : mode === 'brief' ? 'Brief' : 'Deep dive'} — Cell Biology</h3><p className="mt-1 text-xs text-zinc-600">AI-narrated recap from your lecture</p></div>
        </div>
        <div className="waveform">{bars.map((h, i) => <span key={i} className={isPlaying && i % 3 !== 0 ? 'wave-active' : ''} style={{ height: `${h}%`, animationDelay: `${i * 0.035}s` }} />)}</div>
        <div className="flex items-center gap-4">
          <button onClick={togglePlay} className="play-button">{isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}</button>
          <div className="flex-1">
            <div className="mb-2 flex justify-between text-[10px] font-semibold text-zinc-600"><span>{formatTime(progress)}</span><span>{formatTime(100)}</span></div>
            <div className="progress-track h-1"><div className="progress-fill fill-emerald" style={{ width: `${Math.max(progress, 2)}%` }} /></div>
          </div>
          <Volume2 size={18} className="text-zinc-700" />
        </div>
      </div>
      <div className="mt-6"><p className="mb-3 text-xs font-bold uppercase tracking-wider text-zinc-600">Suggested questions</p><div className="flex flex-wrap gap-2">{suggestedQuestions.map((q) => <button key={q} onClick={() => sendQuestion(q)} className="question-chip"><MessageSquareText size={13} />{q}</button>)}</div></div>
      {qaList.length > 0 && (
        <div className="mt-5 space-y-3">
          {qaList.map((item, i) => (
            <div key={i} className={item.role === 'user' ? 'flex justify-end' : ''}>
              <div className={item.role === 'user' ? 'max-w-[80%] rounded-2xl rounded-br-md border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm font-medium text-zinc-100' : 'answer-bubble max-w-[92%]'}>{item.text}</div>
            </div>
          ))}
          {isThinking && <div className="answer-bubble flex items-center gap-2"><span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" /></div>}
        </div>
      )}
      <div className="mt-5 flex items-center gap-3">
        <input className="qa-input" placeholder="Ask a question about this lecture" value={question} onChange={(e) => setQuestion(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') sendQuestion(question); }} />
        <button onClick={() => sendQuestion(question)} className="primary-button shrink-0"><Send size={15} />Send</button>
      </div>
    </motion.div>
  );
}

/* ============ Mind Map ============ */

type MindNode = typeof initialMindNodes[number];
function MindMapPanel() {
  const [nodes, setNodes] = useState<MindNode[]>(initialMindNodes);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [addingTo, setAddingTo] = useState<string | null>(null);
  const [newName, setNewName] = useState('');

  const toggleNode = (id: string) => setExpanded((prev) => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  const addChild = (id: string, name: string) => {
    if (!name.trim()) return;
    setNodes((prev) => prev.map((n) => n.id === id && n.children ? { ...n, children: [...n.children, name.trim()] } : n));
    setExpanded((prev) => new Set(prev).add(id));
  };
  const removeChild = (parentId: string, idx: number) => setNodes((prev) => prev.map((n) => n.id === parentId && n.children ? { ...n, children: n.children.filter((_, i) => i !== idx) } : n));

  const childPositions: Record<string, { top: string; left?: string; bottom?: string; right?: string }> = {
    top: { top: '2%', left: '50%' },
    right: { top: '70%', right: '7%' },
    bottom: { top: 'auto', bottom: '2%', left: '50%' },
    left: { top: '70%', left: '7%' },
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="mx-auto max-w-4xl">
      <div className="mb-5"><h2 className="text-lg font-bold text-zinc-50">Mind map</h2><p className="mt-1 text-xs text-zinc-600">Click any node to expand. Use + to add sub-topics.</p></div>
      <div className="mindmap-card">
        <div className="map-line line-one" /><div className="map-line line-two" /><div className="map-line line-three" /><div className="map-line line-four" />
        {nodes.map((node) => (
          <div key={node.id}>
            <div className={`map-node map-${node.kind}`} onClick={() => node.kind !== 'center' && toggleNode(node.id)} style={node.kind !== 'center' ? { cursor: 'pointer' } : undefined}>
              {node.kind === 'center' ? <BrainCircuit size={23} /> : node.kind === 'top' ? <Lightbulb size={17} /> : node.kind === 'right' ? <Clock3 size={17} /> : node.kind === 'bottom' ? <Target size={17} /> : <Sparkles size={17} />}
              <span>{node.label}</span><small>{node.sub}</small>
              {node.kind !== 'center' && (
                <div className="mt-1.5 flex items-center gap-1">
                  <button onClick={(e) => { e.stopPropagation(); setAddingTo(addingTo === node.id ? null : node.id); setNewName(''); }} className="map-add"><Plus size={13} /></button>
                  {expanded.has(node.id) && <span className="text-[9px] text-zinc-600">{node.children?.length || 0}</span>}
                </div>
              )}
            </div>
            {addingTo === node.id && (
              <div className="absolute z-20" style={childPositions[node.kind]}>
                <div className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 p-2 shadow-xl">
                  <input className="w-36 border-none bg-transparent text-xs text-zinc-200 outline-none placeholder:text-zinc-700" placeholder="Sub-topic name" value={newName} onChange={(e) => setNewName(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { addChild(node.id, newName); setNewName(''); setAddingTo(null); } }} autoFocus />
                  <button onClick={() => { addChild(node.id, newName); setNewName(''); setAddingTo(null); }} className="rounded-md bg-emerald-500 px-2 py-1 text-[10px] font-bold text-emerald-950"><Check size={12} /></button>
                </div>
              </div>
            )}
            {expanded.has(node.id) && node.children && (
              <div className="absolute z-10 flex flex-col gap-1.5" style={childPositions[node.kind]}>
                {node.children.map((child, idx) => (
                  <div key={`${child}-${idx}`} className="map-node map-child flex-row items-center !flex-row !gap-2 !text-left" style={{ position: 'relative', transform: 'none', top: 'auto', left: 'auto', right: 'auto', bottom: 'auto' }}>
                    <span className="!text-[11px]">{child}</span>
                    <button onClick={(e) => { e.stopPropagation(); removeChild(node.id, idx); }} className="ml-auto rounded p-0.5 text-zinc-700 hover:text-rose-400"><X size={11} /></button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ============ Analyze modal ============ */

function AnalyzeModal({ step, name, onClose }: { step: number; name: string; onClose: () => void }) {
  const steps = ['Extracting text from your file', 'Identifying key concepts', 'Generating debate scenarios', 'Building your study session'];
  const done = step >= steps.length - 1;
  const progress = Math.round(((step + 1) / steps.length) * 100);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-5 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, y: 18, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="relative w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-7">
        <button onClick={onClose} className="absolute right-5 top-5 rounded-lg p-1.5 text-zinc-600 hover:bg-zinc-800 hover:text-zinc-300"><X size={16} /></button>
        <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl ${done ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-500/10 text-emerald-400'}`}>{done ? <Check size={28} /> : <BrainCircuit size={28} className="animate-pulse" />}</div>
        <div className="mt-6 text-center"><h2 className="text-lg font-bold text-zinc-50">{done ? 'Session ready' : 'Analyzing your lecture'}</h2><p className="mt-2 text-xs text-zinc-500">{done ? 'Your debate is ready to begin.' : 'The AI is reading your lecture and building your session.'}</p></div>
        <div className="mt-6 space-y-2.5">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-3">
              <div className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${i < step ? 'bg-emerald-500 text-emerald-950' : i === step ? 'bg-emerald-500 text-emerald-950' : 'bg-zinc-800 text-zinc-600'}`}>{i < step ? <Check size={12} /> : i + 1}</div>
              <span className={`text-xs ${i <= step ? 'font-semibold text-zinc-300' : 'text-zinc-600'}`}>{s}</span>
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-950 p-3">
          <div className="flex items-center gap-3"><FileText size={17} className="text-emerald-400" /><span className="min-w-0 flex-1 truncate text-xs font-medium text-zinc-400">{name}</span><span className="text-[10px] font-bold text-emerald-400">{progress}%</span></div>
          <div className="relative mt-3 h-1.5 overflow-hidden rounded-full bg-zinc-800">
            <div className="absolute inset-y-0 left-0 rounded-full bg-emerald-500 transition-all duration-500" style={{ width: `${progress}%` }} />
            {!done && <div className="scan-line absolute inset-y-0 w-1/3" />}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ============ Rankings ============ */

function Rankings({ onBack }: { onBack: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="mx-auto max-w-2xl px-5 py-8 sm:px-8 lg:px-10">
      <button onClick={onBack} className="mb-8 flex items-center gap-2 text-xs font-semibold text-zinc-600 transition hover:text-emerald-400"><ArrowLeft size={15} />Back to overview</button>
      <div className="panel p-6">
        <div className="mb-5 flex items-center justify-between"><div><h1 className="section-title">Mastery Rankings</h1><p className="mt-1 text-xs text-zinc-600">This month's leaderboard</p></div><Trophy size={22} className="text-amber-500" /></div>
        <div className="space-y-3">{peers.map((peer, i) => (
          <div key={peer.name} className={`flex items-center gap-4 rounded-xl p-3 ${peer.current ? 'bg-emerald-500/[0.06] ring-1 ring-emerald-500/10' : ''}`}>
            <span className={`w-5 text-center text-sm font-bold ${i < 3 ? 'text-zinc-300' : 'text-zinc-700'}`}>{i + 1}</span>
            <div className={`flex h-9 w-9 items-center justify-center rounded-full text-[10px] font-bold text-white ${peer.color}`}>{peer.initials}</div>
            <span className={`min-w-0 flex-1 truncate text-sm ${peer.current ? 'font-semibold text-zinc-100' : 'text-zinc-400'}`}>{peer.name}</span>
            <span className="text-sm font-semibold text-zinc-300">{peer.points.toLocaleString()}</span>
            {i === 0 && <Trophy size={16} className="text-amber-500" />}
          </div>
        ))}
      </div>
      </div>
    </motion.div>
  );
}

/* ============ Draft view ============ */

function DraftView({ title, icon, onBack }: { title: string; icon: React.ReactNode; onBack: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="mx-auto max-w-2xl px-5 py-10 sm:px-8 lg:px-10">
      <button onClick={onBack} className="mb-8 flex items-center gap-2 text-xs font-semibold text-zinc-600 transition hover:text-emerald-400"><ArrowLeft size={15} />Back to overview</button>
      <div className="draft-card flex flex-col items-center gap-4 py-16 text-center">
        <div className="empty-illustration">{icon}</div>
        <h1 className="text-xl font-bold text-zinc-100">{title}</h1>
        <p className="max-w-sm text-sm text-zinc-600">This section is wired up and ready for you to build out. It shows a clean placeholder for now.</p>
      </div>
    </motion.div>
  );
}

export default App;
