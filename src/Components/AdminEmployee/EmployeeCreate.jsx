import {
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Input,
    Select,
    Option,
    Button,
    Spinner,
    Typography,
} from "@material-tailwind/react";
import axios from "axios";
import { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const EmployeeCreate = ({ isOpen, onClose, refresh }) => {
    const [fullName, setFullName] = useState("");
    const [birthday, setBirthday] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [role, setRole] = useState("ofitsiant");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleCreate = async () => {
        if (!fullName || !phoneNumber) {
            Swal.fire({
                title: "Xatolik!",
                text: "Iltimos, to‘liq ism va telefon raqamini kiriting.",
                icon: "error",
            });
            return;
        }

        try {
            setLoading(true);

            const data = {
                full_name: fullName,
                birthday,
                phone_number: phoneNumber,
                role,
            };

            await axios.post("/employee", data, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            onClose();
            setFullName("");
            setBirthday("");
            setPhoneNumber("");
            setRole("ofitsiant");
            refresh();

            Swal.fire({
                title: "Yaratildi!",
                icon: "success",
                timer: 2000,
                toast: true,
                position: "top-end",
                showConfirmButton: false,
            });
        } catch (error) {
            Swal.fire({
                title: "Xatolik!",
                text: error.response?.data?.message || "Xatolik yuz berdi",
                icon: "error",
            });

            if (error.response?.status === 401) {
                localStorage.removeItem("token");
                navigate("/login");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} handler={onClose} size="sm">
            <DialogHeader className="justify-between">
                <Typography variant="h5" color="blue-gray">
                    Yangi Hodim Qo‘shish
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

            <DialogBody className="space-y-4">
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
            </DialogBody>

            <DialogFooter>
                <Button variant="text" color="gray" onClick={onClose} className="mr-2">
                    Bekor qilish
                </Button>
                <Button
                    onClick={handleCreate}
                    className="bg-green-700 text-white hover:bg-green-600 flex items-center gap-2"
                    disabled={loading}
                >
                    {loading && <Spinner className="h-4 w-4" />}
                    Yaratish
                </Button>
            </DialogFooter>
        </Dialog>
    );
};

export default EmployeeCreate;
