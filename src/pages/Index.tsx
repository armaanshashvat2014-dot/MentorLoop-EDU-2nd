import { useState } from "react";
import { GameProvider } from "@/context/GameContext";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import SmartGuideFAB from "@/components/SmartGuideFAB";
import TutorialOverlay from "@/components/TutorialOverlay";
import LearnTab from "@/pages/LearnTab";
import BattleTab from "@/pages/BattleTab";
import LeaderboardTab from "@/pages/LeaderboardTab";
import ProfileTab from "@/pages/ProfileTab";

const Index = () => {
  const [activeTab, setActiveTab] = useState("learn");

  return (
    <GameProvider>
      <div className="min-h-screen bg-background">
        <TopBar />
        <TutorialOverlay />
        <SmartGuideFAB />
        <main className="pt-2">
          {activeTab === "learn" && <LearnTab />}
          {activeTab === "battle" && <BattleTab />}
          {activeTab === "leaderboard" && <LeaderboardTab />}
          {activeTab === "profile" && <ProfileTab />}
        </main>
        <div className="fixed bottom-16 left-0 right-0 text-center py-1 text-xs text-muted-foreground font-body z-40">
          Powered by MentorLoop EDU
        </div>
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </GameProvider>
  );
};

export default Index;
