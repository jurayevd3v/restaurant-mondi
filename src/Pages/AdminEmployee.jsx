import { useEffect, useState } from "react";
import axios from "axios";
import ReactLoading from "react-loading";
import { MdDelete, MdEdit } from "react-icons/md";
import EmployeeCreate from "../Components/AdminEmployee/EmployeeCreate";
import EmployeeDelete from "../Components/AdminEmployee/EmployeeDelete";
import EmployeeEdit from "../Components/AdminEmployee/EmployeeEdit";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Select,
  Option,
  Input,
} from "@material-tailwind/react";

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
      if (filterType === "day") url = `/employee/day/${filterValue}`;
      else if (filterType === "week") url = `/employee/week/${filterValue}`;
      else if (filterType === "month") url = `/employee/month/${filterValue}`;
      else if (filterType === "year") url = `/employee/year/${filterValue}`;

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
        <ReactLoading type="spinningBubbles" color="#026634" height={100} width={100} />
      </div>
    );
  }

  return (
    <div className="p-3 min-h-screen ">
      <Card className="shadow-lg">
        <CardHeader floated={false} shadow={false} className="">
          <div className="flex justify-between items-center p-4">
            <Typography variant="h4">Xodimlar</Typography>

            <Button
              className=" bg-[#0093B5] hover:bg-[#007A99] text-white"
              onClick={() => setCreateModal(true)}>
              Yangi xodim
            </Button>
          </div>
        </CardHeader>
        <CardBody className="overflow-x-auto">
          <form onSubmit={handleFilterSubmit} className="flex gap-4 items-center mb-4">
            <Select label="Filter turi" value={filterType} onChange={(val) => { setFilterType(val); setFilterValue(""); }}>
              <Option value="all">Hammasi</Option>
              <Option value="day">Kun</Option>
              <Option value="week">Hafta</Option>
              <Option value="month">Oy</Option>
              <Option value="year">Yil</Option>
            </Select>

            {(filterType === "day" || filterType === "week") && (
              <Input type="date" label="Sanani tanlang" value={filterValue} onChange={(e) => setFilterValue(e.target.value)} required />
            )}

            {filterType === "month" && (
              <Input type="month" label="Oyni tanlang" value={filterValue} onChange={(e) => setFilterValue(e.target.value)} required />
            )}

            {filterType === "year" && (
              <Select label="Yilni tanlang" value={filterValue} onChange={(val) => setFilterValue(val)} required>
                <Option value="">Yilni tanlang</Option>
                {Array.from({ length: 5 }, (_, i) => {
                  const currentYear = new Date().getFullYear();
                  const year = currentYear - 2 + i;
                  return <Option key={year} value={year}>{year}</Option>;
                })}
              </Select>
            )}

            <Button type="submit"
              className=" bg-[#0093B5] hover:bg-[#007A99] text-white"
            >Qidirish</Button>
          </form>

          {employees.length > 0 ? (
            <table className="min-w-full table-auto text-left">
              <thead>
                <tr className="bg-[#026634] text-white">
                  <th className="p-3">F.I.O</th>
                  <th className="p-3">Telefon</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Reyting</th>
                  <th className="p-3">Sozlamalar</th>
                  <th className="p-3">Izohlar</th>
                </tr>
              </thead>
              <tbody>
                {displayedEmployees.map((emp) => (
                  <tr key={emp.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{emp.full_name}</td>
                    <td className="p-3">{emp.phone_number}</td>
                    <td className="p-3">{emp.role}</td>
                    <td className="p-3">{emp.avgRating} ⭐</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Button size="sm" color="blue" onClick={() => { setEditData(emp); setEditModal(true); }}><MdEdit /></Button>
                        <Button size="sm" color="red" onClick={() => { setDeleteId(emp.id); setDeleteModal(true); }}><MdDelete /></Button>
                      </div>
                    </td>
                    <td className="p-3">
                      <Button size="sm" color="green" onClick={() => navigate(`/admin/employee/${emp.id}`)}>Ko‘rish</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center text-gray-600 p-8">Hech qanday ma'lumot topilmadi.</div>
          )}

          <div className="flex justify-center items-center gap-4 mt-6">
            <Button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)} variant="outlined">
              &lt;
            </Button>
            <Typography color="gray">{currentPage} / {totalPages}</Typography>
            <Button disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)} variant="outlined">
              &gt;
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Modals */}
      <EmployeeCreate isOpen={createModal} onClose={() => setCreateModal(false)} refresh={fetchEmployees} />
      <EmployeeEdit isOpen={editModal} onClose={() => setEditModal(false)} data={editData} refresh={fetchEmployees} />
      <EmployeeDelete isOpen={deleteModal} onClose={() => setDeleteModal(false)} id={deleteId} refresh={fetchEmployees} />
    </div>
  );
}