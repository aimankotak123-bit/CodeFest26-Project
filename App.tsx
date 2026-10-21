import { useEffect, useMemo, useRef, useState } from 'react';
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
  FileType2,
  Flame,
  Headphones,
  Home,
  Languages,
  LayoutGrid,
  Lightbulb,
  ListChecks,
  Map,
  Menu,
  MessageCircle,
  MoreHorizontal,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Send,
  Sparkles,
  Target,
  Trash2,
  UploadCloud,
  Volume2,
  X,
  Zap,
} from 'lucide-react';

type Language = 'en' | 'ms';
type View = 'dashboard' | 'study' | 'modules' | 'insights' | 'achievements' | 'history';
type StudyTab = 'flashcards' | 'audio' | 'visual' | 'materials';
type Rating = 'Hard' | 'Good' | 'Easy';
type PodcastMode = 'eli5' | 'brief' | 'deep';
type UploadedFile = { name: string; type: string; size: string };

const copy = {
  en: {
    hello: 'Good morning, Aina',
    subtitle: 'Ready to make your knowledge stick?',
    uploadHeroTitle: 'Upload your lecture to start studying',
    uploadHeroBody: 'Drop a PDF, Word document, or PowerPoint deck here. The AI will read it and build a personalized study session for you.',
    uploadHeroCta: 'Choose a file',
    supported: 'PDF, Word (.docx), PowerPoint (.pptx) up to 25 MB',
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
    leaderboard: 'Leaderboard',
    thisMonth: 'This month',
    rank: 'Your rank',
    study: 'Study session',
    back: 'Back to dashboard',
    progress: 'Session progress',
    cards: 'cards mastered',
    flashcards: 'Flashcards',
    podcast: 'Podcast',
    mindmap: 'Mind map',
    materials: 'Materials',
    flip: 'Click card to reveal answer',
    hard: 'Hard',
    good: 'Good',
    easy: 'Easy',
    next: 'Next card',
    question: 'Question',
    answer: 'Answer',
    language: 'BM',
    analyzing: 'Analyzing your lecture',
    analyzingSteps: ['Extracting text from your file', 'Identifying key concepts', 'Generating flashcards & summary', 'Building your study session'],
    ready: 'Session ready',
    materialsTitle: 'Lecture materials',
    materialsBody: 'Upload your lecture file here. The AI will read the content and generate flashcards, a podcast, and a mind map from it.',
    dropHere: 'Drag your file here, or click to browse',
    noFiles: 'No materials uploaded yet. Upload your first lecture to get started.',
    podcastTitle: 'Recap podcast',
    podcastBody: 'Listen to an AI-narrated recap of your lecture. Choose a style and ask questions as you listen.',
    eli5: "Explain like I'm 5",
    brief: 'Normal brief',
    deep: 'Deep dive',
    eli5Desc: 'Simple words, fun analogies',
    briefDesc: 'A clear, balanced summary',
    deepDesc: 'Thorough, detailed walk-through',
    play: 'Play',
    pause: 'Pause',
    suggestedQuestions: 'Suggested questions',
    askAnything: 'Ask a question about this lecture',
    send: 'Send',
    thinking: 'Thinking',
    mindmapTitle: 'Mind map',
    mindmapBody: 'Tap any node to expand it, or add your own sub-topics to build out the map.',
    addNode: 'Add sub-topic',
    nodeName: 'Sub-topic name',
    comingSoon: 'This section is a draft',
    comingSoonBody: 'This area is wired up and ready for you to adjust later. It shows a friendly placeholder for now.',
  },
  ms: {
    hello: 'Selamat pagi, Aina',
    subtitle: 'Sedia untuk menjadikan ilmu lebih kekal?',
    uploadHeroTitle: 'Muat naik kuliah anda untuk mula belajar',
    uploadHeroBody: 'Letak PDF, dokumen Word, atau PowerPoint di sini. AI akan membacanya dan membina sesi belajar peribadi untuk anda.',
    uploadHeroCta: 'Pilih fail',
    supported: 'PDF, Word (.docx), PowerPoint (.pptx) sehingga 25 MB',
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
    leaderboard: 'Papan pendahulu',
    thisMonth: 'Bulan ini',
    rank: 'Kedudukan anda',
    study: 'Sesi pembelajaran',
    back: 'Kembali ke papan pemuka',
    progress: 'Kemajuan sesi',
    cards: 'kad dikuasai',
    flashcards: 'Kad imbas',
    podcast: 'Podcast',
    mindmap: 'Peta minda',
    materials: 'Bahan',
    flip: 'Klik kad untuk lihat jawapan',
    hard: 'Sukar',
    good: 'Baik',
    easy: 'Mudah',
    next: 'Kad seterusnya',
    question: 'Soalan',
    answer: 'Jawapan',
    language: 'EN',
    analyzing: 'Menganalisis kuliah anda',
    analyzingSteps: ['Mengekstrak teks dari fail anda', 'Mengenal pasti konsep utama', 'Menjana kad imbas & ringkasan', 'Membina sesi belajar anda'],
    ready: 'Sesi sedia',
    materialsTitle: 'Bahan kuliah',
    materialsBody: 'Muat naik fail kuliah anda di sini. AI akan membaca kandungan dan menjana kad imbas, podcast, dan peta minda.',
    dropHere: 'Seret fail anda ke sini, atau klik untuk melayari',
    noFiles: 'Tiada bahan dimuat naik lagi. Muat naik kuliah pertama anda untuk bermula.',
    podcastTitle: 'Podcast ulasan',
    podcastBody: 'Dengar ulasan bacaan AI tentang kuliah anda. Pilih gaya dan tanya soalan sambil mendengar.',
    eli5: 'Terangkan macam umur 5',
    brief: 'Ringkas biasa',
    deep: 'Lengkap terperinci',
    eli5Desc: 'Perkataan mudah, analogi menyeronokkan',
    briefDesc: 'Ringkasan jelas dan seimbang',
    deepDesc: 'Huraian teliti dan terperinci',
    play: 'Main',
    pause: 'Jeda',
    suggestedQuestions: 'Soalan dicadangkan',
    askAnything: 'Tanya soalan tentang kuliah ini',
    send: 'Hantar',
    thinking: 'Memikir',
    mindmapTitle: 'Peta minda',
    mindmapBody: 'Klik mana-mana nod untuk kembangkan, atau tambah sub-topik anda sendiri.',
    addNode: 'Tambah sub-topik',
    nodeName: 'Nama sub-topik',
    comingSoon: 'Bahagian ini adalah draf',
    comingSoonBody: 'Kawasan ini telah disambung dan sedia untuk anda pelaskan kemudian. Ia menunjukkan ruang letak mesra buat masa ini.',
  },
} as const;
type Copy = Record<keyof typeof copy.en, string>;

