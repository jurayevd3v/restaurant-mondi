import React, { useEffect, useState } from 'react';
import CategoryCreate from '../Components/AdminCategory/CategoryCreate';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CONFIG from '../utils/Config';
import CategoryDelete from '../Components/AdminCategory/CategoryDelete';
import CategoryEdit from '../Components/AdminCategory/CategoryEdit';
import ReactLoading from 'react-loading';

export default function AdminCategory() {
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1);
    const [createModal, setCreateModal] = useState(false)
    const [DeleteModal, setDeleteModal] = useState(false)
    const [EditModal, setEditModal] = useState(false)
    const [EditData, setEditData] = useState([])
    const [DeleteId, setDeleteId] = useState(null)
    const [data, setData] = useState([])
    const navigate = useNavigate()

    const fotoFood = 'https://i.pinimg.com/originals/0e/ed/c9/0eedc9e9a5104635d84d3b06b3e162b5.jpg'
    const getCategory = async () => {
        try {
            const response = await axios.get('/category', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })
            setData(response?.data)
        } catch (error) {
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('token');
                navigate('login')
            }
        }finally{
            setLoading(false)
        }
    }

    useEffect(() => {
        getCategory()
    }, [])
    const itemsPerPage = 5;
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const displayedData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);


    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    
    if (    loading) {
        return (
            <div className='flex items-center justify-center h-screen w-full'>
                <ReactLoading type="spinningBubbles" color="#000" height={100} width={100} />
            </div>
        );
    }



    return (
        <div className="overflow-y-scroll w-full h-screen pb-20">
            <div className="w-full p-5 bg-[white] border-[#0093b5] border-b">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5">
                        <h1 className="text-2xl">Turkum</h1>
                        <button onClick={() => setCreateModal(true)} className="bg-[#0093b5] text-lg px-5 py-2 rounded-md border-2 text-white border-[#0093b5] duration-500 hover:bg-transparent hover:text-[#0093b5]">
                            Yaratish
                        </button>
                    </div>
                </div>
            </div>

            {data && data?.length > 0 ? (
                <div className="p-6">
                    <table className="min-w-full table-auto">
                        <thead className="bg-[#0093b5] text-[white]">
                            <tr>
                                <th className="px-4 py-2 text-left">Photo</th>
                                <th className="px-4 py-2 text-left">Name</th>
                                <th className="px-4 py-2 text-left">Number</th>
                                <th className="px-4 py-2 text-left">Settings</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayedData.map((row) => (
                                <tr key={row.id} className="border-b border-[#0093b5]">
                                    <td className="px-4 py-2">
                                        <img src={row?.image ? CONFIG.API_URL + row?.image : fotoFood} alt={row.name} className="w-[300px] h-[200px] object-cover border-[1px] border-[black] rounded-[8px]" />
                                    </td>
                                    <td className="px-4 py-2">{row.name}</td>
                                    <td className="px-4 py-2">{row.sort}</td>
                                    <td className="px-4 py-2">
                                        <div className='flex items-center gap-[10px]'>
                                            <button onClick={() => { setDeleteModal(true); setDeleteId(row?.id) }} className='text-[25px] hover:text-[red] duration-500'>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6z"></path></svg>
                                            </button>
                                            <button onClick={() => { setEditModal(true); setEditData(row) }} className='text-[25px] hover:text-[#828282] duration-500'>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M20.71 7.04c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.37-.39-1.02-.39-1.41 0l-1.84 1.83l3.75 3.75M3 17.25V21h3.75L17.81 9.93l-3.75-3.75z"></path></svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table><div className="flex justify-center items-center space-x-4 mt-6">
                        <button
                            className={`py-2 px-4 rounded-md ${currentPage === 1
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-[#4cd4f3] text-white hover:bg-[#0093b5]'
                                }`}
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 1024 1024">
                                <path
                                    fill="currentColor"
                                    d="M724 218.3V141c0-6.7-7.7-10.4-12.9-6.3L260.3 486.8a31.86 31.86 0 0 0 0 50.3l450.8 352.1c5.3 4.1 12.9.4 12.9-6.3v-77.3c0-4.9-2.3-9.6-6.1-12.6l-360-281l360-281.1c3.8-3 6.1-7.7 6.1-12.6"
                                ></path>
                            </svg>
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
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 1024 1024">
                                <path
                                    fill="currentColor"
                                    d="M765.7 486.8L314.9 134.7A7.97 7.97 0 0 0 302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1l-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 0 0 0-50.4"
                                ></path>
                            </svg>
                        </button>
                    </div>

                </div>
            ) : (
                <div className='flex items-center justify-center h-screen'>
                    Bo`sh
                </div>
            )}

            <CategoryEdit isOpen={EditModal} onClose={() => setEditModal(false)} data={EditData} refresh={getCategory} />
            <CategoryCreate isOpen={createModal} refresh={getCategory} onClose={() => setCreateModal(false)} />
            <CategoryDelete isOpen={DeleteModal} onClose={() => setDeleteModal(false)} id={DeleteId} refresh={getCategory} />
        </div>
    );
}
