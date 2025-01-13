import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CONFIG from "../../utils/Config";
import ReactLoading from "react-loading";
import foto from "../../img/images (1).jpg";

export default function MenuCard() {
    const { ID } = useParams();
    const [data, setData] = useState([]); // Для хранения всех загруженных данных
    const [loading, setLoading] = useState(false); // Индикатор загрузки
    const [page, setPage] = useState(1); // Текущая страница
    const [hasMore, setHasMore] = useState(true); // Флаг наличия дополнительных данных

    const getMenu = async (currentPage) => {
        try {
            setLoading(true);
            const response = await axios.get(`/category/${ID}/page`, {
                params: { page: currentPage },
            });
            const result = Array.isArray(response?.data?.data?.records)
                ? response?.data?.data?.records
                : [];

            if (result.length > 0) {
                setData((prevData) =>
                    currentPage === 1 ? result : [...prevData, ...result] // Если первая страница, заменяем данные
                );
            } else {
                setHasMore(false); // Если новых данных нет, отключаем загрузку
            }
        } catch (error) {
            console.error("Failed to fetch menu:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleScroll = () => {
        if (
            window.innerHeight + document.documentElement.scrollTop >=
            document.documentElement.offsetHeight - 100 && // Почти конец страницы
            hasMore && // Есть ли еще данные
            !loading // Нет ли текущей загрузки
        ) {
            setPage((prevPage) => prevPage + 1); // Увеличиваем номер страницы
        }
    };

    useEffect(() => {
        getMenu(page); // Загружаем данные для текущей страницы
    }, [page]);

    useEffect(() => {
        // Добавляем обработчик скролла
        window.addEventListener("scroll", handleScroll);
        return () => {
            // Удаляем обработчик при размонтировании
            window.removeEventListener("scroll", handleScroll);
        };
    }, [hasMore, loading]); // Обновляем обработчик только если изменился флаг `hasMore` или `loading`

    if (loading && data.length === 0) {
        return (
            <div className="flex items-center justify-center h-screen w-full">
                <ReactLoading type="spinningBubbles" color="white" height={100} width={100} />
            </div>
        );
    }

    return (
        <div className="Container relative z-20">
            <div className="Menu__Wrapper mt-[50px]">
                {data.length > 0 ? (
                    data.map((i, index) => (
                        <div
                            key={index}
                            className="border-[3px] border-white h-auto cursor-pointer rounded-[20px] text-[white]"
                        >
                            <div className="w-full py-[5px] bg-white text-[#0093b5] rounded-t-[10px] h-[30px] text-center">
                                {i?.new === true && <span>Янгилик</span>}
                            </div>
                            <img
                                src={CONFIG.API_URL + i?.image}
                                alt={foto}
                                className="object-cover rounded-b-[10px]"
                            />
                            <div className="w-full pt-[10px]">
                                <h2 className="text-[30px] font-[800] text-center">
                                    {i?.name}
                                </h2>
                                <div className="w-[80%] h-[3px] bg-[white] mx-auto my-[15px] rounded-3xl"></div>
                                <h2 className="text-[30px] font-[800] text-center mb-[10px]">
                                    {i.price
                                        ? Number(i.price).toLocaleString("ru-RU")
                                        : "N/A"}{" "}
                                    Сум
                                </h2>
                                <div className="w-full py-[5px] bg-[white] text-[#0093b5] rounded-b-[10px] h-[30px] text-center">
                                    <span>
                                        {i?.discount > 0
                                            ? `Скидка ${i?.discount} %`
                                            : ""}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div>
                        <p>Нет данных</p>
                    </div>
                )}
            </div>
            {loading && hasMore && (
                <div className="flex items-center justify-center my-4">
                    <ReactLoading type="spinningBubbles" color="white" height={50} width={50} />
                </div>
            )}
        </div>
    );
}
