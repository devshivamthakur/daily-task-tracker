import { useMemo } from "react";
import { motion } from "framer-motion";
import { useTasks } from "@/context/TaskContext";
import { ProgressRing } from "./ProgressRing";
import {
  computeStreak,
  isOnDate,
  isTaskCompletedForDate,
  isToday,
  motivationalMessage,
  QUOTES,
  todayISO,
} from "@/utils/tasks";
import { FiZap, FiAward, FiCalendar } from "react-icons/fi";

export function Dashboard() {
  const { tasks, selectedDate } = useTasks();
  const active = tasks.filter((t) => !t.archived);
  const isViewingToday = selectedDate === todayISO();

  // Stats for the selected date
  const dayTasks = active.filter((t) => isOnDate(t, selectedDate));
  const completedDayTasks = dayTasks.filter((t) => isTaskCompletedForDate(t, selectedDate)).length;
  const dayPct = dayTasks.length ? (completedDayTasks / dayTasks.length) * 100 : 0;

  // Today-specific stats (for badges)
  const todays = active.filter((t) => isToday(t));
  const completedToday = active.filter((t) => isTaskCompletedForDate(t, todayISO())).length;
  const { current, longest } = useMemo(() => computeStreak(active), [active]);
  const quote = useMemo(() => QUOTES[new Date().getDate() % QUOTES.length], []);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const dayLabel = isViewingToday
    ? "today"
    : new Date(selectedDate + "T00:00:00").toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      });

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl border border-border glass p-5 sm:p-7 shadow-elegant"
    >
      <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-gradient-primary opacity-20 blur-3xl" />
      <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">{greeting} 👋</p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
            {isViewingToday ? motivationalMessage(dayPct) : `Tasks for ${dayLabel}`}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground italic">"{quote}"</p>

          <div className="mt-5 flex flex-wrap gap-2">
            <Badge icon={<FiZap />} label={`${current} day streak`} />
            <Badge icon={<FiAward />} label={`Longest ${longest}`} />
            <Badge icon={<FiCalendar />} label={`${completedToday} done today`} />
            {!isViewingToday && (
              <Badge
                icon={<FiCalendar />}
                label={`${completedDayTasks}/${dayTasks.length} on ${dayLabel}`}
              />
            )}
          </div>
        </div>
        <div className="flex justify-center md:justify-end">
          <ProgressRing percent={dayPct} label={dayLabel} />
        </div>
      </div>
    </motion.section>
  );
}

function Badge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/80 px-3 py-1 text-xs font-medium shadow-soft">
      <span className="text-primary">{icon}</span>
      {label}
    </span>
  );
}
