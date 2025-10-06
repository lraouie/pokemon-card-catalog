import { Form, useNavigation, useSubmit } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

export default function AddEditModal({ isOpen, onClose, card }) {
  const [errors, setErrors] = useState({});
  const [formValues, setFormValues] = useState({
    card_name: "",
    card_description: "",
    stocks: "",
    price: "",
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [file, setFile] = useState(null);

  const navigation = useNavigation();
  const submit = useSubmit();
  const isSubmitting = navigation.state === "submitting";

  // preload values if editing
  useEffect(() => {
    if (card) {
      setFormValues({
        card_name: card.card_name || "",
        card_description: card.card_description || "",
        stocks: card.stocks || "",
        price: card.price || "",
      });
      setPreviewImage(card.card_image || null);
      setFile(null);
    } else {
      setFormValues({
        card_name: "",
        card_description: "",
        stocks: "",
        price: "",
      });
      setPreviewImage(null);
      setFile(null);
    }
    setErrors({});
  }, [card, isOpen]);

  const validate = () => {
    const newErrors = {};
    if (!formValues.card_name.trim()) newErrors.card_name = "Card name is required.";
    if (!formValues.price || isNaN(formValues.price)) newErrors.price = "Valid price is required.";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validation = validate();
    if (Object.keys(validation).length > 0) {
      setErrors(validation); // Store errors in state
      toast.error(Object.values(validation)[0]);
      return;
    }
    console.log("File before submit:", file);

    // Create a new FormData object to send both text and file data
    const formData = new FormData();
    
    formData.append("_intent", card ? "edit" : "add");
    if (card) formData.append("id", card.id);
    formData.append("card_name", formValues.card_name);
    formData.append("card_description", formValues.card_description);
    formData.append("stocks", formValues.stocks);
    formData.append("price", formValues.price);
    if (file) formData.append("card_image", file);

    submit(formData, { method: "post", encType: "multipart/form-data" });
  };

  const handleImageUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);

    const reader = new FileReader();
    reader.onloadend = () => setPreviewImage(reader.result);
    reader.readAsDataURL(selectedFile);
  };

  // Success toast
  useEffect(() => {
    if (!isSubmitting && isOpen) {
      if (navigation.formData) toast.success(card ? "Card updated!" : "Card added!");
      onClose();
    }
  }, [isSubmitting]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-base-100 rounded-2xl p-6 w-[90%] md:w-[500px] shadow-lg relative"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
          >
            <button
              className="absolute top-2 right-2 btn btn-sm btn-circle"
              onClick={onClose}
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-4">{card ? "Edit Card" : "Add Card"}</h2>

            <form onSubmit={handleSubmit} className="space-y-3" encType="multipart/form-data">
              <input type="text" name="card_name" placeholder="Card Name" className="input input-bordered w-full"
                value={formValues.card_name} onChange={e => setFormValues({ ...formValues, card_name: e.target.value })} />
              
              <textarea name="card_description" placeholder="Description" className="textarea textarea-bordered w-full"
                value={formValues.card_description} onChange={e => setFormValues({ ...formValues, card_description: e.target.value })} />
              
              <div>
                <input
                  type="file"
                  name="card_image"
                  accept="image/*"
                  className="file-input file-input-bordered w-full"
                  onChange={handleImageUpload}
                />
                {previewImage && (
                  <img
                    src={
                      previewImage.startsWith("http") || previewImage.startsWith("data:")
                        ? previewImage
                        : `http://localhost:4000${previewImage}`
                    }
                    alt="Preview"
                    className="mt-2 w-32 h-32 object-cover rounded-lg shadow"
                  />
                )}
              </div>


              <input type="number" name="stocks" placeholder="Stocks" className="input input-bordered w-full"
                value={formValues.stocks} onChange={e => setFormValues({ ...formValues, stocks: e.target.value })} />

              <input type="number" name="price" placeholder="Price" className="input input-bordered w-full"
                value={formValues.price} onChange={e => setFormValues({ ...formValues, price: e.target.value })} />

              <button type="submit" className={`btn btn-primary w-full ${isSubmitting ? "loading" : ""}`} disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : card ? "Update" : "Add"}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
