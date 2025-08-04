import {
    Input,
    Textarea,
    Checkbox,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Button,
    Spinner,
} from '@material-tailwind/react';
import axios from 'axios';
import { useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';

const MenuCreate = ({ isOpen, onClose, refresh }) => {
    const { ID } = useParams(); // category_id
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [number, setNumber] = useState('');
    const [photo, setPhoto] = useState('');
    const [price, setPrice] = useState('');
    const [discount, setDiscount] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState(false);
    const [isNew, setIsNew] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) setPhoto(file);
    };

    const CreateMenu = async () => {
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('sort', number);
            formData.append('image', photo);
            formData.append('price', price);
            formData.append('discount', discount);
            formData.append('description', description);
            formData.append('category_id', ID); // from useParams
            formData.append('type', type);
            formData.append('new', isNew);

            await axios.post('/menu', formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            setIsLoading(false);
            onClose();
            setName('');
            setNumber('');
            setPhoto('');
            setPrice('');
            setDiscount('');
            setDescription('');
            setType(false);
            setIsNew(false);
            document.getElementById('photoInput').value = '';
            refresh();

            Swal.fire({
                title: 'Muvaffaqiyatli!',
                icon: 'success',
                position: 'top-end',
                timer: 3000,
                toast: true,
                showConfirmButton: false,
            });
        } catch (error) {
            setIsLoading(false);
            Swal.fire({
                title: 'Error!',
                text: error.response?.data?.message || 'Error',
                icon: 'error',
                position: 'top-end',
                timer: 3000,
                toast: true,
                showConfirmButton: false,
            });
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                navigate('/login');
            }
        }
    };

    return (
        <Dialog open={isOpen} handler={onClose} size="lg">
            <DialogHeader>
                Menu yaratish
            </DialogHeader>

            <DialogBody className="space-y-4">
                <Input label="Nom" value={name} onChange={(e) => setName(e.target.value)} />

                <div className="grid grid-cols-3 gap-4">
                    <Input label="Raqam" value={number} onChange={(e) => setNumber(e.target.value)} type="number" />
                    <Input
                        label="Narx"
                        value={price.toLocaleString('ru-RU')}
                        onChange={(e) => {
                            const rawValue = e.target.value.replace(/\s/g, '');
                            const numericValue = parseInt(rawValue, 10);
                            setPrice(isNaN(numericValue) ? 0 : numericValue);
                        }}
                    />
                    <Input label="Chegirma" value={discount} onChange={(e) => setDiscount(e.target.value)} type="number" />
                </div>

                <Textarea label="Tavsif" value={description} onChange={(e) => setDescription(e.target.value)} />

                <div className="flex items-center gap-6">
                    <Checkbox label="Turi" checked={type} onChange={(e) => setType(e.target.checked)} />
                    <Checkbox label="Yangi" checked={isNew} onChange={(e) => setIsNew(e.target.checked)} />
                </div>

                <input
                    type="file"
                    id="photoInput"
                    onChange={handlePhotoChange}
                    className="w-full p-3 border border-[#026634] rounded-lg cursor-pointer bg-[#026634] text-white"
                />
            </DialogBody>

            <DialogFooter>
                <Button variant="text" color="red" onClick={onClose} className="mr-2">
                    Bekor qilish
                </Button>
                <Button
                    color="green"
                    onClick={CreateMenu}
                    disabled={isLoading}
                    className="flex items-center gap-2"
                >
                    {isLoading && <Spinner className="h-4 w-4" />}
                    {isLoading ? 'Yaratilmoqda...' : 'Yaratish'}
                </Button>
            </DialogFooter>
        </Dialog>
    );
};

export default MenuCreate;
