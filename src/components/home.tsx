import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Settings, Plus, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import HabitList from "./HabitList";
import AddHabitForm from "./AddHabitForm";
import SettingsPanel from "./SettingsPanel";
import LandingPage from "./LandingPage";
import AuthForm from "./AuthForm";
import AuthLayout from "./AuthLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";

interface HomeProps {
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
}

const Home: React.FC<HomeProps> = ({
  darkMode = false,
  onToggleDarkMode = () => {},
}) => {
  const { user, loading, signOut } = useAuth();
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [addHabitDialogOpen, setAddHabitDialogOpen] = useState(false);
  const [habits, setHabits] = useState([
    { id: "1", name: "Drink water", emoji: "💧", completed: false, streak: 5 },
    { id: "2", name: "Meditate", emoji: "🧘", completed: false, streak: 12 },
    { id: "3", name: "Read", emoji: "📚", completed: false, streak: 3 },
  ]);

  const [isPro, setIsPro] = useState(false);

  // Load habits from Supabase when user is authenticated
  useEffect(() => {
    if (user) {
      // In a real app, we would fetch habits from Supabase here
      // For now, we'll use the default habits
    }
  }, [user]);

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

  const handleGetStarted = () => {
    setShowAuthForm(true);
  };

  const handleAuthSuccess = () => {
    // User is now authenticated via Supabase
    // The AuthContext will update automatically
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-xl">Loading...</div>
      </div>
    );
  }

  // Show landing page if not authenticated and not showing auth form
  if (!user && !showAuthForm) {
    return <LandingPage onGetStarted={handleGetStarted} />;
  }

  // Show auth form
  if (!user && showAuthForm) {
    return (
      <AuthLayout>
        <AuthForm onAuthSuccess={handleAuthSuccess} />
      </AuthLayout>
    );
  }

  // Show main app if authenticated
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="p-4 flex justify-between items-center">
        <h1 className="text-xl font-medium">MicroHabits</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={signOut}
            title="Sign Out"
          >
            <LogOut className="h-5 w-5" />
            <span className="sr-only">Sign Out</span>
          </Button>
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
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-pulse text-lg">Loading habits...</div>
            </div>
          ) : (
            <HabitList
              habits={habits}
              onHabitToggle={handleHabitToggle}
              isPro={isPro}
            />
          )}

          {habits.length === 0 && !loading && (
            <div className="mt-8 p-6 border rounded-lg bg-primary/5 text-center">
              <h3 className="text-lg font-medium mb-2">
                Welcome to MicroHabits!
              </h3>
              <p className="text-muted-foreground mb-4">
                Get started by adding your first habit to track.
              </p>
              <Button onClick={() => setAddHabitDialogOpen(true)}>
                <Plus className="h-5 w-5 mr-2" />
                Add Your First Habit
              </Button>
            </div>
          )}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="p-4 flex justify-center">
        <Dialog open={addHabitDialogOpen} onOpenChange={setAddHabitDialogOpen}>
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
              open={addHabitDialogOpen}
              onOpenChange={setAddHabitDialogOpen}
              onSave={handleAddHabit}
              isPro={isPro}
              habitCount={habits.length}
            />
          </DialogContent>
        </Dialog>
      </footer>
    </div>
  );
};

export default Home;
