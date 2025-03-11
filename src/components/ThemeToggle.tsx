import React, { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { Switch } from "./ui/switch";
import { motion, AnimatePresence } from "framer-motion";

interface ThemeToggleProps {
  theme?: "light" | "dark";
  onThemeChange?: (theme: "light" | "dark") => void;
}

const ThemeToggle = ({
  theme: initialTheme = "light",
  onThemeChange = () => {},
}: ThemeToggleProps) => {
  const [theme, setTheme] = useState<"light" | "dark">(initialTheme);
  const [isMounted, setIsMounted] = useState(false);

  // Handle initial client-side hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    onThemeChange(newTheme);
  };

  if (!isMounted) {
    return <div className="w-[80px] h-[40px] bg-background" />; // Prevents hydration mismatch
  }

  return (
    <div className="flex items-center justify-between w-[80px] h-[40px] px-2 py-1 rounded-full bg-background border border-border shadow-sm">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={theme}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="flex items-center"
        >
          {theme === "light" ? (
            <Sun className="h-4 w-4 text-amber-500" />
          ) : (
            <Moon className="h-4 w-4 text-indigo-400" />
          )}
        </motion.div>
      </AnimatePresence>

      <Switch
        checked={theme === "dark"}
        onCheckedChange={toggleTheme}
        aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      />
    </div>
  );
};

export default ThemeToggle;
