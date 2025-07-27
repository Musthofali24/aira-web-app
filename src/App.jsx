// App.jsx
import Navbar from "./components/Navbar";
import FloatingNavbar from "./components/FloatingNavbar";

function App({ children }) {
  return (
    <div className="bg-gradient-to-b bg-[#45cad7] text-white min-h-screen py-5 px-5">
      {/* Navbar selalu tampil */}
      <Navbar />

      {/* Halaman spesifik akan muncul di sini */}
      {children}

      {/* Floating bottom navbar */}
      <FloatingNavbar />
    </div>
  );
}

export default App;
