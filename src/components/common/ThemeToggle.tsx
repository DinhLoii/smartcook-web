import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  return (
    <button
      type="button"
      aria-label="Chế độ tối"
      aria-pressed={isDark}
      title={isDark ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
      onClick={toggleTheme}
      className="inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-surface text-slate-800 transition-colors hover:bg-brand-100 hover:text-accent-ink aria-pressed:bg-brand-100 aria-pressed:text-accent-ink"
    >
      {isDark ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
    </button>
  );
}
