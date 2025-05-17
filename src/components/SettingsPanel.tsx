import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  MoonIcon,
  SunIcon,
  BellIcon,
  CheckCircleIcon,
  PaletteIcon,
  CloudIcon,
} from "lucide-react";

interface SettingsPanelProps {
  isPro?: boolean;
  onToggleDarkMode?: (isDark: boolean) => void;
  onToggleNotifications?: (enabled: boolean) => void;
  onUpgradeToPro?: () => void;
}

const SettingsPanel = ({
  isPro = false,
  onToggleDarkMode = () => {},
  onToggleNotifications = () => {},
  onUpgradeToPro = () => {},
}: SettingsPanelProps) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleDarkModeToggle = (checked: boolean) => {
    setIsDarkMode(checked);
    onToggleDarkMode(checked);
  };

  const handleNotificationsToggle = (checked: boolean) => {
    setNotificationsEnabled(checked);
    onToggleNotifications(checked);
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-6 bg-background">
      <h2 className="text-2xl font-semibold text-center mb-6">Settings</h2>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {isDarkMode ? (
                  <MoonIcon className="h-5 w-5" />
                ) : (
                  <SunIcon className="h-5 w-5" />
                )}
                <Label htmlFor="dark-mode">Dark Mode</Label>
              </div>
              <Switch
                id="dark-mode"
                checked={isDarkMode}
                onCheckedChange={handleDarkModeToggle}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <BellIcon className="h-5 w-5" />
                <Label htmlFor="notifications">Reminders</Label>
              </div>
              <Switch
                id="notifications"
                checked={notificationsEnabled}
                onCheckedChange={handleNotificationsToggle}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {!isPro && (
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="text-center">
              Unlock Unlimited Habits
            </CardTitle>
            <CardDescription className="text-center">
              Upgrade to Pro for premium features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <CheckCircleIcon className="h-5 w-5 text-primary" />
                <span>Unlimited habits</span>
              </li>
              <li className="flex items-center space-x-2">
                <PaletteIcon className="h-5 w-5 text-primary" />
                <span>Custom themes</span>
              </li>
              <li className="flex items-center space-x-2">
                <CloudIcon className="h-5 w-5 text-primary" />
                <span>Cloud sync</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button className="w-full" onClick={onUpgradeToPro}>
              Subscribe $1.99/month
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={onUpgradeToPro}
            >
              Buy Lifetime for $9.99
            </Button>
          </CardFooter>
        </Card>
      )}

      <div className="text-center text-xs text-muted-foreground">
        <p>MicroHabits v1.0</p>
        <p className="mt-1">Big change, one small habit at a time.</p>
      </div>
    </div>
  );
};

export default SettingsPanel;
