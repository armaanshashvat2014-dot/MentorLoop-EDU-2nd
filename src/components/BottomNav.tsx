import { BookOpen, Swords, Trophy, User } from "lucide-react";
import { motion } from "framer-motion";

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: "learn", label: "Learn", icon: BookOpen },
  { id: "battle", label: "Battle", icon: Swords },
  { id: "leaderboard", label: "Ranks", icon: Trophy },
  { id: "profile", label: "Profile", icon: User },
];

const BottomNav = ({ activeTab, onTabChange }: BottomNavProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/90 backdrop-blur-md border-t border-border">
      <div className="flex items-center justify-around max-w-lg mx-auto py-2">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <motion.button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
              whileTap={{ scale: 0.9 }}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -top-0.5 w-8 h-1 bg-primary rounded-full"
                />
              )}
              <tab.icon className={`w-5 h-5 ${isActive ? "stroke-[2.5]" : ""}`} />
              <span className="text-xs font-display font-semibold">{tab.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
