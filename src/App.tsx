import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, 
  Sparkles, 
  MessageSquare, 
  ChevronRight, 
  Star, 
  Quote, 
  Flame, 
  BookOpen, 
  Trophy, 
  Users, 
  Zap, 
  Target, 
  ExternalLink, 
  User, 
  Terminal, 
  Sword, 
  ShieldCheck, 
  MousePointer2, 
  Activity, 
  Cpu,
  Play,
  Music,
  Pause
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";

// --- Components ---

const Candle = ({ className = "" }: { className?: string }) => (
  <div className={`relative w-6 h-16 ${className}`}>
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-12 bg-[#4E342E] rounded-sm shadow-inner" />
    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-4 h-6 bg-amber-500 rounded-full blur-sm animate-flicker opacity-80" />
    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-2 h-4 bg-amber-200 rounded-full animate-glow" />
    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 bg-amber-400/10 rounded-full blur-2xl animate-pulse" />
  </div>
);

const Cloud = ({ className = "", duration = 20 }: { className?: string, duration?: number }) => (
  <motion.div 
    animate={{ x: [-20, 20, -20], y: [-10, 10, -10] }}
    transition={{ duration: duration, repeat: Infinity, ease: "easeInOut" }}
    className={`absolute pointer-events-none opacity-20 blur-3xl bg-white/40 rounded-full ${className}`}
  />
);

const WarmLight = ({ className = "" }: { className?: string }) => (
  <div className={`absolute pointer-events-none rounded-full bg-amber-600/10 blur-[150px] mix-blend-screen ${className}`} />
);

const Halo = ({ className = "" }: { className?: string }) => (
  <div className={`absolute pointer-events-none rounded-full bg-gradient-to-r from-amber-500/5 via-amber-500/10 to-transparent blur-[100px] ${className}`} />
);

const FloatingEmbers = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 bg-amber-500/20 rounded-full"
        initial={{ 
          x: Math.random() * 100 + "%", 
          y: Math.random() * 100 + "%",
          opacity: Math.random()
        }}
        animate={{ 
          y: [null, "-30%"],
          opacity: [null, 0]
        }}
        transition={{ 
          duration: Math.random() * 10 + 10, 
          repeat: Infinity,
          ease: "linear"
        }}
      />
    ))}
  </div>
);

const GlobalAtmosphere = ({ children }: { children: React.ReactNode }) => (
  <div className="relative min-h-screen bg-[#1A0F0A] overflow-hidden">
    {/* Base Gradient Layers */}
    <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,#2D1B14_0%,#1A0F0A_100%)]" />
    <div className="fixed inset-0 opacity-20 mix-blend-overlay pointer-events-none" 
         style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
    />
    
    {/* Large Ambient Glows */}
    <div className="fixed top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-amber-900/10 blur-[150px] pointer-events-none" />
    <div className="fixed bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-amber-900/10 blur-[150px] pointer-events-none" />
    
    <div className="relative z-10">
      {children}
    </div>
  </div>
);

const PrayerRibbon = ({ className = "", text = "一战成硕" }: { className?: string, text?: string }) => (
  <motion.div 
    animate={{ rotate: [-1.5, 1.5, -1.5], x: [-1, 1, -1] }}
    transition={{ duration: 4 + Math.random() * 2, repeat: Infinity, ease: "easeInOut" }}
    className={`absolute w-5 h-28 bg-amber-900/20 border-l border-amber-500/20 flex items-center justify-center backdrop-blur-[1px] ${className}`}
    style={{ writingMode: 'vertical-rl' }}
  >
    <span className="text-[9px] text-amber-200/50 font-serif tracking-[0.4em] py-2">{text}</span>
    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-2 bg-amber-900/40" />
  </motion.div>
);

const TOTAL_SCORE_IMAGES = [
  "https://oimagec5.ydstatic.com/image?id=-2715022800124275890&product=xue",
  "https://oimagec5.ydstatic.com/image?id=6261351883657199667&product=xue",
  "https://oimageb5.ydstatic.com/image?id=-2313012617024427302&product=xue",
  "https://oimageb5.ydstatic.com/image?id=-7974328190546897071&product=xue",
  "https://oimageb1.ydstatic.com/image?id=4746275366720415651&product=xue",
  "https://oimagea5.ydstatic.com/image?id=3096806703513945236&product=xue",
  "https://oimagec6.ydstatic.com/image?id=7148793870411900679&product=xue",
  "https://oimagea4.ydstatic.com/image?id=7040289542787107880&product=xue",
  "https://oimagea1.ydstatic.com/image?id=-2996888849386097731&product=xue",
  "https://oimagec1.ydstatic.com/image?id=-3086105129828248561&product=xue",
];

