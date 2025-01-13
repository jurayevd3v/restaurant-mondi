import React from 'react';
import logo from '../img/logo.png'
import { NavLink, useLocation } from 'react-router-dom';
const Sidebar = () => {

    const locatiton = useLocation()

    const Category = locatiton.pathname === '/admin/category'
    const Menu = locatiton.pathname === '/admin/menu'
    const Bg = locatiton.pathname === '/admin/bg'

    return (
        <div
            class="relative flex h-screen border-r-[2px] border-[#0093b5] w-full max-w-[20rem] flex-col  bg-[white] bg-clip-border p-4 text-gray-700 shadow-xl shadow-blue-gray-900/5">
            <div class="p-4 mb-2">
                <img src={logo} alt="" />
            </div>
            <div className='w-full bg-[white] h-[1px]'>

            </div>
            <nav class="flex min-w-[240px] flex-col gap-1 p-2 font-sans text-base font-normal text-black text-[22px]">
                <NavLink to={'admin/menu'}>
                    <div role="button"
                        class={`flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900 ${Menu ? 'bg-blue-100' : ''}`}>
                        <div class="grid mr-4 place-items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M3 2h2v20H3zm16 0H6v20h13c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2m-1 10H9v-2h9zm0-4H9V6h9z"></path></svg>
                        </div>
                        Menu
                    </div>
                </NavLink>
                <NavLink to={'/admin/category'}>
                    <div role="button"
                        class={`flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900 ${Category ? 'bg-blue-100' : ''}`}>
                        <div class={`grid mr-4 place-items-center `}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M4 11h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1m10 0h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1M4 21h6a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1m13 0c2.206 0 4-1.794 4-4s-1.794-4-4-4s-4 1.794-4 4s1.794 4 4 4"></path></svg>
                        </div>
                        Turkum
                    </div>
                </NavLink>
                <NavLink to={'/admin/bg'}>
                <div role="button"
                        class={`flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900 ${Bg ? 'bg-blue-100' : ''}`}>
                    <div class="grid mr-4 place-items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none"><path d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z"></path><path fill="currentColor" d="M21.129 4.012a1.5 1.5 0 0 1-.141 2.117l-16 14a1.5 1.5 0 0 1-1.976-2.258l16-14a1.5 1.5 0 0 1 2.117.141m0 6.375a1.5 1.5 0 0 1-.141 2.117l-8.715 7.625a1.5 1.5 0 0 1-1.975-2.258l8.714-7.625a1.5 1.5 0 0 1 2.117.141m0 5.875a1.5 1.5 0 0 1-.03 2.01l-.111.107l-2 1.75a1.5 1.5 0 0 1-2.086-2.151l.11-.107l2-1.75a1.5 1.5 0 0 1 2.117.141m-7.286-12.25a1.5 1.5 0 0 1-.14 2.117l-8.715 7.625a1.5 1.5 0 0 1-1.976-2.258l8.715-7.625a1.5 1.5 0 0 1 2.116.141m-6.286 0a1.5 1.5 0 0 1-.03 2.01l-.11.107l-2.43 2.125a1.5 1.5 0 0 1-2.085-2.151l.11-.107l2.429-2.125a1.5 1.5 0 0 1 2.116.141"></path></g></svg>
                    </div>
                    Fon
                </div>
                </NavLink>
            </nav>
        </div>
    );
};

export default Sidebar;
