import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BarChart3,
  BrainCircuit,
  Check,
  ChevronRight,
  Clock3,
  FileText,
  Flame,
  Headphones,
  Home,
  Languages,
  LayoutGrid,
  Lightbulb,
  Map,
  Menu,
  MoreHorizontal,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Sparkles,
  Target,
  UploadCloud,
  X,
  Zap,
} from 'lucide-react';

type Language = 'en' | 'ms';
type View = 'dashboard' | 'study';
type StudyTab = 'flashcards' | 'audio' | 'visual';
type Rating = 'Hard' | 'Good' | 'Easy';

const copy = {
  en: {
    hello: 'Good morning, Aina',
    subtitle: 'Ready to make your knowledge stick?',
    overview: 'Learning overview',
    thisWeek: 'This week',
    mastery: 'Mastery points',
    streak: 'Day streak',
    hours: 'Focus hours',
    keepGoing: 'Keep the momentum going',
    streakLine: 'You are on a roll. One more session today keeps your streak alive.',
    startSession: 'Start a session',
    continueLearning: 'Continue learning',
    viewAll: 'View all',
    recent: 'Recent modules',
    uploadTitle: 'Turn your notes into a learning loop',
    uploadBody: 'Upload a PDF or lecture slide deck. CogniSync will shape it into an adaptive session.',
    uploadCta: 'Upload materials',
    supported: 'PDF, PPTX up to 25 MB',
    leaderboard: 'Leaderboard',
    thisMonth: 'This month',
    rank: 'Your rank',
    study: 'Study session',
    back: 'Back to dashboard',
    progress: 'Session progress',
    cards: 'cards mastered',
    flashcards: 'Flashcards',
    podcast: 'Podcast mode',
    mindmap: 'Mind map',
    flip: 'Click card to reveal answer',
    hard: 'Hard',
    good: 'Good',
    easy: 'Easy',
    next: 'Next card',
    question: 'Question',
    answer: 'Answer',
    audioTitle: 'The science of active recall',
    audioBody: 'A 06:42 guided recap from your uploaded module.',
    listening: 'Listening now',
    visualTitle: 'Memory architecture',
    visualBody: 'See how active recall strengthens the path from input to long-term memory.',
    uploadScanning: 'Reading your materials',
    uploadWait: 'Building your personalised session',
    ready: 'Session ready',
    language: 'BM',
  },
  ms: {
    hello: 'Selamat pagi, Aina',
    subtitle: 'Sedia untuk menjadikan ilmu lebih kekal?',
    overview: 'Ringkasan pembelajaran',
    thisWeek: 'Minggu ini',
    mastery: 'Mata penguasaan',
    streak: 'Hari berturut-turut',
    hours: 'Jam fokus',
    keepGoing: 'Teruskan momentum',
    streakLine: 'Anda sedang bersemangat. Satu sesi lagi hari ini memastikan rentetan anda kekal.',
    startSession: 'Mula sesi',
    continueLearning: 'Sambung belajar',
    viewAll: 'Lihat semua',
    recent: 'Modul terkini',
    uploadTitle: 'Tukar nota anda menjadi kitaran pembelajaran',
    uploadBody: 'Muat naik PDF atau slaid kuliah. CogniSync akan membentuk sesi adaptif untuk anda.',
    uploadCta: 'Muat naik bahan',
    supported: 'PDF, PPTX sehingga 25 MB',
    leaderboard: 'Papan pendahulu',
    thisMonth: 'Bulan ini',
    rank: 'Kedudukan anda',
    study: 'Sesi pembelajaran',
    back: 'Kembali ke papan pemuka',
    progress: 'Kemajuan sesi',
    cards: 'kad dikuasai',
    flashcards: 'Kad imbas',
    podcast: 'Mod audio',
    mindmap: 'Peta minda',
    flip: 'Klik kad untuk lihat jawapan',
    hard: 'Sukar',
    good: 'Baik',
    easy: 'Mudah',
    next: 'Kad seterusnya',
    question: 'Soalan',
    answer: 'Jawapan',
    audioTitle: 'Sains active recall',
    audioBody: 'Ulasan berpandu 06:42 daripada modul yang dimuat naik.',
    listening: 'Sedang dimainkan',
    visualTitle: 'Seni bina ingatan',
    visualBody: 'Lihat bagaimana active recall menguatkan laluan daripada input kepada ingatan jangka panjang.',
    uploadScanning: 'Membaca bahan anda',
    uploadWait: 'Membina sesi peribadi anda',
    ready: 'Sesi sedia',
    language: 'EN',
  },
} as const;
type Copy = Record<keyof typeof copy.en, string>;

