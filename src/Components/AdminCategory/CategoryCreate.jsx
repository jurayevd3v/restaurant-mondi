// CategoryCreate.js
import axios from 'axios';
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import {  Input } from '@material-tailwind/react';
import { useNavigate } from 'react-router-dom';



const CategoryCreate = ({ isOpen, onClose, refresh }) => {
    const [name, setName] = useState('');
    const [number, setNumber] = useState('');
    const [photo, setPhoto] = useState('');
    const navigate = useNavigate()

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhoto(file);
        }
    };

    const createCategory = async () => {
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('sort', number);
            formData.append('image', photo);
            await axios.post(`/category`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data',
                },
            })
            onClose()
            setName('')
            setNumber('')
            setPhoto('');  // Сбрасываем состояние фото
            document.getElementById('photoInput').value = ''; // Очищаем input file
            refresh()
            Swal.fire({
                title: 'Muvaffaqiyatli!',
                icon: 'success',
                position: 'top-end',
                timer: 3000,
                timerProgressBar: true,
                showCloseButton: true,
                toast: true,
                showConfirmButton: false,
            });
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: error.response?.data?.message || 'Error.',
                icon: 'error',
                position: 'top-end',
                timer: 3000,
                timerProgressBar: true,
                showCloseButton: true,
                toast: true,
                showConfirmButton: false,
            });
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('token');
                navigate('/login')
            }
        }
    }

    return (
        <div className={`modal2 ${isOpen ? "open" : ""}`} onClick={onClose}>
            <div onClick={(e) => e.stopPropagation()} className={`Modal2Content ${isOpen ? "open" : ""} overflow-y-auto`}>
                <div className="p-6 pb-12 bg-white rounded-lg   mx-auto">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-black">Turkum yaratish</h2>
                        <button onClick={onClose} className="text-gray-600">
                            <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14">
                                <path fill="currentColor" d="M1.707.293A1 1 0 0 0 .293 1.707L5.586 7L.293 12.293a1 1 0 1 0 1.414 1.414L7 8.414l5.293 5.293a1 1 0 0 0 1.414-1.414L8.414 7l5.293-5.293A1 1 0 0 0 12.293.293L7 5.586z" />
                            </svg>
                        </button>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <Input
                                label="Nom"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                color="gray"  // Changed to gray for a neutral look
                                type="text"
                                required
                                className="border-black"  // Black border color
                            />

                        </div>

                        <div>
                            <Input
                                label="Raqam"
                                value={number}
                                onChange={(e) => setNumber(e.target.value)}
                                color="gray"  // Changed to gray for a neutral look
                                type="number"
                                required
                                className="border-black"  // Black border color
                            />
                        </div>

                        <div>
                            <input
                                type="file"
                                id='photoInput'
                                onChange={handlePhotoChange}
                                className="w-full p-3 mt-2 border border-[#0093b5] rounded-lg cursor-pointer bg-[#0093b5] text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end space-x-4">
                        <button
                            onClick={createCategory}
                            className="px-6 py-2 bg-[#0093b5] duration-500 text-white rounded-lg hover:bg-[#0093b5] focus:outline-none"
                        >
                            Yaratish
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryCreate;
