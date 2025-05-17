import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Button } from "./ui/button";
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
  onDeleteHabit?: (id: string) => void;
  isPro?: boolean;
  onAddHabit?: () => void;
}

const HabitList = ({
  habits = [],
  onHabitToggle = () => {},
  onDeleteHabit = () => {},
  isPro = false,
  onAddHabit = () => {},
}: HabitListProps) => {
  const [localHabits, setLocalHabits] = useState<Habit[]>(habits);

  // Sync localHabits with habits prop when it changes
  useEffect(() => {
    setLocalHabits(habits);
  }, [habits]);

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
          <motion.div 
            className="text-center py-12 space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="space-y-2">
              <h3 className="text-2xl font-semibold">Welcome to MicroHabits!</h3>
              <p className="text-muted-foreground">Start your journey to better habits today.</p>
            </div>
            <div className="p-6 rounded-lg border border-dashed border-primary/50 bg-primary/5">
              <p className="text-sm text-muted-foreground mb-4">
                Begin by adding your first micro habit - something small and achievable that you want to do every day.
              </p>
              <Button onClick={onAddHabit} className="gap-2">
                <Plus className="h-5 w-5" />
                Add Your First Habit
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>Examples: Drink water, Read for 5 minutes, Take vitamins</p>
            </div>
          </motion.div>
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
              onDelete={onDeleteHabit}
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
