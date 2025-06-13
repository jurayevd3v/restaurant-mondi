import { useEffect, useState } from "react";
import axios from "axios";
import ReactLoading from "react-loading";

export default function AdminComments() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalComments: 0,
    totalRating: 0,
    avgRating: 0,
  });

  const [filterType, setFilterType] = useState("all");
  const [filterValue, setFilterValue] = useState(""); // always string
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const fetchComments = async () => {
    setLoading(true);

    let url = "/comments/comment";

    try {
      if (filterType === "day") {
        url = `/comments/comment-day/${filterValue}`; // example: 2025-06-13
      } else if (filterType === "week") {
        url = `/comments/comment-week/${filterValue}`; // example: 2025-06-13
      } else if (filterType === "month") {
        url = `/comments/comment-month/${filterValue}`; // example: 2025-06
      } else if (filterType === "year") {
        url = `/comments/comment-year/${filterValue}`; // example: 2025
      }

      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setComments(res.data.comments || []);
      setStats({
        totalComments: res.data.totalComments,
        totalRating: res.data.totalRating,
        avgRating: res.data.avgRating,
      });
    } catch (error) {
      console.error("Xatolik:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const totalPages = Math.ceil(comments.length / itemsPerPage);
  const displayedComments = comments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchComments();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <ReactLoading
          type="spinningBubbles"
          color="#000"
          height={100}
          width={100}
        />
      </div>
    );
  }

  return (
    <div className="px-6 w-full">
      <div className="w-full p-5 bg-white border-b border-[#0093b5] flex justify-between items-center mb-5">
        <h1 className="text-2xl">Izohlar</h1>

        {/* Filter form */}
        <form
          onSubmit={handleFilterSubmit}
          className="flex items-center gap-4 justify-between"
        >
          <select
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
              setFilterValue(""); // Clear value when type changes
            }}
            className="border border-[#0093b5] rounded px-4 py-2.5 text-[#0093b5] w-full"
          >
            <option value="all">Hammasi</option>
            <option value="day">Kun</option>
            <option value="week">Hafta (kun asosida)</option>
            <option value="month">Oy</option>
            <option value="year">Yil</option>
          </select>

          {/* Dynamic input */}
          {(filterType === "day" || filterType === "week") && (
            <input
              type="date"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              className="border rounded px-4 py-2"
              required
            />
          )}
          {filterType === "month" && (
            <input
              type="month"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              className="border rounded px-4 py-2"
              required
            />
          )}
          {filterType === "year" && (
            <select
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              className="border border-[#0093b5] rounded px-4 py-2.5"
              required
            >
              <option value="">Yilni tanlang</option>
              {Array.from({ length: 5 }, (_, i) => {
                const currentYear = new Date().getFullYear();
                const year = currentYear - 2 + i;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>
          )}

          <button
            type="submit"
            className="bg-[#0093b5] text-white px-4 py-2 rounded hover:bg-[#007799]"
          >
            Qidirish
          </button>
        </form>
      </div>

      {/* Statistikalar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white shadow border border-[#0093b5] rounded p-4">
          <p className="text-[#0093b5]">Jami izohlar 💬</p>
          <p className="text-xl font-bold">{stats.totalComments}</p>
        </div>
        <div className="bg-white shadow border border-[#0093b5] rounded p-4">
          <p className="text-[#0093b5]">Reytinglar yig`indisi ⭐</p>
          <p className="text-xl font-bold">{stats.totalRating}</p>
        </div>
        <div className="bg-white shadow border border-[#0093b5] rounded p-4">
          <p className="text-[#0093b5]">O`rtacha reyting ⭐</p>
          <p className="text-xl font-bold">{stats.avgRating}</p>
        </div>
      </div>

      {/* Comments */}
      {displayedComments.length === 0 ? (
        <p>Izohlar topilmadi</p>
      ) : (
        <>
          <div className="space-y-4 w-full">
            {displayedComments.map(
              ({ id, comment, createdAt, full_name, rating }) => (
                <details key={id} className="border rounded p-4 w-full">
                  <summary className="cursor-pointer font-semibold w-full">
                    {full_name} — Reyting: {rating} ⭐
                  </summary>
                  <p className="mt-2 w-full">{comment}</p>
                  <p className="mt-1 text-sm text-gray-500 w-full">
                    Yozilgan sana: {new Date(createdAt).toLocaleString()}
                  </p>
                </details>
              )
            )}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center space-x-4 mt-8">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded ${
                currentPage === 1
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[#0093b5] text-white hover:bg-[#007799]"
              }`}
            >
              &lt;
            </button>
            <span className="text-lg">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded ${
                currentPage === totalPages
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[#0093b5] text-white hover:bg-[#007799]"
              }`}
            >
              &gt;
            </button>
          </div>
        </>
      )}
    </div>
  );
}