const modules = [
  { title: 'Cognitive Science', meta: '12 cards · 24 min', color: 'cyan', icon: BrainCircuit, progress: 72 },
  { title: 'Neural Networks', meta: '18 cards · 38 min', color: 'violet', icon: Zap, progress: 48 },
  { title: 'UX Research Methods', meta: '9 cards · 16 min', color: 'orange', icon: Target, progress: 91 },
];

const cards = [
  { question: 'What is the testing effect?', answer: 'The finding that actively retrieving information strengthens long-term retention more effectively than re-reading.' },
  { question: 'Why does spaced repetition work?', answer: 'It schedules recall just as a memory begins to fade, reinforcing the neural pathway with increasing intervals.' },
  { question: 'What is cognitive load?', answer: 'The amount of mental effort being used in working memory at one time.' },
  { question: 'Name the three types of cognitive load.', answer: 'Intrinsic load, extraneous load, and germane load.' },
  { question: 'What is interleaving?', answer: 'Mixing related topics or problem types during practice instead of studying one category at a time.' },
];

const peers = [
  { name: 'Nadia Karim', points: 2680, initials: 'NK', color: 'bg-amber-400' },
  { name: 'You', points: 2410, initials: 'AS', color: 'bg-cyan-400', current: true },
  { name: 'Daniel Wong', points: 2240, initials: 'DW', color: 'bg-violet-400' },
  { name: 'Mei Ling', points: 1980, initials: 'ML', color: 'bg-rose-400' },
  { name: 'Ravi Kumar', points: 1760, initials: 'RK', color: 'bg-emerald-400' },
];

