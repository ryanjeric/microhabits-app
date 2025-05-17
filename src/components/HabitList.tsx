import React, { useState } from "react";
import { motion } from "framer-motion";
import HabitItem from "./HabitItem";

interface Habit {
  id: string;
  name: string;
  emoji?: string;
  streak: number;
  completed: boolean;
}

interface HabitListProps {
  habits?: Habit[];
  onHabitToggle?: (id: string) => void;
  isPro?: boolean;
}

const HabitList = ({
  habits = [],
  onHabitToggle = () => {},
  isPro = false,
}: HabitListProps) => {
  const [localHabits, setLocalHabits] = useState<Habit[]>(habits);

  const handleHabitToggle = (id: string) => {
    setLocalHabits((prevHabits) =>
      prevHabits.map((habit) =>
        habit.id === id ? { ...habit, completed: !habit.completed } : habit,
      ),
    );
    onHabitToggle(id);
  };

  const maxHabitsReached = !isPro && localHabits.length >= 3;

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto py-8 bg-background">
      <motion.div
        className="w-full space-y-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
      >
        {localHabits.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No habits added yet.</p>
            <p className="mt-2">Add your first micro habit to get started!</p>
          </div>
        ) : (
          localHabits.map((habit) => (
            <HabitItem
              key={habit.id}
              id={habit.id}
              name={habit.name}
              emoji={habit.emoji}
              streak={habit.streak}
              completed={habit.completed}
              onToggle={() => handleHabitToggle(habit.id)}
            />
          ))
        )}

        {maxHabitsReached && (
          <div className="mt-6 p-4 rounded-lg border border-muted bg-muted/30 text-center">
            <p className="text-sm text-muted-foreground">
              Free plan limited to 3 habits.
            </p>
            <p className="text-sm font-medium mt-1">
              Upgrade to Pro for unlimited habits!
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default HabitList;
