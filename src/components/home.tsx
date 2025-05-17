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

interface HomeProps {}

interface Habit {
  id: string;
  name: string;
  emoji?: string;
  streak: number;
  completed: boolean;
  last_completed_at?: string;
}

const Home: React.FC<HomeProps> = () => {
  const { user, loading, signOut } = useAuth();
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [addHabitDialogOpen, setAddHabitDialogOpen] = useState(false);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isPro, setIsPro] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load habits from Supabase when user is authenticated
  useEffect(() => {
    if (user) {
      fetchHabits();
      fetchUserProfile();
    }
  }, [user]);

  // Check for habit resets at midnight
  useEffect(() => {
    const checkForReset = async () => {
      const now = new Date();
      const localMidnight = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        0, 0, 0
      );

      // Reset completed status for habits not completed today
      const { data: habitsToReset, error } = await supabase
        .from('habits')
        .update({ completed: false })
        .eq('user_id', user?.id)
        .lt('last_completed_at', localMidnight.toISOString())
        .select();

      if (!error && habitsToReset) {
        setHabits(prevHabits => 
          prevHabits.map(habit => {
            const resetHabit = habitsToReset.find(h => h.id === habit.id);
            return resetHabit ? { ...habit, completed: false } : habit;
          })
        );
      }
    };

    // Check for reset when component mounts
    if (user) {
      checkForReset();
    }

    // Set up interval to check for reset every minute
    const interval = setInterval(checkForReset, 60000);
    return () => clearInterval(interval);
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_pro')
        .eq('id', user?.id)
        .single();
      
      if (profile) {
        setIsPro(profile.is_pro);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchHabits = async () => {
    try {
      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: true });

      if (error) {
        throw error;
      }

      if (data) {
        setHabits(data);
      }
    } catch (error) {
      console.error('Error fetching habits:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleHabitToggle = async (id: string) => {
    try {
      const habit = habits.find(h => h.id === id);
      if (!habit) return;

      const now = new Date();
      const localMidnight = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        0, 0, 0
      );

      // If habit is being completed
      if (!habit.completed) {
        const lastCompletedDate = habit.last_completed_at 
          ? new Date(habit.last_completed_at) 
          : null;

        // Calculate if the streak should increase
        let newStreak = habit.streak;
        if (!lastCompletedDate) {
          // First time completing the habit
          newStreak = 1;
        } else {
          const yesterdayMidnight = new Date(localMidnight);
          yesterdayMidnight.setDate(yesterdayMidnight.getDate() - 1);

          if (lastCompletedDate >= yesterdayMidnight) {
            // Completed yesterday or today, increment streak
            newStreak = habit.streak + 1;
          } else {
            // Streak broken, start new streak
            newStreak = 1;
          }
        }

        const { error } = await supabase
          .from('habits')
          .update({ 
            completed: true,
            streak: newStreak,
            last_completed_at: now.toISOString()
          })
          .eq('id', id)
          .eq('user_id', user?.id);

        if (error) {
          throw error;
        }

        setHabits(habits.map((h) =>
          h.id === id ? { 
            ...h, 
            completed: true,
            streak: newStreak,
            last_completed_at: now.toISOString()
          } : h
        ));
      } else {
        // If unchecking the habit
        const { error } = await supabase
          .from('habits')
          .update({ 
            completed: false,
            // Don't reset the streak if unchecking on the same day
            last_completed_at: null
          })
          .eq('id', id)
          .eq('user_id', user?.id);

        if (error) {
          throw error;
        }

        setHabits(habits.map((h) =>
          h.id === id ? { 
            ...h, 
            completed: false,
            last_completed_at: null
          } : h
        ));
      }
    } catch (error) {
      console.error('Error toggling habit:', error);
    }
  };

  const handleDeleteHabit = async (id: string) => {
    try {
      const { error } = await supabase
        .from('habits')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) {
        throw error;
      }

      // Remove the habit from local state
      setHabits(habits.filter(habit => habit.id !== id));
    } catch (error) {
      console.error('Error deleting habit:', error);
    }
  };

  const handleAddHabit = async (habit: { name: string; emoji?: string }) => {
    if (habits.length < 3 || isPro) {
      try {
        const newHabit = {
          user_id: user?.id as string,
          name: habit.name,
          emoji: habit.emoji || null,
          completed: false,
          streak: 0,
          last_completed_at: null
        };

        const { data, error } = await supabase
          .from('habits')
          .insert([newHabit])
          .select()
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          setHabits([...habits, data]);
          setAddHabitDialogOpen(false);
        }
      } catch (error) {
        console.error('Error adding habit:', error);
      }
    }
  };

  const handleUpgradeToPro = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_pro: true })
        .eq('id', user?.id);

      if (error) {
        throw error;
      }

      setIsPro(true);
    } catch (error) {
      console.error('Error upgrading to pro:', error);
    }
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
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-pulse text-lg">Loading habits...</div>
            </div>
          ) : (
            <HabitList
              habits={habits}
              onHabitToggle={handleHabitToggle}
              onDeleteHabit={handleDeleteHabit}
              isPro={isPro}
              onAddHabit={() => setAddHabitDialogOpen(true)}
            />
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
