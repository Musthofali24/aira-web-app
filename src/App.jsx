// App.jsx
import Navbar from "./components/Navbar";
import FloatingNavbar from "./components/FloatingNavbar";
import { Toaster } from "react-hot-toast";

function App({ children }) {
  return (
    <div className="bg-gradient-to-b bg-[#45cad7] text-white min-h-screen py-5">
      {/* Toast Notifications */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          error: {
            style: {
              background: "#FF4B4B",
              color: "white",
            },
          },
        }}
      />

      {/* Navbar */}
      <Navbar />

      {/* Halaman */}
      {children}

      {/* Floating bottom navbar */}
      <FloatingNavbar />
    </div>
  );
}

export default App;
