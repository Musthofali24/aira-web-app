import { NavLink, useLocation } from "react-router-dom";

function FloatingNavbar() {
  const { pathname } = useLocation();

  // fungsi bantu untuk cek active
  const isActive = (path) => pathname === path;

  const baseClass =
    "flex flex-col items-center space-y-1.5 p-4 rounded-full transition-colors duration-200";

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white text-gray-700 rounded-full shadow-2xl border border-[#45cad7] px-2 py-2 flex justify-between items-center gap-0 z-50">
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
        <p className="text-xs">Stats</p>
      </NavLink>

      <NavLink
        to="/chatbot"
        className={`relative flex flex-col items-center justify-center}`}
      >
        <div
          className={`-mt-18 z-20 w-16 h-16 flex items-center justify-center rounded-full border-4 hover:bg-[#45cad7] hover:text-white transition-all duration-300 ${
            isActive("/chatbot")
              ? "bg-[#45cad7] border-[#45cad7] text-white"
              : "bg-white border-[#45cad7]/30 text-[#45cad7]"
          }`}
        >
          <i className="ri-robot-3-line ri-xl"></i>
        </div>
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
    </div>
  );
}

export default FloatingNavbar;
