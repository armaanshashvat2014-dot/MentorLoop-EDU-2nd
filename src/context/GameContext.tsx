import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface UserProfile {
  name: string;
  avatar: string;
  points: number;
  streaks: number;
  quizzesSolved: number;
  rank: number;
  level: number;
  tutorialDone: boolean;
}

interface GameState {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  addPoints: (n: number) => void;
  addStreak: (n: number) => void;
  solveQuiz: () => void;
  buyStreaks: () => boolean;
  buyPoints: () => boolean;
  showTutorial: boolean;
  setShowTutorial: (v: boolean) => void;
}

const defaultUser: UserProfile = {
  name: "Student",
  avatar: "🧑‍🎓",
  points: 250,
  streaks: 5,
  quizzesSolved: 42,
  rank: 7,
  level: 4,
  tutorialDone: false,
};

const GameContext = createContext<GameState | null>(null);

export const useGame = () => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be inside GameProvider");
  return ctx;
};

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem("quizquest-user");
    return saved ? JSON.parse(saved) : defaultUser;
  });
  const [showTutorial, setShowTutorial] = useState(!user.tutorialDone);

  const persist = useCallback((u: UserProfile) => {
    localStorage.setItem("quizquest-user", JSON.stringify(u));
  }, []);

  const addPoints = useCallback((n: number) => {
    setUser(prev => {
      const next = { ...prev, points: prev.points + n };
      persist(next);
      return next;
    });
  }, [persist]);

  const addStreak = useCallback((n: number) => {
    setUser(prev => {
      const next = { ...prev, streaks: prev.streaks + n };
      persist(next);
      return next;
    });
  }, [persist]);

  const solveQuiz = useCallback(() => {
    setUser(prev => {
      const next = {
        ...prev,
        quizzesSolved: prev.quizzesSolved + 1,
        points: prev.points + 10,
        level: Math.floor((prev.quizzesSolved + 1) / 10) + 1,
      };
      persist(next);
      return next;
    });
  }, [persist]);

  const buyStreaks = useCallback(() => {
    if (user.points < 100) return false;
    setUser(prev => {
      const next = { ...prev, points: prev.points - 100, streaks: prev.streaks + 10 };
      persist(next);
      return next;
    });
    return true;
  }, [user.points, persist]);

  const buyPoints = useCallback(() => {
    if (user.streaks < 20) return false;
    setUser(prev => {
      const next = { ...prev, streaks: prev.streaks - 20, points: prev.points + 10 };
      persist(next);
      return next;
    });
    return true;
  }, [user.streaks, persist]);

  return (
    <GameContext.Provider value={{ user, setUser, addPoints, addStreak, solveQuiz, buyStreaks, buyPoints, showTutorial, setShowTutorial }}>
      {children}
    </GameContext.Provider>
  );
};
