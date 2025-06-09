import axios from "axios";
import CONFIG from "../../utils/Config";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import ReactLoading from 'react-loading';


export default function CategoryCard() {
    const [categoryData, setCategoryData] = useState([])
    const [loading, setloading] = useState(true)
    const getCategory = async () => {
        try {
            const response = await axios.get('/category')
            setCategoryData(response?.data)
        } catch (error) {

        }finally{
            setloading(false)
        }
    }

    useEffect(() => {
        getCategory()
    }, [])



    if (loading) {
        return (
            <div className='flex items-center justify-center h-screen w-full'>
                <ReactLoading type="spinningBubbles" color="white" height={100} width={100} />
            </div>
        );
    }

    return (
        <div className="Category__Wrapper mt-[50px]">
            {categoryData?.map((i, index) => (
                <NavLink to={`/category/${i?.id}`}>
                    <div key={index} className="Category__Card h-[310px]  relative border-[4px] border-[white] rounded-[30px] bg-cover bg-no-repeat bg-center" style={{ backgroundImage: `url(${CONFIG.API_URL + i?.image})` }} >
                        <div className="flex items-center justify-center h-[100%]">
                            <h2 className="text-[30px] relative z-20 text-[white]">
                                {i?.name}
                            </h2>
                        </div>
                        <div className="absolute z-10 inset-0 bg-black/60 hover:bg-black/70 cursor-pointer rounded-[25px]"></div>
                    </div>
                </NavLink>
            ))}
        </div>
    )
}