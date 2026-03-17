import { useState } from "react";
import { useGame } from "@/context/GameContext";
import { motion } from "framer-motion";
import { Edit3, Flame, Star, Trophy, Award, ArrowLeftRight, Download } from "lucide-react";
import { toast } from "sonner";

const avatarOptions = ["🧑‍🎓", "🧙‍♂️", "🦊", "🧠", "🦸", "🐱", "🐶", "🎮", "🚀", "🌟", "🦄", "🐲"];

const ProfileTab = () => {
  const { user, setUser, buyStreaks, buyPoints } = useGame();
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(user.name);
  const [showShop, setShowShop] = useState(false);
  const [showAvatars, setShowAvatars] = useState(false);

  const saveName = () => {
    const next = { ...user, name: nameInput };
    setUser(next);
    localStorage.setItem("quizquest-user", JSON.stringify(next));
    setEditingName(false);
    toast.success("Name updated! 🎉");
  };

  const pickAvatar = (a: string) => {
    const next = { ...user, avatar: a };
    setUser(next);
    localStorage.setItem("quizquest-user", JSON.stringify(next));
    setShowAvatars(false);
    toast.success("Avatar changed! Looking great! ✨");
  };

  const handleBuyStreaks = () => {
    if (buyStreaks()) toast.success("Bought 10 streaks for 100 points! 🔥");
    else toast.error("Not enough points! Need 100 points.");
  };

  const handleBuyPoints = () => {
    if (buyPoints()) toast.success("Bought 10 points for 20 streaks! ⭐");
    else toast.error("Not enough streaks! Need 20 streaks.");
  };

  const progress = Math.min(user.quizzesSolved / 100, 1);
  const canDownloadCert = user.quizzesSolved >= 100;

  return (
    <div className="p-4 max-w-lg mx-auto pb-24">
      <h1 className="font-display text-3xl font-bold mb-6">Profile</h1>

      {/* Avatar & Name */}
      <div className="text-center mb-6">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowAvatars(!showAvatars)}
          className="relative inline-block"
        >
          <span className="text-7xl block">{user.avatar}</span>
          <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary rounded-full flex items-center justify-center">
            <Edit3 className="w-3.5 h-3.5 text-primary-foreground" />
          </div>
        </motion.button>

        {showAvatars && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 flex flex-wrap justify-center gap-2"
          >
            {avatarOptions.map(a => (
              <motion.button
                key={a}
                whileTap={{ scale: 0.9 }}
                onClick={() => pickAvatar(a)}
                className={`text-3xl p-2 rounded-xl ${user.avatar === a ? "bg-primary/20 ring-2 ring-primary" : "bg-card"} hover:bg-muted`}
              >
                {a}
              </motion.button>
            ))}
          </motion.div>
        )}

        <div className="mt-3 flex items-center justify-center gap-2">
          {editingName ? (
            <div className="flex gap-2">
              <input
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                className="px-3 py-1.5 border border-border rounded-lg text-sm font-body text-center focus:outline-none focus:ring-2 focus:ring-primary/30"
                autoFocus
              />
              <button onClick={saveName} className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm font-display font-bold">Save</button>
            </div>
          ) : (
            <button onClick={() => setEditingName(true)} className="font-display text-xl font-bold flex items-center gap-1">
              {user.name} <Edit3 className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-1">Level {user.level}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-card rounded-xl p-4 text-center border border-border">
          <Star className="w-5 h-5 text-primary mx-auto mb-1" />
          <p className="font-display font-bold text-lg">{user.points}</p>
          <p className="text-xs text-muted-foreground">Points</p>
        </div>
        <div className="bg-card rounded-xl p-4 text-center border border-border">
          <Flame className="w-5 h-5 text-streak mx-auto mb-1" />
          <p className="font-display font-bold text-lg">{user.streaks}</p>
          <p className="text-xs text-muted-foreground">Streaks</p>
        </div>
        <div className="bg-card rounded-xl p-4 text-center border border-border">
          <Trophy className="w-5 h-5 text-secondary mx-auto mb-1" />
          <p className="font-display font-bold text-lg">{user.quizzesSolved}</p>
          <p className="text-xs text-muted-foreground">Quizzes</p>
        </div>
      </div>

      {/* Certificate progress */}
      <div className="bg-card rounded-xl p-4 border border-border mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Award className="w-5 h-5 text-streak" />
          <span className="font-display font-bold text-sm">Certificate Progress</span>
        </div>
        <div className="w-full h-3 bg-muted rounded-full overflow-hidden mb-2">
          <motion.div
            className="h-full bg-streak rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 1, delay: 0.3 }}
          />
        </div>
        <p className="text-xs text-muted-foreground">{user.quizzesSolved}/100 quizzes — {canDownloadCert ? "🎉 Ready!" : `${100 - user.quizzesSolved} to go!`}</p>
        {canDownloadCert && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="mt-2 flex items-center gap-1.5 px-4 py-2 bg-streak text-streak-foreground rounded-xl font-display font-bold text-sm"
          >
            <Download className="w-4 h-4" /> Download Certificate
          </motion.button>
        )}
      </div>

      {/* Shop */}
      <div className="bg-card rounded-xl p-4 border border-border">
        <div className="flex items-center gap-2 mb-4">
          <ArrowLeftRight className="w-5 h-5 text-primary" />
          <span className="font-display font-bold text-sm">Streak Shop</span>
        </div>
        <div className="flex flex-col gap-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleBuyStreaks}
            className="flex items-center justify-between p-4 bg-streak/10 rounded-xl border-2 border-streak/20 hover:border-streak/50 transition-all"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔥</span>
              <div className="text-left">
                <p className="font-display font-bold text-sm">Buy 10 Streaks</p>
                <p className="text-xs text-muted-foreground">Cost: 100 points</p>
              </div>
            </div>
            <span className="font-display font-bold text-primary text-sm">-100 ⭐</span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleBuyPoints}
            className="flex items-center justify-between p-4 bg-primary/10 rounded-xl border-2 border-primary/20 hover:border-primary/50 transition-all"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">⭐</span>
              <div className="text-left">
                <p className="font-display font-bold text-sm">Buy 10 Points</p>
                <p className="text-xs text-muted-foreground">Cost: 20 streaks</p>
              </div>
            </div>
            <span className="font-display font-bold text-streak text-sm">-20 🔥</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;
