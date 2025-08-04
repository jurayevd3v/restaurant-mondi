import { Outlet } from "react-router-dom";
import Sidebar from "../Components/Sidebar";

export default function AdminLayout() {
    return (
        <div className="flex w-[100%] min-h-screen overflow-hidden bg-[#EAE9E9]">
            <Sidebar />
            <div className="ml-[310px] w-full">
                <Outlet />
            </div>
        </div>
    )
}