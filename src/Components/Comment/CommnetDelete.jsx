import React, { useState } from "react";
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
} from "@material-tailwind/react";
import Swal from 'sweetalert2';

import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CommentDelete({ id, refresh }) {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(!open);
    const navigate = useNavigate();

    const handleDelete = async () => {
        try {
            const ressponse = await axios.delete(`comments/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })
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
            handleOpen();
            refresh();
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: error.response?.data?.message || 'Error.',
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

    return (
        <>
            {/* Trigger Button */}
            <Button
                color="red"
                onClick={handleOpen}
                className="text-white font-medium w-[100px] mt-[10px] px-[20px] py-[10px]"
            >
                O‘chirish
            </Button>

            {/* Modal */}
            <Dialog open={open} handler={handleOpen}>
                <DialogHeader>Diqqat!</DialogHeader>
                <DialogBody divider>
                    Siz rostdan ham ushbu kommentariyani o‘chirib tashlamoqchimisiz?
                </DialogBody>
                <DialogFooter>
                    <Button
                        variant="text"
                        color="gray"
                        onClick={handleOpen}
                        className="mr-2"
                    >
                        <span>Bekor qilish</span>
                    </Button>
                    <Button variant="filled" color="red" onClick={handleDelete}>
                        <span>Ha, o‘chirish</span>
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
}
