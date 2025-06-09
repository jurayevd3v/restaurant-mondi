import { Input } from '@material-tailwind/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const EmployeeEdit = ({ isOpen, onClose, refresh, data }) => {
    const [fullName, setFullName] = useState('');
    const [birthday, setBirthday] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [role, setRole] = useState('ofitsiant');

    const navigate = useNavigate();

    useEffect(() => {
        if (data) {
            setFullName(data.full_name || '');
            setBirthday(data.birthday || '');
            setPhoneNumber(data.phone_number || '');
            setRole(data.role || 'ofitsiant');
        }
    }, [data]);

    const handleUpdate = async () => {
        try {
            const payload = {
                full_name: fullName,
                birthday,
                phone_number: phoneNumber,
                role,
            };

            await axios.put(`/employee/${data?.id}`, payload, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            onClose();
            refresh();

            Swal.fire({
                title: 'Muvaffaqiyatli yangilandi!',
                icon: 'success',
                position: 'top-end',
                timer: 3000,
                toast: true,
                showConfirmButton: false,
            });
        } catch (error) {
            Swal.fire({
                title: 'Xatolik!',
                text: error.response?.data?.message || 'Xatolik yuz berdi',
                icon: 'error',
                position: 'top-end',
                timer: 3000,
                toast: true,
                showConfirmButton: false,
            });

            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                navigate('/wlogin');
            }
        }
    };

    return (
        <div className={`modal2 ${isOpen ? "open" : ""}`} onClick={onClose}>
            <div onClick={(e) => e.stopPropagation()} className={`Modal2Content ${isOpen ? "open" : ""}`}>
                <div className="p-6 pb-12 bg-white rounded-lg mx-auto">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-black">Xodimni tahrirlash</h2>
                        <button onClick={onClose} className="text-gray-600">
                            <svg className="w-6 h-6" viewBox="0 0 14 14">
                                <path
                                    fill="currentColor"
                                    d="M1.707.293A1 1 0 0 0 .293 1.707L5.586 7 .293 12.293a1 1 0 1 0 1.414 1.414L7 8.414l5.293 5.293a1 1 0 0 0 1.414-1.414L8.414 7l5.293-5.293A1 1 0 0 0 12.293.293L7 5.586z"
                                />
                            </svg>
                        </button>
                    </div>

                    <div className="space-y-4">
                        <Input
                            label="Ism Familiya"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            color="gray"
                            type="text"
                        />
                        <Input
                            label="Tug‘ilgan sana"
                            value={birthday}
                            onChange={(e) => setBirthday(e.target.value)}
                            color="gray"
                            type="date"
                        />
                        <Input
                            label="Telefon raqam"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            color="gray"
                            type="text"
                        />
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="w-full border border-black rounded-lg p-2"
                            >
                                <option value="ofitsiant">Ofitsiant</option>
                                <option value="admin">Admin</option>
                                <option value="kassir">Kassir</option>
                                <option value="oshpaz">Oshpaz</option>
                                <option value="tarosh">Tarosh</option>
                            </select>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end space-x-4">
                        <button
                            onClick={handleUpdate}
                            className="px-6 py-2 bg-[#0093b5] text-white rounded-lg hover:bg-[#007a96]"
                        >
                            Saqlash
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeEdit;