const modules = [
  { title: 'Cognitive Science', meta: '12 cards · 24 min', color: 'cyan', icon: BrainCircuit, progress: 72 },
  { title: 'Neural Networks', meta: '18 cards · 38 min', color: 'teal', icon: Zap, progress: 48 },
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
  { name: 'You', points: 2410, initials: 'AS', color: 'bg-sky-400', current: true },
  { name: 'Daniel Wong', points: 2240, initials: 'DW', color: 'bg-teal-400' },
  { name: 'Mei Ling', points: 1980, initials: 'ML', color: 'bg-rose-400' },
  { name: 'Ravi Kumar', points: 1760, initials: 'RK', color: 'bg-emerald-400' },
];

const suggestedQuestions = [
  'Can you summarize the main idea?',
  'What is the most important concept?',
  'Give me a real-world example',
  'What should I memorize for the exam?',
];

const podcastScripts: Record<PodcastMode, string> = {
  eli5: "Okay, imagine your brain is a big toy box. When you learn something new, you drop a toy into the box. But if you never take the toy out and play with it, you forget where you put it! Active recall is like taking the toy out and looking at it again and again. Every time you try to remember it without peeking, your brain builds a stronger path to that toy. That is why quizzing yourself works way better than just reading your notes over and over. Spaced repetition is like setting a timer — you check on the toy right before you are about to forget it. That makes the memory stick for a really, really long time!",
  brief: "Active recall is the practice of actively stimulating memory during the learning process. Instead of passively re-reading, you test yourself by trying to retrieve information from memory. Research consistently shows this is far more effective for long-term retention. Spaced repetition complements this by scheduling review sessions at increasing intervals — right before you are about to forget. Together, these two techniques form the backbone of evidence-based study strategies. The key takeaway: pull information out of your brain rather than cramming it in, and space your reviews over time.",
  deep: "Active recall refers to the cognitive process of retrieving information from long-term memory without external cues. The testing effect, first documented by Roediger and Karpicke in 2006, demonstrates that the act of retrieval itself produces more learning than an equivalent amount of time spent studying. The mechanism is thought to involve elaborative rehearsal — by reconstructing knowledge, you strengthen the neural pathways associated with that memory trace. Spaced repetition leverages the spacing effect, first described by Ebbinghaus in 1885. The optimal interval is one that places the review just as the forgetting curve begins to descend steeply. Algorithms like SM-2 dynamically adjust these intervals based on your performance. Combined with interleaving — mixing different problem types — these methods reduce cognitive load over time and promote transfer of learning to novel contexts.",
};

const podcastAnswers: Record<string, string> = {
  'Can you summarize the main idea?':
    'The core idea is that actively retrieving information from memory — testing yourself — strengthens long-term retention far more than passively re-reading. Pair that with spaced repetition, reviewing at increasing intervals, and you get a highly effective study strategy.',
  'What is the most important concept?':
    'The testing effect: the act of pulling information out of your memory is itself a powerful learning event. It is not just a measure of what you know — it is what builds the memory in the first place.',
  'Give me a real-world example':
    'Instead of re-reading your lecture slides on cognitive load, close them and try to write down everything you remember about the three types. Struggling to recall is exactly what strengthens the memory. Do it again tomorrow, then in three days.',
  'What should I memorize for the exam?':
    'Focus on the three types of cognitive load — intrinsic, extraneous, and germane — and the definitions of the testing effect and spaced repetition. Those are the high-yield concepts that tend to appear on exams.',
};

const initialMindNodes = [
  { id: 'center', label: 'Active recall', sub: 'Core method', kind: 'center' as const },
  { id: 'top', label: 'Retrieval', sub: 'Pull knowledge out', kind: 'top' as const, children: ['Quiz yourself', 'Free recall', 'Practice tests'] },
  { id: 'right', label: 'Spacing', sub: 'Return over time', kind: 'right' as const, children: ['Daily review', 'Increasing intervals'] },
  { id: 'bottom', label: 'Feedback', sub: 'Notice the gaps', kind: 'bottom' as const, children: ['Self-check', 'Correct mistakes'] },
  { id: 'left', label: 'Elaboration', sub: 'Connect ideas', kind: 'left' as const, children: ['Analogies', 'Explain aloud'] },
];

