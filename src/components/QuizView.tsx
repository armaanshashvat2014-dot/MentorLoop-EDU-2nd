import { useState, useEffect, useCallback } from "react";
import { useGame, QuizQuestion } from "@/context/GameContext";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CheckCircle2, XCircle, Zap, Award, Loader2, Flame } from "lucide-react";
import Confetti from "react-confetti";
import { supabase } from "@/integrations/supabase/client";

interface QuizViewProps {
  subject: string;
  onBack: () => void;
  difficulty?: "easy" | "medium" | "hard";
}

const encouragements = ["🔥 On fire!", "💪 Beast mode!", "⚡ Unstoppable!", "🧠 Big brain!", "🎯 Perfect!", "👑 Legendary!"];
const wrongReactions = ["😅 Almost!", "💪 Next one!", "🤔 Tricky!", "😤 So close!"];

const QuizView = ({ subject, onBack, difficulty = "medium" }: QuizViewProps) => {
  const { solveQuiz, user } = useGame();
  const [quizzes, setQuizzes] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const [combo, setCombo] = useState(0);
  const [floatingEmojis, setFloatingEmojis] = useState<{ id: number; emoji: string; x: number }[]>([]);
  const [showEncouragement, setShowEncouragement] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: fnError } = await supabase.functions.invoke("generate-quiz", {
          body: { subject, difficulty, count: 5 },
        });
        if (fnError) throw fnError;
        if (data?.error) throw new Error(data.error);
        setQuizzes(data.questions || []);
      } catch (e: any) {
        console.error("Failed to generate quiz:", e);
        setError(e.message || "Failed to generate quiz");
        setQuizzes([
          { question: `What is a key concept in ${subject}?`, options: ["Core principles", "Random facts", "Guessing", "Luck"], correctIndex: 0, explanation: "Core principles are fundamental." },
          { question: `How do you master ${subject}?`, options: ["Ignoring it", "Practice", "Sleeping", "Wishing"], correctIndex: 1, explanation: "Practice makes perfect!" },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, [subject, difficulty, retryKey]);

  const spawnEmojis = useCallback((correct: boolean) => {
    const emojis = correct ? ["🎉", "⭐", "🔥", "✨", "💎", "🏆"] : ["💨", "😅"];
    const count = correct ? 5 : 2;
    const newEmojis = Array.from({ length: count }, (_, i) => ({
      id: Date.now() + i,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      x: 20 + Math.random() * 60,
    }));
    setFloatingEmojis(prev => [...prev, ...newEmojis]);
    setTimeout(() => setFloatingEmojis(prev => prev.filter(e => !newEmojis.find(n => n.id === e.id))), 1200);
  }, []);

  const q = quizzes[current];

  const handleSelect = (idx: number) => {
    if (selected !== null || !q) return;
    setSelected(idx);
    const correct = idx === q.correctIndex;

    if (correct) {
      const newCombo = combo + 1;
      setCombo(newCombo);
      setScore(s => s + 1);
      solveQuiz();
      spawnEmojis(true);
      if (newCombo >= 2) {
        setShowEncouragement(encouragements[Math.floor(Math.random() * encouragements.length)]);
        setTimeout(() => setShowEncouragement(null), 1500);
      }
    } else {
      setCombo(0);
      spawnEmojis(false);
      setShowEncouragement(wrongReactions[Math.floor(Math.random() * wrongReactions.length)]);
      setTimeout(() => setShowEncouragement(null), 1500);
    }

    setTimeout(() => {
      if (current < quizzes.length - 1) {
        setCurrent(c => c + 1);
        setSelected(null);
      } else {
        setFinished(true);
        if (user.quizzesSolved + 1 >= 100) setShowCertificate(true);
      }
    }, 1500);
  };

  if (loading) {
    return (
      <div className="p-4 max-w-lg mx-auto pb-24 flex flex-col items-center justify-center min-h-[60vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        >
          <Loader2 className="w-10 h-10 text-primary" />
        </motion.div>
        <motion.p
          className="font-display font-bold text-lg mt-4"
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          Generating {subject} quiz...
        </motion.p>
        <p className="text-sm text-muted-foreground mt-1">AI is crafting questions just for you ✨</p>
        <div className="flex gap-2 mt-4">
          {["🧠", "⚡", "📚", "🎯", "🔥"].map((e, i) => (
            <motion.span
              key={i}
              className="text-2xl"
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
            >
              {e}
            </motion.span>
          ))}
        </div>
      </div>
    );
  }

  if (finished) {
    const perfect = score === quizzes.length;
    const ratio = score / quizzes.length;
    return (
      <div className="p-4 max-w-lg mx-auto pb-24">
        {(perfect || showCertificate) && <Confetti recycle={false} numberOfPieces={perfect ? 500 : 300} />}
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-12">
          <motion.div
            className="text-6xl mb-4"
            animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 0.8 }}
          >
            {perfect ? "🏆" : ratio >= 0.6 ? "🎉" : "💪"}
          </motion.div>
          <h2 className="font-display text-3xl font-bold mb-2">
            {perfect ? "PERFECT SCORE!" : ratio >= 0.6 ? "Quiz Complete!" : "Keep Practicing!"}
          </h2>
          <motion.p
            className="text-muted-foreground mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            You scored <span className="text-primary font-bold">{score}/{quizzes.length}</span> on {subject}
          </motion.p>
          <motion.div
            className="flex justify-center gap-1 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {Array.from({ length: quizzes.length }).map((_, i) => (
              <motion.span
                key={i}
                className="text-2xl"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 + i * 0.1, type: "spring" }}
              >
                {i < score ? "⭐" : "☆"}
              </motion.span>
            ))}
          </motion.div>
          <p className="text-sm text-muted-foreground mb-2">+{score * 10} points earned!</p>
          {showCertificate && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-6 bg-streak/10 rounded-2xl border-2 border-streak">
              <Award className="w-12 h-12 text-streak mx-auto mb-2" />
              <h3 className="font-display text-xl font-bold text-streak">🏆 Certificate Unlocked!</h3>
              <p className="text-sm text-muted-foreground mt-1">You solved 100 quizzes!</p>
              <button className="mt-3 px-4 py-2 bg-streak text-streak-foreground rounded-xl font-display font-bold text-sm">Download Certificate 📜</button>
            </motion.div>
          )}
          <div className="flex gap-3 justify-center mt-6">
            <motion.button whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.05 }} onClick={onBack} className="px-5 py-2.5 bg-muted rounded-xl font-display font-semibold">Back to Learn</motion.button>
            <motion.button
              whileTap={{ scale: 0.92 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => { setCurrent(0); setSelected(null); setScore(0); setFinished(false); setCombo(0); setRetryKey(k => k + 1); }}
              className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-display font-bold shadow-lg shadow-primary/25"
            >
              Try Again 🔄
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!q) return null;

  return (
    <div className="p-4 max-w-lg mx-auto pb-24 relative">
      {/* Floating emojis */}
      <AnimatePresence>
        {floatingEmojis.map(fe => (
          <motion.span
            key={fe.id}
            className="fixed text-2xl pointer-events-none z-50"
            style={{ left: `${fe.x}%`, top: "50%" }}
            initial={{ opacity: 1, y: 0, scale: 1 }}
            animate={{ opacity: 0, y: -100, scale: 1.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            {fe.emoji}
          </motion.span>
        ))}
      </AnimatePresence>

      {/* Encouragement popup */}
      <AnimatePresence>
        {showEncouragement && (
          <motion.div
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-card border-2 border-primary/30 px-4 py-2 rounded-full shadow-lg font-display font-bold text-sm"
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
          >
            {showEncouragement}
          </motion.div>
        )}
      </AnimatePresence>

      <button onClick={onBack} className="flex items-center gap-1 text-muted-foreground mb-4">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      {error && <p className="text-xs text-streak bg-streak/10 px-3 py-1.5 rounded-lg mb-3">⚠️ AI unavailable, using fallback questions</p>}

      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl font-bold">{subject}</h2>
        <div className="flex items-center gap-2">
          {combo >= 2 && (
            <motion.div
              className="flex items-center gap-1 bg-streak/10 px-2 py-1 rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              key={combo}
            >
              <Flame className="w-3.5 h-3.5 text-streak" />
              <span className="font-display font-bold text-xs text-streak">{combo}x</span>
            </motion.div>
          )}
          <div className="flex items-center gap-1 bg-primary/10 px-3 py-1 rounded-full">
            <Zap className="w-4 h-4 text-primary" />
            <span className="font-display font-bold text-sm text-primary">{current + 1}/{quizzes.length}</span>
          </div>
        </div>
      </div>

      <div className="w-full h-2 bg-muted rounded-full mb-6 overflow-hidden">
        <motion.div className="h-full bg-primary rounded-full" animate={{ width: `${((current + 1) / quizzes.length) * 100}%` }} transition={{ type: "spring", stiffness: 200 }} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={current} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}>
          <h3 className="font-display text-lg font-semibold mb-4">{q.question}</h3>
          <div className="flex flex-col gap-3">
            {q.options.map((opt, idx) => {
              const isSelected = selected === idx;
              const isCorrect = idx === q.correctIndex;
              const showResult = selected !== null;
              let borderClass = "border-border";
              let bgClass = "bg-card";
              if (showResult && isCorrect) { borderClass = "border-secondary"; bgClass = "bg-secondary/10"; }
              else if (showResult && isSelected && !isCorrect) { borderClass = "border-destructive"; bgClass = "bg-destructive/10"; }
              return (
                <motion.button
                  key={idx}
                  whileTap={selected === null ? { scale: 0.97 } : {}}
                  whileHover={selected === null ? { scale: 1.01, x: 4 } : {}}
                  onClick={() => handleSelect(idx)}
                  className={`w-full text-left p-4 rounded-xl border-2 ${borderClass} ${bgClass} transition-all flex items-center justify-between`}
                  animate={showResult && isSelected && !isCorrect ? { x: [0, -4, 4, -4, 4, 0] } : showResult && isCorrect ? { scale: [1, 1.03, 1] } : {}}
                  transition={{ duration: 0.4 }}
                >
                  <span className="font-body text-sm">{opt}</span>
                  {showResult && isCorrect && <CheckCircle2 className="w-5 h-5 text-secondary animate-pop-in" />}
                  {showResult && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-destructive" />}
                </motion.button>
              );
            })}
          </div>
          {selected !== null && (
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-3 bg-muted rounded-xl text-sm text-muted-foreground">
              💡 {q.explanation}
            </motion.p>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default QuizView;
