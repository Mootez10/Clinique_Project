"use client";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export default function ThemeSwitcherClient() {
  const { theme, setTheme } = useTheme();
  return (
    <button
      aria-label="Basculer le thème"
      className="rounded-full p-2 border border-blue-200 bg-white/80 hover:bg-blue-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 transition"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      type="button"
    >
      {theme === "dark"
        ? <Sun className="w-6 h-6 text-yellow-400" />
        : <Moon className="w-6 h-6 text-blue-900" />}
    </button>
  );
}
