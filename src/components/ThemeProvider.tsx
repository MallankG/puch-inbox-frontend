import { useEffect } from "react";
import { useSettingsContext } from "@/hooks/SettingsContext";

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { settings } = useSettingsContext();

  useEffect(() => {
    if (!settings) return;
    const theme = settings.preferences.theme;
    const root = window.document.documentElement;
    // Remove Tailwind's 'dark' class from <html> and <body> to force reflow
    root.classList.remove("light", "dark");
    document.body.classList.remove("light", "dark");
    if (theme === "light" || theme === "dark") {
      root.classList.add(theme);
      document.body.classList.add(theme);
    }
    if (theme === "system") {
      // Detect system preference and apply
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      if (mq.matches) {
        root.classList.add('dark');
        document.body.classList.add('dark');
      } else {
        root.classList.add('light');
        document.body.classList.add('light');
      }
      // Listen for system changes
      const handler = (e: MediaQueryListEvent) => {
        root.classList.remove('light', 'dark');
        document.body.classList.remove('light', 'dark');
        if (e.matches) {
          root.classList.add('dark');
          document.body.classList.add('dark');
        } else {
          root.classList.add('light');
          document.body.classList.add('light');
        }
      };
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    }
  }, [settings?.preferences.theme, settings]);

  return <>{children}</>;
};

export default ThemeProvider;