function fileIcon(name: string) {
  const lower = name.toLowerCase();
  if (lower.endsWith('.pdf')) return FileText;
  if (lower.endsWith('.docx') || lower.endsWith('.doc')) return FileText;
  if (lower.endsWith('.pptx') || lower.endsWith('.ppt')) return FileType2;
  return FileText;
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [view, setView] = useState<View>('dashboard');
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeStep, setAnalyzeStep] = useState(0);
  const [uploadedName, setUploadedName] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [activeTab, setActiveTab] = useState<StudyTab>('flashcards');
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [points, setPoints] = useState(2410);
  const t = copy[language];

  useEffect(() => {
    if (!isAnalyzing) return;
    setAnalyzeStep(0);
    const stepTimer = window.setInterval(() => {
      setAnalyzeStep((s) => {
        if (s >= t.analyzingSteps.length - 1) {
          window.clearInterval(stepTimer);
          window.setTimeout(() => {
            setIsAnalyzing(false);
            setView('study');
            setActiveTab('flashcards');
          }, 700);
          return s;
        }
        return s + 1;
      });
    }, 900);
    return () => window.clearInterval(stepTimer);
  }, [isAnalyzing, t.analyzingSteps.length]);

  const currentCard = cards[cardIndex];
  const sessionProgress = Math.round(((cardIndex + (flipped ? 0.5 : 0)) / cards.length) * 100);

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    const entry: UploadedFile = { name: file.name, type: file.type || 'file', size: formatSize(file.size) };
    setUploadedFiles((prev) => [entry, ...prev]);
    setUploadedName(file.name);
    setIsAnalyzing(true);
  };

  const handleDemoUpload = () => {
    const entry: UploadedFile = { name: 'Cognitive Science — Week 04.pdf', type: 'application/pdf', size: '2.4 MB' };
    setUploadedFiles((prev) => [entry, ...prev]);
    setUploadedName(entry.name);
    setIsAnalyzing(true);
  };

  const rateCard = (rating: Rating) => {
    const award = rating === 'Easy' ? 30 : rating === 'Good' ? 20 : 10;
    setPoints((value) => value + award);
    setFlipped(false);
    setCardIndex((value) => (value + 1) % cards.length);
  };

  const navSections: { heading: string; items: { label: string; icon: typeof Home; view: View; badge?: string }[] }[] = [
    {
      heading: 'Workspace',
      items: [
        { label: 'Overview', icon: Home, view: 'dashboard' },
        { label: 'My modules', icon: LayoutGrid, view: 'modules' },
        { label: 'Insights', icon: BarChart3, view: 'insights' },
      ],
    },
    {
      heading: 'Your journey',
      items: [
        { label: 'Achievements', icon: Award, view: 'achievements', badge: '8' },
        { label: 'Study history', icon: Clock3, view: 'history' },
      ],
    },
  ];

  const go = (v: View) => {
    setView(v);
    setShowMobileNav(false);
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#eef3f9] text-slate-800">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="aurora aurora-sky" />
        <div className="aurora aurora-teal" />
        <div className="aurora aurora-amber" />
        <div className="grid-overlay" />
      </div>
      <div className="relative z-10 flex min-h-screen">
        <aside className="hidden w-[248px] shrink-0 flex-col border-r border-slate-200/80 bg-white/70 px-5 py-7 backdrop-blur-xl lg:flex">
          <Brand />
          <div className="mt-10 flex flex-1 flex-col">
            {navSections.map((section) => (
              <div key={section.heading} className="mb-7">
                <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">{section.heading}</p>
                <nav className="space-y-1">
                  {section.items.map(({ label, icon: Icon, view: itemView, badge }) => (
                    <button key={label} onClick={() => go(itemView)} className={`nav-item ${view === itemView ? 'nav-item-active' : ''}`}>
                      <Icon size={18} strokeWidth={view === itemView ? 2.2 : 1.8} />
                      <span>{label}</span>
                      {badge && <span className="ml-auto rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-500">{badge}</span>}
                      {view === itemView && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-sky-500" />}
                    </button>
                  ))}
                </nav>
              </div>
            ))}
            <div className="mt-auto rounded-2xl border border-sky-200/60 bg-gradient-to-br from-sky-50 to-teal-50 p-4">
              <div className="mb-3 flex items-center justify-between"><Sparkles size={17} className="text-sky-500" /><span className="text-[10px] font-bold uppercase tracking-wider text-sky-600">Pro tip</span></div>
              <p className="text-xs leading-5 text-slate-600">Short, frequent sessions beat last-minute cramming.</p>
            </div>
          </div>
          <div className="mt-5 flex items-center gap-3 border-t border-slate-200 pt-5">
            <div className="avatar">AS</div>
            <div className="min-w-0"><p className="truncate text-sm font-semibold text-slate-800">Aina Sofea</p><p className="text-[11px] text-slate-400">Level 12 learner</p></div>
            <MoreHorizontal size={17} className="ml-auto text-slate-400" />
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <header className="flex h-[82px] items-center justify-between border-b border-slate-200 bg-white/50 px-5 backdrop-blur-md sm:px-8 lg:px-10">
            <div className="flex items-center gap-4">
              <button onClick={() => setShowMobileNav(!showMobileNav)} className="rounded-xl border border-slate-200 bg-white p-2 lg:hidden"><Menu size={18} /></button>
              <div className="lg:hidden"><Brand compact /></div>
              <div className="hidden text-sm text-slate-400 sm:block">{view === 'dashboard' ? 'Workspace / Overview' : `Workspace / ${view.charAt(0).toUpperCase() + view.slice(1)}`}</div>
            </div>
            <div className="flex items-center gap-3 sm:gap-5">
              <button onClick={() => setLanguage(language === 'en' ? 'ms' : 'en')} className="language-toggle"><Languages size={15} /><span>{t.language}</span></button>
              <div className="hidden h-7 w-px bg-slate-200 sm:block" />
              <div className="flex items-center gap-3">
                <div className="hidden text-right sm:block"><p className="text-xs font-semibold text-slate-700">{points.toLocaleString()} XP</p><p className="mt-0.5 text-[10px] text-slate-400">Aina Sofea</p></div>
                <div className="avatar">AS</div>
              </div>
            </div>
          </header>

          <AnimatePresence>
            {showMobileNav && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="absolute left-4 right-4 top-[74px] z-30 rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl lg:hidden">
                {navSections.flatMap((s) => s.items).map(({ label, icon: Icon, view: itemView, badge }) => (
                  <button key={label} onClick={() => go(itemView)} className={`nav-item ${view === itemView ? 'nav-item-active' : ''}`}>
                    <Icon size={18} /><span>{label}</span>
                    {badge && <span className="ml-auto rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-500">{badge}</span>}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {view === 'dashboard' && (
              <Dashboard key="dashboard" t={t} points={points} onStart={() => { setView('study'); setActiveTab('flashcards'); }} onFile={handleFile} onDemoUpload={handleDemoUpload} openStudy={() => { setView('study'); setActiveTab('materials'); }} />
            )}
            {view === 'study' && (
              <StudyView key="study" t={t} activeTab={activeTab} setActiveTab={setActiveTab} currentCard={currentCard} cardIndex={cardIndex} flipped={flipped} setFlipped={setFlipped} sessionProgress={sessionProgress} rateCard={rateCard} onBack={() => setView('dashboard')} uploadedFiles={uploadedFiles} onFile={handleFile} onDemoUpload={handleDemoUpload} onRemoveFile={(idx) => setUploadedFiles((prev) => prev.filter((_, i) => i !== idx))} />
            )}
            {view === 'modules' && <DraftView key="modules" t={t} title="My modules" icon={<LayoutGrid size={28} />} onBack={() => setView('dashboard')} />}
            {view === 'insights' && <DraftView key="insights" t={t} title="Insights" icon={<BarChart3 size={28} />} onBack={() => setView('dashboard')} />}
            {view === 'achievements' && <DraftView key="achievements" t={t} title="Achievements" icon={<Award size={28} />} onBack={() => setView('dashboard')} />}
            {view === 'history' && <DraftView key="history" t={t} title="Study history" icon={<Clock3 size={28} />} onBack={() => setView('dashboard')} />}
          </AnimatePresence>
        </main>
      </div>

      <AnimatePresence>
        {isAnalyzing && <AnalyzeModal step={analyzeStep} name={uploadedName} t={t} onClose={() => { setIsAnalyzing(false); setAnalyzeStep(0); }} />}
      </AnimatePresence>
    </div>
  );
}

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`flex items-center gap-2.5 ${compact ? '' : 'px-3'}`}>
      <div className="brand-mark"><BrainCircuit size={19} /></div>
      <span className="text-[17px] font-bold tracking-[-0.04em] text-slate-800">cogni<span className="text-sky-500">sync</span></span>
    </div>
  );
}

/* ============ Dashboard ============ */

type DashboardProps = { t: Copy; points: number; onStart: () => void; onFile: (file: File | undefined) => void; onDemoUpload: () => void; openStudy: () => void };
function Dashboard({ t, points, onStart, onFile, onDemoUpload, openStudy }: DashboardProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35 }} className="mx-auto max-w-[1370px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
      <div className="mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-sm font-medium text-sky-500">Wednesday, 21 October 2026</p>
          <h1 className="text-3xl font-bold tracking-[-0.04em] text-slate-800 sm:text-[38px]">{t.hello}</h1>
          <p className="mt-2 text-sm text-slate-500">{t.subtitle}</p>
        </div>
        <button onClick={onStart} className="primary-button"><Plus size={17} />{t.startSession}<ArrowRight size={16} /></button>
      </div>

      {/* ---- Prominent upload hero — first thing you see ---- */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); onFile(e.dataTransfer.files[0]); }}
        className={`upload-hero mb-8 ${dragging ? 'upload-hero-active' : ''}`}
      >
        <div className="upload-icon-big"><UploadCloud size={30} /></div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">{t.uploadHeroTitle}</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">{t.uploadHeroBody}</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button onClick={() => fileRef.current?.click()} className="primary-button"><UploadCloud size={16} />{t.uploadHeroCta}<ArrowRight size={15} /></button>
          <button onClick={onDemoUpload} className="secondary-button"><Sparkles size={15} />Try a sample lecture</button>
        </div>
        <p className="text-[11px] font-medium text-slate-400">{t.supported}</p>
        <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.ppt,.pptx" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <StatCard icon={<Zap size={19} />} label={t.mastery} value={points.toLocaleString()} change="+180 this week" accent="cyan" />
        <StatCard icon={<Flame size={19} />} label={t.streak} value="5 days" change="Personal best: 12 days" accent="orange" />
        <StatCard icon={<Clock3 size={19} />} label={t.hours} value="6.4h" change="+22% vs last week" accent="teal" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_330px]">
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div><h2 className="section-title">{t.recent}</h2><p className="mt-1 text-xs text-slate-400">Pick up where you left off</p></div>
            <button onClick={() => openStudy()} className="subtle-button">{t.viewAll}<ChevronRight size={14} /></button>
          </div>
          <div className="grid gap-4 md:grid-cols-3">{modules.map((module) => <ModuleCard key={module.title} module={module} onClick={onStart} />)}</div>
        </section>
        <aside className="space-y-5"><StreakCard t={t} onStart={onStart} /><Leaderboard t={t} /></aside>
      </div>
    </motion.div>
  );
}

