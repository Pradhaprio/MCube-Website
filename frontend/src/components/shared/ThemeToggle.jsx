import { useTheme } from '../../context/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-lg dark:border-slate-700 dark:bg-slate-900"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? 'L' : 'D'}
    </button>
  );
}
