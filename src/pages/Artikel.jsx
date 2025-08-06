function Artikel() {
  // Data dummy berita untuk contoh
  const newsData = [
    {
      id: 1,
      title: "Kualitas Udara Jakarta Memburuk, PM2.5 Capai Level Berbahaya",
      description:
        "Indeks kualitas udara Jakarta kembali mencapai level tidak sehat dengan konsentrasi PM2.5 yang tinggi. BMKG menghimbau masyarakat untuk mengurangi aktivitas luar ruangan dan menggunakan masker saat bepergian.",
      image:
        "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=200&fit=crop",
      source: "BMKG",
      publishedAt: "2025-08-06T09:30:00Z",
    },
    {
      id: 2,
      title: "Teknologi AI Prediksi Kualitas Udara Real-time di 10 Kota",
      description:
        "Sistem monitoring berbasis AI kini dapat memprediksi kualitas udara secara real-time di 10 kota besar Indonesia, membantu masyarakat dalam perencanaan aktivitas harian dengan data yang akurat dan terpercaya.",
      image:
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=200&fit=crop",
      source: "Kompas",
      publishedAt: "2025-08-05T14:15:00Z",
    },
    {
      id: 3,
      title: "Emisi Karbon Indonesia Turun 15% Berkat Program Hijau",
      description:
        "Program penghijauan massal dan penggunaan energi terbarukan berhasil menurunkan emisi karbon Indonesia sebesar 15% dalam setahun terakhir. Pemerintah menargetkan penurunan hingga 30% pada 2030.",
      image:
        "https://images.unsplash.com/photo-1569163139394-de4e4f43e4e5?w=400&h=200&fit=crop",
      source: "Tempo",
      publishedAt: "2025-08-04T11:45:00Z",
    },
  ];

  const formatDate = (dateString) => {
    const options = {
      day: "numeric",
      month: "short",
      year: "numeric",
    };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div className=" text-white min-h-screen py-5 mb-20">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Berita Iklim & Kualitas Udara
        </h1>
        <p className="text-sm sm:text-base text-gray-200">
          Update terbaru seputar perubahan iklim dan kondisi kualitas udara
        </p>
      </div>
      <div className="max-w-4xl mx-auto bg-[#e8fdff] rounded-2xl p-4 sm:p-6 shadow-lg">
        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {newsData.map((article) => (
            <div
              key={article.id}
              className="bg-white rounded-2xl shadow-md transition-all hover:shadow-lg hover:-translate-y-1 overflow-hidden"
            >
              {/* Image Section */}
              <div className="relative">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/400x200?text=No+Image";
                  }}
                />
                <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold">
                  {article.source}
                </div>
              </div>

              {/* Content Section */}
              <div className="p-4 flex flex-col h-52">
                {/* Title */}
                <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
                  {article.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm">
                  {truncateText(article.description, 75)}
                </p>

                {/* Footer */}
                <div className="flex justify-between items-center mt-auto">
                  <span className="text-xs text-gray-500">
                    {formatDate(article.publishedAt)}
                  </span>
                  <button className="bg-[#45cad7] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#3bb4c1] transition-colors duration-200 flex items-center gap-1">
                    <i className="ri-eye-line"></i>
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Section */}
        <div className="text-center mt-8 sm:mt-12">
          <button className="bg-[#45cad7] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#3bb4c1] transition-colors duration-200 flex items-center gap-2 mx-auto">
            <i className="ri-refresh-line"></i>
            Muat Berita Lainnya
          </button>
        </div>
      </div>
    </div>
  );
}

export default Artikel;
