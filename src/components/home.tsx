import React, { useState } from "react";
import { motion } from "framer-motion";
import { Settings, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import HabitList from "./HabitList";
import AddHabitForm from "./AddHabitForm";
import SettingsPanel from "./SettingsPanel";

interface HomeProps {
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
}

const Home: React.FC<HomeProps> = ({
  darkMode = false,
  onToggleDarkMode = () => {},
}) => {
  const [habits, setHabits] = useState([
    { id: "1", name: "Drink water", emoji: "💧", completed: false, streak: 5 },
    { id: "2", name: "Meditate", emoji: "🧘", completed: false, streak: 12 },
    { id: "3", name: "Read", emoji: "📚", completed: false, streak: 3 },
  ]);

  const [isPro, setIsPro] = useState(false);

  const handleHabitToggle = (id: string) => {
    setHabits(
      habits.map((habit) =>
        habit.id === id ? { ...habit, completed: !habit.completed } : habit,
      ),
    );
  };

  const handleAddHabit = (habit: { name: string; emoji?: string }) => {
    if (habits.length < 3 || isPro) {
      const newHabit = {
        id: Date.now().toString(),
        name: habit.name,
        emoji: habit.emoji || "",
        completed: false,
        streak: 0,
      };
      setHabits([...habits, newHabit]);
    }
  };

  const handleUpgradeToPro = () => {
    setIsPro(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="p-4 flex justify-between items-center">
        <h1 className="text-xl font-medium">MicroHabits</h1>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SettingsPanel
              darkMode={darkMode}
              onToggleDarkMode={onToggleDarkMode}
              isPro={isPro}
              onUpgradeToPro={handleUpgradeToPro}
            />
          </SheetContent>
        </Sheet>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <HabitList habits={habits} onToggleHabit={handleHabitToggle} />
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="p-4 flex justify-center">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="rounded-full"
              disabled={habits.length >= 3 && !isPro}
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Habit
            </Button>
          </DialogTrigger>
          <DialogContent>
            <AddHabitForm
              onAddHabit={handleAddHabit}
              isPro={isPro}
              habitCount={habits.length}
              onUpgradeToPro={handleUpgradeToPro}
            />
          </DialogContent>
        </Dialog>
      </footer>
    </div>
  );
};

export default Home;