function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [view, setView] = useState<View>('dashboard');
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedName, setUploadedName] = useState('');
  const [activeTab, setActiveTab] = useState<StudyTab>('flashcards');
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [points, setPoints] = useState(2410);
  const [isPlaying, setIsPlaying] = useState(false);
  const t = copy[language];

  useEffect(() => {
    if (!isUploading) return;
    const timer = window.setInterval(() => {
      setUploadProgress((current) => {
        if (current >= 100) {
          window.clearInterval(timer);
          window.setTimeout(() => {
            setIsUploading(false);
            setView('study');
            setActiveTab('flashcards');
          }, 450);
          return 100;
        }
        return Math.min(current + 10, 100);
      });
    }, 200);
    return () => window.clearInterval(timer);
  }, [isUploading]);

  const currentCard = cards[cardIndex];
  const sessionProgress = Math.round(((cardIndex + (flipped ? 0.5 : 0)) / cards.length) * 100);

  const handleUpload = (name = 'Cognitive Science — Week 04.pdf') => {
    setUploadedName(name);
    setUploadProgress(0);
    setIsUploading(true);
  };

  const rateCard = (rating: Rating) => {
    const award = rating === 'Easy' ? 30 : rating === 'Good' ? 20 : 10;
    setPoints((value) => value + award);
    setFlipped(false);
    setCardIndex((value) => (value + 1) % cards.length);
  };

  const navItems = [
    { label: 'Overview', icon: Home, active: view === 'dashboard' },
    { label: 'My modules', icon: LayoutGrid, active: false },
    { label: 'Insights', icon: BarChart3, active: false },
  ];

  return (
    <div className="min-h-screen overflow-hidden bg-[#080b14] text-slate-100">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="aurora aurora-cyan" />
        <div className="aurora aurora-violet" />
        <div className="grid-overlay" />
      </div>
      <div className="relative z-10 flex min-h-screen">
        <aside className="hidden w-[240px] shrink-0 flex-col border-r border-white/[0.06] bg-[#0b0f1a]/80 px-5 py-7 backdrop-blur-xl lg:flex">
          <Brand />
          <div className="mt-12 flex flex-1 flex-col">
            <p className="mb-4 px-3 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">Workspace</p>
            <nav className="space-y-1">
              {navItems.map(({ label, icon: Icon, active }) => (
                <button key={label} onClick={() => setView('dashboard')} className={`nav-item ${active ? 'nav-item-active' : ''}`}>
                  <Icon size={18} strokeWidth={active ? 2.2 : 1.8} />
                  <span>{label}</span>
                  {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_10px_#67e8f9]" />}
                </button>
              ))}
            </nav>
            <div className="my-8 h-px bg-white/[0.06]" />
            <p className="mb-4 px-3 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">Your journey</p>
            <button className="nav-item"><Award size={18} /><span>Achievements</span><span className="ml-auto rounded-md bg-white/[0.06] px-1.5 py-0.5 text-[10px] text-slate-400">8</span></button>
            <button className="nav-item"><Clock3 size={18} /><span>Study history</span></button>
            <div className="mt-auto rounded-2xl border border-cyan-300/10 bg-gradient-to-br from-cyan-400/[0.12] to-violet-500/[0.08] p-4">
              <div className="mb-3 flex items-center justify-between"><Sparkles size={17} className="text-cyan-300" /><span className="text-[10px] font-bold uppercase tracking-wider text-cyan-200">Pro tip</span></div>
              <p className="text-xs leading-5 text-slate-300">Short, frequent sessions beat last-minute cramming.</p>
            </div>
          </div>
          <div className="mt-5 flex items-center gap-3 border-t border-white/[0.06] pt-5"><div className="avatar">AS</div><div className="min-w-0"><p className="truncate text-sm font-semibold">Aina Sofea</p><p className="text-[11px] text-slate-500">Level 12 learner</p></div><MoreHorizontal size={17} className="ml-auto text-slate-500" /></div>
        </aside>

        <main className="min-w-0 flex-1">
          <header className="flex h-[82px] items-center justify-between border-b border-white/[0.06] px-5 sm:px-8 lg:px-10">
            <div className="flex items-center gap-4"><button onClick={() => setShowMobileNav(!showMobileNav)} className="rounded-xl border border-white/10 p-2 lg:hidden"><Menu size={18} /></button><div className="lg:hidden"><Brand compact /></div><div className="hidden text-sm text-slate-500 sm:block">{view === 'dashboard' ? 'Workspace / Overview' : 'Workspace / Study session'}</div></div>
            <div className="flex items-center gap-3 sm:gap-5"><button onClick={() => setLanguage(language === 'en' ? 'ms' : 'en')} className="language-toggle"><Languages size={15} /><span>{t.language}</span></button><div className="hidden h-7 w-px bg-white/10 sm:block" /><div className="flex items-center gap-3"><div className="hidden text-right sm:block"><p className="text-xs font-semibold">Aina Sofea</p><p className="mt-0.5 text-[10px] text-slate-500">{points.toLocaleString()} XP</p></div><div className="avatar">AS</div></div></div>
          </header>

          <AnimatePresence>{showMobileNav && <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="absolute left-4 right-4 top-[74px] z-30 rounded-2xl border border-white/10 bg-[#111827] p-3 shadow-2xl lg:hidden"><button onClick={() => { setView('dashboard'); setShowMobileNav(false); }} className="nav-item nav-item-active"><Home size={18} /><span>Overview</span></button><button onClick={() => setShowMobileNav(false)} className="nav-item"><LayoutGrid size={18} /><span>My modules</span></button></motion.div>}</AnimatePresence>

          <AnimatePresence mode="wait">
            {view === 'dashboard' ? <Dashboard key="dashboard" t={t} points={points} onStart={() => setView('study')} onUpload={handleUpload} /> : <StudyView key="study" t={t} activeTab={activeTab} setActiveTab={setActiveTab} currentCard={currentCard} cardIndex={cardIndex} flipped={flipped} setFlipped={setFlipped} sessionProgress={sessionProgress} rateCard={rateCard} isPlaying={isPlaying} setIsPlaying={setIsPlaying} onBack={() => setView('dashboard')} />}
          </AnimatePresence>
        </main>
      </div>

      <AnimatePresence>{isUploading && <UploadModal progress={uploadProgress} name={uploadedName} t={t} onClose={() => { setIsUploading(false); setUploadProgress(0); }} />}</AnimatePresence>
    </div>
  );
}

