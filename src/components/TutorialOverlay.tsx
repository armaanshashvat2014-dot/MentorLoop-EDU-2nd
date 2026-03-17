import { useGame } from "@/context/GameContext";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const steps = [
  { emoji: "👋", title: "Welcome to QuizQuest!", text: "I'm your Smart Guide! I'll help you learn, battle, and climb the ranks." },
  { emoji: "📚", title: "Learn Anything", text: "Search any subject and get AI-powered quizzes instantly. The more you learn, the more points you earn!" },
  { emoji: "⚔️", title: "Battle Mode", text: "Challenge AI or friends in real-time quiz battles. Chat, share quizzes, and prove you're the best!" },
  { emoji: "🔥", title: "Streaks & Points", text: "Keep your streak alive daily! Trade 100 points for 10 streaks, or 20 streaks for 10 points in the shop." },
  { emoji: "🏆", title: "Get Certified!", text: "Solve 100 quizzes to earn a downloadable certificate. Let's go!" },
];

const TutorialOverlay = () => {
  const { showTutorial, setShowTutorial, user, setUser } = useGame();
  const [step, setStep] = useState(0);

  if (!showTutorial) return null;

  const finish = () => {
    setShowTutorial(false);
    const next = { ...user, tutorialDone: true };
    setUser(next);
    localStorage.setItem("quizquest-user", JSON.stringify(next));
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-foreground/60 flex items-center justify-center p-6"
        onClick={() => {}}
      >
        <motion.div
          key={step}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="bg-background rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl"
        >
          <motion.div
            className="text-6xl mb-4"
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            {steps[step].emoji}
          </motion.div>
          <h2 className="font-display text-2xl font-bold mb-2">{steps[step].title}</h2>
          <p className="text-muted-foreground mb-6">{steps[step].text}</p>
          <div className="flex gap-2 justify-center mb-4">
            {steps.map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full ${i === step ? "bg-primary" : "bg-border"}`} />
            ))}
          </div>
          <div className="flex gap-3 justify-center">
            {step > 0 && (
              <button
                onClick={() => setStep(s => s - 1)}
                className="px-5 py-2.5 rounded-xl bg-muted text-foreground font-display font-semibold"
              >
                Back
              </button>
            )}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => (step < steps.length - 1 ? setStep(s => s + 1) : finish())}
              className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-display font-bold"
            >
              {step < steps.length - 1 ? "Next" : "Let's Go! 🚀"}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TutorialOverlay;
