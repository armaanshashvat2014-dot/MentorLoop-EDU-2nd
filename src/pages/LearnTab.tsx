import { useState } from "react";
import { Search, BookOpen, Atom, Globe, Calculator, Palette, Code, Music, FlaskConical, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import QuizView from "@/components/QuizView";

const subjects = [
  { name: "Mathematics", icon: Calculator, color: "bg-primary/10 text-primary", emoji: "🔢" },
  { name: "Science", icon: FlaskConical, color: "bg-secondary/10 text-secondary", emoji: "🧪" },
  { name: "History", icon: Globe, color: "bg-streak/10 text-streak", emoji: "🏛️" },
  { name: "Physics", icon: Atom, color: "bg-battle/10 text-battle", emoji: "⚛️" },
  { name: "Art", icon: Palette, color: "bg-destructive/10 text-destructive", emoji: "🎨" },
  { name: "Coding", icon: Code, color: "bg-primary/10 text-primary", emoji: "💻" },
  { name: "Music", icon: Music, color: "bg-streak/10 text-streak", emoji: "🎵" },
  { name: "Literature", icon: BookOpen, color: "bg-secondary/10 text-secondary", emoji: "📖" },
];

const funMessages = [
  "Pick a subject and let's go! 🎯",
  "What do you wanna learn today? 🤔",
  "Your brain is hungry! Feed it! 🧠",
  "Ready to become a genius? 🚀",
];

const LearnTab = () => {
  const [search, setSearch] = useState("");
  const [activeSubject, setActiveSubject] = useState<string | null>(null);
  const [hoveredSubject, setHoveredSubject] = useState<string | null>(null);

  const filtered = search
    ? subjects.filter(s => s.name.toLowerCase().includes(search.toLowerCase()))
    : subjects;

  if (activeSubject) {
    return <QuizView subject={activeSubject} onBack={() => setActiveSubject(null)} />;
  }

  return (
    <div className="p-4 max-w-lg mx-auto pb-24">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold mb-1">
          Learn <motion.span
            className="inline-block"
            animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >✨</motion.span>
        </h1>
        <p className="text-muted-foreground mb-4">
          {funMessages[Math.floor(Date.now() / 10000) % funMessages.length]}
        </p>
      </motion.div>

      <motion.div
        className="relative mb-6"
        whileFocusWithin={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search any subject... 🔍"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-card border border-border font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
        />
      </motion.div>

      {search && filtered.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-8"
        >
          <motion.p
            className="text-4xl mb-3"
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            🤓
          </motion.p>
          <p className="text-muted-foreground mb-3">Ooh, a custom topic!</p>
          <motion.button
            whileTap={{ scale: 0.92 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => setActiveSubject(search)}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-display font-bold shadow-lg shadow-primary/25"
          >
            Quiz me on "{search}" 🚀
          </motion.button>
        </motion.div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {filtered.map((subject, i) => (
          <motion.button
            key={subject.name}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: i * 0.06, type: "spring", stiffness: 200 }}
            whileTap={{ scale: 0.93 }}
            whileHover={{ y: -4, scale: 1.03 }}
            onClick={() => setActiveSubject(subject.name)}
            onHoverStart={() => setHoveredSubject(subject.name)}
            onHoverEnd={() => setHoveredSubject(null)}
            className="relative flex flex-col items-center gap-2 p-5 rounded-2xl bg-card border border-border hover:shadow-lg hover:shadow-primary/5 transition-shadow overflow-hidden"
          >
            <motion.div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${subject.color}`}
              animate={hoveredSubject === subject.name ? { rotate: [0, -10, 10, 0] } : {}}
              transition={{ duration: 0.4 }}
            >
              <subject.icon className="w-6 h-6" />
            </motion.div>
            <span className="font-display font-semibold text-sm">{subject.name}</span>
            <AnimatePresence>
              {hoveredSubject === subject.name && (
                <motion.span
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  className="absolute top-1 right-2 text-lg"
                >
                  {subject.emoji}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default LearnTab;
