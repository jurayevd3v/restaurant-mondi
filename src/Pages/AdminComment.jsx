import { useEffect, useState } from "react";
import axios from "axios";
import ReactLoading from "react-loading";

export default function AdminEmployeeComments() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    try {
      const res = await axios.get(`/comments/comment`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setComments(res.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  });

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
      </div>

      {comments.length === 0 ? (
        <p>Izohlar topilmadi</p>
      ) : (
        <div className="space-y-4 w-full">
          {comments.map(({ id, comment, createdAt, full_name, rating }) => (
            <details key={id} className="border rounded p-4 w-full">
              <summary className="cursor-pointer font-semibold w-full">
                {full_name} — Reyting: {rating} ⭐
              </summary>
              <p className="mt-2 w-full">{comment}</p>
              <p className="mt-1 text-sm text-gray-500 w-full">
                Yozilgan sana: {new Date(createdAt).toLocaleString()}
              </p>
            </details>
          ))}
        </div>
        
      )}
    </div>
  );
}
