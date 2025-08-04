import {
  Card,
  CardBody,
  Typography,
  Select,
  Option,
  Input,
  Button,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import axios from "axios";
import ReactLoading from "react-loading";
import { useParams, useNavigate } from "react-router-dom";
import CommentDelete from "../Components/Comment/CommnetDelete";

export default function AdminEmployeeComments() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [full_name, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalComments: 0,
    totalRating: 0,
    avgRating: 0,
  });

  const [filterType, setFilterType] = useState("all");
  const [filterValue, setFilterValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const fetchComments = async () => {
    setLoading(true);
    let url = `/comments/employee/${id}`;
    try {
      if (filterType === "day") url = `/comments/employee-day/${id}/${filterValue}`;
      else if (filterType === "week") url = `/comments/employee-week/${id}/${filterValue}`;
      else if (filterType === "month") url = `/comments/employee-month/${id}/${filterValue}`;
      else if (filterType === "year") url = `/comments/employee-year/${id}/${filterValue}`;

      const [res, employee] = await Promise.all([
        axios.get(url, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
        axios.get(`employee/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
      ]);

      setComments(res.data.comments || []);
      setFullName(employee.data.full_name);
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
  }, [id]);

  const totalPages = Math.ceil(comments.length / itemsPerPage);
  const displayedComments = comments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchComments();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <ReactLoading type="spinningBubbles" color="#026634" height={100} width={100} />
      </div>
    );
  }

  return (
    <div className="p-3 mx-auto w-full space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Typography variant="h4" className="text-[#026634] font-bold">
          {full_name} — Izohlar
        </Typography>
        <Button onClick={() => navigate(-1)} className="bg-[#026634] hover:bg-[#259c61]">
          Orqaga qaytish
        </Button>
      </div>

      {/* Filter */}
      <Card className="shadow-lg p-6">
        <Typography variant="lead" className="mb-4 text-[#026634] font-semibold">
          Filtr bo'yicha izlash
        </Typography>
        <form onSubmit={handleFilterSubmit} className="flex flex-wrap gap-4">
          <Select
            label="Filter turi"
            value={filterType}
            onChange={(val) => {
              setFilterType(val);
              setFilterValue("");
            }}
            className="min-w-[150px]"
          >
            <Option value="all">Hammasi</Option>
            <Option value="day">Kun</Option>
            <Option value="week">Hafta</Option>
            <Option value="month">Oy</Option>
            <Option value="year">Yil</Option>
          </Select>

          {(filterType === "day" || filterType === "week") && (
            <Input
              type="date"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              label="Sanani tanlang"
              required
              className="min-w-[180px]"
            />
          )}
          {filterType === "month" && (
            <Input
              type="month"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              label="Oyni tanlang"
              required
              className="min-w-[180px]"
            />
          )}
          {filterType === "year" && (
            <Select
              label="Yilni tanlang"
              value={filterValue}
              onChange={(val) => setFilterValue(val)}
              required
              className="min-w-[150px]"
            >
              {Array.from({ length: 5 }, (_, i) => {
                const year = new Date().getFullYear() - 2 + i;
                return <Option key={year} value={year}>{year}</Option>;
              })}
            </Select>
          )}

          <Button type="submit" className="bg-[#026634] px-6 py-2">
            Qidirish
          </Button>
        </form>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="shadow-lg border border-[#026634]">
          <CardBody>
            <Typography className="text-[#026634] font-medium">
              Jami izohlar 💬
            </Typography>
            <Typography variant="h4">{stats.totalComments}</Typography>
          </CardBody>
        </Card>
        <Card className="shadow-lg border border-[#026634]">
          <CardBody>
            <Typography className="text-[#026634] font-medium">
              Reytinglar yig'indisi ⭐
            </Typography>
            <Typography variant="h4">{stats.totalRating}</Typography>
          </CardBody>
        </Card>
        <Card className="shadow-lg border border-[#026634]">
          <CardBody>
            <Typography className="text-[#026634] font-medium">
              O'rtacha reyting ⭐
            </Typography>
            <Typography variant="h4">{stats.avgRating}</Typography>
          </CardBody>
        </Card>
      </div>

      {/* Comments */}
      <div className="space-y-4">
        {displayedComments.length === 0 ? (
          <Card className="p-6 text-center text-gray-500">Izohlar topilmadi</Card>
        ) : (
          displayedComments.map(({ id, comment, createdAt, full_name, rating }) => (
            <Card key={id} className="shadow-md border border-gray-200">
              <CardBody>
                <Typography className="text-[#026634] font-semibold">
                  {full_name} — Reyting: {rating} ⭐
                </Typography>
                <Typography className="text-gray-800 mt-2">{comment}</Typography>
                <Typography className="text-sm text-gray-500 mt-2">
                  Sana: {new Date(createdAt).toLocaleString()}
                </Typography>
                <CommentDelete id={id} refresh={fetchComments} />
              </CardBody>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            variant="outlined"
            color="green"
          >
            &lt;
          </Button>
          <Typography variant="h6" color="green">
            {currentPage} / {totalPages}
          </Typography>
          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            variant="outlined"
            color="green"
          >
            &gt;
          </Button>
        </div>
      )}
    </div>
  );
}