function StatCard({ icon, label, value, change, accent }: { icon: React.ReactNode; label: string; value: string; change: string; accent: 'cyan' | 'orange' | 'teal' }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon stat-${accent}`}>{icon}</div>
      <div className="mt-5 flex items-end justify-between gap-2">
        <div><p className="text-xs text-slate-400">{label}</p><p className="mt-1 text-2xl font-bold tracking-tight text-slate-800">{value}</p></div>
        <span className="mb-1 rounded-md bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-600">{change.split(' ')[0]}</span>
      </div>
      <p className="mt-2 text-[10px] text-slate-400">{change}</p>
    </div>
  );
}

function ModuleCard({ module, onClick }: { module: typeof modules[number]; onClick: () => void }) {
  const Icon = module.icon;
  return (
    <button onClick={onClick} className="module-card group text-left">
      <div className={`module-icon module-${module.color}`}><Icon size={20} /></div>
      <div className="mt-5 flex items-start justify-between gap-2">
        <div><h3 className="text-sm font-semibold text-slate-800">{module.title}</h3><p className="mt-1 text-[11px] text-slate-400">{module.meta}</p></div>
        <ChevronRight size={15} className="mt-0.5 text-slate-300 transition group-hover:text-sky-500" />
      </div>
      <div className="mt-5 flex items-center gap-3">
        <div className="progress-track"><div className={`progress-fill fill-${module.color}`} style={{ width: `${module.progress}%` }} /></div>
        <span className="text-[10px] font-semibold text-slate-500">{module.progress}%</span>
      </div>
    </button>
  );
}

function StreakCard({ t, onStart }: { t: Copy; onStart: () => void }) {
  return (
    <div className="streak-card">
      <div className="flex items-start justify-between">
        <div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-orange-500">{t.keepGoing}</p><p className="mt-2 text-2xl font-bold text-slate-800">5 <span className="text-sm font-medium text-slate-400">{t.streak}</span></p></div>
        <div className="flame-orb"><Flame size={22} /></div>
      </div>
      <div className="mt-5 flex gap-2">{['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
        <div key={`${day}-${index}`} className={`streak-day ${index < 5 ? 'streak-day-active' : ''}`}><span>{day}</span>{index < 5 ? <Check size={11} /> : <span className="h-1 w-1 rounded-full bg-slate-300" />}</div>
      ))}</div>
      <p className="mt-5 text-xs leading-5 text-slate-500">{t.streakLine}</p>
      <button onClick={onStart} className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-orange-500 transition hover:text-orange-600">{t.continueLearning}<ArrowRight size={14} /></button>
    </div>
  );
}

function Leaderboard({ t }: { t: Copy }) {
  return (
    <div className="panel p-5">
      <div className="mb-5 flex items-center justify-between"><div><h2 className="section-title">{t.leaderboard}</h2><p className="mt-1 text-[11px] text-slate-400">{t.thisMonth}</p></div><Award size={20} className="text-amber-500" /></div>
      <div className="space-y-3">{peers.map((peer, index) => (
        <div key={peer.name} className={`flex items-center gap-3 ${peer.current ? 'rounded-xl bg-sky-50 px-3 py-2.5 ring-1 ring-sky-100' : ''}`}>
          <span className={`w-4 text-center text-xs font-bold ${index < 3 ? 'text-slate-700' : 'text-slate-300'}`}>{index + 1}</span>
          <div className={`flex h-7 w-7 items-center justify-center rounded-full text-[9px] font-bold text-white ${peer.color}`}>{peer.initials}</div>
          <span className={`min-w-0 flex-1 truncate text-xs ${peer.current ? 'font-semibold text-slate-800' : 'text-slate-500'}`}>{peer.name}</span>
          <span className="text-[11px] font-semibold text-slate-500">{peer.points.toLocaleString()}</span>
        </div>
      ))}</div>
      <button className="mt-5 flex w-full items-center justify-center gap-1.5 border-t border-slate-100 pt-4 text-[11px] font-semibold text-slate-400 transition hover:text-sky-500">See full leaderboard <ChevronRight size={13} /></button>
    </div>
  );
}

/* ============ Study view ============ */

type StudyProps = {
  t: Copy;
  activeTab: StudyTab;
  setActiveTab: (tab: StudyTab) => void;
  currentCard: typeof cards[number];
  cardIndex: number;
  flipped: boolean;
  setFlipped: (flipped: boolean) => void;
  sessionProgress: number;
  rateCard: (rating: Rating) => void;
  onBack: () => void;
  uploadedFiles: UploadedFile[];
  onFile: (file: File | undefined) => void;
  onDemoUpload: () => void;
  onRemoveFile: (idx: number) => void;
};
function StudyView({ t, activeTab, setActiveTab, currentCard, cardIndex, flipped, setFlipped, sessionProgress, rateCard, onBack, uploadedFiles, onFile, onDemoUpload, onRemoveFile }: StudyProps) {
  const tabs: { id: StudyTab; label: string; icon: typeof FileText }[] = [
    { id: 'materials', label: t.materials, icon: UploadCloud },
    { id: 'flashcards', label: t.flashcards, icon: FileText },
    { id: 'audio', label: t.podcast, icon: Headphones },
    { id: 'visual', label: t.mindmap, icon: Map },
  ];
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35 }} className="mx-auto max-w-[1120px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
      <button onClick={onBack} className="mb-8 flex items-center gap-2 text-xs font-semibold text-slate-400 transition hover:text-sky-500"><ArrowLeft size={15} />{t.back}</button>
      <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold text-sky-500"><span className="h-1.5 w-1.5 rounded-full bg-sky-500" />{t.study} / Cognitive Science</div>
          <h1 className="text-3xl font-bold tracking-[-0.04em] text-slate-800 sm:text-[36px]">Build stronger recall.</h1>
          <p className="mt-2 text-sm text-slate-500">One idea at a time. Your brain will thank you.</p>
        </div>
        <div className="w-full sm:w-52">
          <div className="mb-2 flex justify-between text-[10px] font-semibold uppercase tracking-wider text-slate-400"><span>{t.progress}</span><span className="text-sky-500">{sessionProgress}%</span></div>
          <div className="progress-track h-1.5"><div className="progress-fill fill-cyan" style={{ width: `${Math.max(sessionProgress, 4)}%` }} /></div>
        </div>
      </div>
      <div className="study-tabs">{tabs.map(({ id, label, icon: Icon }) => (
        <button key={id} onClick={() => setActiveTab(id)} className={`study-tab ${activeTab === id ? 'study-tab-active' : ''}`}><Icon size={16} />{label}</button>
      ))}</div>
      <AnimatePresence mode="wait">
        {activeTab === 'materials' && <MaterialsPanel key="materials" t={t} files={uploadedFiles} onFile={onFile} onDemoUpload={onDemoUpload} onRemove={onRemoveFile} />}
        {activeTab === 'flashcards' && <FlashcardPanel key="flashcards" t={t} currentCard={currentCard} cardIndex={cardIndex} flipped={flipped} setFlipped={setFlipped} rateCard={rateCard} />}
        {activeTab === 'audio' && <AudioPanel key="audio" t={t} />}
        {activeTab === 'visual' && <VisualPanel key="visual" t={t} />}
      </AnimatePresence>
    </motion.div>
  );
}

/* ============ Materials panel (upload inside study session) ============ */

function MaterialsPanel({ t, files, onFile, onDemoUpload, onRemove }: { t: Copy; files: UploadedFile[]; onFile: (file: File | undefined) => void; onDemoUpload: () => void; onRemove: (idx: number) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  return (
    <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} className="mx-auto max-w-3xl">
      <div className="mb-6"><h2 className="text-xl font-bold text-slate-800">{t.materialsTitle}</h2><p className="mt-1 text-sm text-slate-500">{t.materialsBody}</p></div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); onFile(e.dataTransfer.files[0]); }}
        className={`upload-zone-compact ${dragging ? 'upload-zone-compact-active' : ''}`}
      >
        <div className="upload-icon"><UploadCloud size={22} /></div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-700">{t.dropHere}</p>
          <p className="mt-1 text-[11px] text-slate-400">{t.supported}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => fileRef.current?.click()} className="secondary-button"><UploadCloud size={15} />Browse</button>
          <button onClick={onDemoUpload} className="ghost-button"><Sparkles size={14} />Sample</button>
        </div>
        <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.ppt,.pptx" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
      </div>

      <div className="mt-6">
        {files.length === 0 ? (
          <div className="draft-card flex flex-col items-center gap-3 py-12 text-center">
            <div className="empty-illustration"><FileText size={28} /></div>
            <p className="text-sm text-slate-500">{t.noFiles}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {files.map((file, idx) => {
              const Icon = fileIcon(file.name);
              return (
                <div key={`${file.name}-${idx}`} className="panel flex items-center gap-4 p-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-500"><Icon size={20} /></div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-800">{file.name}</p>
                    <p className="mt-0.5 text-[11px] text-slate-400">{file.size} · Analyzed · Flashcards & podcast ready</p>
                  </div>
                  <span className="hidden rounded-md bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-600 sm:inline">Ready</span>
                  <button onClick={() => onRemove(idx)} className="rounded-lg p-2 text-slate-300 transition hover:bg-rose-50 hover:text-rose-500"><Trash2 size={16} /></button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ============ Flashcards ============ */

function FlashcardPanel({ t, currentCard, cardIndex, flipped, setFlipped, rateCard }: { t: Copy; currentCard: typeof cards[number]; cardIndex: number; flipped: boolean; setFlipped: (value: boolean) => void; rateCard: (rating: Rating) => void }) {
  return (
    <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} className="mx-auto max-w-3xl">
      <div className="mb-4 flex items-center justify-between text-[11px] font-semibold text-slate-400">
        <span>{t.question} {cardIndex + 1} of {cards.length}</span>
        <span className="flex items-center gap-1.5"><RotateCcw size={13} /> Active recall</span>
      </div>
      <button onClick={() => setFlipped(!flipped)} className="flashcard group">
        <div className="absolute inset-0 rounded-[26px] bg-gradient-to-br from-sky-50/60 via-transparent to-teal-50/60" />
        <div className="relative flex h-full flex-col items-center justify-center px-8 text-center sm:px-20">
          {flipped ? (
            <><span className="card-label card-label-answer">{t.answer}</span><p className="mt-5 max-w-xl text-xl font-semibold leading-8 tracking-[-0.02em] text-slate-800 sm:text-2xl">{currentCard.answer}</p></>
          ) : (
            <><span className="card-label">{t.question}</span><p className="mt-5 max-w-xl text-xl font-semibold leading-8 tracking-[-0.02em] text-slate-800 sm:text-2xl">{currentCard.question}</p><p className="absolute bottom-8 text-[11px] font-medium text-slate-400 transition group-hover:text-sky-500">{t.flip}</p></>
          )}
        </div>
      </button>
      <div className="mt-5 grid grid-cols-3 gap-3">
        <button onClick={() => rateCard('Hard')} className="rating-button rating-hard"><X size={15} />{t.hard}</button>
        <button onClick={() => rateCard('Good')} className="rating-button rating-good"><Check size={15} />{t.good}</button>
        <button onClick={() => rateCard('Easy')} className="rating-button rating-easy"><Zap size={15} />{t.easy}</button>
      </div>
      <p className="mt-6 text-center text-[11px] text-slate-400">Rate how well you knew it to personalise your next review.</p>
    </motion.div>
  );
}

/* ============ Podcast (audio + modes + Q&A) ============ */

type QAItem = { role: 'user' | 'ai'; text: string };
function AudioPanel({ t }: { t: Copy }) {
  const [mode, setMode] = useState<PodcastMode>('brief');
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [question, setQuestion] = useState('');
  const [qaList, setQaList] = useState<QAItem[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);
  const intervalRef = useRef<number | null>(null);

  const script = podcastScripts[mode];
  const bars = useMemo(() => Array.from({ length: 48 }, (_, index) => 18 + ((index * 17) % 42)), []);

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
    u.pitch = 1;
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
    intervalRef.current = window.setInterval(() => {
      setProgress((p) => Math.min(p + 100 / totalSecs, 100));
    }, 1000);
  };

  const togglePlay = () => {
    if (isPlaying) { stopAudio(); setProgress(0); }
    else playAudio(script);
  };

  const switchMode = (m: PodcastMode) => {
    stopAudio();
    setProgress(0);
    setMode(m);
  };

  useEffect(() => () => stopAudio(), []);

  const sendQuestion = (text: string) => {
    const q = text.trim();
    if (!q) return;
    setQaList((prev) => [...prev, { role: 'user', text: q }]);
    setQuestion('');
    setIsThinking(true);
    stopAudio();
    const answer = podcastAnswers[q] ||
      `Based on your lecture, here is how I would answer "${q}": the key idea is that active retrieval — trying to remember without looking — is what builds durable memory. Apply it by closing your notes and writing down everything you can recall, then checking what you missed.`;
    window.setTimeout(() => {
      setIsThinking(false);
      setQaList((prev) => [...prev, { role: 'ai', text: answer }]);
      playAudio(answer);
    }, 1100);
  };

  const formatTime = (pct: number) => {
    const total = Math.round(script.length / 15);
    const current = Math.round((pct / 100) * total);
    return `${String(Math.floor(current / 60)).padStart(2, '0')}:${String(current % 60).padStart(2, '0')}`;
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="mx-auto max-w-3xl">
      <div className="mb-5"><h2 className="text-xl font-bold text-slate-800">{t.podcastTitle}</h2><p className="mt-1 text-sm text-slate-500">{t.podcastBody}</p></div>

      {/* Mode selection */}
      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        {(['eli5', 'brief', 'deep'] as PodcastMode[]).map((m) => (
          <button key={m} onClick={() => switchMode(m)} className={`mode-chip ${mode === m ? 'mode-chip-active' : ''} flex-col !items-start gap-1 !rounded-2xl !p-4`}>
            <span className="flex items-center gap-2">
              {m === 'eli5' && <Lightbulb size={15} />}
              {m === 'brief' && <ListChecks size={15} />}
              {m === 'deep' && <BrainCircuit size={15} />}
              {m === 'eli5' ? t.eli5 : m === 'brief' ? t.brief : t.deep}
            </span>
            <span className={`text-[10px] font-medium ${mode === m ? 'text-sky-100' : 'text-slate-400'}`}>{m === 'eli5' ? t.eli5Desc : m === 'brief' ? t.briefDesc : t.deepDesc}</span>
          </button>
        ))}
      </div>

      {/* Audio player */}
      <div className="podcast-card">
        <div className="flex items-center gap-4">
          <div className="podcast-art"><Headphones size={30} /></div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-sky-500">{isPlaying ? 'Now playing' : t.podcastTitle}</p>
            <h3 className="mt-2 text-lg font-bold text-slate-800">{mode === 'eli5' ? t.eli5 : mode === 'brief' ? t.brief : t.deep} — Cognitive Science</h3>
            <p className="mt-1 text-xs text-slate-400">AI-narrated recap from your uploaded module</p>
          </div>
        </div>
        <div className="waveform">{bars.map((height, index) => (
          <span key={index} className={isPlaying && index % 3 !== 0 ? 'wave-active' : ''} style={{ height: `${height}%`, animationDelay: `${index * 0.035}s` }} />
        ))}</div>
        <div className="flex items-center gap-4">
          <button onClick={togglePlay} className="play-button">{isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}</button>
          <div className="flex-1">
            <div className="mb-2 flex justify-between text-[10px] font-semibold text-slate-400"><span>{formatTime(progress)}</span><span>{formatTime(100)}</span></div>
            <div className="progress-track h-1"><div className="progress-fill fill-cyan" style={{ width: `${Math.max(progress, 2)}%` }} /></div>
          </div>
          <Volume2 size={18} className="text-slate-300" />
        </div>
      </div>

      {/* Suggested questions */}
      <div className="mt-6">
        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">{t.suggestedQuestions}</p>
        <div className="flex flex-wrap gap-2">
          {suggestedQuestions.map((q) => (
            <button key={q} onClick={() => sendQuestion(q)} className="question-chip"><MessageCircle size={13} />{q}</button>
          ))}
        </div>
      </div>

      {/* Q&A history */}
      {qaList.length > 0 && (
        <div className="mt-5 space-y-3">
          {qaList.map((item, i) => (
            <div key={i} className={item.role === 'user' ? 'flex justify-end' : ''}>
              <div className={item.role === 'user' ? 'max-w-[80%] rounded-2xl rounded-br-md bg-sky-500 px-4 py-3 text-sm font-medium text-white' : 'answer-bubble max-w-[92%]'}>
                {item.text}
              </div>
            </div>
          ))}
          {isThinking && (
            <div className="answer-bubble flex items-center gap-2 text-sky-600">
              <Sparkles size={15} className="animate-pulse" />{t.thinking}…
            </div>
          )}
        </div>
      )}

      {/* Ask input */}
      <div className="mt-5 flex items-center gap-3">
        <input className="qa-input" placeholder={t.askAnything} value={question} onChange={(e) => setQuestion(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') sendQuestion(question); }} />
        <button onClick={() => sendQuestion(question)} className="primary-button shrink-0"><Send size={15} />{t.send}</button>
      </div>
    </motion.div>
  );
}

/* ============ Mind map (interactive) ============ */

type MindNode = typeof initialMindNodes[number];
function VisualPanel({ t }: { t: Copy }) {
  const [nodes, setNodes] = useState<MindNode[]>(initialMindNodes);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [addingTo, setAddingTo] = useState<string | null>(null);
  const [newName, setNewName] = useState('');

  const toggleNode = (id: string) => setExpanded((prev) => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });

  const addChild = (id: string, name: string) => {
    if (!name.trim()) return;
    setNodes((prev) => prev.map((n) => n.id === id && n.children ? { ...n, children: [...n.children, name.trim()] } : n));
    setExpanded((prev) => new Set(prev).add(id));
  };
  const removeChild = (parentId: string, idx: number) => {
    setNodes((prev) => prev.map((n) => n.id === parentId && n.children ? { ...n, children: n.children.filter((_, i) => i !== idx) } : n));
  };

  const childPositions: Record<string, { top: string; left: string }> = {
    top: { top: '2%', left: '50%' },
    right: { top: '70%', right: '7%' },
    bottom: { top: 'auto', bottom: '2%', left: '50%' },
    left: { top: '70%', left: '7%' },
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="mx-auto max-w-4xl">
      <div className="mb-5"><h2 className="text-xl font-bold text-slate-800">{t.mindmapTitle}</h2><p className="mt-1 text-xs text-slate-500">{t.mindmapBody}</p></div>
      <div className="mindmap-card">
        <div className="map-line line-one" /><div className="map-line line-two" /><div className="map-line line-three" /><div className="map-line line-four" />
        {nodes.map((node) => (
          <div key={node.id}>
            <div
              className={`map-node map-${node.kind}`}
              onClick={() => node.kind !== 'center' && toggleNode(node.id)}
              style={node.kind === 'center' ? undefined : { cursor: 'pointer' }}
            >
              {node.kind === 'center' ? <BrainCircuit size={23} /> : node.kind === 'top' ? <Lightbulb size={17} /> : node.kind === 'right' ? <Clock3 size={17} /> : node.kind === 'bottom' ? <Target size={17} /> : <Sparkles size={17} />}
              <span>{node.label}</span>
              <small>{node.sub}</small>
              {node.kind !== 'center' && (
                <div className="mt-1.5 flex items-center gap-1">
                  <button onClick={(e) => { e.stopPropagation(); setAddingTo(addingTo === node.id ? null : node.id); setNewName(''); }} className="map-add"><Plus size={13} /></button>
                  {expanded.has(node.id) && <span className="text-[9px] text-slate-400">{node.children?.length || 0}</span>}
                </div>
              )}
            </div>

            {/* Add sub-topic input */}
            {addingTo === node.id && (
              <div className="absolute z-20" style={childPositions[node.kind]}>
                <div className="flex items-center gap-2 rounded-xl border border-sky-200 bg-white p-2 shadow-lg">
                  <input className="w-36 border-none text-xs text-slate-700 outline-none placeholder:text-slate-300" placeholder={t.nodeName} value={newName} onChange={(e) => setNewName(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { addChild(node.id, newName); setNewName(''); setAddingTo(null); } }} autoFocus />
                  <button onClick={() => { addChild(node.id, newName); setNewName(''); setAddingTo(null); }} className="rounded-md bg-sky-500 px-2 py-1 text-[10px] font-bold text-white"><Check size={12} /></button>
                </div>
              </div>
            )}

            {/* Expanded children */}
            {expanded.has(node.id) && node.children && (
              <div className="absolute z-10 flex flex-col gap-1.5" style={childPositions[node.kind]}>
                {node.children.map((child, idx) => (
                  <div key={`${child}-${idx}`} className="map-node map-child flex-row items-center !flex-row !gap-2 !text-left" style={{ position: 'relative', transform: 'none', top: 'auto', left: 'auto', right: 'auto', bottom: 'auto' }}>
                    <span className="!text-[11px]">{child}</span>
                    <button onClick={(e) => { e.stopPropagation(); removeChild(node.id, idx); }} className="ml-auto rounded p-0.5 text-slate-300 hover:text-rose-500"><X size={11} /></button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <p className="mt-4 text-center text-[11px] text-slate-400">Click any branch node to expand its sub-topics. Use the + button to add your own.</p>
    </motion.div>
  );
}

/* ============ Analyze modal ============ */

function AnalyzeModal({ step, name, t, onClose }: { step: number; name: string; t: Copy; onClose: () => void }) {
  const done = step >= t.analyzingSteps.length - 1;
  const progress = Math.round(((step + 1) / t.analyzingSteps.length) * 100);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-5 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, y: 18, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-2xl">
        <button onClick={onClose} className="absolute right-5 top-5 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><X size={16} /></button>
        <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl ${done ? 'bg-emerald-50 text-emerald-500' : 'bg-sky-50 text-sky-500'}`}>
          {done ? <Check size={28} /> : <BrainCircuit size={28} className="animate-pulse" />}
        </div>
        <div className="mt-6 text-center">
          <h2 className="text-lg font-bold text-slate-800">{done ? t.ready : t.analyzing}</h2>
          <p className="mt-2 text-xs text-slate-400">{done ? 'Your study session is ready to explore.' : 'The AI is reading your lecture and building your session.'}</p>
        </div>
        <div className="mt-6 space-y-2.5">
          {t.analyzingSteps.map((s, i) => (
            <div key={s} className="flex items-center gap-3">
              <div className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${i < step ? 'bg-emerald-500 text-white' : i === step ? 'bg-sky-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                {i < step ? <Check size={12} /> : i + 1}
              </div>
              <span className={`text-xs ${i <= step ? 'font-semibold text-slate-700' : 'text-slate-400'}`}>{s}</span>
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-3">
          <div className="flex items-center gap-3">
            <FileText size={17} className="text-sky-500" />
            <span className="min-w-0 flex-1 truncate text-xs font-medium text-slate-600">{name}</span>
            <span className="text-[10px] font-bold text-sky-500">{progress}%</span>
          </div>
          <div className="relative mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200">
            <div className="absolute inset-y-0 left-0 rounded-full bg-sky-500 transition-all duration-500" style={{ width: `${progress}%` }} />
            {!done && <div className="scan-line absolute inset-y-0 w-1/3" />}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ============ Draft view for sidebar pages ============ */

function DraftView({ t, title, icon, onBack }: { t: Copy; title: string; icon: React.ReactNode; onBack: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="mx-auto max-w-3xl px-5 py-10 sm:px-8 lg:px-10">
      <button onClick={onBack} className="mb-8 flex items-center gap-2 text-xs font-semibold text-slate-400 transition hover:text-sky-500"><ArrowLeft size={15} />{t.back}</button>
      <div className="draft-card flex flex-col items-center gap-4 py-16 text-center">
        <div className="empty-illustration">{icon}</div>
        <h1 className="text-xl font-bold text-slate-800">{title}</h1>
        <p className="mt-1 max-w-sm text-sm text-slate-500">{t.comingSoonBody}</p>
      </div>
    </motion.div>
  );
}

export default App;
