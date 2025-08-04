import { useEffect, useState } from "react";
import MenuCreate from "../Components/AdminMenu/MenuCreate";
import axios from "axios";
import CONFIG from "../utils/Config";
import { MdDelete, MdEdit } from "react-icons/md";
import ReactLoading from "react-loading";
import MenuDelete from "../Components/AdminMenu/MenuDelete";
import MenuEdit from "../Components/AdminMenu/MenuEdit";
import { useParams } from "react-router-dom";
import { Card, CardBody, Typography, Button } from "@material-tailwind/react";

export default function AdminMenu() {
    const { ID } = useParams();
    const [CreateModal, setCreateModal] = useState(false);
    const [categoryData, setCategoryData] = useState(null);
    const [DeleteModal, setDeleteModal] = useState(false);
    const [DeleteId, setDeleteId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [EditModal, setEditModal] = useState(false);
    const [EditData, setEditData] = useState(null);

    const getMenu = async () => {
        try {
            const res = await axios.get(`/category/${ID}`);
            setCategoryData(res.data);
        } catch (err) {
            console.error("Error fetching menu:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getMenu();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <ReactLoading type="spinningBubbles" color="#026634" height={100} width={100} />
            </div>
        );
    }

    return (
        <div className="p-3 mx-auto ">
            <div className="bg-white p-[15px] fixed top-[10px] w-[78%]   z-20 shadow-2xl mb-6 rounded-[10px] flex justify-between items-center">
                <Typography variant="h4" className="text-[#026634]">
                    {categoryData?.name} menyusi
                </Typography>
                <Button
                    className="bg-[#026634] text-white hover:bg-[#259c61]"
                    onClick={() => setCreateModal(true)}
                >
                    Yangi qo'shish
                </Button>
            </div>

            {categoryData?.menu?.length ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-[80px]">
                    {categoryData.menu.map((item) => (
                        <Card key={item.id} className="shadow-md border border-gray-200">
                            <img
                                src={item.image ? CONFIG.API_URL + item.image : "https://via.placeholder.com/250"}
                                alt={item.name}
                                className="h-48 w-full object-cover rounded-t-md"
                            />
                            <CardBody>
                                <div className="flex justify-between items-center mb-2">
                                    <Typography variant="h6" className="text-[#026634]">
                                        {item.name}
                                    </Typography>
                                    <Typography variant="small" className="text-gray-600">
                                        {item.price ? Number(item.price).toLocaleString('ru-RU') : 'N/A'} uzs
                                    </Typography>
                                </div>
                                <Typography variant="small" color="gray">
                                    {item.description || "Izoh yo'q"}
                                </Typography>
                                <div className="flex justify-between items-center mt-3">
                                    <Typography variant="small">
                                        Chegirma: {item.discount}%
                                    </Typography>
                                    <Typography variant="small">
                                        {item.type ? "Katta" : "Oddiy"} | {item.new ? "Yangi" : "Eski"}
                                    </Typography>
                                </div>
                                <div className="flex justify-end gap-4 mt-4">
                                    <button
                                        onClick={() => {
                                            setEditData(item);
                                            setEditModal(true);
                                        }}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        <MdEdit size={20} />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setDeleteId(item.id);
                                            setDeleteModal(true);
                                        }}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        <MdDelete size={20} />
                                    </button>
                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center flex items-center justify-center h-screen text-gray-500 text-lg mt-10">
                    <h1>Menyu bo'sh
                    </h1></div>
            )}

            <MenuCreate isOpen={CreateModal} onClose={() => setCreateModal(false)} refresh={getMenu} />
            <MenuDelete isOpen={DeleteModal} onClose={() => setDeleteModal(false)} id={DeleteId} refresh={getMenu} />
            <MenuEdit isOpen={EditModal} onClose={() => setEditModal(false)} data={EditData} refresh={getMenu} />
        </div>
    );
}
