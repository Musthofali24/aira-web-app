import React from "react";

function Navbar() {
  return (
    <div className="max-w-4xl mx-auto flex justify-between items-center mb-5">
      <div className="flex items-center gap-4">
        <div className="bg-[#2f9ea8] py-2 px-3 rounded-lg">
          <i className="ri-leaf-line ri-lg"></i>
        </div>
        <div>
          <h1 className="font-semibold text-xl tracking-widest">AIRA</h1>
          <p className="text-base text-gray-200">
            Smart Air Quality Monitoring
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <a href="#" className="bg-[#2f9ea8] py-2 px-3 rounded-lg">
          <i className="ri-moon-line ri-lg"></i>
        </a>
        <a href="#" className="bg-[#2f9ea8] py-2 px-3 rounded-lg">
          <i className="ri-notification-3-line ri-lg"></i>
        </a>
        <a href="#" className="bg-[#2f9ea8] py-2 px-3 rounded-lg">
          <i className="ri-settings-3-line ri-lg"></i>
        </a>
      </div>
    </div>
  );
}

export default Navbar;
