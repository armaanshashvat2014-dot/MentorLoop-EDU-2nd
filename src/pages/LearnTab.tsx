import { useState } from "react";
import { Search, BookOpen, Atom, Globe, Calculator, Palette, Code, Music, FlaskConical } from "lucide-react";
import { motion } from "framer-motion";
import QuizView from "@/components/QuizView";

const subjects = [
  { name: "Mathematics", icon: Calculator, color: "bg-primary/10 text-primary" },
  { name: "Science", icon: FlaskConical, color: "bg-secondary/10 text-secondary" },
  { name: "History", icon: Globe, color: "bg-streak/10 text-streak" },
  { name: "Physics", icon: Atom, color: "bg-battle/10 text-battle" },
  { name: "Art", icon: Palette, color: "bg-destructive/10 text-destructive" },
  { name: "Coding", icon: Code, color: "bg-primary/10 text-primary" },
  { name: "Music", icon: Music, color: "bg-streak/10 text-streak" },
  { name: "Literature", icon: BookOpen, color: "bg-secondary/10 text-secondary" },
];

const LearnTab = () => {
  const [search, setSearch] = useState("");
  const [activeSubject, setActiveSubject] = useState<string | null>(null);

  const filtered = search
    ? subjects.filter(s => s.name.toLowerCase().includes(search.toLowerCase()))
    : subjects;

  if (activeSubject) {
    return <QuizView subject={activeSubject} onBack={() => setActiveSubject(null)} />;
  }

  return (
    <div className="p-4 max-w-lg mx-auto pb-24">
      <h1 className="font-display text-3xl font-bold mb-1">Learn</h1>
      <p className="text-muted-foreground mb-4">Search any subject to start learning</p>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search subjects..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-card border border-border font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      {search && filtered.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8"
        >
          <p className="text-muted-foreground mb-2">No preset subject found</p>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveSubject(search)}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-display font-bold"
          >
            Quiz me on "{search}" 🚀
          </motion.button>
        </motion.div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {filtered.map((subject, i) => (
          <motion.button
            key={subject.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => setActiveSubject(subject.name)}
            className="flex flex-col items-center gap-2 p-5 rounded-2xl bg-card border border-border hover:shadow-md transition-shadow"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${subject.color}`}>
              <subject.icon className="w-6 h-6" />
            </div>
            <span className="font-display font-semibold text-sm">{subject.name}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default LearnTab;
