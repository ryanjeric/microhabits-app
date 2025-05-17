import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, X, Smile } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

interface Emoji {
  symbol: string;
  name: string;
}

interface AddHabitFormProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSave?: (habit: { name: string; emoji: string }) => void;
  isEditing?: boolean;
  initialHabit?: { name: string; emoji: string };
  habitCount?: number;
  isPro?: boolean;
}

const COMMON_EMOJIS: Emoji[] = [
  { symbol: "💧", name: "water" },
  { symbol: "🏃", name: "exercise" },
  { symbol: "📚", name: "read" },
  { symbol: "🧘", name: "meditate" },
  { symbol: "💊", name: "medication" },
  { symbol: "🥗", name: "healthy eating" },
  { symbol: "😴", name: "sleep" },
  { symbol: "✍️", name: "journal" },
];

const AddHabitForm: React.FC<AddHabitFormProps> = ({
  open = true,
  onOpenChange = () => {},
  onSave = () => {},
  isEditing = false,
  initialHabit = { name: "", emoji: "" },
  habitCount = 0,
  isPro = false,
}) => {
  const [habitName, setHabitName] = useState(initialHabit.name);
  const [selectedEmoji, setSelectedEmoji] = useState(initialHabit.emoji);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleSave = () => {
    if (habitName.trim()) {
      onSave({ name: habitName.trim(), emoji: selectedEmoji });
      onOpenChange(false);
      // Reset form
      setHabitName("");
      setSelectedEmoji("");
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    // Reset form
    setHabitName(initialHabit.name);
    setSelectedEmoji(initialHabit.emoji);
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const selectEmoji = (emoji: string) => {
    setSelectedEmoji(emoji);
    setShowEmojiPicker(false);
  };

  // Show upgrade prompt if user has reached habit limit and is not pro
  const showUpgradePrompt = !isPro && habitCount >= 3 && !isEditing;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-medium">
            {isEditing ? "Edit Habit" : "Add New Habit"}
          </DialogTitle>
        </DialogHeader>

        {showUpgradePrompt ? (
          <div className="py-6">
            <Card className="p-6 bg-primary/5 border-primary/20">
              <h3 className="text-lg font-medium text-center mb-4">
                Unlock Unlimited Habits
              </h3>
              <p className="text-sm text-center text-muted-foreground mb-6">
                Free users can track up to 3 habits. Upgrade to Pro for
                unlimited habits, custom themes, and cloud sync.
              </p>
              <div className="flex flex-col gap-3">
                <Button className="w-full">Subscribe $1.99/month</Button>
                <Button variant="outline" className="w-full">
                  Buy Lifetime for $9.99
                </Button>
              </div>
            </Card>
          </div>
        ) : (
          <div className="py-4 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="habit-name">Habit Name</Label>
              <Input
                id="habit-name"
                placeholder="e.g., Drink water"
                value={habitName}
                onChange={(e) => setHabitName(e.target.value)}
                className="w-full"
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label>Emoji (Optional)</Label>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-full"
                  onClick={toggleEmojiPicker}
                >
                  {selectedEmoji ? (
                    <span className="text-lg">{selectedEmoji}</span>
                  ) : (
                    <Smile className="h-5 w-5 text-muted-foreground" />
                  )}
                </Button>
                <span className="text-sm text-muted-foreground">
                  {selectedEmoji ? "Click to change" : "Add an emoji"}
                </span>
              </div>

              {showEmojiPicker && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-2 p-2 border rounded-md grid grid-cols-4 gap-2 bg-background"
                >
                  {COMMON_EMOJIS.map((emoji) => (
                    <Button
                      key={emoji.symbol}
                      type="button"
                      variant="ghost"
                      className="h-10 w-10 p-0 rounded-full"
                      onClick={() => selectEmoji(emoji.symbol)}
                    >
                      <span className="text-lg">{emoji.symbol}</span>
                    </Button>
                  ))}
                  <Button
                    type="button"
                    variant="ghost"
                    className="h-10 w-10 p-0 rounded-full"
                    onClick={() => selectEmoji("")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        )}

        <DialogFooter className="sm:justify-between">
          <Button type="button" variant="ghost" onClick={handleCancel}>
            Cancel
          </Button>
          {!showUpgradePrompt && (
            <Button
              type="button"
              onClick={handleSave}
              disabled={!habitName.trim()}
            >
              {isEditing ? "Save Changes" : "Add Habit"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddHabitForm;
