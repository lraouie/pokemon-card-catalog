import React, { useState, useEffect } from "react";

export default function Navbar() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.querySelector("html").setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div className="navbar bg-base-200 px-4 py-2 flex justify-between items-center shadow-md">
      {/* Logo */}
      <img
        src="/images/pokemon-logo.png" // save this inside public/images/
        alt="Pokémon Logo"
        className="h-12 object-contain"
      />

      {/* Theme Button */}
      <div className="flex-none">
        <button
          className="btn btn-base-100"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
      </div>
    </div>
  );
}
