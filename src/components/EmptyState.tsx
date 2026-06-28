import { motion } from "framer-motion";
import { FiInbox, FiPlus } from "react-icons/fi";

export function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid place-items-center rounded-3xl border border-dashed border-border bg-card/50 px-6 py-16 text-center"
    >
      <div className="relative">
        <div className="absolute inset-0 -z-10 rounded-full bg-gradient-primary opacity-20 blur-2xl" />
        <div className="grid h-20 w-20 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-glow">
          <FiInbox className="h-9 w-9" />
        </div>
      </div>
      <h3 className="mt-5 text-xl font-bold tracking-tight">No tasks yet.</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Capture what's on your mind. Start small — a single task creates momentum.
      </p>
      <button
        onClick={onAdd}
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-elegant hover:shadow-glow"
      >
        <FiPlus className="h-4 w-4" /> Create your first task
      </button>
    </motion.div>
  );
}
