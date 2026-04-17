import React, { useState, Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Float, MeshWobbleMaterial, Text } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Map, 
  User, 
  ArrowRight, 
  Play, 
  Info,
  Home,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Gem,
  Backpack
} from 'lucide-react';
import confetti from 'canvas-confetti';

// --- 3D Components ---

function TreasureChest({ isOpen }: { isOpen: boolean }) {
  const lidRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (lidRef.current) {
      if (isOpen) {
        lidRef.current.rotation.x = THREE.MathUtils.lerp(lidRef.current.rotation.x, -Math.PI / 2, 0.05);
      } else {
        lidRef.current.rotation.x = THREE.MathUtils.lerp(lidRef.current.rotation.x, 0, 0.05);
      }
    }
  });

  return (
    <group position={[0, -0.5, 0]}>
      {/* Base */}
      <mesh position={[0, 0.25, 0]}>
        <boxGeometry args={[1.2, 0.5, 0.8]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      {/* Lid Group */}
      <group ref={lidRef} position={[0, 0.5, -0.4]}>
        <mesh position={[0, 0.2, 0.4]}>
          <boxGeometry args={[1.2, 0.4, 0.8]} />
          <meshStandardMaterial color="#A0522D" />
        </mesh>
      </group>
      {/* Ornaments */}
      <mesh position={[0, 0.35, 0.41]}>
        <boxGeometry args={[0.2, 0.2, 0.05]} />
        <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Gems inside if open */}
      <AnimatePresence>
        {isOpen && (
          <Float speed={5} rotationIntensity={2} floatIntensity={2}>
            <mesh position={[0, 0.5, 0]}>
              <octahedronGeometry args={[0.3, 0]} />
              <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={0.5} transparent opacity={0.8} />
            </mesh>
          </Float>
        )}
      </AnimatePresence>
    </group>
  );
}

function Scene({ isOpen }: { isOpen: boolean }) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[3, 2, 5]} />
      <OrbitControls 
        enablePan={false} 
        enableZoom={false} 
        minPolarAngle={Math.PI / 4} 
        maxPolarAngle={Math.PI / 2.5} 
      />
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} intensity={1} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="blue" />
      
      <Suspense fallback={null}>
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <TreasureChest isOpen={isOpen} />
        </Float>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
          <planeGeometry args={[10, 10]} />
          <MeshWobbleMaterial factor={0.1} speed={1} color="#1e3a8a" opacity={0.2} transparent />
        </mesh>
      </Suspense>
    </>
  );
}

// --- Types & Data ---

interface Question {
  id: number;
  sentence: string;
  missing: string;
  options: string[];
  correct: string;
  explanation: string;
}

