import React, { useEffect, useState } from 'react';
import CategoryCreate from '../Components/AdminCategory/CategoryCreate';
import axios from 'axios';
import { NavLink, useNavigate } from 'react-router-dom';
import CONFIG from '../utils/Config';
import CategoryDelete from '../Components/AdminCategory/CategoryDelete';
import CategoryEdit from '../Components/AdminCategory/CategoryEdit';
import ReactLoading from 'react-loading';
import {
    PencilIcon,
    TrashIcon,
    EyeIcon,
} from "@heroicons/react/24/outline";

import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Button,
} from '@material-tailwind/react';

export default function AdminCategory() {
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [createModal, setCreateModal] = useState(false);
    const [DeleteModal, setDeleteModal] = useState(false);
    const [EditModal, setEditModal] = useState(false);
    const [EditData, setEditData] = useState([]);
    const [DeleteId, setDeleteId] = useState(null);
    const [data, setData] = useState([]);
    const navigate = useNavigate();

    const fotoFood = 'https://i.pinimg.com/originals/0e/ed/c9/0eedc9e9a5104635d84d3b06b3e162b5.jpg';

    const getCategory = async () => {
        try {
            const response = await axios.get('/category', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setData(response?.data);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('token');
                navigate('login');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getCategory();
    }, []);

    const itemsPerPage = 6;
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const displayedData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen w-full">
                <ReactLoading type="spinningBubbles" color="#000" height={100} width={100} />
            </div>
        );
    }

    return (
        <div className="overflow-y-auto w-full min-h-screen py-[10px] pb-[40px] px-[10px] ">
            <div className="bg-white p-[15px] fixed top-[10px] w-[78%] z-20 shadow-2xl mb-6 rounded-[10px] flex justify-between items-center">
                <Typography variant="h4" className="text-black">
                    Turkumlar
                </Typography>
                <Button
                    className=" bg-[#0093B5] hover:bg-[#007A99] text-white"
                    onClick={() => setCreateModal(true)}>
                    Yaratish
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 mt-[80px]">
                {displayedData.map((row) => (
                    <Card key={row.id} className="shadow-md">
                        <CardHeader floated={false} className="h-56">
                            <img
                                src={row?.image ? CONFIG.API_URL + row?.image : fotoFood}
                                alt={row.name}
                                className="h-full w-full object-cover"
                            />
                        </CardHeader>
                        <CardBody className='pb-[5px]'>
                            <Typography variant="h6" color="blue-gray" className="mb-2">
                                {row.name}
                            </Typography>
                            <Typography color="gray">Tartib raqami: {row.sort}</Typography>

                            {/* Добавлено отображение даты */}
                            <Typography color="gray">
                                Sana: {row.date ? new Date(row.date).toLocaleDateString('uz-UZ') : 'Sana yo‘q'}
                            </Typography>
                        </CardBody>
                        <CardFooter className="flex justify-between pt-[10px]">
                            <Button
                                size="sm"
                                color="red"
                                onClick={() => {
                                    setDeleteModal(true);
                                    setDeleteId(row?.id);
                                }}
                                className="flex items-center gap-1"
                            >
                                <TrashIcon className="h-4 w-4" />
                                O'chirish
                            </Button>
                            <Button
                                size="sm"
                                color="blue-gray"
                                onClick={() => {
                                    setEditModal(true);
                                    setEditData(row);
                                }}
                                className="flex items-center gap-1"
                            >
                                <PencilIcon className="h-4 w-4" />
                                Tahrirlash
                            </Button>
                            <NavLink to={`/admin/menu/${row?.id}`}>
                                <Button
                                    size="sm"
                                    color="green"
                                    className="flex items-center gap-1"
                                >
                                    <EyeIcon className="h-4 w-4" />
                                    Ko‘rish
                                </Button>
                            </NavLink>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            <div className="flex justify-center items-center mt-8 space-x-4">
                <Button
                    size="sm"
                    variant="outlined"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                >
                    Oldingi
                </Button>
                <Typography className="text-lg">{currentPage} / {totalPages}</Typography>
                <Button
                    size="sm"
                    variant="outlined"
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                >
                    Keyingi
                </Button>
            </div>

            <CategoryEdit isOpen={EditModal} onClose={() => setEditModal(false)} data={EditData} refresh={getCategory} />
            <CategoryCreate isOpen={createModal} refresh={getCategory} onClose={() => setCreateModal(false)} />
            <CategoryDelete isOpen={DeleteModal} onClose={() => setDeleteModal(false)} id={DeleteId} refresh={getCategory} />
        </div>
    );
}
