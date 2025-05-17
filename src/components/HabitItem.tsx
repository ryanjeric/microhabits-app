import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface HabitItemProps {
  id?: string;
  name?: string;
  emoji?: string;
  streak?: number;
  completed?: boolean;
  onToggle?: (id: string) => void;
}

const HabitItem = ({
  id = "habit-1",
  name = "Drink Water",
  emoji = "💧",
  streak = 0,
  completed = false,
  onToggle = () => {},
}: HabitItemProps) => {
  const [isCompleted, setIsCompleted] = useState(completed);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = () => {
    setIsAnimating(true);
    setIsCompleted(!isCompleted);
    onToggle(id);

    // Reset animation state after animation completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  return (
    <div className="flex flex-col items-center justify-center py-4 px-2 bg-background">
      <div className="flex items-center mb-2">
        {emoji && <span className="mr-2 text-xl">{emoji}</span>}
        <h3 className="text-lg font-medium text-foreground">{name}</h3>
      </div>

      <motion.div
        className={`relative flex items-center justify-center w-16 h-16 rounded-full border-2 cursor-pointer
          ${isCompleted ? "border-primary bg-primary/10" : "border-muted-foreground bg-background"}`}
        whileTap={{ scale: 0.95 }}
        onClick={handleToggle}
        animate={isAnimating ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 0.5 }}
      >
        {isCompleted && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <Check className="w-8 h-8 text-primary" />
          </motion.div>
        )}
      </motion.div>

      <div className="mt-2 text-sm text-muted-foreground">
        <span>
          {streak} day{streak !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
};

export default HabitItem;
