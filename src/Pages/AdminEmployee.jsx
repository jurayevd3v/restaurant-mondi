import { useEffect, useState } from "react";
import axios from "axios";
// import CONFIG from "../utils/Config";
import ReactLoading from "react-loading";
import { MdDelete, MdEdit } from "react-icons/md";
import EmployeeCreate from "../Components/AdminEmployee/EmployeeCreate";
import EmployeeDelete from "../Components/AdminEmployee/EmployeeDelete";
import EmployeeEdit from "../Components/AdminEmployee/EmployeeEdit";
import { useNavigate } from "react-router-dom";

export default function AdminEmployee() {
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [createModal, setCreateModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [filterType, setFilterType] = useState("all");
  const [filterValue, setFilterValue] = useState("");

  const navigate = useNavigate();

  const fetchEmployees = async () => {
    setLoading(true);

    let url = "/employee";

    try {
      if (filterType === "day") {
        url = `/employee/day/${filterValue}`; // example: 2025-06-13
      } else if (filterType === "week") {
        url = `/employee/week/${filterValue}`; // example: 2025-06-13
      } else if (filterType === "month") {
        url = `/employee/month/${filterValue}`; // example: 2025-06
      } else if (filterType === "year") {
        url = `/employee/year/${filterValue}`; // example: 2025
      }

      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setEmployees(res.data || []);
    } catch (error) {
      console.error("Xatolik:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Pagination
  const totalPages = Math.ceil(employees.length / itemsPerPage);
  const displayedEmployees = employees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchEmployees();
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
    <div className="overflow-y-scroll w-full h-screen pb-20">
      <div className="w-full p-5 bg-white border-b border-[#0093b5] flex justify-between items-center">
        <div className="flex items-center gap-5">
          <h1 className="text-2xl">Xodimlar</h1>
          <button
            onClick={() => setCreateModal(true)}
            className="bg-[#0093b5] text px-5 py-2 rounded-md text-white border-2 border-[#0093b5] hover:bg-transparent hover:text-[#0093b5] transition"
          >
            Yaratish
          </button>
        </div>

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

      {employees.length > 0 ? (
        <>
          <div className="overflow-x-auto mt-5 p-6">
            <table className="min-w-full bg-white border-collapse">
              <thead className="bg-[#0093b5] text-white">
                <tr className="border-b">
                  <th className="py-2 px-4 text-left">Full Name</th>
                  <th className="py-2 px-4 text-left">Phone Number</th>
                  <th className="py-2 px-4 text-left">Role</th>
                  <th className="py-2 px-4 text-left">Reyting</th>
                  <th className="py-2 px-4 text-left">Sozlamalar</th>
                  <th className="py-2 px-4 text-left">Izohlarni ko‘rish</th>
                </tr>
              </thead>
              <tbody>
                {displayedEmployees.map((employee) => (
                  <tr key={employee.id} className="border-b border-[#0093b5]">
                    <td className="py-2 px-4">{employee.full_name}</td>
                    <td className="py-2 px-4">{employee.phone_number}</td>
                    <td className="py-2 px-4">{employee.role}</td>
                    <td className="py-2 px-4">{employee.avgRating} ⭐</td>
                    <td className="py-2 px-4">
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            setEditData(employee);
                            setEditModal(true);
                          }}
                          className="hover:text-[#5f5f5f]"
                        >
                          <MdEdit fontSize={22} />
                        </button>
                        <button
                          onClick={() => {
                            setDeleteId(employee.id);
                            setDeleteModal(true);
                          }}
                          className="hover:text-red-600"
                        >
                          <MdDelete fontSize={22} />
                        </button>
                      </div>
                    </td>
                    <td className="py-2 px-4">
                      <button
                        onClick={() =>
                          navigate(`/admin/employee/${employee.id}`)
                        }
                        className="bg-[#0093b5] text-white px-3 py-1 rounded hover:bg-[#007799]"
                      >
                        Izohlarni ko‘rish
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center space-x-4 mt-6">
            <button
              className={`py-2 px-4 rounded-md ${
                currentPage === 1
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[#4cd4f3] text-white hover:bg-[#0093b5]"
              }`}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              &lt;
            </button>
            <span className="text-lg">
              {currentPage} / {totalPages}
            </span>
            <button
              className={`py-2 px-4 rounded-md ${
                currentPage === totalPages
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[#4cd4f3] text-white hover:bg-[#0093b5]"
              }`}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              &gt;
            </button>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-screen">Bo‘sh</div>
      )}

      {/* Modal components */}
      <EmployeeCreate
        isOpen={createModal}
        onClose={() => setCreateModal(false)}
        refresh={fetchEmployees}
      />
      <EmployeeEdit
        isOpen={editModal}
        onClose={() => setEditModal(false)}
        data={editData}
        refresh={fetchEmployees}
      />
      <EmployeeDelete
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        id={deleteId}
        refresh={fetchEmployees}
      />
    </div>
  );
}