function Brand({ compact = false }: { compact?: boolean }) {
  return <div className={`flex items-center gap-2.5 ${compact ? '' : 'px-3'}`}><div className="brand-mark"><BrainCircuit size={19} /></div><span className="text-[17px] font-bold tracking-[-0.04em]">cogni<span className="text-cyan-300">sync</span></span></div>;
}

type DashboardProps = { t: Copy; points: number; onStart: () => void; onUpload: (name?: string) => void };
function Dashboard({ t, points, onStart, onUpload }: DashboardProps) {
  return <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35 }} className="mx-auto max-w-[1370px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
    <div className="mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="mb-2 text-sm font-medium text-cyan-300">Wednesday, 21 October 2026</p><h1 className="text-3xl font-bold tracking-[-0.04em] text-white sm:text-[38px]">{t.hello}</h1><p className="mt-2 text-sm text-slate-400">{t.subtitle}</p></div><button onClick={onStart} className="primary-button"><Plus size={17} />{t.startSession}<ArrowRight size={16} /></button></div>
    <div className="mb-8 grid gap-4 sm:grid-cols-3"><StatCard icon={<Zap size={19} />} label={t.mastery} value={points.toLocaleString()} change="+180 this week" accent="cyan" /><StatCard icon={<Flame size={19} />} label={t.streak} value="5 days" change="Personal best: 12 days" accent="orange" /><StatCard icon={<Clock3 size={19} />} label={t.hours} value="6.4h" change="+22% vs last week" accent="violet" /></div>
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_330px]">
      <section>
        <div className="mb-4 flex items-center justify-between"><div><h2 className="section-title">{t.recent}</h2><p className="mt-1 text-xs text-slate-500">Pick up where you left off</p></div><button className="subtle-button">{t.viewAll}<ChevronRight size={14} /></button></div>
        <div className="grid gap-4 md:grid-cols-3">{modules.map((module) => <ModuleCard key={module.title} module={module} onClick={onStart} />)}</div>
        <UploadZone t={t} onUpload={onUpload} />
      </section>
      <aside className="space-y-5"><StreakCard t={t} onStart={onStart} /><Leaderboard t={t} /></aside>
    </div>
  </motion.div>;
}

function StatCard({ icon, label, value, change, accent }: { icon: React.ReactNode; label: string; value: string; change: string; accent: 'cyan' | 'orange' | 'violet' }) {
  return <div className="stat-card"><div className={`stat-icon stat-${accent}`}>{icon}</div><div className="mt-5 flex items-end justify-between gap-2"><div><p className="text-xs text-slate-500">{label}</p><p className="mt-1 text-2xl font-bold tracking-tight text-white">{value}</p></div><span className="mb-1 rounded-md bg-emerald-400/10 px-2 py-1 text-[10px] font-semibold text-emerald-300">{change.split(' ')[0]}</span></div><p className="mt-2 text-[10px] text-slate-500">{change}</p></div>;
}

function ModuleCard({ module, onClick }: { module: typeof modules[number]; onClick: () => void }) {
  const Icon = module.icon;
  return <button onClick={onClick} className="module-card text-left"><div className={`module-icon module-${module.color}`}><Icon size={20} /></div><div className="mt-5 flex items-start justify-between gap-2"><div><h3 className="text-sm font-semibold text-white">{module.title}</h3><p className="mt-1 text-[11px] text-slate-500">{module.meta}</p></div><ChevronRight size={15} className="mt-0.5 text-slate-600 transition group-hover:text-cyan-300" /></div><div className="mt-5 flex items-center gap-3"><div className="progress-track"><div className={`progress-fill fill-${module.color}`} style={{ width: `${module.progress}%` }} /></div><span className="text-[10px] font-semibold text-slate-400">{module.progress}%</span></div></button>;
}

