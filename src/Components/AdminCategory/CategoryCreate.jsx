import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import {
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Button,
    Input,
    Typography
} from '@material-tailwind/react';
import { useNavigate } from 'react-router-dom';

const CategoryCreate = ({ isOpen, onClose, refresh }) => {
    const [name, setName] = useState('');
    const [number, setNumber] = useState('');
    const [photo, setPhoto] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhoto(file);
        }
    };

    const createCategory = async () => {
        setLoading(true);
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
            });

            onClose();
            setName('');
            setNumber('');
            setPhoto('');
            document.getElementById('photoInput').value = '';
            refresh();

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
                title: 'Xatolik!',
                text: error.response?.data?.message || 'Xatolik yuz berdi.',
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
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} handler={onClose} size="sm" className="overflow-y-auto">
            <DialogHeader className="flex justify-between items-center">
                <Typography variant="h5" color="blue-gray">
                    Turkum yaratish
                </Typography>
                <button onClick={onClose} className="text-gray-600 hover:text-black">
                    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14">
                        <path
                            fill="currentColor"
                            d="M1.707.293A1 1 0 0 0 .293 1.707L5.586 7L.293 12.293a1 1 0 1 0 1.414 1.414L7 8.414l5.293 5.293a1 1 0 0 0 1.414-1.414L8.414 7l5.293-5.293A1 1 0 0 0 12.293.293L7 5.586z"
                        />
                    </svg>
                </button>
            </DialogHeader>

            <DialogBody className="flex flex-col gap-4">
                <Input
                    label="Nom"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    color="gray"
                    required
                />

                <Input
                    label="Tartib raqami"
                    type="number"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    color="gray"
                    required
                />

                <div>
                    <Typography variant="small" color="gray" className="mb-1">
                        Rasm yuklash
                    </Typography>
                    <input
                        type="file"
                        id="photoInput"
                        onChange={handlePhotoChange}
                        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                    />
                </div>
            </DialogBody>

            <DialogFooter className="flex justify-end space-x-3">
                <Button variant="outlined" color="gray" onClick={onClose} disabled={loading}>
                    Bekor qilish
                </Button>
                <Button
                    variant="filled"
                    color="green"
                    onClick={createCategory}
                    disabled={loading}
                >
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <svg
                                className="animate-spin h-4 w-4 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v8H4z"
                                ></path>
                            </svg>
                            Yaratilmoqda...
                        </span>
                    ) : (
                        "Yaratish"
                    )}
                </Button>
            </DialogFooter>
        </Dialog>
    );
};

export default CategoryCreate;