const HighScoresEcho = () => {
  const [index, setIndex] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);
  
  const groups = [
    [TOTAL_SCORE_IMAGES[0], TOTAL_SCORE_IMAGES[1], TOTAL_SCORE_IMAGES[2]],
    [TOTAL_SCORE_IMAGES[3], TOTAL_SCORE_IMAGES[4], TOTAL_SCORE_IMAGES[5]],
    [TOTAL_SCORE_IMAGES[6], TOTAL_SCORE_IMAGES[7], TOTAL_SCORE_IMAGES[8]],
    [TOTAL_SCORE_IMAGES[9], TOTAL_SCORE_IMAGES[0], TOTAL_SCORE_IMAGES[1]],
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setIsGlitching(true);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % groups.length);
        setIsGlitching(false);
      }, 150);
    }, 2800); // Faster interval for more excitement
    return () => clearInterval(timer);
  }, [groups.length]);

  return (
    <div className="mt-16 relative w-full max-w-4xl mx-auto group">
      {/* Signature / Dedication */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        className="flex justify-end mb-4 pr-4"
      >
        <span className="text-amber-500/80 font-serif italic text-lg md:text-xl tracking-widest drop-shadow-[0_0_8px_rgba(255,171,0,0.3)]">
          —— 你永远的树洞姥姥 · 刘亚男
        </span>
      </motion.div>

      {/* Section Title with Pulse */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-2 mb-10"
      >
        <div className="flex items-center justify-center gap-4">
          <motion.div 
            animate={{ width: [40, 80, 40] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="h-[2px] bg-amber-500 shadow-[0_0_10px_#FFAB00]" 
          />
          <h3 className="text-3xl md:text-5xl font-black italic text-amber-500 tracking-widest drop-shadow-[0_0_20px_rgba(255,171,0,0.8)] uppercase">
            树洞里的回响
          </h3>
          <motion.div 
            animate={{ width: [40, 80, 40] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="h-[2px] bg-amber-500 shadow-[0_0_10px_#FFAB00]" 
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-amber-500/60 uppercase tracking-[0.5em] animate-pulse">Critical_Success_Detected</span>
          <div className="w-1 h-1 rounded-full bg-amber-500 animate-ping" />
        </div>
      </motion.div>

      <motion.div 
        animate={isGlitching ? { x: [-2, 2, -2, 0], y: [1, -1, 1, 0] } : {}}
        className="relative aspect-[16/9] rounded-[3rem] overflow-hidden border-4 border-amber-500/40 bg-black/95 backdrop-blur-2xl shadow-[0_0_100px_rgba(255,171,0,0.3)] group-hover:border-amber-400 transition-colors duration-300"
      >
        {/* Background Blur Fill - Composite of the current group */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`bg-${index}`}
            initial={{ opacity: 0, scale: 1.2 }}
            animate={{ opacity: 0.6, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 blur-3xl saturate-200 flex"
          >
            {groups[index].map((img, i) => (
              <img 
                key={i}
                src={img} 
                alt="" 
                className="w-1/3 h-full object-cover opacity-50"
                referrerPolicy="no-referrer"
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* High Impact Overlays */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/95 via-transparent to-black/70 pointer-events-none" />
        <div className="absolute inset-0 z-10 shadow-[inset_0_0_200px_rgba(0,0,0,1)] pointer-events-none" />
        
        {/* UI Elements - Aggressive Video Style */}
        <div className="absolute top-10 left-12 z-30 flex items-center gap-6">
          <div className="flex items-center gap-3 px-4 py-1.5 bg-red-600 border-2 border-red-400 rounded-sm shadow-[0_0_20px_rgba(220,38,38,0.5)]">
            <div className="w-3 h-3 rounded-full bg-white animate-pulse" />
            <span className="text-xs font-mono text-white font-black uppercase tracking-widest">LIVE_ECHO</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-amber-500 font-bold uppercase tracking-widest">SIGNAL_STRENGTH: 99%</span>
            <motion.div 
              animate={{ width: ["10%", "99%", "95%", "99%"] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="h-1 bg-amber-500 rounded-full" 
            />
          </div>
        </div>

        <div className="absolute top-10 right-12 z-30 text-xs font-mono text-amber-500 flex flex-col items-end font-bold">
          <span className="text-amber-400">TIMESTAMP: 03_APR_2026</span>
          <span className="text-amber-600">LATENCY: 12ms</span>
        </div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 1.5, filter: "brightness(5) contrast(2)" }}
            animate={{ opacity: 1, scale: 1, filter: "brightness(1) contrast(1)" }}
            exit={{ opacity: 0, scale: 0.8, filter: "brightness(0) blur(20px)" }}
            transition={{ duration: 0.5, type: "spring", stiffness: 200, damping: 20 }}
            className="absolute inset-0 flex items-center justify-center p-12 gap-8"
          >
            {groups[index].map((img, i) => (
              <motion.div 
                key={i}
                initial={{ y: 100, opacity: 0, rotate: -5 }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                transition={{ 
                  delay: i * 0.1, 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 15 
                }}
                whileHover={{ scale: 1.1, zIndex: 50, rotate: 2 }}
                className="relative h-full aspect-[9/16] rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.8)] border-2 border-white/20 bg-black/40 group/img"
              >
                <img 
                  src={img} 
                  alt="高分回响" 
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
                {/* Intense Glitch Overlay */}
                <motion.div 
                  animate={{ 
                    opacity: [0, 0.2, 0, 0.4, 0],
                    x: [-5, 5, -5, 0]
                  }}
                  transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 1 }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/30 to-transparent mix-blend-overlay pointer-events-none"
                />
                {/* Success Badge */}
                <div className="absolute top-4 right-4 bg-amber-500 text-black text-[10px] font-black px-2 py-1 rounded-sm transform rotate-12 shadow-lg">
                  PASS_2026
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Aggressive Particle System */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-amber-400 rounded-full"
              initial={{ x: Math.random() * 100 + "%", y: "110%", opacity: 0 }}
              animate={{ 
                y: "-10%", 
                opacity: [0, 1, 0],
                scale: [1, 2, 1]
              }}
              transition={{ 
                duration: Math.random() * 2 + 1, 
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>

        {/* Intense VHS/Glitch Effects */}
        <div className="absolute inset-0 pointer-events-none z-40 opacity-[0.2] mix-blend-screen" 
             style={{ backgroundImage: 'linear-gradient(rgba(255,171,0,0.3) 3px, transparent 3px)', backgroundSize: '100% 6px' }} 
        />
        <motion.div 
          animate={{ y: ["-100%", "100%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute inset-x-0 h-20 bg-gradient-to-b from-transparent via-amber-500/10 to-transparent z-40 pointer-events-none"
        />
        
        {/* Flash Effect on Transition */}
        <AnimatePresence>
          {isGlitching && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white z-50 pointer-events-none"
            />
          )}
        </AnimatePresence>
        
        {/* Rapid Progress Bar */}
        <div className="absolute bottom-0 left-0 h-2 bg-amber-900/50 w-full z-40">
          <motion.div 
            key={index}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2.8, ease: "linear" }}
            className="h-full bg-amber-500 shadow-[0_0_20px_#FFAB00]"
          />
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 flex gap-4">
          {groups.map((_, i) => (
            <motion.div 
              key={i} 
              animate={{ 
                width: i === index ? 48 : 12,
                height: 6,
                backgroundColor: i === index ? "rgba(255, 171, 0, 1)" : "rgba(255, 255, 255, 0.1)",
                boxShadow: i === index ? "0 0 20px rgba(255, 171, 0, 0.8)" : "none"
              }}
              className="rounded-full transition-all duration-300"
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

const SkillCard = ({ icon: Icon, title, type, description, effect, colorClass }: any) => (
  <motion.div 
    whileHover={{ y: -8, boxShadow: "0 20px 40px -10px rgba(255, 171, 0, 0.2), 0 0 20px rgba(255, 171, 0, 0.1)" }}
    className="bg-[#3E2723]/40 border border-amber-500/20 p-8 rounded-[2.5rem] relative overflow-hidden group backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
  >
    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
      <Icon size={80} />
    </div>
    <div className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-amber-500/5 border border-amber-500/20 mb-6 text-sm md:text-base font-black uppercase tracking-widest ${colorClass}`}>
      <Icon size={16} />
      <span>{type}</span>
    </div>
    <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
    <p className="text-base text-[#FFF3E0]/70 mb-6 leading-relaxed">{description}</p>
    <div className="pt-6 border-t border-white/5">
      <div className="text-[10px] font-mono text-[#FFAB00] mb-2 uppercase tracking-tighter opacity-50">System_Response:</div>
      <motion.p 
        animate={{ 
          opacity: [1, 0.2, 1, 0.5, 1, 0.8, 1],
          textShadow: [
            "0 0 0px rgba(255,171,0,0)",
            "0 0 10px rgba(255,171,0,0.5)",
            "0 0 0px rgba(255,171,0,0)"
          ]
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity, 
          repeatType: "mirror",
          times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 1]
        }}
        className="text-sm italic text-[#FFAB00] leading-snug font-bold"
      >
        {effect}
      </motion.p>
    </div>
  </motion.div>
);

const StudentReviews = () => {
  const reviews = [
    { text: "背诵营太神，加餐直接考到！", screenshot: "https://oimagec4.ydstatic.com/image?id=-8739363246314970194&product=xue" },
    { text: "没背帽子题，全靠刘姥姥指路！", screenshot: "https://oimagea1.ydstatic.com/image?id=-6143584412087238594&product=xue" },
    { text: "别人停笔我狂写，姥姥yyds！", screenshot: "https://oimagec1.ydstatic.com/image?id=-8332769964317369962&product=xue" },
    { text: "刘姥姥神预言，背诵营跟对了！", screenshot: "https://oimageb7.ydstatic.com/image?id=5284686174065703665&product=xue" },
    { text: "听刘姥姥早学，考场思路飞起！", screenshot: "https://oimagec4.ydstatic.com/image?id=8854182418866602876&product=xue" },
    { text: "三三制+语料库，考场下笔有神！", screenshot: "https://oimagea5.ydstatic.com/image?id=1128098160352754081&product=xue" },
    { text: "听姥姥早准备，考题从容拿捏！", screenshot: "https://oimageb3.ydstatic.com/image?id=-682365001598260088&product=xue" },
    { text: "紧跟姥姥背诵营，大题白给！", screenshot: "https://oimagea1.ydstatic.com/image?id=1030741433937634363&product=xue" },
    { text: "跟住每一轮，稳稳拿高分！", screenshot: "https://oimageb7.ydstatic.com/image?id=6185447617986099894&product=xue" },
  ];

  return (
    <motion.section 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="py-20 bg-[#1A0F0A]/80 relative overflow-hidden"
    >
      <FloatingEmbers />
      <WarmLight className="top-0 left-1/4 w-[400px] h-[400px] opacity-40" />
      <Halo className="bottom-0 right-1/4 w-[500px] h-[500px] opacity-30" />
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="flex items-center gap-4 mb-16">
          <div className="w-12 h-12 bg-amber-500/20 border border-amber-500/40 rounded-lg flex items-center justify-center text-amber-400">
            <MessageSquare size={24} />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-white italic flex items-center gap-3">
              学员真实好评・高分见证 <span className="text-xs font-mono text-white/30 uppercase tracking-widest mt-2">USER_FEEDBACK_MATRIX</span>
            </h2>
            <p className="text-[#FFF3E0]/60 text-sm mt-2">9 位学员真实上岸反馈，见证政治提分实力</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((review, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(255, 171, 0, 0.15)" }}
              className="bg-[#3E2723]/40 border border-amber-500/10 rounded-3xl backdrop-blur-sm overflow-hidden group relative shadow-lg"
            >
              {/* Small Star Icon in corner */}
              <div className="absolute top-4 left-4 opacity-20">
                <Star size={16} className="text-[#FFAB00]" />
              </div>

              <div className="p-6 pb-2">
                <p className="text-[#FFF3E0] text-center font-bold italic text-lg leading-tight">
                  <span className="text-amber-400 mr-2">“</span>
                  {review.text}
                  <span className="text-amber-400 ml-2">”</span>
                </p>
              </div>
              <div className="px-3 pb-3">
                <div className="rounded-xl overflow-hidden border border-white/5 bg-black/40 shadow-inner aspect-[640/244]">
                  <img 
                    src={review.screenshot} 
                    alt="学员反馈" 
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Decorative floating icons */}
      <motion.div 
        animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute top-20 left-10 opacity-10"
      >
        <MessageSquare size={100} className="text-[#FFAB00]" />
      </motion.div>
      <motion.div 
        animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
        transition={{ duration: 7, repeat: Infinity }}
        className="absolute bottom-20 right-10 opacity-10"
      >
        <Sparkles size={80} className="text-[#E65100]" />
      </motion.div>
    </motion.section>
  );
};

const HighScoreRecords = () => {
  const row1 = [
    "https://oimageb6.ydstatic.com/image?id=5243773072688255493&product=xue",
    "https://oimageb5.ydstatic.com/image?id=-7637747156272021188&product=xue",
    "https://oimageb3.ydstatic.com/image?id=5354312702836515984&product=xue",
    "https://oimagea5.ydstatic.com/image?id=647388191135207135&product=xue",
    "https://oimageb7.ydstatic.com/image?id=-1591561487760192815&product=xue",
    "https://oimagec1.ydstatic.com/image?id=-5308442647359822160&product=xue",
    "https://oimagea6.ydstatic.com/image?id=-5656071281528801016&product=xue",
    "https://oimageb4.ydstatic.com/image?id=-2288995064901986766&product=xue",
    "https://oimagea6.ydstatic.com/image?id=4717532889148320148&product=xue",
    "https://oimagec1.ydstatic.com/image?id=6750651209365518070&product=xue",
  ];

  return (
    <motion.section 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="py-20 bg-[#1A0F0A]/60 relative overflow-hidden"
    >
      <WarmLight className="top-0 right-0 w-[500px] h-[500px] opacity-20" />
      <div className="max-w-6xl mx-auto px-4 relative z-10 mb-12">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Trophy className="text-[#FFAB00] w-10 h-10" />
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white italic leading-none mb-4">
            26考研 <span className="text-[#FFAB00]">高分实录</span>
          </h2>
          <p className="text-[#FFAB00] text-lg md:text-xl font-bold mb-4">「有道考研，用高分说话，70 + 不是梦」</p>
          <p className="text-[#FFF3E0]/60 font-mono">HIGH_SCORE_LONG_DATABASE</p>
        </div>
      </div>

      <div className="space-y-16">
        {/* Row 1 */}
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-10 flex justify-center">
            <div className="inline-flex items-center gap-4 bg-amber-500/5 border border-amber-500/20 px-12 py-5 rounded-full backdrop-blur-sm">
              <div className="w-5 h-5 rounded-full bg-[#FFAB00] shadow-[0_0_15px_#FFAB00] animate-pulse" />
              <span className="text-3xl md:text-5xl font-black text-[#FFAB00] tracking-[0.2em] uppercase italic">政治高分排行</span>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-[2rem] border border-amber-500/10 bg-black/40 p-8">
            <motion.div 
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="flex gap-8 whitespace-nowrap"
            >
              {[...row1, ...row1].map((img, idx) => (
                <div key={idx} className="w-[calc((100%-128px)/5)] aspect-[3/5.5] flex-shrink-0 rounded-2xl overflow-hidden border border-white/10 bg-[#2A1A15] shadow-2xl group/item">
                  <img 
                    src={img} 
                    alt="高分喜报" 
                    className="w-full h-full object-contain group-hover/item:scale-105 transition-transform duration-700" 
                    referrerPolicy="no-referrer" 
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

const CourseRecommendations = () => {
 const courses = [
    { title: "【27考研·强化抢跑】全科400分备考提升营",  price: "￥0", icon: BookOpen, link: "https://ke.study.163.com/course/detail/100163142?courseId=1473682173&outVendor=zw_mooc_kaoyan_pcbanner_1068&tid=1475361492", image: "https://oimagea8.ydstatic.com/image?id=3142901116950254289&product=xue" },
    { title: "【27考研米鹏】分数解析&专业院校指南", price: "￥0", icon: Target, link: "https://ke.study.163.com/course/detail/100163114?outVendor=zw_mooc_kaoyan_pckclb_27_1", image: "https://oimagea8.ydstatic.com/image?id=7793687305128056508&product=xue" },
    { title: "【暑期集训】27考研政治定制SVIP领学班",  price: "￥4990", icon: Zap, link: "https://ke.study.163.com/course/detail/100163103?inLoc=MocWebpd&Pdt=Moc.Web&outVendor=zw_mooc_kaoyan_pckclb__4", image: "https://oimagec6.ydstatic.com/image?id=-4694226103563181269&product=xue" },
    { title: "【27考研私教课】有考商，能考上", price: "￥1990", icon: Cpu, link: "https://ke.study.163.com/course/detail/100162349?inLoc=MocWebpd&Pdt=Moc.Web&outVendor=zw_mooc_kaoyan_pckclb_27_", image: "https://oimagec2.ydstatic.com/image?id=-644811539544527095&product=xue" },
    { title: "【双集训】28考研政治定制SVIP长线领学1班",  price: "￥4990", icon: Activity, link: "https://ke.study.163.com/course/detail/100161988?inLoc=MocWebpd&Pdt=Moc.Web&outVendor=zw_mooc_kaoyan_pckclb_28_1", image: "https://oimageb6.ydstatic.com/image?id=-1689373198895319816&product=xue" },
  ];
  
  return (
    <motion.section 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="py-20 bg-[#1A0F0A]/40 border-y border-white/5 relative overflow-hidden"
    >
      <WarmLight className="bottom-0 left-0 w-[600px] h-[600px] opacity-20" />
      <Cloud className="top-10 right-10 w-64 h-32" duration={25} />
      <Cloud className="bottom-20 left-1/4 w-48 h-24 opacity-10" duration={30} />
      <div className="max-w-[1400px] mx-auto px-4 relative z-10">
        <h2 className="text-3xl font-black text-white mb-12 text-center italic">
          好课 <span className="text-[#FFAB00]">推荐</span>
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {courses.map((course, idx) => (
            <motion.a
              key={idx}
              href={course.link}
              target="_blank"
              whileHover={{ y: -10 }}
              className="bg-[#3E2723]/60 border border-amber-500/10 rounded-3xl relative overflow-hidden group flex flex-col"
            >
              <div className="aspect-video bg-[#2A1A15] relative">
                <img 
                  src={course.image} 
                  alt={course.title} 
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" 
                  referrerPolicy="no-referrer" 
                />
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="w-10 h-10 rounded-xl bg-[#E65100]/20 flex items-center justify-center text-[#FFAB00] mb-4">
                  <course.icon size={20} />
                </div>
                <h3 className="text-sm font-bold text-white mb-4 line-clamp-2 h-10">{course.title}</h3>
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-xl font-black text-[#FFAB00]">{course.price}</span>
                  <div className="p-2 rounded-full bg-white/5 group-hover:bg-[#E65100] transition-colors text-white">
                    <ChevronRight size={16} />
                  </div>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [customAudioUrl, setCustomAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(err => console.error("Playback failed:", err));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const generateAITheme = async () => {
    if (isGenerating) return;
    
    try {
      if (!(await (window as any).aistudio.hasSelectedApiKey())) {
        await (window as any).aistudio.openSelectKey();
        return;
      }

      setIsGenerating(true);
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContentStream({
        model: "lyria-3-clip-preview",
        contents: "Generate a 30-second warm, passionate, and uplifting cinematic orchestral track for a student success sanctuary. It should feel inspiring and emotional.",
      });

      let audioBase64 = "";
      let mimeType = "audio/wav";

      for await (const chunk of response) {
        const parts = chunk.candidates?.[0]?.content?.parts;
        if (!parts) continue;
        for (const part of parts) {
          if (part.inlineData?.data) {
            if (!audioBase64 && part.inlineData.mimeType) {
              mimeType = part.inlineData.mimeType;
            }
            audioBase64 += part.inlineData.data;
          }
        }
      }

      const binary = atob(audioBase64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: mimeType });
      const url = URL.createObjectURL(blob);
      setCustomAudioUrl(url);
      setIsPlaying(true);
      
      // Auto-play the new track
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.src = url;
          audioRef.current.play();
        }
      }, 100);

    } catch (error) {
      console.error("AI Music Generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-32 z-[100] flex flex-col items-end gap-4">
      {/* AI Generation Tooltip/Button */}
      <AnimatePresence>
        {!isPlaying && !isGenerating && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="bg-amber-500 text-black text-[10px] font-black px-3 py-1.5 rounded-full shadow-xl flex items-center gap-2 cursor-pointer whitespace-nowrap"
            onClick={generateAITheme}
          >
            <Sparkles size={12} />
            <span>生成专属 AI 主题曲</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative">
        <audio
          ref={audioRef}
          src={customAudioUrl || "https://cdn.pixabay.com/audio/2022/01/18/audio_d0a13f69d2.mp3"}
          loop
        />
        
        {/* Visualizer Ring */}
        {isPlaying && (
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-full bg-amber-500 blur-xl"
          />
        )}

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={togglePlay}
          className={`w-16 h-16 rounded-full backdrop-blur-2xl border-2 flex items-center justify-center transition-all duration-500 shadow-[0_0_30px_rgba(255,171,0,0.3)] relative overflow-hidden ${
            isPlaying ? 'bg-amber-500 border-amber-400 text-black' : 'bg-black/40 border-amber-500/40 text-amber-500'
          }`}
        >
          {isGenerating ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles size={24} />
            </motion.div>
          ) : (
            <AnimatePresence mode="wait">
              {isPlaying ? (
                <motion.div
                  key="pause"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                >
                  <Pause size={28} fill="currentColor" />
                </motion.div>
              ) : (
                <motion.div
                  key="play"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                >
                  <Music size={28} />
                </motion.div>
              )}
            </AnimatePresence>
          )}

          {/* Mini visualizer bars */}
          {isPlaying && (
            <div className="absolute bottom-3 flex gap-0.5">
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ height: [4, 10, 4] }}
                  transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.1 }}
                  className="w-0.5 bg-black/40 rounded-full"
                />
              ))}
            </div>
          )}
        </motion.button>
      </div>
    </div>
  );
};

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <GlobalAtmosphere>
      <div className="text-[#FFF3E0] relative selection:bg-[#FFAB00] selection:text-black">
        <div className="scanline" />
      
      <AnimatePresence>
        {loading && (
          <motion.div 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#1A0F0A] flex flex-col items-center justify-center"
          >
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="mb-8"
            >
              <Flame size={64} className="text-[#FFAB00]" />
            </motion.div>
            <p className="font-mono text-[#FFAB00] animate-pulse tracking-widest">HEALING_THE_SOUL...</p>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative z-10">
        {/* Header / Title Section (Reference Attachment 1) */}
        <div className="max-w-7xl mx-auto px-4 pt-12 pb-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 text-[#FFAB00] font-mono text-xs mb-2">
                <Activity size={14} className="animate-pulse" />
                <span>CONNECTION_ESTABLISHED: STABLE</span>
              </div>
              <h1 className="text-4xl md:text-7xl font-black italic tracking-tighter uppercase leading-none flex flex-wrap gap-x-4">
                <span className="text-white">一战成硕</span>
                <span className="text-[#FFAB00]">考研上岸树洞系统</span>
              </h1>
            </div>
            <div className="flex items-center gap-4 bg-[#2A1A15]/80 border border-white/10 p-4 rounded-xl backdrop-blur-md">
              <div className="w-12 h-12 rounded-full bg-[#FFAB00]/20 flex items-center justify-center text-[#FFAB00] border border-[#FFAB00]/40">
                <User size={24} />
              </div>
              <div>
                <div className="text-[10px] font-mono text-[#FFAB00] opacity-60">NPC_NAVIGATOR</div>
                <div className="font-bold text-white">刘亚男 (姥姥)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <section className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
          <FloatingEmbers />
          <WarmLight className="top-1/4 left-1/4 w-[600px] h-[600px] opacity-40" />
          <WarmLight className="bottom-1/4 right-1/4 w-[700px] h-[700px] opacity-30" />
          <Halo className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-20" />
          <div className="max-w-6xl w-full flex flex-col md:flex-row items-center justify-between gap-12 relative z-20">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex-1 text-left"
            >
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-xl md:text-3xl text-[#FFF3E0]/80 mb-12 font-bold leading-tight"
              >
                12年资深讲师 · 连续7年带背考场原题<br/>
                <span className="text-[#FFAB00]">江湖人称：姥宝贝们的超绝守护者</span>
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-12 space-y-6 border-l-4 border-amber-500/40 pl-8 py-4 bg-amber-500/5 rounded-r-2xl"
              >
                <div className="flex items-start gap-4">
                  <div className="mt-2 w-3 h-3 rounded-full bg-[#FFAB00] shadow-[0_0_15px_#FFAB00] animate-pulse" />
                  <div className="space-y-4">
                    <p className="text-lg font-bold text-white leading-tight">
                      教学特色: <span className="text-[#FFAB00]">“双轮记忆法则”</span> — 框架式提炼 + 周期双轮复训<br/>
                      <span className="text-[#FFAB00]">“分析题三三制原则”</span> — 3层逻辑X3步解题，把书读薄把分抓稳
                    </p>
                    <p className="text-lg font-bold text-[#FFF3E0]/60 leading-relaxed">
                      高等教育出版社、中国政法大学出版社等权威出版社教材副主编/编委
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="flex-1 relative"
            >
              <motion.a 
                href="http://ytiao.cn/gAyZMj" 
                target="_blank"
                whileHover={{ scale: 1.02 }}
                className="block relative w-full aspect-[4/5] max-w-md mx-auto cursor-pointer group"
              >
                {/* Image Frame */}
                <div className="absolute inset-0 border-2 border-amber-500/20 rounded-[3rem] rotate-3 group-hover:rotate-6 transition-transform" />
                <div className="absolute inset-0 border-2 border-amber-500/10 rounded-[3rem] -rotate-3 group-hover:-rotate-6 transition-transform" />
                
                <div className="absolute inset-0 bg-[#3E2723]/40 rounded-[3rem] overflow-hidden backdrop-blur-sm border border-white/10">
                  <img 
                    src="https://oimageb4.ydstatic.com/image?id=3450842205294602300&product=xue" 
                    alt="刘亚男老师" 
                    className="w-full h-full object-cover transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A0F0A] via-transparent to-transparent opacity-60" />
                  
                  {/* Play Icon */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center shadow-2xl"
                    >
                      <Play size={40} className="text-white fill-white ml-1" />
                    </motion.div>
                  </div>
                </div>

                {/* Floating Elements around Image */}
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -top-6 -right-6 bg-amber-600 p-4 rounded-2xl shadow-xl z-20"
                >
                  <Trophy className="text-white" size={32} />
                </motion.div>
                
                <div className="absolute -bottom-4 -left-4 bg-[#FFAB00] px-6 py-2 rounded-full shadow-lg text-black font-black text-sm rotate-[-5deg] z-20">
                  点击观看姥姥寄语
                </div>
              </motion.a>
            </motion.div>
          </div>

          {/* Background Candles */}
          <Candle className="absolute bottom-20 left-10 md:left-40 scale-150 rotate-[-5deg]" />
          <Candle className="absolute top-40 right-10 md:right-40 scale-125 rotate-[10deg] opacity-60" />
          <Candle className="absolute bottom-40 right-20 scale-75 rotate-[-15deg] opacity-40" />
          <Candle className="absolute top-20 left-1/4 scale-110 rotate-[5deg] opacity-30" />
          <Candle className="absolute bottom-1/4 left-1/3 scale-90 rotate-[-8deg] opacity-20" />
          
          {/* Floating Particles */}
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-[#FFAB00]/40 rounded-full"
              initial={{ 
                x: Math.random() * 100 + "%", 
                y: Math.random() * 100 + "%",
                opacity: Math.random()
              }}
              animate={{ 
                y: [null, "-20%"],
                opacity: [null, 0]
              }}
              transition={{ 
                duration: Math.random() * 5 + 5, 
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}

          {/* Scroll Indicator */}
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40"
          >
            <span className="text-[10px] font-mono uppercase tracking-widest">Scroll_Down</span>
            <ChevronRight size={20} className="rotate-90" />
          </motion.div>
        </section>

        {/* Highlights Section */}
        <motion.section 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="py-20 px-4 bg-[#1A0F0A]/40 relative overflow-hidden"
        >
          <WarmLight className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-20" />
          <Halo className="top-0 left-0 w-[400px] h-[400px] opacity-30" />
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="flex items-center gap-3 mb-12">
              <Terminal className="text-[#FFAB00]" />
              <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-widest italic">
                姥姥教学<span className="text-amber-500">style</span>
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <SkillCard 
                icon={MessageSquare}
                title="按需调整"
                type="贴心倾听"
                description="课堂弹幕、社群留言等多渠道同步收集学员需求，针对马原复盘、考点重讲等诉求，第一时间动态调整授课安排，真正做到 “学员需要什么，就补什么”。"
                effect="教学不是单向输出，是「双向奔赴」"
                colorClass="text-[#FFAB00]"
              />
              <SkillCard 
                icon={BookOpen}
                title="轻松吃透"
                type="科学带背"
                description="针对政治背诵痛点，打造「晨读 + 夜带背」双轨闭环体系：晨间系统晨读版块夯实基础，晚间微信视频同步带背强化，反复循环巩固，彻底告别死记硬背。"
                effect="背诵不是玄学，是「科学闭环」"
                colorClass="text-amber-500"
              />
              <SkillCard 
                icon={Target}
                title="精准适配"
                type="专属护航"
                description="全程为不同专业考生提供个性化备考规划：针对工科生数学备考节奏、医学生专业课背诵压力，量身定制适配其专业特点的政治复习方案，全局统筹不跑偏。"
                effect="规划不是模板，是「量身定制」"
                colorClass="text-pink-500"
              />
            </div>
          </div>
        </motion.section>

        {/* Tree Hole Letter Section */}
        <motion.section 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
          className="py-32 px-4 relative min-h-screen flex items-center justify-center overflow-hidden"
        >
          {/* Tree Background Layer */}
          <div className="absolute inset-0 z-0">
             <img 
               src="https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=2000&auto=format&fit=crop" 
               alt="Ancient Wish Tree" 
               className="w-full h-full object-cover opacity-20 scale-110"
               referrerPolicy="no-referrer"
             />
             <div className="absolute inset-0 bg-gradient-to-b from-[#1A0F0A] via-transparent to-[#1A0F0A]" />
             <div className="absolute inset-0 bg-[#2D1B14]/40" />
          </div>

          {/* Soft Atmosphere Elements */}
          <WarmLight className="top-1/4 left-1/4 w-[500px] h-[500px]" />
          <WarmLight className="bottom-1/4 right-1/4 w-[600px] h-[600px]" />
          <WarmLight className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-30" />
          <Halo className="top-1/3 right-1/4 w-[400px] h-[400px] opacity-40" />
          <Cloud className="top-1/2 left-1/2 w-96 h-48 opacity-10" duration={40} />
          <FloatingEmbers />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,171,0,0.05)_0%,transparent_70%)]" />
          
          {/* Prayer Ribbons on the tree */}
          <PrayerRibbon className="top-[20%] left-[15%] opacity-40" text="稳稳上岸" />
          <PrayerRibbon className="top-[15%] left-[25%] opacity-30" text="一战成硕" />
          <PrayerRibbon className="top-[25%] right-[20%] opacity-40" text="金榜题名" />
          <PrayerRibbon className="top-[10%] right-[30%] opacity-30" text="全力以赴" />
          <PrayerRibbon className="top-[30%] left-[40%] opacity-20" text="不负韶华" />
          
          <Cloud className="top-20 left-[10%] w-64 h-32" duration={25} />
          <Cloud className="top-40 right-[15%] w-80 h-40" duration={30} />
          <Cloud className="bottom-40 left-[20%] w-72 h-36" duration={22} />

          <div className="max-w-6xl mx-auto relative z-20 w-full">
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="bg-[#3E2723]/40 border border-amber-500/20 p-8 md:p-16 rounded-[4rem] backdrop-blur-2xl relative overflow-hidden shadow-[0_0_80px_rgba(255,171,0,0.1)]"
            >
              {/* Letter Stripes Background */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                   style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 39px, #FFAB00 39px, #FFAB00 40px)' }} 
              />
              
              <div className="absolute top-0 right-0 p-12 opacity-5">
                <Quote size={240} className="text-[#FFAB00]" />
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-6 mb-12">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-[0_0_30px_rgba(255,171,0,0.4)]">
                    <Heart className="text-white fill-white" size={32} />
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black italic text-white tracking-tight">姥姥的心里话</h2>
                </div>
                
                <div className="space-y-8 text-lg md:text-xl leading-relaxed text-[#FFF3E0] font-serif italic font-light">
                  <p className="drop-shadow-lg">“考研从来不是一个人的战斗，你从来都不是一个人在走这段路。”</p>
                  <p className="drop-shadow-lg">“在这个温暖的树洞里，你挑灯夜读的每一份坚持都不会被辜负，你迷茫焦虑的每一声叹息都会有回响，你备考路上的每一个细碎疑问都会有最认真的回应。”</p>
                  <p className="drop-shadow-lg">“我是刘亚男，也是永远陪着你的树洞姥姥。我懂你凌晨三点背书的疲惫，懂你深夜刷题的崩溃，懂你对未来的不安，更懂你想要上岸的决心。不管是多晚的深夜，还是多早的凌晨，只要你需要，消息发过来，我永远都在线，做你最坚实的后盾，给你最及时的解答、最温暖的鼓励。”</p>
                  <p className="drop-shadow-lg">“我会全程陪着你，把控你的复习节奏，给你最贴合的规划建议，陪你走过备考的每一个阶段；我会第一时间分享每一份初试高分的喜悦，每一个成功上岸的荣光，让你在这条路上，永远有底气、有方向、有陪伴。”</p>
                  <p className="drop-shadow-lg">“让我们一起，全力以赴，一战成硕，稳稳上岸，奔赴属于你的光明未来！”</p>
                </div>

                <HighScoresEcho />

                <div className="mt-16 text-right">
                  <div className="inline-block border-t border-amber-500/20 pt-6">
                    <p className="text-2xl md:text-3xl font-black text-[#FFAB00] tracking-tight">—— 你永远的树洞姥姥 · 刘亚男</p>
                  </div>
                </div>
              </div>

              {/* Decorative Candles around the card */}
              <Candle className="absolute -bottom-4 left-16 z-30 scale-150" />
              <Candle className="absolute -bottom-2 right-32 z-30 scale-110 opacity-80" />
              <Candle className="absolute top-1/2 -left-8 z-30 scale-90 opacity-60 rotate-[-10deg]" />
            </motion.div>
          </div>

          {/* Foreground Candles */}
          <Candle className="absolute bottom-10 left-[15%] z-30 scale-[2] rotate-[-5deg] blur-[1px]" />
          <Candle className="absolute bottom-24 right-[10%] z-30 scale-[1.6] rotate-[8deg] blur-[0.5px]" />
        </motion.section>

        <StudentReviews />
        <HighScoreRecords />
        <CourseRecommendations />

        {/* CTA Section */}
        <section className="py-32 px-4 text-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-8 italic">
              加入 <span className="text-[#FFAB00]">姥宝贝</span> 计划
            </h2>
            <p className="text-xl text-[#FFF3E0]/60 mb-12 max-w-2xl mx-auto">
              拒绝陪跑，立刻绑定你的政治MVP导师，开启稳稳上岸之路。
            </p>
            
            <motion.a
              href="https://oimagea3.ydstatic.com/image?id=1128585912348029371&product=xue"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(230, 81, 0, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              className="px-12 py-6 bg-[#E65100] text-white font-black text-2xl rounded-full flex items-center gap-3 mx-auto group w-fit"
            >
              <Sparkles size={28} />
              获取原题之力
              <MousePointer2 size={24} className="animate-bounce" />
            </motion.a>
          </div>
          
          {/* Decorative background elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#E65100]/10 rounded-full blur-[120px] -z-10" />
        </section>
      </main>

      <footer className="py-12 px-4 border-t border-white/5 text-center">
        <div className="max-w-6xl mx-auto">
          <p className="text-2xl font-black italic text-white/20 mb-4 tracking-widest">
            一战成硕 · 考研上岸树洞系统
          </p>
          <p className="text-xs font-mono text-gray-600 uppercase tracking-widest">
            © 2026 LIU_YANAN_EDUCATION_SYSTEM. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>

      {/* Fixed Floating Heart */}
      <motion.div 
        drag
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        className="fixed bottom-8 right-8 z-50 cursor-pointer group"
      >
        <div className="absolute -top-12 right-0 bg-[#E65100] text-white text-[10px] font-bold px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          机制陪伴 姥姥的心里话
        </div>
        <div className="w-16 h-16 rounded-full bg-[#E65100] flex items-center justify-center shadow-2xl shadow-[#E65100]/40 animate-flicker">
          <Heart className="text-white fill-white w-8 h-8" />
        </div>
      </motion.div>
      <MusicPlayer />
      </div>
    </GlobalAtmosphere>
  );
}
