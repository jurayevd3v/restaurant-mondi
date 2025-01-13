import { Input, Textarea, Checkbox } from '@material-tailwind/react'; // Добавлен Checkbox
import axios from 'axios';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Select from 'react-select'; // Import react-select
import { useNavigate } from 'react-router-dom';



const MenuCreate = ({ isOpen, onClose, refresh }) => {
    const [name, setName] = useState('');
    const [number, setNumber] = useState('');
    const [photo, setPhoto] = useState('');
    const [price, setPrice] = useState('');
    const [discount, setDiscount] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [type, setType] = useState(false); // Состояние для type
    const [isNew, setIsNew] = useState(false); // Состояние для new
    const navigate = useNavigate()

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhoto(file);
        }
    };

    const CreateMenu = async () => {
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('sort', number);
            formData.append('image', photo);
            formData.append('price', price);
            formData.append('discount', discount);
            formData.append('description', description);
            formData.append('category_id', selectedCategory);
            formData.append('type', type); // Добавлено значение type
            formData.append('new', isNew); // Добавлено значение new

            await axios.post(`/menu`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            onClose();
            setName('');
            setNumber('');
            setPhoto('');
            setPrice('');
            setDiscount('');
            setDescription('');
            setSelectedCategory('');
            setType(false); // Сброс состояния type
            setIsNew(false); // Сброс состояния new
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
                title: 'Error!',
                text: error.response?.data?.message || 'Error',
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


    useEffect(() => {
        const getCategory = async () => {
            try {
                const response = await axios.get('/category', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setCategory(response?.data || []);
                if (response?.data?.length > 0 && !selectedCategory) {
                    setSelectedCategory(response.data[0].id);
                }
            } catch (error) {
                console.error('Ошибка загрузки категорий:', error);
            }
        };

        if (isOpen) {
            getCategory();
        }
    }, [isOpen, selectedCategory]);


    const categoryOptions = category.map((cat) => ({
        value: cat.id,
        label: cat.name,
    }));

    const customStyles = {
        control: (provided) => ({
            ...provided,
            backgroundColor: 'white', // Черный фон для контроллера
            borderColor: 'black', // Черная рамка
            color: 'white', // Белый цвет текста
            '&:hover': {
                borderColor: 'black', // Черная рамка при наведении
            },
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? '#0093b5' : state.isFocused ? 'white' : 'white', // Черный фон для option
            color: 'black', // Белый текст в option
            '&:hover': {
                backgroundColor: '#0093b5', // Темнее фон при hover
            },
        }),
        menu: (provided) => ({
            ...provided,
            backgroundColor: 'white', // Черный фон для выпадающего меню
        }),
        singleValue: (provided) => ({
            ...provided,
            color: 'black', // Белый цвет для выбранного значения
        }),
        placeholder: (provided) => ({
            ...provided,
            color: 'black', // Белый цвет для placeholder
        }),
        indicatorSeparator: () => ({
            display: 'none', // Убираем разделитель между иконкой и полем
        }),
        dropdownIndicator: (provided) => ({
            ...provided,
            color: 'black', // Белая иконка стрелки
            '&:hover': {
                color: 'white', // Белая иконка при hover
            },
        }),
    };


    return (
        <div className={`modal2 ${isOpen ? "open" : ""}`} onClick={onClose}>
            <div onClick={(e) => e.stopPropagation()} className={`Modal2Content ${isOpen ? "open" : ""} overflow-y-auto`}>
                <div className="p-6 pb-12 bg-white rounded-lg mx-auto">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-black">Menu yaratish</h2>
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
                        <div>
                            <Input
                                label="Nom"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                color="gray"
                                type="text"
                                required
                                className="border-black"
                            />
                        </div>

                        <div className="Number__grid flex items-center gap-[10px]">
                            <Input
                                label="Raqam"
                                value={number}
                                onChange={(e) => setNumber(e.target.value)}
                                color="gray"
                                type="number"
                                required
                                className="border-black"
                            />
                            <Input
                                label="Narx"
                                value={price.toLocaleString('ru-RU')}
                                onChange={(e) => {
                                    const rawValue = e.target.value.replace(/\s/g, '');
                                    const numericValue = parseInt(rawValue, 10);
                                    setPrice(isNaN(numericValue) ? 0 : numericValue);
                                }}
                                color="gray"
                                type="text"
                                required
                                className="border-black"
                            />
                            <Input
                                label="Chegirma"
                                value={discount}
                                onChange={(e) => setDiscount(e.target.value)}
                                color="gray"
                                type="number"
                                required
                                className="border-black"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Turkum</label>
                            <Select
                                options={categoryOptions}
                                value={categoryOptions.find(option => option.value === selectedCategory)}
                                onChange={(option) => setSelectedCategory(option?.value)}
                                placeholder="Turkum"
                                isSearchable
                                styles={customStyles}

                            />
                        </div>

                        <div>
                            <Textarea
                                label="Описание"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                color="gray"
                                required
                                className="border-black"
                            />
                        </div>

                        <div className='flex items-center gap-[20px]'>
                            <Checkbox
                                label="Turi"
                                checked={type}
                                onChange={(e) => setType(e.target.checked)}
                            />
                            <Checkbox
                                label="Yangi"
                                checked={isNew}
                                onChange={(e) => setIsNew(e.target.checked)}
                            />
                        </div>

                        <div>
                            <input
                                type="file"
                                id="photoInput"
                                onChange={handlePhotoChange}
                                className="w-full p-3 mt-2 border border-[#0093b5] rounded-lg cursor-pointer bg-[#0093b5] text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end space-x-4">
                        <button
                            onClick={CreateMenu}
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

export default MenuCreate;
