"use client";

import { useTheme as useNextTheme } from "next-themes";

/**
 * テーマ管理フック
 * next-themesをラップして型安全なテーマ操作を提供
 */
export const useTheme = () => {
  const { theme, setTheme, resolvedTheme, systemTheme } = useNextTheme();

  return {
    theme: theme as "light" | "dark" | "system" | undefined,
    resolvedTheme,
    systemTheme,
    setTheme: (newTheme: "light" | "dark" | "system") => setTheme(newTheme),
    changeTheme: (newTheme: "light" | "dark" | "system") => setTheme(newTheme),
  };
};

