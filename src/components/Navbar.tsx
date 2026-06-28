import { useTasks } from "@/context/TaskContext";
import { FiMoon, FiSun, FiCheckCircle } from "react-icons/fi";
import { motion } from "framer-motion";

export function Navbar() {
  const { theme, toggleTheme } = useTasks();
  const date = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="sticky top-0 z-30 glass border-b border-border/60">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3 min-w-0">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-primary shadow-glow"
          >
            <FiCheckCircle className="h-5 w-5 text-primary-foreground" />
          </motion.div>
          <div className="min-w-0">
            <h1 className="truncate text-base font-semibold tracking-tight sm:text-lg">
              Daily<span className="gradient-text"> Tracker</span>
            </h1>
            <p className="hidden text-xs text-muted-foreground sm:block">{date}</p>
          </div>
        </div>
        <button
          aria-label="Toggle theme"
          onClick={toggleTheme}
          className="rounded-full border border-border bg-card p-2.5 shadow-soft transition-all hover:shadow-elegant hover:scale-105"
        >
          {theme === "dark" ? <FiSun className="h-4 w-4" /> : <FiMoon className="h-4 w-4" />}
        </button>
      </div>
    </header>
  );
}
