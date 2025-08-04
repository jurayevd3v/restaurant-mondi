import axios from 'axios';
import { useEffect, useState } from 'react';
import logo from '../img/logo.png';
import CONFIG from '../utils/Config';
import { NavLink } from 'react-router-dom';
import MenuCard from '../Components/Menu/MenuCard';

export default function Menu() {
    const [bg, setBg] = useState('');

    const getBg = async () => {
        try {
            const response = await axios.get(`/background`);
            setBg(response?.data[0]?.image);
        } catch (error) {
            console.error('Failed to fetch background:', error);
        }
    };

    useEffect(() => {
        getBg();
    }, [])

    const backgroundStyle = bg ? { backgroundImage: `url(${CONFIG.API_URL + bg})` } : {};

    return (
        <div className="pb-[50px] relative min-h-[1000px] h-[100%] bg-cover bg-center bg-no-repeat" style={backgroundStyle}>
            <div className='absolute  z-10 inset-0 bg-[#00000033]'>

            </div>

            <div className="Header relative z-20 flex items-center justify-center bg-white p-[20px] rounded-b-[30px]">
                <img className='sm:w-[200px] w-[100px]' src={logo} alt="Logo" />
            </div>
            <MenuCard />
        </div >
    );
}
