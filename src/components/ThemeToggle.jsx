import React, { useEffect, useState } from "react";

export default function ThemeToggle() {
  // read initial theme from localStorage or system preference
  const getInitial = () => {
    try {
      const saved = localStorage.getItem("theme");
      if (saved) return saved === "pokemon_dark";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    } catch {
      return false;
    }
  };

  const [isDark, setIsDark] = useState(getInitial);

  // apply theme to <html> when toggled
  useEffect(() => {
    const theme = isDark ? "pokemon_dark" : "pokemon";
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("theme", theme);
    } catch {}
  }, [isDark]);

  return (
    <label className="swap swap-rotate cursor-pointer">
      <input
        type="checkbox"
        checked={isDark}
        onChange={() => setIsDark((prev) => !prev)}
      />

      {/* Moon (dark) */}
      <svg
        className="swap-on fill-current w-6 h-6"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path d="M21.64 13.64A9 9 0 1 1 10.36 2.36 7 7 0 0 0 21.64 13.64z" />
      </svg>

      {/* Sun (light) */}
      <svg
        className="swap-off fill-current w-6 h-6"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path d="M6.76 4.84l-1.8-1.79L3.17 4.84l1.79 1.79 1.8-1.79zM1 13h3v2H1zm10-9h2V1h-2zm9.07 2.93l-1.79-1.79-1.8 1.8 1.79 1.79 1.8-1.8zM20 13h3v-2h-3zm-9 9h2v-3h-2zm-7.07-2.93l1.79 1.79 1.8-1.8-1.79-1.79-1.8 1.8z" />
      </svg>
    </label>
  );
}
