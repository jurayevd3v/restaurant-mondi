import { useEffect, useState } from "react";
import MenuCreate from "../Components/AdminMenu/MenuCreate";
import axios from "axios";
import CONFIG from "../utils/Config";
import { MdDelete } from "react-icons/md";
import ReactLoading from 'react-loading';
import { MdEdit } from "react-icons/md";
import MenuDelete from "../Components/AdminMenu/MenuDelete";
import MenuEdit from "../Components/AdminMenu/MenuEdit";

export default function AdminMenu() {

    const [CreateModal, setCreateModal] = useState(false);
    const [menuData, setMenuData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [DeleteModal, setDeleteModal] = useState(false)
    const [DeleteId, setDeleteId] = useState(false)
    const [loading, setLoading] = useState(true)
    const [EditModal, setEditModal] = useState(false)
    const [EditData, setEditData] = useState([])
    const itemsPerPage = 5;

    const getMenu = async () => {
        try {
            const response = await axios.get('/menu');
            setMenuData(response.data);  // Set the fetched data into the state
        } catch (error) {
            console.error("Error fetching menu data:", error);
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        getMenu();
    }, []); // Empty dependency array to fetch data once on mount


    if (loading) {
        return (
            <div className='flex items-center justify-center h-screen w-full'>
                <ReactLoading type="spinningBubbles" color="#000" height={100} width={100} />
            </div>
        );
    }



    // Pagination logic
    const totalPages = Math.ceil(menuData.length / itemsPerPage);
    const displayedData = menuData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="overflow-y-scroll w-full h-screen pb-20">
            <div className="w-full p-5 bg-[white] border-b border-[#0093b5]">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5">
                        <h1 className="text-2xl">Menu</h1>
                        <button
                            onClick={() => setCreateModal(true)}
                            className="bg-[#0093b5] text-lg px-5 py-2 rounded-md text-white border-2 border-[#0093b5] duration-500 hover:bg-transparent hover:text-[#0093b5]"
                        >
                            Yaratish
                        </button>
                    </div>
                </div>
            </div>
            {menuData && menuData?.length > 0 ? (
                <div>
                    {/* Table to display menu data */}
                    <div className="overflow-x-auto mt-5 p-6">
                        <table className="min-w-full bg-white border-collapse">
                            <thead className="bg-[#0093b5] text-[white]">
                                <tr className="border-b">
                                    <th className="py-2 px-4 text-left">Rasm</th>
                                    <th className="py-2 px-4 text-left">Turkum</th>
                                    <th className="py-2 px-4 text-left">Raqami</th>
                                    <th className="py-2 px-4 text-left">Name</th>
                                    <th className="py-2 px-4 text-left">Narx</th>
                                    <th className="py-2 px-4 text-left">Chegirma</th>
                                    <th className="py-2 px-4 text-left">Turi</th>
                                    <th className="py-2 px-4 text-left">Yangi</th>
                                    <th className="py-2 px-4 text-left">Info</th>
                                    <th className="py-2 px-4 text-left">Sozlama</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayedData.map((item) => (
                                    <tr key={item.id} className="border-b border-[#0093b5]">
                                        <td className="py-2 px-4">
                                            <img src={item?.image ? CONFIG.API_URL + item?.image : fotoFood} alt={item.name} className="w-[250px] h-[200px] cursor-pointer object-cover border-[1px] border-[black] rounded-[8px]" />
                                        </td>
                                        <td className="py-2 px-4">{item.name}</td>
                                        <td className="py-2 px-4">{item.category.name}</td>
                                        <td className="py-2 px-4">{item.sort}</td>
                                        <td className="py-2 px-4">
                                            {item.price  ? Number(item.price).toLocaleString('ru-RU') : 'N/A'}  uzs
                                        </td>
                                        <td className="py-2 px-4">{item.discount} %</td>
                                        <td className="py-2 px-4">{item.type === true ? "Katta" : 'Oddiy'}</td>
                                        <td className="py-2 px-4">{item.new === true ? "Xa" : 'Yo`q'}</td>
                                        <td className="py-2 px-4">{item.description}</td>
                                        <td className="py-2 px-4">
                                            <div className="flex items-center gap-[10px]">
                                                <button onClick={() => { setDeleteModal(true); setDeleteId(item?.id) }} className="hover:text-[red]">
                                                    <MdDelete fontSize={22} />
                                                </button>
                                                <button onClick={() => { setEditModal(true); setEditData(item) }} className="hover:text-[#5f5f5f]">
                                                    <MdEdit fontSize={22} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-center items-center space-x-4 mt-6">
                        <button
                            className={`py-2 px-4 rounded-md ${currentPage === 1
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-[#4cd4f3] text-white hover:bg-[#0093b5]'
                                }`}
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            &lt;
                        </button>
                        <span className="text-lg">{currentPage} / {totalPages}</span>
                        <button
                            className={`py-2 px-4 rounded-md ${currentPage === totalPages
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-[#4cd4f3] text-white hover:bg-[#0093b5]'
                                }`}
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            &gt;
                        </button>
                    </div>
                </div>
            ) : (
                <div className='flex items-center justify-center h-screen'>
                    Bo`sh
                </div>
            )}

            {/* Modal for creating menu item */}
            <MenuDelete isOpen={DeleteModal} onClose={() => setDeleteModal(false)} id={DeleteId} refresh={getMenu} />
            <MenuCreate isOpen={CreateModal} onClose={() => setCreateModal(false)} refresh={getMenu} />
            <MenuEdit isOpen={EditModal} onClose={() => setEditModal(false)} data={EditData} refresh={getMenu} />
        </div>
    );
}
