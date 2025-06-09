import { Outlet } from "react-router-dom";
import Sidebar from "../Components/Sidebar";

export default function AdminLayout(){
    return(
        <div className="flex w-[100%] overflow-hidden">
            <Sidebar/>
            <Outlet/>
        </div>
    )
}