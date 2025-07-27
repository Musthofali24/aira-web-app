import { NavLink, useLocation } from "react-router-dom";

function FloatingNavbar() {
  const { pathname } = useLocation();

  // fungsi bantu untuk cek active
  const isActive = (path) => pathname === path;

  const baseClass =
    "flex flex-col items-center space-y-1.5 p-4 rounded-full transition-colors duration-200";

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white text-gray-700 rounded-full shadow-2xl border border-[#45cad7] px-2 py-2 flex justify-between items-center md:gap-3 z-50">
      <NavLink
        to="/"
        className={`${baseClass} ${
          isActive("/")
            ? "bg-[#45cad7] text-white"
            : "hover:bg-[#45cad7] hover:text-white"
        }`}
      >
        <i className="ri-home-5-line ri-xl"></i>
        <p className="text-xs">Home</p>
      </NavLink>

      <NavLink
        to="/statistik"
        className={`${baseClass} ${
          isActive("/statistik")
            ? "bg-[#45cad7] text-white"
            : "hover:bg-[#45cad7] hover:text-white"
        }`}
      >
        <i className="ri-bar-chart-line ri-xl"></i>
        <p className="text-xs">Statistik</p>
      </NavLink>

      <NavLink
        to="/udara"
        className={`${baseClass} ${
          isActive("/udara")
            ? "bg-[#45cad7] text-white"
            : "hover:bg-[#45cad7] hover:text-white"
        }`}
      >
        <i className="ri-windy-line ri-xl"></i>
        <p className="text-xs">Udara</p>
      </NavLink>

      <NavLink
        to="/artikel"
        className={`${baseClass} ${
          isActive("/artikel")
            ? "bg-[#45cad7] text-white"
            : "hover:bg-[#45cad7] hover:text-white"
        }`}
      >
        <i className="ri-article-line ri-xl"></i>
        <p className="text-xs">Artikel</p>
      </NavLink>

      <NavLink
        to="/chatbot"
        className={`${baseClass} ${
          isActive("/chatbot")
            ? "bg-[#45cad7] text-white"
            : "hover:bg-[#45cad7] hover:text-white"
        }`}
      >
        <i className="ri-robot-3-line ri-xl"></i>
        <p className="text-xs">Chat</p>
      </NavLink>
    </div>
  );
}

export default FloatingNavbar;
