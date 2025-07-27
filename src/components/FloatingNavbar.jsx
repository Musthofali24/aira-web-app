function FloatingNavbar() {
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-transparent backdrop-blur-lg text-gray-700 rounded-full shadow-2xl border border-[#45cad7] px-5 py-2 flex justify-between items-center gap-3 z-50">
      <a
        href="#"
        className="flex flex-col items-center space-y-1.5 hover:bg-[#45cad7] hover:text-white p-4 rounded-full transition-colors duration-200"
      >
        <i className="ri-home-5-line ri-xl"></i>
        <p className="text-xs">Monitoring</p>
      </a>
      <a
        href="#"
        className="flex flex-col items-center space-y-1.5 hover:bg-[#45cad7] hover:text-white p-4 rounded-full transition-colors duration-200"
      >
        <i className="ri-bar-chart-line ri-xl"></i>
        <p className="text-xs">Statistik</p>
      </a>
      <a
        href="#"
        className="flex flex-col items-center space-y-1.5 hover:bg-[#45cad7] hover:text-white p-4 rounded-full transition-colors duration-200"
      >
        <i className="ri-windy-line ri-xl"></i>
        <p className="text-xs">Udara</p>
      </a>
      <a
        href="#"
        className="flex flex-col items-center space-y-1.5 hover:bg-[#45cad7] hover:text-white p-4 rounded-full transition-colors duration-200"
      >
        <i className="ri-article-line ri-xl"></i>
        <p className="text-xs">Artikel</p>
      </a>
    </div>
  );
}

export default FloatingNavbar;
