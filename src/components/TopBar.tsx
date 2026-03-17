import { useGame } from "@/context/GameContext";
import { Flame, Star, Trophy } from "lucide-react";
import { motion } from "framer-motion";

const TopBar = () => {
  const { user } = useGame();

  return (
    <div className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border px-4 py-3">
      <div className="flex items-center justify-between max-w-lg mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{user.avatar}</span>
          <div>
            <p className="font-display font-bold text-sm leading-none">{user.name}</p>
            <p className="text-xs text-muted-foreground">Lvl {user.level}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <motion.div
            className="flex items-center gap-1 bg-streak/10 px-2.5 py-1 rounded-full"
            whileHover={{ scale: 1.05 }}
          >
            <Flame className="w-4 h-4 text-streak animate-streak-fire" />
            <span className="font-display font-bold text-sm text-streak">{user.streaks}</span>
          </motion.div>
          <motion.div
            className="flex items-center gap-1 bg-primary/10 px-2.5 py-1 rounded-full"
            whileHover={{ scale: 1.05 }}
          >
            <Star className="w-4 h-4 text-primary" />
            <span className="font-display font-bold text-sm text-primary">{user.points}</span>
          </motion.div>
          <div className="flex items-center gap-1 bg-secondary/10 px-2.5 py-1 rounded-full">
            <Trophy className="w-4 h-4 text-secondary" />
            <span className="font-display font-bold text-sm text-secondary">#{user.rank}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
