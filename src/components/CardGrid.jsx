import { Form, useSubmit } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function CardGrid({ cards, onEdit, onView }) {
  const submit = useSubmit();

  const handleDelete = (card, formEl) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <span>
            Are you sure you want to delete <b>{card.card_name}</b>?
          </span>
          <div className="flex gap-2">
            <button
              className="btn btn-error btn-xs"
              onClick={() => {
                toast.dismiss(t.id);
                submit(formEl, { method: "post" });
                toast.success("Deleted successfully!");
              }}
            >
              Yes
            </button>
            <button
              className="btn btn-ghost btn-xs"
              onClick={() => toast.dismiss(t.id)}
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: 4000 }
    );
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {cards.map((card) => (
        <motion.div
          key={card.id}
          className="w-full max-w-[220px] bg-white shadow-xl overflow-hidden cursor-pointer flex flex-col border border-gray-300 rounded 2-xl"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onView(card)}
        >
          {/* Full card image */}
          {card.card_image ? (
            <img
              src={
                card.card_image.startsWith("http")
                  ? card.card_image
                  : `http://localhost:4000${card.card_image}`
              }
              alt={card.card_name}
              className="w-full h-72 object-cover"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-72 bg-gray-200 text-gray-500">
              No Image
            </div>
          )}

          {/* Extension below the card image */}
          <div className="bg-base-100 p-3 flex flex-col gap-2 border-t border-gray-200">
            <div>
              <h2 className="font-bold text-sm text-primary truncate">
                {card.card_name}
              </h2>
              <p className="label-text">₱{card.price}</p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                className="btn btn-info btn-xs flex-1"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(card);
                }}
              >
                Edit
              </button>

              <Form
                method="post"
                onClick={(e) => e.stopPropagation()}
                className="flex-1"
              >
                <input type="hidden" name="_intent" value="delete" />
                <input type="hidden" name="id" value={card.id} />
                <button
                  type="button"
                  className="btn btn-error btn-xs w-full"
                  onClick={(e) => {
                    e.preventDefault();
                    const formEl = e.currentTarget.closest("form");
                    handleDelete(card, formEl);
                  }}
                >
                  Delete
                </button>
              </Form>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
