// App.jsx
import Navbar from "./components/Navbar";
import FloatingNavbar from "./components/FloatingNavbar";

function App({ children }) {
  return (
    <div className="bg-gradient-to-b bg-[#45cad7] text-white min-h-screen py-5">
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
