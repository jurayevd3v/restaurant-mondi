import {
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Input,
    Button,
    Typography,
} from "@material-tailwind/react";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const EmployeeEdit = ({ isOpen, onClose, refresh, data }) => {
    const [fullName, setFullName] = useState("");
    const [birthday, setBirthday] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const role = "ofitsiant"; // по умолчанию (не отображается)

    const navigate = useNavigate();

    useEffect(() => {
        if (data) {
            setFullName(data.full_name || "");
            setBirthday(data.birthday || "");
            setPhoneNumber(data.phone_number || "");
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
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            onClose();
            refresh();

            Swal.fire({
                title: "Muvaffaqiyatli yangilandi!",
                icon: "success",
                position: "top-end",
                timer: 3000,
                toast: true,
                showConfirmButton: false,
            });
        } catch (error) {
            Swal.fire({
                title: "Xatolik!",
                text: error.response?.data?.message || "Xatolik yuz berdi",
                icon: "error",
                position: "top-end",
                timer: 3000,
                toast: true,
                showConfirmButton: false,
            });

            if (error.response?.status === 401) {
                localStorage.removeItem("token");
                navigate("/wlogin");
            }
        }
    };

    return (
        <Dialog open={isOpen} handler={onClose} size="sm" className="rounded-lg">
            <DialogHeader className="justify-between">
                <Typography variant="h5" color="blue-gray">
                    Xodimni Tahrirlash
                </Typography>
                <Button
                    variant="text"
                    color="gray"
                    onClick={onClose}
                    className="rounded-full"
                >
                    ✕
                </Button>
            </DialogHeader>

            <DialogBody className="flex flex-col gap-4">
                <Input
                    label="Ism Familiya"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                />
                <Input
                    label="Tug‘ilgan sana"
                    type="date"
                    value={birthday}
                    onChange={(e) => setBirthday(e.target.value)}
                />
                <Input
                    label="Telefon raqam"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                />
                {/* Роль скрыта, но всегда ofitsiant */}
            </DialogBody>

            <DialogFooter className="justify-end">
                <Button
                    onClick={handleUpdate}
                    color="green"
                    className="rounded-md px-6 py-2"
                >
                    Saqlash
                </Button>
            </DialogFooter>
        </Dialog>
    );
};

export default EmployeeEdit;
