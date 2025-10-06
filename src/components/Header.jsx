import { useEffect, useState } from "react";

export default function Header() {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <header className="navbar bg-base-200 shadow-md px-4 md:px-8">
      <div className="flex-1 text-xl font-bold text-primary">
        Pokémon Catalog
      </div>

      <div className="flex-none">
        <button
          className="btn btn-sm btn-ghost"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
      </div>
    </header>
  );
}
