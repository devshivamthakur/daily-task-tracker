export type Priority = "high" | "medium" | "low";
export type Category = "personal" | "work" | "study" | "fitness" | "shopping" | "other";

export interface Task {
  id: string;
  title: string;
  description: string;
  category: Category;
  priority: Priority;
  dueDate: string | null; // ISO date (yyyy-mm-dd)
  completed: boolean;
  completedAt: string | null;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
  order: number;
}

export type FilterKey =
  | "all"
  | "completed"
  | "pending"
  | "overdue"
  | "high"
  | "today"
  | "week"
  | `cat:${Category}`;

export type SortKey = "newest" | "oldest" | "priority" | "due" | "alpha" | "completed";

export const CATEGORIES: Category[] = ["personal", "work", "study", "fitness", "shopping", "other"];
export const PRIORITIES: Priority[] = ["high", "medium", "low"];