function UploadZone({ t, onUpload }: { t: Copy; onUpload: (name?: string) => void }) {
  const [dragging, setDragging] = useState(false);
  return <div onDragOver={(event) => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={(event) => { event.preventDefault(); setDragging(false); onUpload(event.dataTransfer.files[0]?.name); }} className={`upload-zone mt-6 ${dragging ? 'upload-zone-active' : ''}`}><div className="upload-icon"><UploadCloud size={22} /></div><div className="min-w-0"><h3 className="text-sm font-semibold text-white">{t.uploadTitle}</h3><p className="mt-1 max-w-lg text-xs leading-5 text-slate-500">{t.uploadBody}</p><p className="mt-3 text-[10px] text-slate-600">{t.supported}</p></div><button onClick={(event) => { event.stopPropagation(); onUpload(); }} className="secondary-button shrink-0"><UploadCloud size={15} />{t.uploadCta}</button></div>;
}

function StreakCard({ t, onStart }: { t: Copy; onStart: () => void }) {
  return <div className="streak-card"><div className="flex items-start justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-orange-300">{t.keepGoing}</p><p className="mt-2 text-2xl font-bold text-white">5 <span className="text-sm font-medium text-slate-400">{t.streak}</span></p></div><div className="flame-orb"><Flame size={22} /></div></div><div className="mt-5 flex gap-2">{['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => <div key={`${day}-${index}`} className={`streak-day ${index < 5 ? 'streak-day-active' : ''}`}><span>{day}</span>{index < 5 ? <Check size={11} /> : <span className="h-1 w-1 rounded-full bg-slate-600" />}</div>)}</div><p className="mt-5 text-xs leading-5 text-slate-400">{t.streakLine}</p><button onClick={onStart} className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-orange-300 transition hover:text-orange-200">{t.continueLearning}<ArrowRight size={14} /></button></div>;
}

function Leaderboard({ t }: { t: Copy }) {
  return <div className="panel p-5"><div className="mb-5 flex items-center justify-between"><div><h2 className="section-title">{t.leaderboard}</h2><p className="mt-1 text-[11px] text-slate-500">{t.thisMonth}</p></div><Award size={20} className="text-amber-300" /></div><div className="space-y-4">{peers.map((peer, index) => <div key={peer.name} className={`flex items-center gap-3 ${peer.current ? 'rounded-xl bg-cyan-300/[0.07] px-3 py-2.5 ring-1 ring-cyan-300/10' : ''}`}><span className={`w-4 text-center text-xs font-bold ${index < 3 ? 'text-slate-200' : 'text-slate-600'}`}>{index + 1}</span><div className={`flex h-7 w-7 items-center justify-center rounded-full text-[9px] font-bold text-[#081018] ${peer.color}`}>{peer.initials}</div><span className={`min-w-0 flex-1 truncate text-xs ${peer.current ? 'font-semibold text-white' : 'text-slate-400'}`}>{peer.name}</span><span className="text-[11px] font-semibold text-slate-400">{peer.points.toLocaleString()}</span></div>)}</div><button className="mt-5 flex w-full items-center justify-center gap-1.5 border-t border-white/[0.06] pt-4 text-[11px] font-semibold text-slate-400 transition hover:text-cyan-300">See full leaderboard <ChevronRight size={13} /></button></div>;
}

type StudyProps = { t: Copy; activeTab: StudyTab; setActiveTab: (tab: StudyTab) => void; currentCard: typeof cards[number]; cardIndex: number; flipped: boolean; setFlipped: (flipped: boolean) => void; sessionProgress: number; rateCard: (rating: Rating) => void; isPlaying: boolean; setIsPlaying: (playing: boolean) => void; onBack: () => void };
function StudyView({ t, activeTab, setActiveTab, currentCard, cardIndex, flipped, setFlipped, sessionProgress, rateCard, isPlaying, setIsPlaying, onBack }: StudyProps) {
  const tabs = [{ id: 'flashcards' as StudyTab, label: t.flashcards, icon: FileText }, { id: 'audio' as StudyTab, label: t.podcast, icon: Headphones }, { id: 'visual' as StudyTab, label: t.mindmap, icon: Map }];
  return <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35 }} className="mx-auto max-w-[1120px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10"><button onClick={onBack} className="mb-8 flex items-center gap-2 text-xs font-semibold text-slate-500 transition hover:text-cyan-300"><ArrowLeft size={15} />{t.back}</button><div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><div className="mb-3 flex items-center gap-2 text-[11px] font-semibold text-cyan-300"><span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_#67e8f9]" />{t.study} / Cognitive Science</div><h1 className="text-3xl font-bold tracking-[-0.04em] text-white sm:text-[36px]">Build stronger recall.</h1><p className="mt-2 text-sm text-slate-400">One idea at a time. Your brain will thank you.</p></div><div className="w-full sm:w-52"><div className="mb-2 flex justify-between text-[10px] font-semibold uppercase tracking-wider text-slate-500"><span>{t.progress}</span><span className="text-cyan-300">{sessionProgress}%</span></div><div className="progress-track h-1.5"><div className="progress-fill fill-cyan" style={{ width: `${Math.max(sessionProgress, 4)}%` }} /></div></div></div><div className="study-tabs">{tabs.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => setActiveTab(id)} className={`study-tab ${activeTab === id ? 'study-tab-active' : ''}`}><Icon size={16} />{label}</button>)}</div><AnimatePresence mode="wait">{activeTab === 'flashcards' && <FlashcardPanel key="flashcards" t={t} currentCard={currentCard} cardIndex={cardIndex} flipped={flipped} setFlipped={setFlipped} rateCard={rateCard} />}{activeTab === 'audio' && <AudioPanel key="audio" t={t} isPlaying={isPlaying} setIsPlaying={setIsPlaying} />}{activeTab === 'visual' && <VisualPanel key="visual" t={t} />}</AnimatePresence></motion.div>;
}

function FlashcardPanel({ t, currentCard, cardIndex, flipped, setFlipped, rateCard }: { t: Copy; currentCard: typeof cards[number]; cardIndex: number; flipped: boolean; setFlipped: (value: boolean) => void; rateCard: (rating: Rating) => void }) {
  return <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} className="mx-auto max-w-3xl"><div className="mb-4 flex items-center justify-between text-[11px] font-semibold text-slate-500"><span>{t.question} {cardIndex + 1} of {cards.length}</span><span className="flex items-center gap-1.5"><RotateCcw size={13} /> Active recall</span></div><button onClick={() => setFlipped(!flipped)} className="flashcard group"><div className="absolute inset-0 rounded-[26px] bg-gradient-to-br from-cyan-300/[0.09] via-transparent to-violet-500/[0.12]" /><div className="relative flex h-full flex-col items-center justify-center px-8 text-center sm:px-20">{flipped ? <><span className="card-label card-label-answer">{t.answer}</span><p className="mt-5 max-w-xl text-xl font-semibold leading-8 tracking-[-0.02em] text-white sm:text-2xl">{currentCard.answer}</p></> : <><span className="card-label">{t.question}</span><p className="mt-5 max-w-xl text-xl font-semibold leading-8 tracking-[-0.02em] text-white sm:text-2xl">{currentCard.question}</p><p className="absolute bottom-8 text-[11px] font-medium text-slate-500 transition group-hover:text-cyan-300">{t.flip}</p></>}</div></button><div className="mt-5 grid grid-cols-3 gap-3"><button onClick={() => rateCard('Hard')} className="rating-button rating-hard"><X size={15} />{t.hard}</button><button onClick={() => rateCard('Good')} className="rating-button rating-good"><Check size={15} />{t.good}</button><button onClick={() => rateCard('Easy')} className="rating-button rating-easy"><Zap size={15} />{t.easy}</button></div><p className="mt-6 text-center text-[11px] text-slate-600">Rate how well you knew it to personalise your next review.</p></motion.div>;
}

