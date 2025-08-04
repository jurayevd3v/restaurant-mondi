import { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardBody,
  Typography,
  Input,
  Button,
  Select,
  Option,
  Spinner,
} from "@material-tailwind/react";
import CommentDelete from "../Components/Comment/CommnetDelete";

export default function AdminComments() {
  const [comments, setComments] = useState([]);
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
    let url = "/comments/comment";

    try {
      if (filterType === "day") {
        url = `/comments/comment-day/${filterValue}`;
      } else if (filterType === "week") {
        url = `/comments/comment-week/${filterValue}`;
      } else if (filterType === "month") {
        url = `/comments/comment-month/${filterValue}`;
      } else if (filterType === "year") {
        url = `/comments/comment-year/${filterValue}`;
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
    } catch (err) {
      console.error("Xatolik:", err);
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
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchComments();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner color="green" className="h-12 w-12" />
      </div>
    );
  }

  return (
    <div className="p-3">
      <Card className="mb-6 p-6 shadow-md">
        <Typography variant="h4" color="green" className="mb-4">
          Izohlar boshqaruvi
        </Typography>

        <form
          onSubmit={handleFilterSubmit}
          className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center"
        >
          <Select
            label="Filter turi"
            value={filterType}
            onChange={(val) => {
              setFilterType(val);
              setFilterValue("");
            }}
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
              label="Sanani tanlang"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              required
            />
          )}

          {filterType === "month" && (
            <Input
              type="month"
              label="Oy"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              required
            />
          )}

          {filterType === "year" && (
            <Select
              label="Yilni tanlang"
              value={filterValue}
              onChange={(val) => setFilterValue(val)}
              required
            >
              {Array.from({ length: 5 }, (_, i) => {
                const year = new Date().getFullYear() - 2 + i;
                return <Option key={year} value={String(year)}>{year}</Option>;
              })}
            </Select>
          )}

          <Button type="submit" color="green" className="w-full">
            Qidirish
          </Button>
        </form>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="p-4 border-l-4 border-green-600 shadow-sm">
          <Typography variant="small" className="text-green-700">
            💬 Jami izohlar
          </Typography>
          <Typography variant="h5" className="mt-2 font-bold">
            {stats.totalComments}
          </Typography>
        </Card>
        <Card className="p-4 border-l-4 border-yellow-500 shadow-sm">
          <Typography variant="small" className="text-yellow-600">
            ⭐ Reyting yig'indisi
          </Typography>
          <Typography variant="h5" className="mt-2 font-bold">
            {stats.totalRating}
          </Typography>
        </Card>
        <Card className="p-4 border-l-4 border-purple-500 shadow-sm">
          <Typography variant="small" className="text-purple-600">
            📊 O‘rtacha reyting
          </Typography>
          <Typography variant="h5" className="mt-2 font-bold">
            {stats.avgRating}
          </Typography>
        </Card>
      </div>

      {/* Comments */}
      <div className="space-y-4">
        {displayedComments.length === 0 ? (
          <Typography color="gray" className="italic text-center">
            Hech qanday izoh topilmadi
          </Typography>
        ) : (
          displayedComments.map(({ id, full_name, comment, rating, createdAt }) => (
            <Card key={id} className="p-4 border-l-4 border-green-400 shadow-md">
              <div className="flex justify-between items-center mb-2">
                <Typography variant="h6" className="text-green-700">
                  {full_name}
                </Typography>
                <Typography className="text-yellow-600">⭐ {rating}</Typography>
              </div>
              <Typography className="text-gray-800">{comment}</Typography>
              <Typography className="text-sm text-gray-500 mt-2">
                🕒 {new Date(createdAt).toLocaleString()}
              </Typography>
              <CommentDelete id={id} refresh={fetchComments} />
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-4 mt-10">
        <Button
          size="sm"
          variant="outlined"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          ⬅
        </Button>
        <Typography variant="paragraph" className="text-green-800 font-medium">
          {currentPage} / {totalPages}
        </Typography>
        <Button
          size="sm"
          variant="outlined"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          ➡
        </Button>
      </div>
    </div>
  );
}
