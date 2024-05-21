import React, { useState } from 'react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import styles from './ProductDetail.module.css';
import axios from 'axios';
import config from '../../constants/config';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet';
import { useCartStore } from '../../hooks/useCartStore';
import { Link, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export interface IBooks {
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
    id: number,
    name: string
  },
  publisher: {
    id: number,
    name: string,
  }
}

const BooksDetailsPage = () => {

  // const { addItem, items, itemCount, increaseQuantity, decreaseQuantity } = useCartStore();
  /*Tac vu & fetch product getById*/
  const params = useParams();
  console.log(params);

  const id = params.id ? parseInt(params.id) : 0;

  //Hàm fetch products
  const getBooks = (id: number): Promise<IBooks> => {
    return axios.get(`http://localhost:9000/books/${id}`);
  };

  // Queries

  const {
    data: book,
    isLoading,
    isError,
    error,
  } = useQuery<IBooks, Error>({
    queryKey: ['book_details', id], // include id in the query key
    queryFn: () => getBooks(id), // pass id to getProduct
    onSuccess: (data) => {
      // Thành công thì trả lại data
      console.log('getbooks', data.data);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  //========================================//

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        {/* <title>{book?.name}</title> */}
      </Helmet>
      <div className="container mx-auto ">
        <section
          data-section-id={1}
          data-share=""
          data-category="product-details-gradient"
          data-component-id="95810a73_03_awz"
          className="py-12 md:py-12 mt-6 mb-6"
        >
          <div className="container mx-auto px-4">
            <div className="max-w-md md:max-w-none mx-auto">
              <div className="flex flex-wrap -mx-4">
                <div className="w-full md:w-1/2 px-4 mb-12 md:mb-0">
                  <div className="max-w-3xl">
                    <div className="lg:flex h-full">
                      <div className="lg:flex-shrink-0 lg:w-20 mb-5 lg:mb-0 lg:mr-6">
                      </div>
                      <div className="border-gray-300 border-4">
                        <img
                          className="block h-full w-full"
                          src={`../../../../BookStore-API/public/${book?.data.imageURL}`}
                          alt=""
                          style={{ maxHeight: 650 }}
                          data-config-id="auto-img-4-3"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-1/2 px-4">
                  <div className="max-w-md mx-auto">
                    <h3 className="font-heading text-3xl  font-bold mb-4" data-config-id="auto-txt-1-3">
                      {book?.data.name}
                    </h3>
                    <span className="block text-lg font-bold  mb-6" data-config-id="auto-txt-2-3">
                      {book?.data.title}
                    </span>
                    <div className="block text-lg  mb-6" data-config-id="auto-txt-2-3">
                      <span>Tác giả:</span> <span className='font-semibold'>{book?.data.author}</span>
                    </div>
                    <div className="block mb-8" data-config-id="auto-txt-2-3">
                      <span className='text-lg'>Nhà xuất bản:</span> <span className='text-lg font-semibold text-blue-500'>{book?.data.publisher.name}</span>
                    </div>
                    <div className="block  mb-6" data-config-id="auto-txt-2-3">
                      <span className='text-red-600 text-xl font-semibold mr-1'> {book?.data.price * (1 - (book?.data.discount / 100))} đ</span> <del className='text-lg mr-1'>{book?.data.price} đ</del>
                      <span className='py-1 px-2 bg-red-600 text-white rounded-lg font-medium'>{`-${book?.data.discount}%`}</span>
                    </div>

                    <div className="flex items-center border-b border-blueGray-800 mb-6">
                      <span className="block mr-auto font-bold " data-config-id="auto-txt-4-3">
                        Quantity
                      </span>
                      <div className="inline-flex p-1 mb-1  font-bold text-gray-400 border border-gray-600 bg-slate-800">
                        <button className="inline-block p-1">
                          <svg
                            width={8}
                            height={2}
                            viewBox="0 0 8 2"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            data-config-id="auto-svg-8-3"
                          >
                            <path
                              d="M7 1H1"
                              stroke="white"
                              strokeWidth="0.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                        <input
                          className="w-12 text-sm font-bold text-center bg-transparent outline-none"
                          type="number"
                          placeholder={'1'}
                          data-config-id="auto-input-8-3"
                        />
                        <button className="inline-block p-1">
                          <svg
                            width={8}
                            height={8}
                            viewBox="0 0 8 8"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            data-config-id="auto-svg-9-3"
                          >
                            <path
                              d="M4 1V4M4 4V7M4 4H7M4 4L1 4"
                              stroke="white"
                              strokeWidth="0.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>

                    </div>
                    <a className="relative group block w-full h-12 mb-4 px-8 py-3 text-center font-bold text-yellow-50 bg-red-800 overflow-hidden" href="#">
                      <div className="absolute top-0 right-full w-full h-full bg-red-600 transform group-hover:translate-x-full group-hover:scale-102 transition duration-500" />
                      <span className="relative" data-config-id="auto-txt-5-3">
                        Add to Cart
                      </span>
                    </a>
                    <span className="text-sm text-gray-500" data-config-id="auto-txt-6-3">
                      Free Shipping &amp; Returns within 7 days.
                    </span>
                    <h5 className="mt-8 mb-3 text-lg font-bold " data-config-id="auto-txt-7-3">
                      {book?.data.title}
                    </h5>
                    <p className="text-gray-500 mb-6" data-config-id="auto-txt-8-3">
                     {book?.data.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section data-section-id={1} data-share="" data-category="ecommerce-gallery" data-component-id="4c009313_02_awz" className="py-10 border-t-2">
          <div className="container px-4 mx-auto">

            <div>
              <h2 className="text-3xl  font-bold mb-2" data-config-id="auto-txt-1-2">
                Supporters Also Viewed
              </h2>
              <span>
                <div className="w-1/4 mb-6  border-b border-red-700 dark:border-gray-400"></div>
              </span>
            </div>
            <div className="flex items-center">

              <div className="flex flex-wrap -mx-3">
                <Swiper
                  className="mySwiper  mx-auto grid grid-cols-1 sm:gap-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-center items-center"
                  modules={[Autoplay, Navigation]}
                  spaceBetween={30}
                  slidesPerView={1}
                  rewind={true}
                  autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                  }}
                  navigation={true}
                  breakpoints={{
                    640: {
                      slidesPerView: 1,
                      spaceBetween: 50,
                    },
                    768: {
                      slidesPerView: 3,
                      spaceBetween: 20,
                    },
                    1024: {
                      slidesPerView: 4,
                      spaceBetween: 30,
                    },
                    1280: {
                      slidesPerView: 4,
                      spaceBetween: 40,
                    },
                  }}
                >
                  <SwiperSlide>
                    <div className="w-full  px-4 mb-8 border-gray-200 border-2 py-2">
                      <a className="group block relative" href="#">
                        <span
                          className="absolute top-0 left-0 m-4 inline-block px-2 py-px text-xs font-bold bg-gradient-to-r from-yellow-500 via-green-300 to-blue-500 border border-black rounded-full"
                          data-config-id="auto-txt-5-4"
                        >
                          New
                        </span>
                        <img
                          className="block mb-5 w-full h-80 object-cover"
                          src="https://cdn0.fahasa.com/media/catalog/product/8/9/8935210305640.jpg"
                          alt=""
                          data-config-id="auto-img-2-4"
                        />
                        <div>
                          <h6
                            className="inline-block font-bold  mb-1"
                            data-config-id="auto-txt-6-4"
                          >
                            Pixel 7 Pro
                          </h6>
                          <span className="block text-sm font-medium text-gray-500" data-config-id="auto-txt-7-4">
                            From $349.99
                          </span>
                        </div>
                      </a>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className="w-full  px-4 mb-8 border-gray-200 border-2 py-2">
                      <a className="group block relative" href="#">
                        <span
                          className="absolute top-0 left-0 m-4 inline-block px-2 py-px text-xs font-bold bg-gradient-to-r from-yellow-500 via-green-300 to-blue-500 border border-black rounded-full"
                          data-config-id="auto-txt-5-4"
                        >
                          New
                        </span>
                        <img
                          className="block mb-5 w-full h-80 object-cover"
                          src="https://cdn0.fahasa.com/media/catalog/product/8/9/8935210305640.jpg"
                          alt=""
                          data-config-id="auto-img-2-4"
                        />
                        <div>
                          <h6
                            className="inline-block font-bold  mb-1"
                            data-config-id="auto-txt-6-4"
                          >
                            Pixel 7 Pro
                          </h6>
                          <span className="block text-sm font-medium text-gray-500" data-config-id="auto-txt-7-4">
                            From $349.99
                          </span>
                        </div>
                      </a>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className="w-full  px-4 mb-8 border-gray-200 border-2 py-2">
                      <a className="group block relative" href="#">
                        <span
                          className="absolute top-0 left-0 m-4 inline-block px-2 py-px text-xs font-bold bg-gradient-to-r from-yellow-500 via-green-300 to-blue-500 border border-black rounded-full"
                          data-config-id="auto-txt-5-4"
                        >
                          New
                        </span>
                        <img
                          className="block mb-5 w-full h-80 object-cover"
                          src="https://cdn0.fahasa.com/media/catalog/product/8/9/8935210305640.jpg"
                          alt=""
                          data-config-id="auto-img-2-4"
                        />
                        <div>
                          <h6
                            className="inline-block font-bold  mb-1"
                            data-config-id="auto-txt-6-4"
                          >
                            Pixel 7 Pro
                          </h6>
                          <span className="block text-sm font-medium text-gray-500" data-config-id="auto-txt-7-4">
                            From $349.99
                          </span>
                        </div>
                      </a>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className="w-full  px-4 mb-8 border-gray-200 border-2 py-2">
                      <a className="group block relative" href="#">
                        <span
                          className="absolute top-0 left-0 m-4 inline-block px-2 py-px text-xs font-bold bg-gradient-to-r from-yellow-500 via-green-300 to-blue-500 border border-black rounded-full"
                          data-config-id="auto-txt-5-4"
                        >
                          New
                        </span>
                        <img
                          className="block mb-5 w-full h-80 object-cover"
                          src="https://cdn0.fahasa.com/media/catalog/product/8/9/8935210305640.jpg"
                          alt=""
                          data-config-id="auto-img-2-4"
                        />
                        <div>
                          <h6
                            className="inline-block font-bold  mb-1"
                            data-config-id="auto-txt-6-4"
                          >
                            Pixel 7 Pro
                          </h6>
                          <span className="block text-sm font-medium text-gray-500" data-config-id="auto-txt-7-4">
                            From $349.99
                          </span>
                        </div>
                      </a>
                    </div>
                  </SwiperSlide>
                </Swiper>
              </div>
              {/* end */}
            </div>
          </div>
        </section>


        <section className="py-10 border-gray-200 border-t-2">
          <div className="max-w-6xl px-4 py-6 mx-auto lg:py-4 md:px-6">
            <div className="lg:grid-cols-[50%,1fr] grid grid-cols-1 gap-6">
              <div>
                <div className="p-6 mb-6 bg-gray-100 rounded-md lg:p-6 dark:bg-gray-900">
                  <div className="items-center justify-between block mb-4 lg:flex">
                    <div className="flex flex-wrap items-center mb-4 lg:mb-0">
                      <img className="object-cover mb-1 mr-2 rounded-full shadow w-14 h-14 lg:mb-0"
                        src="https://i.postimg.cc/ZYLBy1kr/Cheerful-cute-girl-greeting-with-namaste-cartoon-art-illustration.jpg " />
                      <div>
                        <h2 className="mr-2 text-lg font-medium text-gray-700 dark:text-gray-400">
                          Isha Singh</h2>
                        <p className="text-sm font-medium text-gray-400 dark:text-gray-400"> 12, SEP 2022 </p>
                      </div>
                    </div>
                    <div>
                      <ul className="flex mb-1">
                        <li>
                          <a href="#">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                              fill="currentColor"
                              className="w-4 mr-1 text-blue-800 dark:text-blue-500 bi bi-star-fill"
                              viewBox="0 0 16 16">
                              <path
                                d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z">
                              </path>
                            </svg>
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                              fill="currentColor"
                              className="w-4 mr-1 text-blue-800 dark:text-blue-500 bi bi-star-fill"
                              viewBox="0 0 16 16">
                              <path
                                d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z">
                              </path>
                            </svg>
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                              fill="currentColor"
                              className="w-4 mr-1 text-blue-800 dark:text-blue-500 bi bi-star-fill"
                              viewBox="0 0 16 16">
                              <path
                                d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z">
                              </path>
                            </svg>
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                              fill="currentColor"
                              className="w-4 mr-1 text-blue-800 dark:text-blue-500 bi bi-star-half"
                              viewBox="0 0 16 16">
                              <path
                                d="M5.354 5.119 7.538.792A.516.516 0 0 1 8 .5c.183 0 .366.097.465.292l2.184 4.327 4.898.696A.537.537 0 0 1 16 6.32a.548.548 0 0 1-.17.445l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256a.52.52 0 0 1-.146.05c-.342.06-.668-.254-.6-.642l.83-4.73L.173 6.765a.55.55 0 0 1-.172-.403.58.58 0 0 1 .085-.302.513.513 0 0 1 .37-.245l4.898-.696zM8 12.027a.5.5 0 0 1 .232.056l3.686 1.894-.694-3.957a.565.565 0 0 1 .162-.505l2.907-2.77-4.052-.576a.525.525 0 0 1-.393-.288L8.001 2.223 8 2.226v9.8z">
                              </path>
                            </svg>
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                              fill="currentColor"
                              className="w-4 mr-1 text-blue-800 dark:text-blue-500 bi bi-star-half"
                              viewBox="0 0 16 16">
                              <path
                                d="M5.354 5.119 7.538.792A.516.516 0 0 1 8 .5c.183 0 .366.097.465.292l2.184 4.327 4.898.696A.537.537 0 0 1 16 6.32a.548.548 0 0 1-.17.445l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256a.52.52 0 0 1-.146.05c-.342.06-.668-.254-.6-.642l.83-4.73L.173 6.765a.55.55 0 0 1-.172-.403.58.58 0 0 1 .085-.302.513.513 0 0 1 .37-.245l4.898-.696zM8 12.027a.5.5 0 0 1 .232.056l3.686 1.894-.694-3.957a.565.565 0 0 1 .162-.505l2.907-2.77-4.052-.576a.525.525 0 0 1-.393-.288L8.001 2.223 8 2.226v9.8z">
                              </path>
                            </svg>
                          </a>
                        </li>
                      </ul>
                      <p className="text-xs font-thin text-gray-400 dark:text-gray-400"> 2h ago </p>
                    </div>
                  </div>
                  <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem
                    Ipsum
                    has been the industry's standard dummy text ever since the 1500s, when an
                    unknown
                    printer took a galley of type and scrambled it to make a type specimen book.
                  </p>
                  <div className="flex items-center">
                    <div className="flex mr-3 text-sm text-gray-700 dark:text-gray-400">
                      <a href="#">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                          className="w-4 h-4 mr-1 text-blue-800 dark:text-blue-500 bi bi-hand-thumbs-up-fill"
                          viewBox="0 0 16 16">
                          <path
                            d="M6.956 1.745C7.021.81 7.908.087 8.864.325l.261.066c.463.116.874.456 1.012.965.22.816.533 2.511.062 4.51a9.84 9.84 0 0 1 .443-.051c.713-.065 1.669-.072 2.516.21.518.173.994.681 1.2 1.273.184.532.16 1.162-.234 1.733.058.119.103.242.138.363.077.27.113.567.113.856 0 .289-.036.586-.113.856-.039.135-.09.273-.16.404.169.387.107.819-.003 1.148a3.163 3.163 0 0 1-.488.901c.054.152.076.312.076.465 0 .305-.089.625-.253.912C13.1 15.522 12.437 16 11.5 16H8c-.605 0-1.07-.081-1.466-.218a4.82 4.82 0 0 1-.97-.484l-.048-.03c-.504-.307-.999-.609-2.068-.722C2.682 14.464 2 13.846 2 13V9c0-.85.685-1.432 1.357-1.615.849-.232 1.574-.787 2.132-1.41.56-.627.914-1.28 1.039-1.639.199-.575.356-1.539.428-2.59z">
                          </path>
                        </svg>
                      </a>
                      <span>Like</span>
                    </div>
                    <div className="flex text-sm text-gray-700 dark:text-gray-400">
                      <a href="#">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                          className="w-4 h-4 mr-1 text-blue-800 dark:text-blue-500 bi bi-chat"
                          viewBox="0 0 16 16">
                          <path
                            d="M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105z">
                          </path>
                        </svg>
                      </a>
                      <span>Reply</span>
                    </div>
                  </div>
                </div>
                <div className="p-6 mb-6 bg-gray-100 rounded-md lg:p-6 dark:bg-gray-900">
                  <div className="items-center justify-between block mb-4 lg:flex">
                    <div className="flex flex-wrap items-center mb-4 lg:mb-0">
                      <img className="object-cover mb-1 mr-2 rounded-full shadow w-14 h-14 lg:mb-0"
                        src="https://i.postimg.cc/Qt3CFq04/7294794.jpg " />
                      <div>
                        <h2 className="mr-2 text-lg font-medium text-gray-700 dark:text-gray-400">
                          Siya Smith</h2>
                        <p className="text-sm font-medium text-gray-400 dark:text-gray-400"> 12, SEP 2022 </p>
                      </div>
                    </div>
                    <div>
                      <ul className="flex mb-1">
                        <li>
                          <a href="#">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                              fill="currentColor"
                              className="w-4 mr-1 text-blue-800 dark:text-blue-500 bi bi-star-fill"
                              viewBox="0 0 16 16">
                              <path
                                d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z">
                              </path>
                            </svg>
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                              fill="currentColor"
                              className="w-4 mr-1 text-blue-800 dark:text-blue-500 bi bi-star-fill"
                              viewBox="0 0 16 16">
                              <path
                                d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z">
                              </path>
                            </svg>
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                              fill="currentColor"
                              className="w-4 mr-1 text-blue-800 dark:text-blue-500 bi bi-star-fill"
                              viewBox="0 0 16 16">
                              <path
                                d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z">
                              </path>
                            </svg>
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                              fill="currentColor"
                              className="w-4 mr-1 text-blue-800 dark:text-blue-500 bi bi-star-half"
                              viewBox="0 0 16 16">
                              <path
                                d="M5.354 5.119 7.538.792A.516.516 0 0 1 8 .5c.183 0 .366.097.465.292l2.184 4.327 4.898.696A.537.537 0 0 1 16 6.32a.548.548 0 0 1-.17.445l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256a.52.52 0 0 1-.146.05c-.342.06-.668-.254-.6-.642l.83-4.73L.173 6.765a.55.55 0 0 1-.172-.403.58.58 0 0 1 .085-.302.513.513 0 0 1 .37-.245l4.898-.696zM8 12.027a.5.5 0 0 1 .232.056l3.686 1.894-.694-3.957a.565.565 0 0 1 .162-.505l2.907-2.77-4.052-.576a.525.525 0 0 1-.393-.288L8.001 2.223 8 2.226v9.8z">
                              </path>
                            </svg>
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                              fill="currentColor"
                              className="w-4 mr-1 text-blue-800 dark:text-blue-500 bi bi-star-half"
                              viewBox="0 0 16 16">
                              <path
                                d="M5.354 5.119 7.538.792A.516.516 0 0 1 8 .5c.183 0 .366.097.465.292l2.184 4.327 4.898.696A.537.537 0 0 1 16 6.32a.548.548 0 0 1-.17.445l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256a.52.52 0 0 1-.146.05c-.342.06-.668-.254-.6-.642l.83-4.73L.173 6.765a.55.55 0 0 1-.172-.403.58.58 0 0 1 .085-.302.513.513 0 0 1 .37-.245l4.898-.696zM8 12.027a.5.5 0 0 1 .232.056l3.686 1.894-.694-3.957a.565.565 0 0 1 .162-.505l2.907-2.77-4.052-.576a.525.525 0 0 1-.393-.288L8.001 2.223 8 2.226v9.8z">
                              </path>
                            </svg>
                          </a>
                        </li>
                      </ul>
                      <p className="text-xs font-thin text-gray-400 dark:text-gray-400"> 3m ago </p>
                    </div>
                  </div>
                  <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem
                    Ipsum
                    has been the industry's standard dummy text ever since the 1500s, when an
                    unknown
                    printer took a galley of type and scrambled it to make a type specimen book.
                  </p>
                  <div className="flex items-center">
                    <div className="flex mr-3 text-sm text-gray-700 dark:text-gray-400">
                      <a href="#">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                          className="w-4 h-4 mr-1 text-blue-800 dark:text-blue-500 bi bi-hand-thumbs-up-fill"
                          viewBox="0 0 16 16">
                          <path
                            d="M6.956 1.745C7.021.81 7.908.087 8.864.325l.261.066c.463.116.874.456 1.012.965.22.816.533 2.511.062 4.51a9.84 9.84 0 0 1 .443-.051c.713-.065 1.669-.072 2.516.21.518.173.994.681 1.2 1.273.184.532.16 1.162-.234 1.733.058.119.103.242.138.363.077.27.113.567.113.856 0 .289-.036.586-.113.856-.039.135-.09.273-.16.404.169.387.107.819-.003 1.148a3.163 3.163 0 0 1-.488.901c.054.152.076.312.076.465 0 .305-.089.625-.253.912C13.1 15.522 12.437 16 11.5 16H8c-.605 0-1.07-.081-1.466-.218a4.82 4.82 0 0 1-.97-.484l-.048-.03c-.504-.307-.999-.609-2.068-.722C2.682 14.464 2 13.846 2 13V9c0-.85.685-1.432 1.357-1.615.849-.232 1.574-.787 2.132-1.41.56-.627.914-1.28 1.039-1.639.199-.575.356-1.539.428-2.59z">
                          </path>
                        </svg>
                      </a>
                      <span>Like</span>
                    </div>
                    <div className="flex text-sm text-gray-700 dark:text-gray-400">
                      <a href="#">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                          className="w-4 h-4 mr-1 text-blue-800 dark:text-blue-500 bi bi-chat"
                          viewBox="0 0 16 16">
                          <path
                            d="M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105z">
                          </path>
                        </svg>
                      </a>
                      <span>Reply</span>
                    </div>
                  </div>
                </div>

              </div>
              <div>
                <div className="p-6 bg-gray-100 rounded-md dark:bg-gray-900">
                  <h2 className="px-2 mb-6 text-2xl font-semibold text-left text-gray-600 dark:text-gray-400">
                    Reviews and Q&A
                  </h2>
                  <form className="">
                    <div className="px-2 mb-6">
                      <label htmlFor="review" className="block mb-2 font-medium text-gray-700 dark:text-gray-400">
                        Your review *
                      </label>
                      <textarea
                        id="review"
                        placeholder="Write a review"
                        required

                        className="block w-full px-4 leading-tight text-gray-700 border rounded bg-gray-50 dark:placeholder-gray-500 py-7 dark:text-gray-400 dark:border-gray-800 dark:bg-gray-800 "
                      ></textarea>
                    </div>
                    <div className="px-2 mb-6">
                      <label htmlFor="name" className="block mb-2 font-medium text-gray-700 dark:text-gray-400">
                        Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        placeholder="Name"
                        required

                        className="block w-full px-4 py-3 mb-3 leading-tight text-gray-700 border rounded bg-gray-50 lg:mb-0 dark:placeholder-gray-500 dark:text-gray-400 dark:border-gray-800 dark:bg-gray-800 "
                      />
                    </div>
                    <div className="px-2 mb-6">
                      <label htmlFor="email" className="block mb-2 font-medium text-gray-700 dark:text-gray-400">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        placeholder="abc@gmail.com"
                        required
                        className="block w-full px-4 py-3 mb-3 leading-tight text-gray-700 border rounded bg-gray-50 dark:placeholder-gray-500 dark:text-gray-400 dark:border-gray-800 dark:bg-gray-800 "
                      />
                    </div>
                    <div className="px-2">
                      <button
                        type="submit"

                        className="px-4 py-2 font-medium text-gray-100 bg-blue-800 rounded shadow hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-700"
                      >
                        Submit Comment
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>

        </section>
      </div>
    </>
  );
};
export default BooksDetailsPage;
