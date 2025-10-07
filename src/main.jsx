import React from "react";
import ReactDOM from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";
import * as cardsRoute from "./routes/cardsRoute";
import "./app.css";

const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    loader: cardsRoute.loader,
    action: cardsRoute.action,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