const QUESTIONS: Question[] = [
  { id: 1, sentence: "Yo ____ al cine esta noche.", missing: "ir", options: ["voy", "vengo"], correct: "voy", explanation: "Իրականացնում ենք շարժում դեպի ինչ-որ տեղ: 'Voy' - գնում եմ:" },
  { id: 2, sentence: "Él ____ de la escuela ahora.", missing: "venir", options: ["va", "viene"], correct: "viene", explanation: "Նա գալիս է դպրոցից: 'Viene' - գալիս է:" },
  { id: 3, sentence: "Nosotros ____ a la playa mañana.", missing: "ir", options: ["vamos", "venimos"], correct: "vamos", explanation: "Մենք գնում ենք լողափ: 'Vamos' - գնում ենք:" },
  { id: 4, sentence: "Ellos ____ a mi casa cada domingo.", missing: "venir", options: ["vienen", "van"], correct: "vienen", explanation: "Նրանք գալիս են իմ տուն: 'Vienen' - գալիս են:" },
  { id: 5, sentence: "¿____ tú con nosotros al parque?", missing: "ir", options: ["Vas", "Vienes"], correct: "Vas", explanation: "Շարժում դեպի այնտեղ: 'Vas' - գնում ես:" },
  { id: 6, sentence: "Ella ____ de España pronto.", missing: "venir", options: ["viene", "va"], correct: "viene", explanation: "Նա շուտով կգա Իսպանիայից: 'Viene' - գալիս է:" },
  { id: 7, sentence: "Nosotros ____ del supermercado.", missing: "venir", options: ["venimos", "vamos"], correct: "venimos", explanation: "Մենք գալիս ենք սուպերմարկետից: 'Venimos' - գալիս ենք:" },
  { id: 8, sentence: "Vosotros ____ a la biblioteca.", missing: "ir", options: ["vais", "venís"], correct: "vais", explanation: "Դուք գնում եք գրադարան: 'Vais' - գնում եք:" },
  { id: 9, sentence: "Ellos ____ por aquí frecuentemente.", missing: "venir", options: ["vienen", "van"], correct: "vienen", explanation: "Նրանք այստեղով հաճախ են գալիս: 'Vienen' - գալիս են:" },
  { id: 10, sentence: "Juan ____ a visitarme mañana.", missing: "venir", options: ["viene", "va"], correct: "viene", explanation: "Խուանը գալիս է ինձ այցելելու: 'Viene' - գալիս է:" },
  { id: 11, sentence: "Yo ____ a trabajar en coche.", missing: "ir", options: ["voy", "vengo"], correct: "voy", explanation: "Ես աշխատանքի եմ գնում մեքենայով:" },
  { id: 12, sentence: "Mis padres ____ de vacaciones en agosto.", missing: "ir", options: ["van", "vienen"], correct: "van", explanation: "Իմ ծնողները արձակուրդ են գնում:" },
  { id: 13, sentence: "¿Cuándo ____ ellos a comer?", missing: "venir", options: ["vienen", "van"], correct: "vienen", explanation: "Ե՞րբ են գալիս ուտելու:" },
  { id: 14, sentence: "Nosotros ____ a estudiar juntos.", missing: "ir", options: ["vamos", "venimos"], correct: "vamos", explanation: "Մենք գնում ենք միասին սովորելու:" },
  { id: 15, sentence: "Tú ____ de comprar el pan.", missing: "venir", options: ["vienes", "vas"], correct: "vienes", explanation: "Դու գալիս ես հաց գնելուց:" },
  { id: 16, sentence: "Ellos ____ al estadio mañana.", missing: "ir", options: ["van", "vienen"], correct: "van", explanation: "Նրանք գնում են մարզադաշտ:" },
  { id: 17, sentence: "¿____ vosotros al cine con nosotros?", missing: "ir", options: ["Vais", "Venís"], correct: "Vais", explanation: "Դուք գնո՞ւմ եք կինո մեզ հետ:" },
  { id: 18, sentence: "Ella ____ de la oficina a las seis.", missing: "venir", options: ["viene", "va"], correct: "viene", explanation: "Նա գալիս է գրասենյակից ժամը վեցին:" },
  { id: 19, sentence: "Yo ____ a verte pronto.", missing: "ir", options: ["voy", "vengo"], correct: "voy", explanation: "Ես շուտով կգամ քեզ տեսնելու (իսպաներենում շարժումը դեպի դիմացինը):" },
  { id: 20, sentence: "Ellos ____ de muy lejos.", missing: "venir", options: ["vienen", "van"], correct: "vienen", explanation: "Նրանք գալիս են շատ հեռվից:" }
];

// --- Main App ---

