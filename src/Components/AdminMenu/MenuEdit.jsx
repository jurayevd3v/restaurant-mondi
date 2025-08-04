import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Textarea,
  Checkbox,
  Button,
  Spinner,
} from '@material-tailwind/react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import Swal from 'sweetalert2';
import axios from 'axios';

const MenuEdit = ({ isOpen, onClose, refresh, data }) => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [photo, setPhoto] = useState('');
  const [fileName, setFileName] = useState('');
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [type, setType] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (data) {
      setName(data?.name || '');
      setNumber(Number(data?.sort) || '');
      setPrice(data?.price || '');
      setDiscount(data?.discount || '');
      setDescription(data?.description || '');
      setType(data?.type || false);
      setIsNew(data?.new || false);
      setFileName(data?.image || '');
      setPhoto(data?.image || '');
      const selected = category.find((cat) => cat.id === data?.category_id);
      setSelectedCategory(selected ? { value: selected.id, label: selected.name } : null);
    }
  }, [data, category]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('/category', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setCategory(res.data || []);
      } catch (err) {
        console.error('Ошибка загрузки категорий', err);
      }
    };

    if (isOpen) fetchCategories();
  }, [isOpen]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setFileName(file.name);
    }
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('sort', number);
      formData.append('image', photo);
      formData.append('price', price);
      formData.append('discount', discount);
      formData.append('description', description);
      formData.append('category_id', selectedCategory?.value);
      formData.append('type', type);
      formData.append('new', isNew);

      await axios.put(`/menu/${data?.id}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setIsLoading(false);
      refresh();
      onClose();

      Swal.fire({
        title: 'Muvaffaqiyatli!',
        icon: 'success',
        timer: 2000,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
      });
    } catch (err) {
      setIsLoading(false);
      Swal.fire({
        title: 'Xatolik!',
        text: err?.response?.data?.message || 'Server xatosi',
        icon: 'error',
        toast: true,
        timer: 3000,
        position: 'top-end',
        showConfirmButton: false,
      });

      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/wlogin');
      }
    }
  };

  const customStyles = {
    control: (base) => ({
      ...base,
      borderColor: '#ccc',
      boxShadow: 'none',
      '&:hover': { borderColor: '#aaa' },
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? '#026634' : state.isFocused ? '#f0f0f0' : '#fff',
      color: '#000',
    }),
    singleValue: (base) => ({ ...base, color: '#000' }),
  };

  return (
    <Dialog open={isOpen} handler={onClose} size="lg">
      <DialogHeader>Menu O'zgartirish</DialogHeader>
      <DialogBody className="space-y-6">
        <Input label="Nomi" value={name} onChange={(e) => setName(e.target.value)} />

        <div className="grid grid-cols-3 gap-4">
          <Input
            label="Raqam"
            type="number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
          />
          <Input
            label="Narxi"
            type="text"
            value={price.toLocaleString('ru-RU')}
            onChange={(e) => {
              const val = parseInt(e.target.value.replace(/\s/g, ''), 10);
              setPrice(isNaN(val) ? '' : val);
            }}
          />
          <Input
            label="Chegirma"
            type="number"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Turkum</label>
          <Select
            options={category.map((c) => ({ value: c.id, label: c.name }))}
            value={selectedCategory}
            onChange={setSelectedCategory}
            styles={customStyles}
            placeholder="Turkumni tanlang"
          />
        </div>

        <Textarea
          label="Tavsif"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="flex gap-6">
          <Checkbox label="Turi" checked={type} onChange={(e) => setType(e.target.checked)} />
          <Checkbox label="Yangi" checked={isNew} onChange={(e) => setIsNew(e.target.checked)} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Rasm</label>
          <input type="file" id="photo-input" onChange={handlePhotoChange} className="hidden" />
          <label
            htmlFor="photo-input"
            className="block w-full p-3 border border-[#026634] rounded-lg bg-[#026634] text-white text-center cursor-pointer"
          >
            {fileName ? `Tanlangan: ${fileName}` : 'Rasm tanlang'}
          </label>
        </div>
      </DialogBody>
      <DialogFooter>
        <Button variant="text" color="red" onClick={onClose} className="mr-2">
          Bekor qilish
        </Button>
        <Button
          color="green"
          onClick={handleUpdate}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          {isLoading && <Spinner className="h-4 w-4" />}
          {isLoading ? 'Saqlanmoqda...' : 'Saqlash'}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default MenuEdit;
