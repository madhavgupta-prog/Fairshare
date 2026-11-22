import { useTheme } from '../../context/ThemeProvider';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
      className="btn-ghost flex h-9 w-9 items-center justify-center text-sm"
    >
      {theme === 'dark' ? '☾' : '☀'}
    </button>
  );
}