export default function GorGayaneQuest() {
  const [view, setView] = useState<'intro' | 'theory' | 'character' | 'playing' | 'chest'>('intro');
  const [character, setCharacter] = useState<'Gor' | 'Gayane' | null>(null);
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [isAnswering, setIsAnswering] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (view === 'chest') {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00ffff', '#FFD700', '#ffffff']
      });
    }
  }, [view]);

  const handleAnswer = (option: string) => {
    if (isAnswering) return;
    setIsAnswering(true);

    const isCorrect = option === QUESTIONS[step].correct;
    if (isCorrect) {
      setScore(s => s + 1);
      setFeedback('correct');
    } else {
      setFeedback('wrong');
    }

    setTimeout(() => {
      setFeedback(null);
      setIsAnswering(false);
      if (step < QUESTIONS.length - 1) {
        setStep(s => s + 1);
      } else {
        setFinished(true);
        setView('chest');
      }
    }, isCorrect ? 1500 : 3500);
  };

  const restart = () => {
    setScore(0);
    setStep(0);
    setCharacter(null);
    setFinished(false);
    setView('intro');
  };

  return (
    <div className="min-h-screen bg-sky-950 text-white font-sans selection:bg-cyan-500 overflow-hidden relative">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[1000px] h-[1000px] bg-blue-600/10 blur-[200px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[1000px] h-[1000px] bg-cyan-500/10 blur-[200px] rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto min-h-screen flex flex-col p-6">
        <AnimatePresence mode="wait">
          {view === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="m-auto text-center space-y-12"
            >
              <div className="space-y-6">
                <motion.div 
                   animate={{ rotate: [0, 10, -10, 0] }}
                   transition={{ repeat: Infinity, duration: 4 }}
                   className="w-40 h-40 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-[3rem] flex items-center justify-center mx-auto shadow-2xl shadow-cyan-500/20"
                >
                   <Map className="w-20 h-20 text-white" />
                </motion.div>
                <div className="space-y-2">
                  <h1 className="text-7xl md:text-9xl font-black tracking-tighter uppercase leading-none">
                    Quest <br/> <span className="text-cyan-400 italic italic">Ir vs Venir</span>
                  </h1>
                  <p className="text-slate-400 font-bold uppercase tracking-[0.4em] text-sm">Գտեք Գանձերի Սնդուկը</p>
                </div>
              </div>

              <div className="flex flex-col gap-4 max-w-md mx-auto">
                <button
                  onClick={() => setView('theory')}
                  className="group relative overflow-hidden py-8 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-[2rem] font-black text-2xl uppercase tracking-widest transition-all flex items-center justify-center gap-4"
                >
                  <Info className="w-8 h-8 text-cyan-400" />
                  Տեսություն
                  <div className="absolute inset-0 bg-white/5 translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                </button>
                <button
                  onClick={() => setView('character')}
                  className="py-8 bg-cyan-500 hover:bg-cyan-400 text-white rounded-[2.5rem] font-black text-3xl uppercase tracking-widest transition-all shadow-[0_20px_50px_rgba(6,182,212,0.3)] flex items-center justify-center gap-6"
                >
                  <Play className="w-10 h-10 fill-current" />
                  Սկսել
                </button>
              </div>
            </motion.div>
          )}

          {view === 'theory' && (
            <motion.div
              key="theory"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="bg-white/5 backdrop-blur-3xl border border-white/10 p-8 md:p-16 rounded-[4rem] shadow-2xl space-y-12 max-h-[85vh] overflow-y-auto custom-scrollbar m-auto"
            >
              <div className="flex items-center gap-6 border-b border-white/10 pb-6">
                 <div className="p-4 bg-cyan-500 rounded-2xl shadow-xl shadow-cyan-500/20">
                   <Backpack className="w-8 h-8 text-white" />
                 </div>
                 <h2 className="text-4xl font-black uppercase tracking-tighter italic">Բայերի Խոնարհումը</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* IR */}
                <div className="space-y-6">
                   <div className="flex items-center gap-4">
                      <div className="h-1 w-12 bg-cyan-500 rounded-full" />
                      <h3 className="text-3xl font-black text-cyan-400 uppercase">IR (Գնալ)</h3>
                   </div>
                   <div className="bg-white/5 p-8 rounded-[3rem] border border-white/10 space-y-4 font-bold text-xl">
                      <div className="flex justify-between border-b border-white/5 pb-2"><span>Yo</span> <span className="text-cyan-400">voy</span></div>
                      <div className="flex justify-between border-b border-white/5 pb-2"><span>Tú</span> <span className="text-cyan-400">vas</span></div>
                      <div className="flex justify-between border-b border-white/5 pb-2"><span>Él / Ella</span> <span className="text-cyan-400">va</span></div>
                      <div className="flex justify-between border-b border-white/5 pb-2"><span>Nosotros</span> <span className="text-cyan-400">vamos</span></div>
                      <div className="flex justify-between border-b border-white/5 pb-2"><span>Vosotros</span> <span className="text-cyan-400">vais</span></div>
                      <div className="flex justify-between"><span>Ellos / Ellas</span> <span className="text-cyan-400">van</span></div>
                   </div>
                   <p className="text-slate-400 italic">Օգտագործվում է, երբ շարժվում եք դեպի ինչ-որ տեղ:</p>
                </div>

                {/* VENIR */}
                <div className="space-y-6">
                   <div className="flex items-center gap-4">
                      <div className="h-1 w-12 bg-cyan-500 rounded-full" />
                      <h3 className="text-3xl font-black text-cyan-400 uppercase">VENIR (Գալ)</h3>
                   </div>
                   <div className="bg-white/5 p-8 rounded-[3rem] border border-white/10 space-y-4 font-bold text-xl">
                      <div className="flex justify-between border-b border-white/5 pb-2"><span>Yo</span> <span className="text-cyan-400">vengo</span></div>
                      <div className="flex justify-between border-b border-white/5 pb-2"><span>Tú</span> <span className="text-cyan-400">vienes</span></div>
                      <div className="flex justify-between border-b border-white/5 pb-2"><span>Él / Ella</span> <span className="text-cyan-400">viene</span></div>
                      <div className="flex justify-between border-b border-white/5 pb-2"><span>Nosotros</span> <span className="text-cyan-400">venimos</span></div>
                      <div className="flex justify-between border-b border-white/5 pb-2"><span>Vosotros</span> <span className="text-cyan-400">venís</span></div>
                      <div className="flex justify-between"><span>Ellos / Ellas</span> <span className="text-cyan-400">vienen</span></div>
                   </div>
                   <p className="text-slate-400 italic">Օգտագործվում է, երբ գալիս եք որևէ տեղից կամ դեպի խոսողը:</p>
                </div>
              </div>

              <button
                onClick={() => setView('character')}
                className="w-full py-8 bg-cyan-500 hover:bg-cyan-400 text-white rounded-full font-black text-3xl uppercase tracking-widest transition-all shadow-xl"
              >
                Անցնել Խաղին
              </button>
            </motion.div>
          )}

          {view === 'character' && (
            <motion.div
              key="character"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              className="m-auto space-y-12 text-center"
            >
              <h2 className="text-5xl font-black uppercase tracking-tighter">Ընտրիր քո հերոսին</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {['Gor', 'Gayane'].map((name) => (
                  <button
                    key={name}
                    onClick={() => { setCharacter(name as any); setView('playing'); }}
                    className="group flex flex-col items-center gap-6 p-12 bg-white/5 border border-white/10 hover:border-cyan-500/50 rounded-[4rem] transition-all hover:scale-105"
                  >
                    <div className="w-48 h-48 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 p-1">
                       <div className="w-full h-full bg-sky-950 rounded-full flex items-center justify-center overflow-hidden">
                          <User className="w-24 h-24 text-cyan-400 group-hover:scale-110 transition-transform" />
                       </div>
                    </div>
                    <span className="text-4xl font-black uppercase italic tracking-tighter text-white group-hover:text-cyan-400 transition-colors">
                      {name === 'Gor' ? 'Գոռ' : 'Գայանե'}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {view === 'playing' && (
            <motion.div
              key="playing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-grow flex flex-col"
            >
              {/* Progress Track */}
              <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[3rem] border border-white/10 mb-8 relative">
                 <div className="flex justify-between items-end mb-4 px-2">
                    <div className="flex items-center gap-3">
                       <div className="p-2 bg-cyan-500 rounded-lg shadow-lg">
                          <User className="w-5 h-5" />
                       </div>
                       <span className="font-black uppercase italic text-cyan-400">{character === 'Gor' ? 'Գոռ' : 'Գայանե'}</span>
                    </div>
                    <div className="text-right">
                       <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Score</div>
                       <div className="text-4xl font-black leading-none">{score}</div>
                    </div>
                 </div>
                 
                 <div className="relative h-12 bg-black/20 rounded-full border border-white/5 overflow-hidden flex items-center px-2">
                    <motion.div 
                       animate={{ left: `${(step / QUESTIONS.length) * 100}%` }}
                       className="absolute h-8 w-8 bg-cyan-500 rounded-full shadow-lg shadow-cyan-500/50 z-20 flex items-center justify-center transform -translate-x-1/2"
                    >
                       <ArrowRight className="w-4 h-4" />
                    </motion.div>
                    <div className="absolute right-4 text-cyan-200 opacity-50"><Gem /></div>
                    {/* Track Line */}
                    <div className="absolute left-2 right-2 h-1 bg-white/10 rounded-full" />
                 </div>
                 <div className="flex justify-between mt-2 px-2 text-[10px] font-black uppercase text-slate-500 tracking-widest">
                    <span>Սկիզբ</span>
                    <span>Գանձերի Սնդուկ</span>
                 </div>
              </div>

              {/* Question Card */}
              <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-12 md:p-20 rounded-[4rem] shadow-2xl space-y-12 relative overflow-hidden flex flex-col items-center flex-grow justify-center text-center">
                 <div className="space-y-6">
                    <div className="px-6 py-2 bg-cyan-500/20 text-cyan-400 rounded-full border border-cyan-500/30 text-xs font-black uppercase tracking-widest inline-block">
                      Հարց {step + 1} / {QUESTIONS.length}
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white leading-tight">
                       {QUESTIONS[step].sentence.split('____').map((part, i) => (
                         <span key={i}>
                           {part}
                           {i === 0 && (
                             <span className="inline-block min-w-[120px] border-b-4 border-cyan-500 bg-cyan-500/10 px-4 mx-2 text-cyan-400 animate-pulse">?</span>
                           )}
                         </span>
                       ))}
                    </h2>
                    <p className="text-slate-400 font-bold uppercase tracking-widest">Ո՞ր բայն է պակասում ({QUESTIONS[step].missing})</p>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
                    {QUESTIONS[step].options.map((opt) => (
                      <button
                        key={opt}
                        disabled={isAnswering}
                        onClick={() => handleAnswer(opt)}
                        className={`group relative py-10 rounded-[2.5rem] font-black text-4xl transition-all border-b-8 active:translate-y-2 active:border-b-0 ${
                          feedback === 'correct' && opt === QUESTIONS[step].correct
                            ? 'bg-emerald-500 border-emerald-700 text-white'
                            : feedback === 'wrong' && opt === QUESTIONS[step].correct
                            ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                            : feedback === 'wrong' && opt !== QUESTIONS[step].correct
                            ? 'bg-rose-500 border-rose-800 text-white shadow-rose-500/20'
                            : 'bg-white/5 border-white/10 hover:bg-white/10 text-white hover:scale-[1.02]'
                        }`}
                      >
                         {opt}
                      </button>
                    ))}
                 </div>

                 {/* Feedback Overlay */}
                 <AnimatePresence>
                   {feedback && (
                     <motion.div
                       initial={{ opacity: 0, y: 40 }}
                       animate={{ opacity: 1, y: 0 }}
                       exit={{ opacity: 0 }}
                       className={`w-full max-w-2xl p-8 rounded-[3rem] border-4 flex flex-col items-center gap-4 text-center ${feedback === 'correct' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-400'}`}
                     >
                        <div className="flex items-center gap-4 text-4xl font-black uppercase italic">
                           {feedback === 'correct' ? <CheckCircle2 className="w-12 h-12" /> : <XCircle className="w-12 h-12" />}
                           {feedback === 'correct' ? "ՃԻՇՏ Է!" : "ՍԽԱԼ Է..."}
                        </div>
                        <p className="text-xl font-bold text-white max-w-xl leading-relaxed">
                           {QUESTIONS[step].explanation}
                        </p>
                     </motion.div>
                   )}
                 </AnimatePresence>
              </div>
            </motion.div>
          )}

          {view === 'chest' && (
            <motion.div
              key="chest"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="m-auto flex flex-col items-center gap-12 w-full h-full"
            >
              <div className="text-center space-y-4">
                 <motion.h2 
                   initial={{ scale: 0.5 }}
                   animate={{ scale: 1 }}
                   className="text-7xl md:text-9xl font-black tracking-tighter uppercase italic text-white"
                 >
                   Գտա՜ք
                 </motion.h2>
                 <p className="text-cyan-400 font-black uppercase tracking-[0.5em]">Դուք հասաք գանձերին</p>
              </div>

              {/* 3D Scene */}
              <div className="w-full h-[400px] md:h-[600px] rounded-[5rem] overflow-hidden bg-white/5 border border-white/10 cursor-grab active:cursor-grabbing shadow-[0_0_100px_rgba(6,182,212,0.1)]">
                 <Canvas shadows>
                    <Scene isOpen={true} />
                 </Canvas>
              </div>

              <div className="bg-white/5 backdrop-blur-xl p-10 md:p-16 rounded-[4rem] text-center space-y-8 w-full max-w-2xl border border-white/10">
                 <div className="space-y-2">
                   <div className="text-sm font-black uppercase tracking-[1em] text-slate-500">Վերջնական Արդյունք</div>
                   <div className="text-9xl font-black text-white leading-none tracking-tighter">
                      {score} <span className="text-cyan-400 text-3xl">/ {QUESTIONS.length}</span>
                   </div>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <button
                     onClick={() => setView('intro')}
                     className="py-8 bg-white/10 hover:bg-white/20 text-white rounded-full font-black text-xl uppercase tracking-widest transition-all"
                   >
                     Գլխավոր էջ
                   </button>
                   <button
                     onClick={restart}
                     className="py-8 bg-cyan-500 hover:bg-cyan-400 text-white rounded-full font-black text-xl uppercase tracking-widest transition-all shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-4"
                   >
                     <RotateCcw className="w-6 h-6" /> Նորից Խաղալ
                   </button>
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
        
        .font-sans {
          font-family: 'Inter', system-ui, sans-serif;
        }

        h1, h2, h3, button, span, p, div {
          font-family: 'Inter', sans-serif !important;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(6, 182, 212, 0.2);
          border-radius: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(6, 182, 212, 0.4);
        }
      `}} />
    </div>
  );
}
