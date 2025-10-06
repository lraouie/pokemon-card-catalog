import { redirect } from "react-router-dom";
import toast from "react-hot-toast";

// Loader: fetch all cards from backend
export async function loader() {
  const res = await fetch("http://localhost:4000/api/cards");
  if (!res.ok) throw new Error("Failed to fetch cards");
  const cards = await res.json();
  return { cards };
}

// Action: handles add/edit/delete with file uploads
export async function action({ request }) {
  const formData = await request.formData();
  const intent = formData.get("_intent");
  const url = "http://localhost:4000/api/cards";
  let message = "";

  try {
    if (intent === "add" || intent === "edit") {
      const id = formData.get("id");

      // Create a FormData object to send file properly
      const fetchData = new FormData();
      fetchData.append("_intent", intent);
      if (id) fetchData.append("id", id);
      fetchData.append("card_name", formData.get("card_name"));
      fetchData.append("card_description", formData.get("card_description"));
      fetchData.append("stocks", formData.get("stocks"));
      fetchData.append("price", formData.get("price"));

      // Add file if provided
      const file = formData.get("card_image");
      if (file && file.size > 0) {
        fetchData.append("card_image", file);
      }

      const res = await fetch(intent === "add" ? url : `${url}/${id}`, {
        method: intent === "add" ? "POST" : "PUT",
        body: fetchData, // send multipart/form-data
      });

      if (!res.ok) throw new Error(intent === "add" ? "Failed to add card" : "Failed to update card");
      message = intent === "add" ? "Card added!" : "Card updated!";

    } else if (intent === "delete") {
      const id = formData.get("id");
      const res = await fetch(`${url}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete card");
      message = "Card deleted!";
    }

    toast.success(message);
  } catch (err) {
    toast.error(err.message);
  }

  return redirect("/"); // reload loader
}