function AudioPanel({ t, isPlaying, setIsPlaying }: { t: Copy; isPlaying: boolean; setIsPlaying: (value: boolean) => void }) {
  const bars = useMemo(() => Array.from({ length: 48 }, (_, index) => 18 + ((index * 17) % 42)), []);
  return <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="mx-auto max-w-3xl"><div className="audio-card"><div className="flex items-center gap-4"><div className="audio-art"><Headphones size={30} /></div><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300">{t.listening}</p><h2 className="mt-2 text-xl font-bold text-white">{t.audioTitle}</h2><p className="mt-1 text-xs text-slate-500">{t.audioBody}</p></div></div><div className="waveform">{bars.map((height, index) => <span key={index} className={isPlaying && index % 3 !== 0 ? 'wave-active' : ''} style={{ height: `${height}%`, animationDelay: `${index * 0.035}s` }} />)}</div><div className="flex items-center gap-4"><button onClick={() => setIsPlaying(!isPlaying)} className="play-button">{isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}</button><div className="flex-1"><div className="mb-2 flex justify-between text-[10px] font-semibold text-slate-500"><span>01:24</span><span>06:42</span></div><div className="progress-track h-1"><div className="progress-fill fill-cyan" style={{ width: '24%' }} /></div></div><button className="rounded-lg p-2 text-slate-500 hover:bg-white/5 hover:text-white"><MoreHorizontal size={18} /></button></div></div><div className="mt-5 grid gap-3 sm:grid-cols-3"><div className="audio-stat"><span>01</span><p>Why recall beats rereading</p></div><div className="audio-stat"><span>02</span><p>The spacing sweet spot</p></div><div className="audio-stat"><span>03</span><p>Making memory durable</p></div></div></motion.div>;
}

