import { BookOpen, Swords, Trophy, User } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: "learn", label: "Learn", icon: BookOpen, emoji: "📚" },
  { id: "battle", label: "Battle", icon: Swords, emoji: "⚔️" },
  { id: "leaderboard", label: "Ranks", icon: Trophy, emoji: "🏆" },
  { id: "profile", label: "Profile", icon: User, emoji: "😎" },
];

const BottomNav = ({ activeTab, onTabChange }: BottomNavProps) => {
  const [tappedTab, setTappedTab] = useState<string | null>(null);

  const handleTap = (tabId: string) => {
    setTappedTab(tabId);
    onTabChange(tabId);
    setTimeout(() => setTappedTab(null), 600);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/90 backdrop-blur-md border-t border-border">
      <div className="flex items-center justify-around max-w-lg mx-auto py-2">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          const justTapped = tappedTab === tab.id;
          return (
            <motion.button
              key={tab.id}
              onClick={() => handleTap(tab.id)}
              className={`relative flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
              whileTap={{ scale: 0.85 }}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -top-0.5 w-8 h-1 bg-primary rounded-full"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <motion.div
                animate={justTapped ? { y: [0, -8, 0], rotate: [0, -10, 10, 0] } : {}}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <tab.icon className={`w-5 h-5 ${isActive ? "stroke-[2.5]" : ""}`} />
              </motion.div>
              <span className="text-xs font-display font-semibold">{tab.label}</span>
              {justTapped && (
                <motion.span
                  className="absolute -top-3 text-sm"
                  initial={{ opacity: 1, y: 0, scale: 1 }}
                  animate={{ opacity: 0, y: -16, scale: 1.5 }}
                  transition={{ duration: 0.6 }}
                >
                  {tab.emoji}
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
