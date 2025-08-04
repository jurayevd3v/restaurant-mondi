import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CONFIG from '../utils/Config';
import Swal from 'sweetalert2';
import {
    Typography,
    Card,
    CardBody,
    Button,
    Spinner
} from '@material-tailwind/react';

export default function AdminBg() {
    const [loading, setLoading] = useState(true);
    const [imageUrl, setImageUrl] = useState('');
    const [image, setImage] = useState(null);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const getBg = async () => {
        try {
            const response = await axios.get('/background', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setImageUrl(CONFIG.API_URL + response?.data[0]?.image);
        } catch (error) {
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = async (e) => {
        const selectedImage = e.target.files[0];
        if (selectedImage) {
            setImage(selectedImage);
            const reader = new FileReader();
            reader.onloadend = async () => {
                setImageUrl(reader.result);

                const formData = new FormData();
                formData.append('image', selectedImage);

                try {
                    await axios.post('/background', formData, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                            'Content-Type': 'multipart/form-data',
                        },
                    });

                    Swal.fire({
                        title: 'Muvaffaqiyatli yuklandi!',
                        icon: 'success',
                        position: 'top-end',
                        timer: 3000,
                        timerProgressBar: true,
                        showCloseButton: true,
                        toast: true,
                        showConfirmButton: false,
                    });

                    getBg();
                } catch (error) {
                    Swal.fire({
                        title: 'Xatolik!',
                        text: error.response?.data?.message || 'Xatolik yuz berdi',
                        icon: 'error',
                        position: 'top-end',
                        timer: 3000,
                        timerProgressBar: true,
                        showCloseButton: true,
                        toast: true,
                        showConfirmButton: false,
                    });

                    if (error.response?.status === 401) {
                        localStorage.removeItem('token');
                        navigate('/login');
                    }
                }
            };
            reader.readAsDataURL(selectedImage);
        }
    };

    useEffect(() => {
        getBg();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen w-full">
                <Spinner className="h-12 w-12 text-green-700" />
            </div>
        );
    }

    return (
        <div className="min-h-screen p-3">
            <Card className=" mx-auto">
                <CardBody>
                    <Typography variant="h4" color="blue-gray" className="mb-4">
                        Fon rasmini o‘zgartirish
                    </Typography>

                    <div className="flex flex-col gap-6">
                        <Button
                            variant="filled"
                            className="w-full bg-[#0093B5] hover:bg-[#007A99] text-white"
                            onClick={() => fileInputRef.current.click()}
                        >
                            Rasmni tanlash
                        </Button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={handleImageChange}
                        />

                        {imageUrl && (
                            <div className="flex justify-center">
                                <img
                                    src={imageUrl}
                                    alt="Fon rasmi"
                                    className="rounded-lg shadow-md max-h-[500px] object-contain"
                                />
                            </div>
                        )}
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}
