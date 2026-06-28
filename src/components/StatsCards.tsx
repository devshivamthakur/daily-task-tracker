import { motion } from "framer-motion";
import { FiList, FiCheckCircle, FiClock, FiAlertCircle } from "react-icons/fi";
import type { Task } from "@/types/task";
import { isOverdue } from "@/utils/tasks";

export function StatsCards({ tasks }: { tasks: Task[] }) {
  const active = tasks.filter((t) => !t.archived);
  const total = active.length;
  const completed = active.filter((t) => t.completed).length;
  const pending = active.filter((t) => !t.completed).length;
  const overdue = active.filter(isOverdue).length;

  const stats = [
    { label: "Total", value: total, icon: FiList, color: "from-violet-500 to-fuchsia-500" },
    { label: "Completed", value: completed, icon: FiCheckCircle, color: "from-emerald-500 to-teal-500" },
    { label: "Pending", value: pending, icon: FiClock, color: "from-sky-500 to-indigo-500" },
    { label: "Overdue", value: overdue, icon: FiAlertCircle, color: "from-rose-500 to-orange-500" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06 }}
          className="group relative overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-soft transition-all hover:shadow-elegant"
        >
          <div className={`absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br ${s.color} opacity-15 blur-xl transition-opacity group-hover:opacity-30`} />
          <div className="flex items-start justify-between">
            <div className="min-w-0">
              <p className="text-xs font-medium text-muted-foreground">{s.label}</p>
              <p className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">{s.value}</p>
            </div>
            <div className={`rounded-xl bg-gradient-to-br ${s.color} p-2 text-white shadow-soft`}>
              <s.icon className="h-4 w-4" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
