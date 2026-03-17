import { motion } from "framer-motion";
import { useGame } from "@/context/GameContext";
import { Medal, Share2 } from "lucide-react";
import { toast } from "sonner";

const leaderboard = [
  { name: "QuizKing", avatar: "👑", points: 4200, quizzes: 210 },
  { name: "BrainStorm", avatar: "⚡", points: 3800, quizzes: 185 },
  { name: "NerdHero", avatar: "🦸", points: 3100, quizzes: 156 },
  { name: "ScienceWiz", avatar: "🧪", points: 2900, quizzes: 142 },
  { name: "MathGenius", avatar: "🔢", points: 2600, quizzes: 130 },
  { name: "HistoryBuff", avatar: "📜", points: 2200, quizzes: 115 },
  { name: "CodeNinja", avatar: "🥷", points: 1800, quizzes: 92 },
  { name: "ArtStar", avatar: "🎨", points: 1500, quizzes: 78 },
];

const medalColors = ["text-streak", "text-muted-foreground", "text-streak/60"];

const LeaderboardTab = () => {
  const { user } = useGame();

  const shareRank = () => {
    toast.success("Rank shared! Challenge your friends to beat you! 🔥");
  };

  return (
    <div className="p-4 max-w-lg mx-auto pb-24">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold">Leaderboard</h1>
          <p className="text-muted-foreground text-sm">Your rank: #{user.rank}</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={shareRank}
          className="flex items-center gap-1.5 px-3 py-2 bg-primary/10 text-primary rounded-xl font-display font-bold text-sm"
        >
          <Share2 className="w-4 h-4" /> Share
        </motion.button>
      </div>

      {/* Top 3 podium */}
      <div className="flex items-end justify-center gap-3 mb-8">
        {[1, 0, 2].map(idx => {
          const p = leaderboard[idx];
          const isFirst = idx === 0;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="text-center"
            >
              <span className={`text-${isFirst ? "5xl" : "4xl"} block mb-1`}>{p.avatar}</span>
              <div className={`${isFirst ? "bg-streak/20 border-streak" : "bg-muted border-border"} border-2 rounded-xl px-4 py-3 ${isFirst ? "pb-8" : "pb-5"}`}>
                <Medal className={`w-5 h-5 mx-auto mb-1 ${medalColors[idx] || "text-muted-foreground"}`} />
                <p className="font-display font-bold text-xs">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.points} pts</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Full list */}
      <div className="space-y-2">
        {leaderboard.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border"
          >
            <span className="font-display font-bold text-muted-foreground w-6 text-center">
              {i < 3 ? ["🥇", "🥈", "🥉"][i] : `${i + 1}`}
            </span>
            <span className="text-2xl">{p.avatar}</span>
            <div className="flex-1">
              <p className="font-display font-semibold text-sm">{p.name}</p>
              <p className="text-xs text-muted-foreground">{p.quizzes} quizzes solved</p>
            </div>
            <span className="font-display font-bold text-sm text-primary">{p.points}</span>
          </motion.div>
        ))}

        {/* Current user */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 p-3 bg-primary/10 rounded-xl border-2 border-primary"
        >
          <span className="font-display font-bold text-primary w-6 text-center">#{user.rank}</span>
          <span className="text-2xl">{user.avatar}</span>
          <div className="flex-1">
            <p className="font-display font-semibold text-sm">{user.name} (You)</p>
            <p className="text-xs text-muted-foreground">{user.quizzesSolved} quizzes solved</p>
          </div>
          <span className="font-display font-bold text-sm text-primary">{user.points}</span>
        </motion.div>
      </div>
    </div>
  );
};

export default LeaderboardTab;
