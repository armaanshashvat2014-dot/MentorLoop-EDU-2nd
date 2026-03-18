import { useState, useEffect } from "react";
import { useGame } from "@/context/GameContext";
import { Flame, Star, Trophy, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const greetings = [
  "Let's crush it! 💪",
  "You're on fire! 🔥",
  "Quiz time! 🧠",
  "Keep going! 🚀",
  "You're amazing! ⭐",
  "Brain power! ⚡",
  "Legend mode! 👑",
  "Unstoppable! 🎯",
];

const TopBar = () => {
  const { user } = useGame();
  const [greeting, setGreeting] = useState(greetings[0]);
  const [showGreeting, setShowGreeting] = useState(true);
  const [prevPoints, setPrevPoints] = useState(user.points);
  const [pointsDelta, setPointsDelta] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowGreeting(false);
      setTimeout(() => {
        setGreeting(greetings[Math.floor(Math.random() * greetings.length)]);
        setShowGreeting(true);
      }, 300);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (user.points !== prevPoints) {
      const delta = user.points - prevPoints;
      setPointsDelta(delta);
      setPrevPoints(user.points);
      setTimeout(() => setPointsDelta(null), 1500);
    }
  }, [user.points, prevPoints]);

  return (
    <div className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border px-4 py-3">
      <div className="flex items-center justify-between max-w-lg mx-auto">
        <div className="flex items-center gap-2">
          <motion.span
            className="text-2xl cursor-pointer"
            whileHover={{ scale: 1.3, rotate: [0, -10, 10, 0] }}
            whileTap={{ scale: 0.8 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            {user.avatar}
          </motion.span>
          <div>
            <p className="font-display font-bold text-sm leading-none">{user.name}</p>
            <AnimatePresence mode="wait">
              {showGreeting && (
                <motion.p
                  key={greeting}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-xs text-muted-foreground"
                >
                  {greeting}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <motion.div
            className="flex items-center gap-1 bg-streak/10 px-2.5 py-1 rounded-full cursor-pointer relative"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Flame className="w-4 h-4 text-streak animate-streak-fire" />
            <span className="font-display font-bold text-sm text-streak">{user.streaks}</span>
          </motion.div>
          <motion.div
            className="flex items-center gap-1 bg-primary/10 px-2.5 py-1 rounded-full cursor-pointer relative"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Star className="w-4 h-4 text-primary" />
            <motion.span
              key={user.points}
              className="font-display font-bold text-sm text-primary"
              initial={{ scale: 1.4 }}
              animate={{ scale: 1 }}
            >
              {user.points}
            </motion.span>
            <AnimatePresence>
              {pointsDelta !== null && pointsDelta > 0 && (
                <motion.span
                  initial={{ opacity: 1, y: 0 }}
                  animate={{ opacity: 0, y: -20 }}
                  exit={{ opacity: 0 }}
                  className="absolute -top-4 right-0 text-xs font-display font-bold text-secondary"
                >
                  +{pointsDelta}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
          <motion.div
            className="flex items-center gap-1 bg-secondary/10 px-2.5 py-1 rounded-full"
            whileHover={{ scale: 1.1 }}
          >
            <Trophy className="w-4 h-4 text-secondary" />
            <span className="font-display font-bold text-sm text-secondary">#{user.rank}</span>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
