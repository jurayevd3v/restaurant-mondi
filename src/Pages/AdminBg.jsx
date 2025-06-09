import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CONFIG from '../utils/Config';
import ReactLoading from 'react-loading';
import Swal from 'sweetalert2';

export default function AdminBg() {
    const [loading, setLoading] = useState(true);
    const [imageUrl, setImageUrl] = useState(''); // Store the image URL for preview
    const [image, setImage] = useState(null); // Store the selected image
    const navigate = useNavigate();

    // Fetch background image data on component mount
    const getBg = async () => {
        try {
            const response = await axios.get('/background', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setImageUrl(CONFIG.API_URL + response?.data[0]?.image); // Set the image URL for preview
        } catch (error) {
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('token');
                navigate('login');
            }
        } finally {
            setLoading(false);
        }
    };

    // Handle image selection and trigger POST request
    const handleImageChange = async (e) => {
        const selectedImage = e.target.files[0];
        if (selectedImage) {
            setImage(selectedImage);
            const reader = new FileReader();
            reader.onloadend = async () => {
                setImageUrl(reader.result); // Set the image preview after selection

                // Create form data and append the selected image
                const formData = new FormData();
                formData.append('image', selectedImage);

                // Perform POST request to upload the image
                try {
                    await axios.post('/background', formData, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                            'Content-Type': 'multipart/form-data', // Set content type for image upload
                        },
                    });

                    // Display success message
                    Swal.fire({
                        title: 'Image Uploaded!',
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
                    // Handle errors
                    Swal.fire({
                        title: 'Error!',
                        text: error.response?.data?.message || 'Error uploading image',
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
            };
            reader.readAsDataURL(selectedImage);
        }
    };

    useEffect(() => {
        getBg(); // Fetch the background on component mount
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen w-full">
                <ReactLoading type="spinningBubbles" color="#000" height={100} width={100} />
            </div>
        );
    }

    return (
        <div className="overflow-y-scroll w-full h-screen pb-20">
            <div className="w-full p-5 bg-[#    ]">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5">
                        <h1 className="text-2xl">Fon</h1>
                    </div>
                </div>
            </div>
            <div className="w-full p-5">
                {imageUrl && (
                    <div className="flex items-center justify-center mb-4">
                        <input
                            type="file"
                            id="photoInput"
                            className="w-full p-3 mt-2 border border-gray-300 rounded-lg cursor-pointer bg-[#0093b5] text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={handleImageChange} // Trigger the POST request after selecting an image
                        />
                    </div>
                )}
                {imageUrl && (
                    <div className="relative flex items-center justify-center">
                        <img
                            src={imageUrl}  // Display the fetched or selected background image
                            alt="Background"
                            className="w-full max-w-[800px] h-auto rounded-md"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
