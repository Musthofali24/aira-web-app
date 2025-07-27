import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import Statistik from "./pages/Statistik";
import Udara from "./pages/Udara";
import Artikel from "./pages/Artikel";
import Home from "./pages/Home";
import "./index.css";
import "remixicon/fonts/remixicon.css";
import ChatBot from "./pages/ChatBot.jsx";
import Settings from "./pages/Setting.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/statistik" element={<Statistik />} />
        <Route path="/udara" element={<Udara />} />
        <Route path="/artikel" element={<Artikel />} />
        <Route path="/chatbot" element={<ChatBot />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </App>
  </BrowserRouter>
);
