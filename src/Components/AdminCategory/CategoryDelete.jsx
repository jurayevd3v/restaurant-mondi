import {
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Button,
    Typography,
} from "@material-tailwind/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function CategoryDelete({ isOpen, onClose, id, refresh }) {
    const navigate = useNavigate();

    const DeleteCategory = async () => {
        try {
            await axios.delete(`category/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            Swal.fire({
                title: "Muvaffaqiyatli!",
                icon: "success",
                position: "top-end",
                timer: 3000,
                timerProgressBar: true,
                showCloseButton: true,
                toast: true,
                showConfirmButton: false,
            });

            onClose();
            refresh();
        } catch (error) {
            Swal.fire({
                title: "Xatolik!",
                text: error.response?.data?.message || "Xatolik yuz berdi.",
                icon: "error",
                position: "top-end",
                timer: 3000,
                timerProgressBar: true,
                showCloseButton: true,
                toast: true,
                showConfirmButton: false,
            });

            if (error.response && error.response.status === 401) {
                localStorage.removeItem("token");
                navigate("/login");
            }
        }
    };

    return (
        <Dialog open={isOpen} handler={onClose} size="xs" className="p-2">
            <DialogHeader className="justify-between items-center pb-[0px]">
                <Typography variant="h6" color="blue-gray">
                    O‘chirishni tasdiqlang
                </Typography>
            </DialogHeader>

            <DialogBody className="text-center pb-[0px]">
                <Typography variant="paragraph" color="gray">
                    Haqiqatan ham ushbu turkumni o‘chirmoqchimisiz?
                </Typography>
            </DialogBody>

            <DialogFooter className="flex justify-end gap-3">
                <Button variant="outlined" color="gray" onClick={onClose}>
                    Bekor qilish
                </Button>
                <Button variant="filled" color="red" onClick={DeleteCategory}>
                    Qabul qilish
                </Button>
            </DialogFooter>
        </Dialog>
    );
}
