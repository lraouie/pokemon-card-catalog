import React, { useState, useRef, useEffect } from "react";
import { useLoaderData } from "react-router-dom";
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";
import CardGrid from "./components/CardGrid";
import AddEditModal from "./components/AddEditModal";
import ExpandedCardModal from "./components/ExpandedCardModal";
import { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";

export default function App() {
  const { cards } = useLoaderData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [viewingCard, setViewingCard] = useState(null);

  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  
  const [hovered, setHovered] = useState(false);
  const [slideX, setSlideX] = useState(0);
  const addButtonRef = useRef(null);

  useEffect(() => {
    if (addButtonRef.current) {
      // slide half of the rectangle width
      setSlideX(addButtonRef.current.offsetWidth / 2);
    }
  }, []);

  // Filter + sort
  const filteredCards = cards
  .filter(c => {
    const term = search.toLowerCase();
    if (!term) return true; // no search term, include all

    // Filter based on the selected sortKey
    if (sortKey === "name") {
      return c.card_name.toLowerCase().includes(term);
    } 
    if (sortKey === "price") {
      return c.price.toString().includes(term);
    } 
    if (sortKey === "stocks") {
      return c.stocks.toString().includes(term);
    }

    return true; // fallback
  })
  .filter(c => (showInStockOnly ? c.stocks > 0 : true))

    .sort((a, b) => {
      const valA = sortKey === "price" ? parseFloat(a.price) :
                   sortKey === "stocks" ? parseInt(a.stocks) :
                   a.card_name.toLowerCase();
      const valB = sortKey === "price" ? parseFloat(b.price) :
                   sortKey === "stocks" ? parseInt(b.stocks) :
                   b.card_name.toLowerCase();
      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  const totalPages = Math.ceil(filteredCards.length / itemsPerPage);
  const paginatedCards = filteredCards.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    
    <div className="min-h-screen flex flex-col bg-base-100">
      <Navbar />
      <Toaster position="top-center" />
      <main className="flex-1 container mx-auto p-4">

        {/* Title + Add Card */}
        <div className="flex justify-between items-center mb-4">
            <img 
                src="/images/pokemon-catalog-logo.png" 
                alt="Pokémon Cards Catalog Logo"
                className="h-16 md:h-24 w-auto"
            />
 
 
            <div>
              {/* Add Cards rectangle */}
              <motion.button
                ref={addButtonRef}
                animate={{
                  x: -slideX, // slide left by half width
                  opacity: hovered ? 1 : 0,
                  scale: hovered ? 1.05 : 1,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="fixed bottom-6 right-[-60px] h-16 px-4 rounded-full border-2 border-black bg-white text-black font-semibold shadow-xl cursor-pointer z-40 flex items-center justify-start"
                style={{ width: 160 }}
                onClick={() => { console.log("Add Cards clicked"); }}
              >
                Add Cards
              </motion.button>

              {/* Pokeball */}
              <motion.button
                className="fixed bottom-6 right-3 z-50 w-16 h-16 rounded-full border-2 border-black flex items-center justify-center cursor-pointer"
                onClick={() => {  
                  setEditingCard(null);  // opens AddEditModal in "add" mode
                  setIsModalOpen(true); }}
                style={{
                  background: "linear-gradient(to bottom, #FF0000 50%, #FFFFFF 50%)",
                }}
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
              >
                {/* Black horizontal line */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-black transform -translate-y-1/2"></div>

                {/* Outer black circle */}
                <div className="absolute w-6 h-6 rounded-full bg-black flex items-center justify-center">
                  {/* Middle white circle */}
                  <div className="w-3 h-3 rounded-full bg-white flex items-center justify-center">
                    {/* Inner black circle */}
                    <div className="w-2 h-2 rounded-full bg-black"></div>
                  </div>
                </div>
              </motion.button>
            </div>



        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input
            type="text"
            placeholder="Search cards..."
            className="input input-bordered flex-1"
            value={search}
            onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
          />
          <select
            className="select select-bordered"
            value={sortKey}
            onChange={e => setSortKey(e.target.value)}
          >
            <option value="name">Name</option>
            <option value="price">Price</option>
            <option value="stocks">Stocks</option>
          </select>
          <select
            className="select select-bordered"
            value={sortOrder}
            onChange={e => setSortOrder(e.target.value)}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="checkbox"
              checked={showInStockOnly}
              onChange={() => { setShowInStockOnly(prev => !prev); setCurrentPage(1); }}
            />
            <span className="label-text">In Stock Only</span>
          </label>
        </div>

        {/* Cards */}
        <CardGrid
          cards={paginatedCards}
          onEdit={card => { setEditingCard(card); setIsModalOpen(true); }}
          onView={card => setViewingCard(card)}
        />

        {/*  */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
            <button
              className="btn btn-sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                className={`btn btn-sm ${currentPage === i + 1 ? "btn-primary" : "btn-ghost"}`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="btn btn-sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </main>

      <Footer />
      <AddEditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        card={editingCard}
      />
      <ExpandedCardModal
        isOpen={!!viewingCard}
        onClose={() => setViewingCard(null)}
        card={viewingCard}
      />
    </div>
  );
}
