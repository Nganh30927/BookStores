import React from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { axiosClient } from '../../library/axiosClient';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
// import required modules
import { Keyboard, Navigation, Pagination, FreeMode, Autoplay } from 'swiper/modules';
import { Button } from '@mui/material';
import { FaHeart } from 'react-icons/fa';
import styles from './books.module.css'
export interface IBooks {
  data: {
    data: {
      id: number;
      name: string;
      author: string;
      title: string;
      quantity: number;
      price: number;
      serialnumber: number;
      description: string;
      discount: number;
      imageURL: string;
      publisherId: number;
      categoryId: number;
      category: {
        id: number;
        name: string;
      };
      publisher: {
        id: number;
        name: string;
      };
    };
  };
}

const GetNewBookCollection = () => {
  const fetchSales = async ( limit = 5) => {
    return axios.get(`http://localhost:9000/books/sales/hotsales?limit=${limit}`);
  };

  // Sử dụng useQuery để fetch data từ API
  const querySales = useQuery({
    queryKey: ['books_sales'],
    queryFn: () => fetchSales(5),
    onSuccess: (data) => {
      //Thành công thì trả lại data
      console.log(data?.data.data);
    },
    onError: (error) => {
      console.log(error);
    },
  });


  return (
    <>
      <Swiper
      slidesPerView={1}
      spaceBetween={10}
      freeMode={true}
      pagination={{
        clickable: true,
      }}
      modules={[Autoplay, FreeMode, Pagination]}
      autoplay={{
        delay: 2000,
        disableOnInteraction: false,
      }}
      className=""
      breakpoints={{
        425: {
          slidesPerView: 2,
          spaceBetween: 0,
        },
        // 640: {
        //   slidesPerView: 1,
        //   spaceBetween: 0,
        // },
        768: {
          slidesPerView: 3,
          spaceBetween: 0,
        },
        1024: {
          slidesPerView: 4,
          spaceBetween: 0,
        },
        1280: {
          slidesPerView: 5,
          spaceBetween: 0,
        },
      }}
      >
        {querySales.data && querySales.data?.data
          ? querySales.data?.data.data.map((book: any) => (
              <SwiperSlide>
                <div className="w-full  px-4 my-4">
                  <div className="block w-full h-full relative bg-white rounded-xl border-2 border-rose-100 overflow-hidden hover:scale-105 ease-in duration-300">
                   <Link to={''} className='cursor-pointer text-black hover:text-red-600'>
                   <img
                      className="block w-full h-72 object-contain rounded-t-xl  pt-2"
                      src={`http://localhost:9000` + `${book.imageURL}`}
                      alt={book.name}
                      data-config-id="auto-img-1-2"
                    />

                    <div className="group block py-4 ms-3" >
                      <h6
                        className="inline-block text-base font-semibold  text-black hover:text-red-600 mb-2 overflow-hidden whitespace-nowrap overflow-ellipsis w-52"
                        data-config-id="auto-txt-9-2"
                      >
                        {book.name}
                      </h6>
                      <div className="flex items-center mb-1">
                        <span className=" text-base font-bold text-red-600 mr-2" data-config-id="auto-txt-10-2">
                        {Number((book.price) * (1 - (book.discount) / 100)).toFixed(0)} đ
                        </span>
                        <del className=" text-sm font-bold text-black" data-config-id="auto-txt-10-2">
                          {book.price} đ
                        </del>
                       
                        <img className="block" src="vendia-assets/images/item-cards/stars-gradient.svg" alt="" data-config-id="auto-img-2-2" />
                      </div>
                    </div>
                   </Link>

                    <div className="absolute top-0 right-0 m-3 inline-block " >
                        <span className=" text-sm text-red-500 font-bold outline outline-1 rounded bg-white p-1" data-config-id="auto-txt-11-2">
                          - {book.discount}%
                        </span>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))
          : null}
      </Swiper>
    </>
  );
};

export default GetNewBookCollection;
