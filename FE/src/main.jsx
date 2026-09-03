import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

async function enableMocking() {
  if (import.meta.env.VITE_USE_MOCK !== "true") return;

  if (!localStorage.getItem("accessToken")) {
    localStorage.setItem("accessToken", "mock-access-token");
  }

  const { worker } = await import("./mocks/browser.js");
  await worker.start({ onUnhandledRequest: "bypass" });
}

enableMocking().then(() => {
  createRoot(document.getElementById("root")).render(<App />);
});
