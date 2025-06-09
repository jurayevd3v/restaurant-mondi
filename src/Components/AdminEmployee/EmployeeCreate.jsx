import { Input, Select, Option } from '@material-tailwind/react';
import axios from 'axios';
import { useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const EmployeeCreate = ({ isOpen, onClose, refresh }) => {
    const [fullName, setFullName] = useState('');
    const [birthday, setBirthday] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [role, setRole] = useState('ofitsiant');

    const navigate = useNavigate();

    const handleCreate = async () => {
        if (!fullName || !phoneNumber) {
            Swal.fire({
                title: 'Xatolik!',
                text: 'Iltimos, to‘liq ism va telefon raqamini kiriting.',
                icon: 'error',
            });
            return;
        }

        try {
            const data = {
                full_name: fullName,
                birthday,
                phone_number: phoneNumber,
                role,
            };

            await axios.post('/employee', data, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            onClose();
            setFullName('');
            setBirthday('');
            setPhoneNumber('');
            setRole('ofitsiant');
            refresh();

            Swal.fire({
                title: 'Yaratildi!',
                icon: 'success',
                timer: 2000,
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
            });
        } catch (error) {
            Swal.fire({
                title: 'Xatolik!',
                text: error.response?.data?.message || 'Xatolik yuz berdi',
                icon: 'error',
            });

            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                navigate('/login');
            }
        }
    };

    return (
        <div className={`modal2 ${isOpen ? 'open' : ''}`} onClick={onClose}>
            <div onClick={(e) => e.stopPropagation()} className={`Modal2Content ${isOpen ? 'open' : ''}`}>
                <div className="p-6 pb-12 bg-white rounded-lg mx-auto">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-black">Yangi Hodim Qo‘shish</h2>
                        <button onClick={onClose} className="text-gray-600">
                            <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14">
                                <path
                                    fill="currentColor"
                                    d="M1.707.293A1 1 0 0 0 .293 1.707L5.586 7L.293 12.293a1 1 0 1 0 1.414 1.414L7 8.414l5.293 5.293a1 1 0 0 0 1.414-1.414L8.414 7l5.293-5.293A1 1 0 0 0 12.293.293L7 5.586z"
                                />
                            </svg>
                        </button>
                    </div>

                    <div className="space-y-4">
                        <Input
                            label="To‘liq ism"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                        />

                        <Input
                            label="Tug‘ilgan sana (ixtiyoriy)"
                            type="date"
                            value={birthday}
                            onChange={(e) => setBirthday(e.target.value)}
                        />

                        <Input
                            label="Telefon raqami"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                        />

                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1">Lavozim</label>
                            <Select
                                label="Lavozimni tanlang"
                                value={role}
                                onChange={(val) => setRole(val)}
                            >
                                <Option value="ofitsiant">Ofitsiant</Option>
                            </Select>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={handleCreate}
                            className="px-6 py-2 bg-[#0093b5] text-white rounded-lg hover:bg-[#007d9f]"
                        >
                            Yaratish
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeCreate;
