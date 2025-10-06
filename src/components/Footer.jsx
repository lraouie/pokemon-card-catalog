export default function Footer() {
    return (
      <footer className="bg-secondary text-neutral text-center p-3 mt-6">
        © {new Date().getFullYear()} Pokémon Catalog | Built with React Router
      </footer>
    );
  }
  