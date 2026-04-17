import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  BookOpen, 
  ChevronRight, 
  RotateCcw, 
  Trophy, 
  Home,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Info
} from 'lucide-react';

// --- Types & Data ---

interface Question {
  id: number;
  word: string; // The base word without tilde or context
  options: string[];
  correct: string;
  rule: 'aguda' | 'llana' | 'esdrujula';
  explanation: string;
}

const QUESTIONS: Question[] = [
  { id: 1, word: "Cancion", options: ["Canción", "Cáncion", "Cancion"], correct: "Canción", rule: 'aguda', explanation: "Canción-ը Aguda բառ է (շեշտը վերջում): Քանի որ այն ավարտվում է 'n'-ով, պետք է դրվի tilde:" },
  { id: 2, word: "Cesped", options: ["Césped", "Cespéd", "Cesped"], correct: "Césped", rule: 'llana', explanation: "Césped-ը Llana բառ է (շեշտը նախավերջում): Քանի որ այն ավարտվում է 'd'-ով (ոչ n, s կամ ձայնավոր), tilde-ն պարտադիր է:" },
  { id: 3, word: "Musica", options: ["Música", "Musíca", "Musicá"], correct: "Música", rule: 'esdrujula', explanation: "Música-ն Esdrújula բառ է (շեշտը 3-րդ վերջին վանկի վրա): Այս տեսակի բոլոր բառերը միշտ ստանում են tilde:" },
  { id: 4, word: "Ingles", options: ["Inglés", "Íngles", "Ingles"], correct: "Inglés", rule: 'aguda', explanation: "Inglés-ը Aguda է, ավարտվում է 's'-ով: Պարտադիր է tilde:" },
  { id: 5, word: "Dolar", options: ["Dólar", "Dolár", "Dolar"], correct: "Dólar", rule: 'llana', explanation: "Dólar-ը Llana բառ է (շեշտը նախավերջում): Քանի որ այն ավարտվում է 'r'-ով (ոչ n, s կամ ձայնավոր), tilde-ն պարտադիր է:" },
  { id: 6, word: "Telefono", options: ["Teléfono", "Telefóno", "Telefono"], correct: "Teléfono", rule: 'esdrujula', explanation: "Teléfono-ն Esdrújula է: Միշտ շեշտվում է:" },
  { id: 7, word: "Cafe", options: ["Café", "Cáfe", "Cafe"], correct: "Café", rule: 'aguda', explanation: "Café-ն Aguda է, ավարտվում է ձայնավորով: Պարտադիր է tilde:" },
  { id: 8, word: "Facil", options: ["Fácil", "Facíl", "Facil"], correct: "Fácil", rule: 'llana', explanation: "Fácil-ը Llana է, ավարտվում է 'l'-ով: Պարտադիր է tilde:" },
  { id: 9, word: "Exito", options: ["Éxito", "Exíto", "Exito"], correct: "Éxito", rule: 'esdrujula', explanation: "Éxito (հաջողություն)՝ Esdrújula է: Միշտ շեշտվում է:" },
  { id: 10, word: "Jamas", options: ["Jamás", "Jámas", "Jamas"], correct: "Jamás", rule: 'aguda', explanation: "Jamás-ը Aguda է, ավարտվում է 's'-ով: Պետք է tilde:" },
  { id: 11, word: "Azucar", options: ["Azúcar", "Azucár", "Azucar"], correct: "Azúcar", rule: 'llana', explanation: "Azúcar-ը Llana է, ավարտվում է 'r'-ով: Պետք է tilde:" },
  { id: 12, word: "Pajaro", options: ["Pájaro", "Pajáro", "Pajaro"], correct: "Pájaro", rule: 'esdrujula', explanation: "Pájaro (թռչուն)՝ Esdrújula է:" },
  { id: 13, word: "Avion", options: ["Avión", "Ávion", "Avion"], correct: "Avión", rule: 'aguda', explanation: "Avión-ը Aguda է, ավարտվում է 'n'-ով:" },
  { id: 14, word: "Util", options: ["Útil", "Utíl", "Util"], correct: "Útil", rule: 'llana', explanation: "Útil-ը Llana է, ավարտվում է 'l'-ով:" },
  { id: 15, word: "Grafico", options: ["Gráfico", "Grafíco", "Grafico"], correct: "Gráfico", rule: 'esdrujula', explanation: "Gráfico-ն Esdrújula է:" },
  { id: 16, word: "Peru", options: ["Perú", "Péru", "Peru"], correct: "Perú", rule: 'aguda', explanation: "Perú-ն Aguda է, ավարտվում է ձայնավորով:" },
  { id: 17, word: "Angel", options: ["Ángel", "Angél", "Angel"], correct: "Ángel", rule: 'llana', explanation: "Ángel-ը Llana է, ավարտվում է 'l'-ով:" },
  { id: 18, word: "America", options: ["América", "Americá", "America"], correct: "América", rule: 'esdrujula', explanation: "América-ն Esdrújula է:" },
  { id: 19, word: "Leccion", options: ["Lección", "Léccion", "Leccion"], correct: "Lección", rule: 'aguda', explanation: "Lección-ը Aguda է, ավարտվում է 'n'-ով:" },
  { id: 20, word: "Dificil", options: ["Difícil", "Dificíl", "Dificil"], correct: "Difícil", rule: 'llana', explanation: "Difícil-ը Llana է, ավարտվում է 'l'-ով:" }
];

