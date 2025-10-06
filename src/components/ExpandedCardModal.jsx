import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ExpandedCardModal({ isOpen, onClose, card }) {
  const imageRef = useRef(null);
  const [imageHeight, setImageHeight] = useState(0);
  const [slideIn, setSlideIn] = useState(false);

  const containerWidth = 300; // container width in px
  const slideDistance = containerWidth * 0.65; // 55% slide
  const imageShift = slideDistance / 2; // image moves half to keep center

  useEffect(() => {
    if (imageRef.current) {
      setImageHeight(imageRef.current.clientHeight);
    }
  }, [card?.card_image]);

  if (!card) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{ backgroundColor: "rgba(0,0,0,0.95)" }}
        >

          {/* 3D rotation wrapper */}
          <motion.div
            className="relative flex items-center justify-center gap-0"
            initial={{ rotateY: 0 }}
            animate={{ rotateY: 720 }}
            transition={{ duration: 1.4, ease: "easeInOut" }}
            style={{ perspective: 1200 }}
          >
            <div className="relative flex items-center justify-center gap-0">

              {/* Container + Arrow behind the image */}
              <motion.div
                className="flex items-center gap-2 absolute left-0 top-0 z-0"
                animate={{ x: slideIn ? slideDistance : 0 }}
                transition={{ type: "tween", duration: 0.5, ease: "easeInOut" }}
                style={{ height: `${imageHeight}px` }}
              >
                {/* Pokédex Container */}
                <div
                  className="relative flex flex-col justify-center rounded-2xl shadow-2xl overflow-hidden"
                  style={{
                    width: `${containerWidth}px`,
                    height: "100%",
                    background: "linear-gradient(145deg, #FF0000, #D90000)", // Deep red gradient
                    border: "4px solid #FFD700", // Gold border
                    padding: "12px",
                    boxSizing: "border-box",
                    boxShadow: "0 0 20px rgba(255,215,0,0.6), inset 0 0 10px rgba(255,255,255,0.2)", // shiny glow
                  }}
                >
                  {/* Pokédex Screen */}
                  <div className="flex flex-col justify-center items-center rounded-xl bg-gray-900 bg-opacity-90 p-4 flex-1 relative"
                      style={{
                        border: "2px solid #FFA500", // inner gold outline
                        boxShadow: "inset 0 0 10px rgba(255,255,255,0.2)", // inner shine
                      }}
                  >
                    <h2 className="text-xl font-extrabold text-yellow-400 text-center break-words">
                      {card.card_name}
                    </h2>
                    <p className="mt-2 text-white text-sm text-center opacity-90 break-words">
                      {card.card_description}
                    </p>
                    <div className="mt-4 space-y-1 text-white text-sm text-center">
                      <p><strong>Stocks:</strong> {card.stocks}</p>
                      <p><strong>Price:</strong> ₱{card.price}</p>
                    </div>

                    {/* Optional small highlights to mimic Pokédex lights */}
                    <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-yellow-400 shadow-md"></div>
                    <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-yellow-400 shadow-md"></div>
                  </div>
                </div>

  

                {/* Arrow beside container */}
                <button
                  className="flex items-center justify-center p-2 hover:scale-110 transition-transform duration-200 cursor-pointer"
                  onClick={() => setSlideIn(!slideIn)}
                >
                  <div className="w-0 h-0 border-t-[12px] border-b-[12px] border-l-[20px] border-t-transparent border-b-transparent border-l-yellow-400"></div>
                </button>
              </motion.div>

              {/* Image on top */}
              <motion.div
                ref={imageRef}
                className="rounded-lg shadow-lg flex items-center justify-center relative z-10"
                style={{
                  backgroundColor: "#D01E36",
                  width: `${containerWidth}px`,
                  height: "auto",
                }}
                animate={{ x: slideIn ? -imageShift : 0 }} // move left when container slides
                transition={{ type: "tween", duration: 0.5, ease: "easeInOut" }}
              >
                <img
                  src={
                    card?.card_image
                      ? card.card_image.startsWith("http")
                        ? card.card_image
                        : `http://localhost:4000${card.card_image}`
                      : "https://via.placeholder.com/300"
                  }
                  alt={card?.card_name || "Card"}
                  className="w-full h-auto object-contain rounded-lg"
                />
              </motion.div>
            </div>
          </motion.div>

          {/* Fixed Close Button */}
          <button
            className="fixed top-4 right-4 btn btn-sm btn-circle z-50"
            onClick={onClose}
          >
            ✕
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
