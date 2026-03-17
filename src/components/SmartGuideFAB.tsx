import { useGame } from "@/context/GameContext";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { MessageCircle, X } from "lucide-react";

const tips = [
  "Try a harder quiz to level up faster! 💪",
  "Your streak is on fire! Don't lose it! 🔥",
  "Battle a friend to earn bonus points! ⚔️",
  "You're close to your certificate! Keep going! 🏆",
  "Search a new subject to expand your knowledge! 📚",
];

const SmartGuideFAB = () => {
  const { user } = useGame();
  const [open, setOpen] = useState(false);

  const tip = user.quizzesSolved >= 90
    ? "You're close to your certificate! Keep going! 🏆"
    : user.streaks > 10
    ? "Your streak is on fire! Don't lose it! 🔥"
    : tips[Math.floor(Math.random() * tips.length)];

  return (
    <div className="fixed bottom-20 right-4 z-30">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="mb-3 bg-background rounded-2xl shadow-lg border border-border p-4 max-w-[260px]"
          >
            <div className="flex items-start gap-2">
              <span className="text-2xl">{user.avatar}</span>
              <div>
                <p className="font-display font-bold text-sm">Smart Guide</p>
                <p className="text-sm text-muted-foreground mt-1">{tip}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen(!open)}
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl ${
          open ? "bg-muted" : "bg-primary animate-pulse-glow"
        }`}
      >
        {open ? <X className="w-5 h-5 text-foreground" /> : user.avatar}
      </motion.button>
    </div>
  );
};

export default SmartGuideFAB;
