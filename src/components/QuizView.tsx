import { useState, useEffect } from "react";
import { useGame, QuizQuestion } from "@/context/GameContext";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CheckCircle2, XCircle, Zap, Award, Loader2 } from "lucide-react";
import Confetti from "react-confetti";
import { supabase } from "@/integrations/supabase/client";

interface QuizViewProps {
  subject: string;
  onBack: () => void;
  difficulty?: "easy" | "medium" | "hard";
}

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
        // Fallback questions
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

  const q = quizzes[current];

  const handleSelect = (idx: number) => {
    if (selected !== null || !q) return;
    setSelected(idx);
    if (idx === q.correctIndex) {
      setScore(s => s + 1);
      solveQuiz();
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
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
          <Loader2 className="w-10 h-10 text-primary" />
        </motion.div>
        <p className="font-display font-bold text-lg mt-4">Generating {subject} quiz...</p>
        <p className="text-sm text-muted-foreground mt-1">AI is crafting questions just for you ✨</p>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="p-4 max-w-lg mx-auto pb-24">
        {showCertificate && <Confetti recycle={false} numberOfPieces={300} />}
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-12">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="font-display text-3xl font-bold mb-2">Quiz Complete!</h2>
          <p className="text-muted-foreground mb-4">
            You scored <span className="text-primary font-bold">{score}/{quizzes.length}</span> on {subject}
          </p>
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
            <motion.button whileTap={{ scale: 0.95 }} onClick={onBack} className="px-5 py-2.5 bg-muted rounded-xl font-display font-semibold">Back to Learn</motion.button>
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => { setCurrent(0); setSelected(null); setScore(0); setFinished(false); setLoading(true); }} className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-display font-bold">
              Try Again 🔄
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!q) return null;

  return (
    <div className="p-4 max-w-lg mx-auto pb-24">
      <button onClick={onBack} className="flex items-center gap-1 text-muted-foreground mb-4">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      {error && <p className="text-xs text-streak bg-streak/10 px-3 py-1.5 rounded-lg mb-3">⚠️ AI unavailable, using fallback questions</p>}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl font-bold">{subject}</h2>
        <div className="flex items-center gap-1 bg-primary/10 px-3 py-1 rounded-full">
          <Zap className="w-4 h-4 text-primary" />
          <span className="font-display font-bold text-sm text-primary">{current + 1}/{quizzes.length}</span>
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
                <motion.button key={idx} whileTap={selected === null ? { scale: 0.97 } : {}} onClick={() => handleSelect(idx)} className={`w-full text-left p-4 rounded-xl border-2 ${borderClass} ${bgClass} transition-all flex items-center justify-between`}>
                  <span className="font-body text-sm">{opt}</span>
                  {showResult && isCorrect && <CheckCircle2 className="w-5 h-5 text-secondary animate-pop-in" />}
                  {showResult && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-destructive animate-shake" />}
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