export default function SpanishAccentsQuest() {
  const [view, setView] = useState<'intro' | 'theory' | 'playing' | 'results'>('intro');
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [isAnswering, setIsAnswering] = useState(false);

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
        setView('results');
      }
    }, isCorrect ? 1500 : 3500);
  };

  const restart = () => {
    setScore(0);
    setStep(0);
    setView('intro');
  };

  return (
    <div className="min-h-screen bg-sky-950 text-white font-sans selection:bg-sky-500 selection:text-white p-4 md:p-8 flex flex-col items-center justify-center overflow-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-blue-600/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-sky-500/10 blur-[150px] rounded-full" />
        <div className="absolute top-[30%] right-[10%] w-[400px] h-[400px] bg-sky-400/5 blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-4xl">
        <AnimatePresence mode="wait">
          {view === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 p-12 md:p-20 rounded-[4rem] shadow-2xl text-center space-y-12"
            >
              <div className="space-y-6">
                <div className="w-32 h-32 bg-sky-500 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl shadow-sky-500/20 -rotate-6">
                   <Sparkles className="w-16 h-16 text-white" />
                </div>
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-tight">
                  Acentos <br/> <span className="text-sky-400 italic">Վարպետ</span>
                </h1>
                <p className="text-slate-400 font-bold text-xl uppercase tracking-widest">Իսպաներենի շեշտադրություն</p>
              </div>

              <div className="flex flex-col gap-4">
                <button
                  onClick={() => setView('theory')}
                  className="w-full py-8 bg-sky-500 hover:bg-sky-400 text-white rounded-full font-black text-3xl uppercase tracking-widest transition-all shadow-2xl flex items-center justify-center gap-6 group"
                >
                  <BookOpen className="w-10 h-10" />
                  Տեսություն
                </button>
                <button
                  onClick={() => setView('playing')}
                  className="w-full py-8 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-full font-black text-3xl uppercase tracking-widest transition-all flex items-center justify-center gap-6 group"
                >
                  Խաղալ
                  <ChevronRight className="w-10 h-10 group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
            </motion.div>
          )}

          {view === 'theory' && (
            <motion.div
              key="theory"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-16 rounded-[4rem] shadow-2xl space-y-10 max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <div className="flex items-center gap-6 border-b border-white/10 pb-6">
                <div className="p-4 bg-sky-400 rounded-2xl">
                  <Lightbulb className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-4xl font-black uppercase tracking-tighter italic">Շեշտադրության Կանոնները</h2>
              </div>

              <div className="grid grid-cols-1 gap-6 text-lg">
                {/* Rule 1 */}
                <div className="p-8 bg-white/5 rounded-[3rem] border border-white/5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sky-400 text-3xl font-black uppercase italic">1. Կանոն</h3>
                    <span className="px-4 py-1 bg-sky-500/20 text-sky-300 text-xs font-black uppercase rounded-full">ձայնավոր կամ N, S</span>
                  </div>
                  <p className="font-bold text-slate-300 leading-relaxed">
                    Եթե բառը վերջանում է ձայնավորով (a, e, i, o, u) կամ n, s տառերով, շեշտն ընկնում է <span className="text-white">նախավերջին վանկի</span> վրա։
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <span className="bg-black/20 px-4 py-2 rounded-xl text-white font-black italic">Ca-sa</span>
                    <span className="bg-black/20 px-4 py-2 rounded-xl text-white font-black italic">Ha-blan</span>
                    <span className="bg-black/20 px-4 py-2 rounded-xl text-white font-black italic">Mar-tes</span>
                    <span className="bg-black/20 px-4 py-2 rounded-xl text-white font-black italic text-xs md:text-base">Es-tu-di-an-tes</span>
                  </div>
                </div>

                {/* Rule 2 */}
                <div className="p-8 bg-white/5 rounded-[3rem] border border-white/5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sky-400 text-3xl font-black uppercase italic">2. Կանոն</h3>
                    <span className="px-4 py-1 bg-sky-500/20 text-sky-300 text-xs font-black uppercase rounded-full">Այլ բաղաձայններ</span>
                  </div>
                  <p className="font-bold text-slate-300 leading-relaxed">
                    Եթե բառը վերջանում է ցանկացած այլ բաղաձայնով (բացի n-ից ու s-ից), շեշտն ընկնում է <span className="text-white">վերջին վանկի</span> վրա։
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <span className="bg-black/20 px-4 py-2 rounded-xl text-white font-black italic">Co-mer</span>
                    <span className="bg-black/20 px-4 py-2 rounded-xl text-white font-black italic">Ha-blar</span>
                    <span className="bg-black/20 px-4 py-2 rounded-xl text-white font-black italic">Ciu-dad</span>
                    <span className="bg-black/20 px-4 py-2 rounded-xl text-white font-black italic">Ma-drid</span>
                  </div>
                </div>

                {/* Rule 3 */}
                <div className="p-8 bg-white/5 rounded-[3rem] border border-white/10 shadow-lg shadow-sky-500/5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sky-400 text-3xl font-black uppercase italic">3. Կանոն</h3>
                    <span className="px-4 py-1 bg-sky-500/20 text-sky-300 text-xs font-black uppercase rounded-full">Գրավոր շեշտ</span>
                  </div>
                  <p className="font-bold text-slate-300 leading-relaxed italic">
                    Եթե բառի արտասանությունը չի ենթարկվում վերևի երկու կանոններին, դրվում է գրավոր շեշտ <span className="text-sky-400 font-black">(´) (La tilde)</span>:
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <span className="bg-black/20 px-4 py-2 rounded-xl text-sky-400 font-black italic">Café</span>
                    <span className="bg-black/20 px-4 py-2 rounded-xl text-sky-400 font-black italic">Estación</span>
                    <span className="bg-black/20 px-4 py-2 rounded-xl text-sky-400 font-black italic">Lápiz</span>
                    <span className="bg-black/20 px-4 py-2 rounded-xl text-sky-400 font-black italic">Música</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setView('playing')}
                className="w-full py-8 bg-sky-500 hover:bg-sky-400 text-white rounded-full font-black text-3xl uppercase tracking-widest transition-all shadow-xl"
              >
                Սկսել Վարժությունը
              </button>
            </motion.div>
          )}

          {view === 'playing' && (
            <motion.div
              key="playing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8 w-full"
            >
              <div className="flex justify-between items-center bg-white/5 backdrop-blur-xl px-10 py-6 rounded-[2.5rem] border border-white/10 shadow-xl">
                 <div className="flex flex-col">
                   <div className="text-[10px] font-black uppercase tracking-[0.4em] text-sky-400 mb-1">Հարց</div>
                   <div className="text-4xl font-black leading-none">{step + 1} <span className="text-white/20 text-xl">/ {QUESTIONS.length}</span></div>
                 </div>
                 <div className="text-right">
                    <div className="text-[10px] font-black uppercase tracking-[0.4em] text-sky-400 mb-1">Միավոր</div>
                    <div className="text-4xl font-black leading-none">{score}</div>
                 </div>
              </div>

              <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-12 md:p-20 rounded-[4rem] shadow-2xl space-y-12 relative overflow-hidden flex flex-col items-center min-h-[500px] justify-center text-center">
                 <div className="space-y-6">
                   <div className="text-sm font-black uppercase tracking-[0.5em] text-sky-500">Ընտրեք ճիշտ տարբերակը</div>
                   <h2 className="text-7xl md:text-9xl font-black tracking-tighter text-white drop-shadow-2xl">
                      {QUESTIONS[step].word}
                   </h2>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-2xl">
                    {QUESTIONS[step].options.map((opt) => (
                      <button
                        key={opt}
                        disabled={isAnswering}
                        onClick={() => handleAnswer(opt)}
                        className={`group relative p-8 rounded-[2rem] font-black text-3xl transition-all border-b-8 active:translate-y-2 active:border-b-0 flex flex-col items-center gap-4 ${
                          feedback === 'correct' && opt === QUESTIONS[step].correct
                            ? 'bg-emerald-500 border-emerald-700 text-white'
                            : feedback === 'wrong' && opt === QUESTIONS[step].correct
                            ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 border-b-0 translate-y-2'
                            : feedback === 'wrong' && opt !== QUESTIONS[step].correct
                            ? 'bg-rose-500 border-rose-800 text-white shadow-rose-500/20 shadow-xl'
                            : 'bg-white/10 border-white/5 hover:bg-white/20 text-white'
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
                       initial={{ opacity: 0, y: 30 }}
                       animate={{ opacity: 1, y: 0 }}
                       exit={{ opacity: 0 }}
                       className={`w-full max-w-2xl p-8 rounded-[3rem] border-4 flex flex-col items-center gap-4 text-center ${feedback === 'correct' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-400'}`}
                     >
                        <div className="flex items-center gap-4 text-3xl font-black uppercase italic">
                           {feedback === 'correct' ? <CheckCircle2 className="w-10 h-10" /> : <XCircle className="w-10 h-10" />}
                           {feedback === 'correct' ? "ՃԻՇՏ Է!" : "ՍԽԱԼ Է..."}
                        </div>
                        <p className="text-xl font-bold text-white leading-relaxed">
                           {QUESTIONS[step].explanation}
                        </p>
                     </motion.div>
                   )}
                 </AnimatePresence>
              </div>
            </motion.div>
          )}

          {view === 'results' && (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/5 backdrop-blur-xl p-16 md:p-24 rounded-[5rem] shadow-2xl text-center space-y-12"
            >
              <div className="space-y-8">
                 <div className="w-48 h-48 bg-sky-500 rounded-[3rem] flex items-center justify-center mx-auto shadow-2xl shadow-sky-500/20 rotate-12">
                    <Trophy className="w-24 h-24 text-white" />
                 </div>
                 <div className="space-y-4">
                    <h2 className="text-7xl font-black tracking-tighter uppercase text-white leading-none">
                       ¡Muy Bien!
                    </h2>
                    <p className="text-slate-400 font-bold uppercase tracking-[0.5em] text-sm">Արդյունքներ</p>
                 </div>
              </div>

              <div className="p-16 bg-white/5 rounded-[4rem] border border-white/10 space-y-4">
                 <div className="text-sm font-black uppercase tracking-[1em] text-slate-500">Վերջնական Արդյունք</div>
                 <div className="text-9xl font-black text-white tracking-tighter">
                    {score} <span className="text-sky-400 text-4xl">/ {QUESTIONS.length}</span>
                 </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                 <button
                   onClick={() => setView('intro')}
                   className="flex-1 py-8 bg-white/10 hover:bg-white/20 text-white rounded-full font-black text-xl uppercase tracking-widest transition-all flex items-center justify-center gap-4"
                 >
                   <Home className="w-6 h-6" /> Գլխավոր էջ
                 </button>
                 <button
                   onClick={restart}
                   className="flex-1 py-8 bg-sky-500 hover:bg-sky-400 text-white rounded-full font-black text-xl uppercase tracking-widest transition-all shadow-xl shadow-sky-500/20 flex items-center justify-center gap-4"
                 >
                   <RotateCcw className="w-6 h-6" /> Նորից Խաղալ
                 </button>
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
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}} />
    </div>
  );
}
