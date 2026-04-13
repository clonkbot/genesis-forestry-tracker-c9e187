import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TreeCount {
  name: string;
  count: number;
  todayCount: number;
}

const initialData: TreeCount[] = [
  { name: 'Robbie', count: 0, todayCount: 0 },
  { name: 'Ross', count: 0, todayCount: 0 },
  { name: 'Harry', count: 0, todayCount: 0 },
  { name: 'Scott', count: 0, todayCount: 0 },
  { name: 'Drew', count: 0, todayCount: 0 },
  { name: 'Alex', count: 0, todayCount: 0 },
  { name: 'Jo', count: 0, todayCount: 0 },
];

const TreeIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 32" fill="currentColor" className={className}>
    <path d="M12 0L4 10h3L3 18h4L2 28h8v4h4v-4h8l-5-10h4l-4-8h3L12 0z" />
  </svg>
);

const AxeIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2L8 8l-6 2 3 3-1 7 8-4 8 4-1-7 3-3-6-2-4-6zm0 4l2 3h3l-1 1 1 3-5-2-5 2 1-3-1-1h3l2-3z" />
  </svg>
);

function App() {
  const [data, setData] = useState<TreeCount[]>(() => {
    const saved = localStorage.getItem('genesis-forestry-data');
    return saved ? JSON.parse(saved) : initialData;
  });
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    localStorage.setItem('genesis-forestry-data', JSON.stringify(data));
  }, [data]);

  const totalTrees = data.reduce((acc, p) => acc + p.count, 0);
  const sortedData = [...data].sort((a, b) => b.count - a.count);

  const handleAddTrees = () => {
    if (!selectedPerson || !inputValue) return;
    const trees = parseInt(inputValue);
    if (isNaN(trees) || trees <= 0) return;

    setData(prev => prev.map(p =>
      p.name === selectedPerson
        ? { ...p, count: p.count + trees, todayCount: p.todayCount + trees }
        : p
    ));

    if (trees >= 50) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    }

    setInputValue('');
    setSelectedPerson(null);
  };

  const handleReset = () => {
    if (confirm('Reset all tree counts? This cannot be undone.')) {
      setData(initialData);
    }
  };

  const getRankBadge = (index: number) => {
    if (index === 0) return { bg: 'bg-amber-600', text: 'CHIEF', border: 'border-amber-400' };
    if (index === 1) return { bg: 'bg-stone-500', text: 'SENIOR', border: 'border-stone-400' };
    if (index === 2) return { bg: 'bg-orange-800', text: 'RANGER', border: 'border-orange-600' };
    return { bg: 'bg-stone-700', text: 'CREW', border: 'border-stone-600' };
  };

  return (
    <div className="min-h-screen bg-stone-900 relative overflow-hidden">
      {/* Wood grain texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Confetti effect */}
      <AnimatePresence>
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-2xl"
                initial={{
                  top: '50%',
                  left: `${Math.random() * 100}%`,
                  opacity: 1,
                  scale: 0
                }}
                animate={{
                  top: '-10%',
                  opacity: 0,
                  scale: 1,
                  rotate: Math.random() * 360
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2, delay: i * 0.05 }}
              >
                <TreeIcon className="w-6 h-6 text-emerald-500" />
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      <div className="relative z-10 px-4 py-6 md:px-8 md:py-10 max-w-6xl mx-auto min-h-screen flex flex-col">
        {/* Header */}
        <motion.header
          className="text-center mb-8 md:mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block relative">
            <div className="absolute -inset-2 md:-inset-4 bg-emerald-900/30 -skew-x-2 transform" />
            <h1 className="relative font-black text-3xl sm:text-4xl md:text-6xl lg:text-7xl tracking-tighter text-cream uppercase">
              <span className="text-emerald-500">Genesis</span> Forestry
            </h1>
          </div>
          <p className="mt-4 text-stone-500 font-mono text-xs md:text-sm tracking-[0.3em] uppercase">
            Tree Count Tracker — Est. 2024
          </p>

          {/* Total counter */}
          <motion.div
            className="mt-6 md:mt-8 inline-flex items-center gap-3 md:gap-4 bg-stone-800/80 border-2 border-stone-700 px-4 md:px-8 py-3 md:py-4"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <TreeIcon className="w-6 h-6 md:w-8 md:h-8 text-emerald-500" />
            <div className="text-left">
              <p className="text-stone-500 text-[10px] md:text-xs font-mono uppercase tracking-wider">Total Trees Counted</p>
              <motion.p
                className="text-2xl md:text-4xl font-black text-cream tabular-nums"
                key={totalTrees}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
              >
                {totalTrees.toLocaleString()}
              </motion.p>
            </div>
          </motion.div>
        </motion.header>

        {/* Input Section */}
        <motion.section
          className="mb-8 md:mb-12 bg-stone-800/50 border-2 border-stone-700 p-4 md:p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="font-mono text-xs md:text-sm text-stone-500 uppercase tracking-wider mb-4">
            Log Today's Count
          </h2>

          {/* Person Selection */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2 mb-4 md:mb-6">
            {data.map((person, i) => (
              <motion.button
                key={person.name}
                onClick={() => setSelectedPerson(person.name)}
                className={`p-2 md:p-3 font-bold text-xs md:text-sm uppercase tracking-wide transition-all border-2 ${
                  selectedPerson === person.name
                    ? 'bg-emerald-700 border-emerald-500 text-cream'
                    : 'bg-stone-700/50 border-stone-600 text-stone-300 hover:bg-stone-700 hover:border-stone-500'
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {person.name}
              </motion.button>
            ))}
          </div>

          {/* Number Input */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <input
              type="number"
              inputMode="numeric"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Trees counted..."
              className="flex-1 bg-stone-900 border-2 border-stone-600 px-4 py-3 md:py-4 text-cream text-lg md:text-xl font-mono placeholder:text-stone-600 focus:outline-none focus:border-emerald-600 transition-colors"
            />
            <motion.button
              onClick={handleAddTrees}
              disabled={!selectedPerson || !inputValue}
              className="bg-emerald-700 hover:bg-emerald-600 disabled:bg-stone-700 disabled:text-stone-500 border-2 border-emerald-600 disabled:border-stone-600 px-6 md:px-8 py-3 md:py-4 font-black uppercase tracking-wider text-cream transition-all min-h-[52px]"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Add Trees
            </motion.button>
          </div>

          {selectedPerson && (
            <motion.p
              className="mt-3 text-emerald-500 font-mono text-xs md:text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Adding trees for: <span className="font-bold uppercase">{selectedPerson}</span>
            </motion.p>
          )}
        </motion.section>

        {/* Leaderboard */}
        <motion.section
          className="flex-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="font-mono text-xs md:text-sm text-stone-500 uppercase tracking-wider flex items-center gap-2">
              <AxeIcon className="w-4 h-4" />
              Crew Rankings
            </h2>
            <button
              onClick={handleReset}
              className="text-stone-600 hover:text-orange-500 font-mono text-xs uppercase tracking-wider transition-colors"
            >
              Reset All
            </button>
          </div>

          <div className="space-y-2 md:space-y-3">
            <AnimatePresence mode="popLayout">
              {sortedData.map((person, index) => {
                const rank = getRankBadge(index);
                const percentage = totalTrees > 0 ? (person.count / totalTrees) * 100 : 0;

                return (
                  <motion.div
                    key={person.name}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="relative bg-stone-800/70 border-2 border-stone-700 overflow-hidden group hover:border-stone-600 transition-colors"
                  >
                    {/* Progress bar background */}
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-emerald-900/30"
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                    />

                    <div className="relative flex items-center gap-3 md:gap-4 p-3 md:p-4">
                      {/* Rank number */}
                      <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-stone-900 border-2 border-stone-600 font-black text-lg md:text-xl text-stone-400">
                        {index + 1}
                      </div>

                      {/* Name and badge */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                          <span className="font-black text-base md:text-lg text-cream uppercase tracking-wide">
                            {person.name}
                          </span>
                          <span className={`${rank.bg} border ${rank.border} px-2 py-0.5 text-[10px] md:text-xs font-mono uppercase text-cream/90`}>
                            {rank.text}
                          </span>
                        </div>
                        {person.todayCount > 0 && (
                          <p className="text-emerald-500 text-[10px] md:text-xs font-mono mt-1">
                            +{person.todayCount} today
                          </p>
                        )}
                      </div>

                      {/* Tree count */}
                      <div className="text-right">
                        <motion.p
                          className="font-black text-xl md:text-2xl text-cream tabular-nums"
                          key={person.count}
                          initial={{ scale: 1.3 }}
                          animate={{ scale: 1 }}
                        >
                          {person.count.toLocaleString()}
                        </motion.p>
                        <p className="text-stone-500 text-[10px] md:text-xs font-mono uppercase">trees</p>
                      </div>

                      {/* Tree icons for top 3 */}
                      {index < 3 && person.count > 0 && (
                        <div className="hidden md:flex gap-1 opacity-50">
                          {[...Array(Math.min(3 - index, 3))].map((_, i) => (
                            <TreeIcon key={i} className="w-4 h-4 text-emerald-600" />
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </motion.section>

        {/* Footer */}
        <motion.footer
          className="mt-8 md:mt-12 pt-6 border-t border-stone-800 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-stone-600 text-xs font-mono">
            Requested by <span className="text-stone-500">@Salmong</span> · Built by <span className="text-stone-500">@clonkbot</span>
          </p>
        </motion.footer>
      </div>
    </div>
  );
}

export default App;
