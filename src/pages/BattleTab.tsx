import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Users, Swords, Send, MessageCircle } from "lucide-react";
import { useGame } from "@/context/GameContext";

const mockOpponents = [
  { name: "AlexTheGreat", avatar: "🧙‍♂️", rank: 3, score: 0 },
  { name: "QuizMaster99", avatar: "🦊", rank: 5, score: 0 },
  { name: "BrainWave", avatar: "🧠", rank: 12, score: 0 },
];

const battleQuestions = [
  { q: "What is the speed of light?", opts: ["3×10⁸ m/s", "3×10⁶ m/s", "3×10¹⁰ m/s", "3×10⁴ m/s"], correct: 0 },
  { q: "Who painted the Mona Lisa?", opts: ["Da Vinci", "Picasso", "Van Gogh", "Monet"], correct: 0 },
  { q: "What's the largest planet?", opts: ["Saturn", "Jupiter", "Neptune", "Earth"], correct: 1 },
];

interface ChatMsg {
  from: string;
  text: string;
}

const BattleTab = () => {
  const { user, addPoints } = useGame();
  const [mode, setMode] = useState<"select" | "battle" | "result">("select");
  const [battleMode, setBattleMode] = useState<"ai" | "pvp">("ai");
  const [questionIdx, setQuestionIdx] = useState(0);
  const [myScore, setMyScore] = useState(0);
  const [opScore, setOpScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [chat, setChat] = useState<ChatMsg[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [opponent] = useState(mockOpponents[Math.floor(Math.random() * mockOpponents.length)]);

  const startBattle = (m: "ai" | "pvp") => {
    setMode(m);
    setQuestionIdx(0);
    setMyScore(0);
    setOpScore(0);
    setSelected(null);
    setChat([{ from: "system", text: `Battle started! ${m === "ai" ? "🤖 AI" : opponent.avatar + " " + opponent.name} is ready!` }]);
  };

  const handleAnswer = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    const correct = idx === battleQuestions[questionIdx].correct;
    if (correct) setMyScore(s => s + 1);

    // Simulate opponent
    const opCorrect = Math.random() > 0.4;
    if (opCorrect) setOpScore(s => s + 1);

    setTimeout(() => {
      if (questionIdx < battleQuestions.length - 1) {
        setQuestionIdx(i => i + 1);
        setSelected(null);
      } else {
        setMode("result");
        if (correct ? myScore + 1 : myScore > opScore) addPoints(50);
      }
    }, 1200);
  };

  const sendChat = () => {
    if (!chatInput.trim()) return;
    setChat(prev => [...prev, { from: "me", text: chatInput }]);
    setChatInput("");
    // Simulate reply
    setTimeout(() => {
      setChat(prev => [...prev, { from: "opponent", text: ["Nice one! 💪", "Good luck! 😄", "🔥🔥🔥"][Math.floor(Math.random() * 3)] }]);
    }, 1000);
  };

  if (mode === "select") {
    return (
      <div className="p-4 max-w-lg mx-auto pb-24">
        <h1 className="font-display text-3xl font-bold mb-1">Battle Arena</h1>
        <p className="text-muted-foreground mb-6">Challenge others and prove your knowledge!</p>

        <div className="flex flex-col gap-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => startBattle("ai")}
            className="flex items-center gap-4 p-5 rounded-2xl bg-primary/10 border-2 border-primary/20 hover:border-primary/50 transition-all"
          >
            <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center">
              <Bot className="w-7 h-7 text-primary-foreground" />
            </div>
            <div className="text-left">
              <p className="font-display font-bold text-lg">Battle AI</p>
              <p className="text-sm text-muted-foreground">Test your skills against the machine</p>
            </div>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => startBattle("pvp")}
            className="flex items-center gap-4 p-5 rounded-2xl bg-battle/10 border-2 border-battle/20 hover:border-battle/50 transition-all"
          >
            <div className="w-14 h-14 bg-battle rounded-xl flex items-center justify-center">
              <Users className="w-7 h-7 text-battle-foreground" />
            </div>
            <div className="text-left">
              <p className="font-display font-bold text-lg">Battle Players</p>
              <p className="text-sm text-muted-foreground">Challenge friends in real-time</p>
            </div>
          </motion.button>
        </div>

        <div className="mt-8">
          <h3 className="font-display font-bold text-lg mb-3">Recent Challengers</h3>
          {mockOpponents.map(op => (
            <div key={op.name} className="flex items-center gap-3 p-3 bg-card rounded-xl mb-2 border border-border">
              <span className="text-2xl">{op.avatar}</span>
              <div className="flex-1">
                <p className="font-display font-semibold text-sm">{op.name}</p>
                <p className="text-xs text-muted-foreground">Rank #{op.rank}</p>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="px-3 py-1.5 bg-battle text-battle-foreground rounded-lg font-display font-bold text-xs"
              >
                Challenge
              </motion.button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (mode === "result") {
    const won = myScore > opScore;
    return (
      <div className="p-4 max-w-lg mx-auto pb-24 text-center">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <div className="text-6xl mb-4">{won ? "🏆" : "😤"}</div>
          <h2 className="font-display text-3xl font-bold mb-2">{won ? "Victory!" : "Defeat!"}</h2>
          <div className="flex justify-center gap-8 my-6">
            <div className="text-center">
              <span className="text-3xl">{user.avatar}</span>
              <p className="font-display font-bold text-lg text-primary">{myScore}</p>
              <p className="text-xs text-muted-foreground">You</p>
            </div>
            <Swords className="w-8 h-8 text-muted-foreground self-center" />
            <div className="text-center">
              <span className="text-3xl">{mode === "ai" ? "🤖" : opponent.avatar}</span>
              <p className="font-display font-bold text-lg text-destructive">{opScore}</p>
              <p className="text-xs text-muted-foreground">Opponent</p>
            </div>
          </div>
          {won && <p className="text-secondary font-display font-bold">+50 points earned!</p>}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setMode("select")}
            className="mt-6 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-display font-bold"
          >
            Battle Again ⚔️
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // Battle in progress
  const bq = battleQuestions[questionIdx];
  return (
    <div className="p-4 max-w-lg mx-auto pb-24">
      {/* Split screen header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{battleMode === "ai" ? "🤖" : opponent.avatar}</span>
          <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-destructive rounded-full" style={{ width: `${(opScore / battleQuestions.length) * 100}%` }} />
          </div>
          <span className="font-display font-bold text-sm">{opScore}</span>
        </div>
        <Swords className="w-5 h-5 text-muted-foreground" />
        <div className="flex items-center gap-2">
          <span className="font-display font-bold text-sm">{myScore}</span>
          <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: `${(myScore / battleQuestions.length) * 100}%` }} />
          </div>
          <span className="text-2xl">{user.avatar}</span>
        </div>
      </div>

      <p className="text-xs text-center text-muted-foreground mb-4">Q{questionIdx + 1}/{battleQuestions.length}</p>

      <AnimatePresence mode="wait">
        <motion.div key={questionIdx} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
          <h3 className="font-display text-lg font-semibold mb-4 text-center">{bq.q}</h3>
          <div className="flex flex-col gap-3">
            {bq.opts.map((opt, idx) => {
              const showResult = selected !== null;
              const isCorrect = idx === bq.correct;
              const isSelected = selected === idx;
              let cls = "border-border bg-card";
              if (showResult && isCorrect) cls = "border-secondary bg-secondary/10";
              else if (showResult && isSelected) cls = "border-destructive bg-destructive/10";
              return (
                <motion.button
                  key={idx}
                  whileTap={!showResult ? { scale: 0.97 } : {}}
                  onClick={() => handleAnswer(idx)}
                  className={`p-4 rounded-xl border-2 ${cls} text-left font-body text-sm transition-all`}
                >
                  {opt}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Chat toggle */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowChat(!showChat)}
        className="fixed bottom-24 left-4 z-30 bg-battle text-battle-foreground px-4 py-2 rounded-full font-display font-bold text-sm flex items-center gap-1.5 shadow-lg"
      >
        <MessageCircle className="w-4 h-4" /> Chat
      </motion.button>

      <AnimatePresence>
        {showChat && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-36 left-4 right-4 z-30 bg-background border border-border rounded-2xl shadow-xl p-4 max-h-60"
          >
            <div className="overflow-y-auto max-h-40 mb-3 space-y-2">
              {chat.map((m, i) => (
                <div key={i} className={`text-xs ${m.from === "me" ? "text-right text-primary" : m.from === "system" ? "text-center text-muted-foreground" : "text-left text-battle"}`}>
                  <span className="inline-block bg-muted px-2 py-1 rounded-lg">{m.text}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendChat()}
                placeholder="Send a message..."
                className="flex-1 px-3 py-2 rounded-lg bg-card border border-border text-sm focus:outline-none"
              />
              <button onClick={sendChat} className="p-2 bg-primary text-primary-foreground rounded-lg">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BattleTab;