function VisualPanel({ t }: { t: Copy }) {
  return <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="mx-auto max-w-4xl"><div className="mb-5"><h2 className="text-xl font-bold text-white">{t.visualTitle}</h2><p className="mt-1 text-xs text-slate-500">{t.visualBody}</p></div><div className="mindmap-card"><div className="map-line line-one" /><div className="map-line line-two" /><div className="map-line line-three" /><div className="map-line line-four" /><div className="map-node map-center"><BrainCircuit size={23} /><span>Active recall</span><small>Core method</small></div><div className="map-node map-top"><Lightbulb size={17} /><span>Retrieval</span><small>Pull knowledge out</small></div><div className="map-node map-right"><Clock3 size={17} /><span>Spacing</span><small>Return over time</small></div><div className="map-node map-bottom"><Target size={17} /><span>Feedback</span><small>Notice the gaps</small></div><div className="map-node map-left"><Sparkles size={17} /><span>Elaboration</span><small>Connect ideas</small></div></div></motion.div>;
}

function UploadModal({ progress, name, t, onClose }: { progress: number; name: string; t: Copy; onClose: () => void }) {
  const done = progress >= 100;
  return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-[#05070d]/80 p-5 backdrop-blur-md"><motion.div initial={{ opacity: 0, y: 18, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#111724] p-7 shadow-2xl"><button onClick={onClose} className="absolute right-5 top-5 rounded-lg p-1.5 text-slate-500 hover:bg-white/5 hover:text-white"><X size={16} /></button><div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl ${done ? 'bg-emerald-400/10 text-emerald-300' : 'bg-cyan-300/10 text-cyan-300'}`}>{done ? <Check size={28} /> : <BrainCircuit size={28} className="animate-pulse" />}</div><div className="mt-6 text-center"><h2 className="text-lg font-bold text-white">{done ? t.ready : t.uploadScanning}</h2><p className="mt-2 text-xs text-slate-500">{done ? 'Your active-recall session is ready to explore.' : t.uploadWait}</p></div><div className="mt-7 rounded-xl border border-white/[0.06] bg-white/[0.025] p-3"><div className="flex items-center gap-3"><FileText size={17} className="text-cyan-300" /><span className="min-w-0 flex-1 truncate text-xs font-medium text-slate-300">{name}</span><span className="text-[10px] font-bold text-cyan-300">{progress}%</span></div><div className="mt-3 progress-track h-1.5"><div className={`progress-fill ${done ? 'fill-emerald' : 'fill-cyan'}`} style={{ width: `${progress}%` }} /></div></div>{done && <button onClick={onClose} className="primary-button mt-6 w-full justify-center">Open study session <ArrowRight size={15} /></button>}</motion.div></motion.div>;
}

export default App;
