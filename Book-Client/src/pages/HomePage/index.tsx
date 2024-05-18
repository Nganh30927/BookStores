import React from 'react';
import { Helmet } from 'react-helmet';
import styles from './HomePage.module.css';
import { FaHeart } from "react-icons/fa";
import { IProduct } from "../../constants/types";
import 'swiper/css';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Autoplay, Navigation, Pagination } from 'swiper/modules';
import { useQuery } from '@tanstack/react-query';
import config from '../../constants/config';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const HomePage = () => {

  const navigate = useNavigate();
  const [params] = useSearchParams();

  

  const page = params.get('page');
  const limit = params.get('limit');
  const int_page = page? parseInt(page) : 1;


  const [currentPage, setCurrentPage] = React.useState(int_page);
  //===========Category SmartPhone=======//
  const fetchProductSmartPhone = async (page=1, limit=5)=> {
    return axios.get(config.urlAPI+`/v1/products?page=${page}&limit=${limit}`);
   
  };
  
  // Sử dụng useQuery để fetch data từ API 
  const queryCategorySmartPhone = useQuery({
    queryKey: ['products_smartphone',int_page, limit ],
    queryFn: ()=>fetchProductSmartPhone(int_page),
    onSuccess: (data)=>{
      //Thành công thì trả lại data
      console.log(data);
    },
    onError: (error)=>{
      console.log(error);
    },
  });

  return (
    <div >
      <Helmet>
        <meta charSet="utf-8" />
        <title>Home Page</title>
      </Helmet>
      <section
        data-section-id="1"
        data-share=""
        data-category="newest-products"
        data-component-id="4f76139a_01_awz"
        className="py-10 bg-gray-100 overflow-x-hidden container mx-auto"
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap -mx-3 ">
            <div className="w-full lg:w-1/2 px-3 mb-6 lg:mb-0">
              <div className="mb-6 h-56 w-full rounded-xl overflow-hidden  bg-slate-100 border">
                <Swiper
                  slidesPerView={1}
                  spaceBetween={30}
                  pagination={{
                    clickable: true,
                  }}
                  navigation={true} modules={[Navigation]} className="mySwiper">
                  <SwiperSlide className="">
                    <img
                      className="w-full h-full  rounded-xl"

                      src=""
                      alt="Slide 1"
                    />
                  </SwiperSlide>
                  <SwiperSlide>
                    <img
                      className="w-full h-full  rounded-xl"

                      src=""
                      alt="Slide 2"
                    />
                  </SwiperSlide>
                </Swiper>

              </div>
              <div
                className="relative h-56 w-full bg-cover bg-center bg-no-repeat rounded-xl">
                <Swiper
                  slidesPerView={1}
                  spaceBetween={30}
                  pagination={{
                    clickable: true,
                  }}
                  navigation={true} modules={[Navigation]} className="mySwiper">
                  <SwiperSlide className="">
                    <img
                      className="w-full h-full  rounded-xl"

                      src=""
                      alt="Slide 1"
                    />
                  </SwiperSlide>
                  <SwiperSlide>
                    <img
                      className="w-full h-full  rounded-xl bg-gray-400"

                      src=""
                      alt="Slide 2"
                    />
                  </SwiperSlide>
                </Swiper>
              </div>
            </div>
            <div className="w-full lg:w-1/2 px-3">
              <div
                className="relative inline-block mb-6 h-80 lg:h-full w-full bg-no-repeat bg-cover rounded-xl"
                style={{ backgroundImage: `url('')`, backgroundColor: 'gray' }}
                data-config-id="image3"
              >


              </div>
            </div>
          </div>
        </div>
      </section>

  

      <section
        data-section-id={1}
        data-share=""
        data-category="banner"
        data-component-id="842e895d_11_awz"
        className="py-6 bg-white"
      >
        <div className="container  mx-auto">
          <div className="max-w-md lg:max-w-none mx-auto shadow overflow-hidden">
            <div className="flex flex-wrap items-center ">
              <div className="w-full lg:w-1/3">
                <a className="group block h-full relative uppercase hover:italic" href="#">
                  <div className="absolute top-0 left-0 w-full h-full group-hover:bg-black group-hover:bg-opacity-40 transition duration-500 " />
                  <img
                    className="img-fluid w-full object-cover" style={{ height: '410px' }}
                    src="https://www.apple.com/newsroom/images/2023/09/apple-unveils-iphone-15-pro-and-iphone-15-pro-max/article/Apple-iPhone-15-Pro-lineup-hero-230912_Full-Bleed-Image.jpg.xlarge.jpg"
                    alt=""
                    data-config-id="auto-img-1-11"
                  />
                  <div className="absolute bottom-0 left-0 p-8 w-full">
                    <h4
                      className="text-5xl font-black text-white"
                      data-config-id="auto-txt-2-11"
                    >
                      Phone
                    </h4>
                  </div>
                </a>
              </div>
              <div className="w-full lg:w-1/3 ">
                <a className="group block h-full relative uppercase hover:italic" href="#">
                  <div className="absolute top-0 left-0 w-full h-full group-hover:bg-black group-hover:bg-opacity-40 transition duration-500" />
                  <img
                    className="img-fluid w-full object-cover" style={{ height: '410px' }}
                    src="https://cdn.tgdd.vn/Files/2022/07/07/1445532/laptop-like-new-99-la-gi-co-tot-khong-co-nen-1.jpg"
                    alt=""
                    data-config-id="auto-img-2-11"
                  />
                  <div className="absolute bottom-0 left-0 p-8 w-full">
                    <h4
                      className="text-5xl font-black text-white"
                      data-config-id="auto-txt-4-11"
                    >
                      Laptop
                    </h4>
                  </div>
                </a>
              </div>
              <div className="w-full lg:w-1/3 ">
                <a className="group block h-full relative uppercase hover:italic" href="#">
                  <div className="absolute top-0 left-0 w-full h-full group-hover:bg-black group-hover:bg-opacity-40 transition duration-500" />
                  <img
                    className="img-fluid w-full object-cover" style={{ height: '410px' }}
                    src="https://i02.appmifile.com/482_operator_sg/14/11/2022/e1d64270ad76f0e56d4f64f5db222058.png"
                    alt=""
                    data-config-id="auto-img-3-11"
                  />
                  <div className="absolute bottom-0 left-0 p-8 w-full">
                    <h4
                      className="text-5xl font-black text-white"
                      data-config-id="auto-txt-2-11"
                    >
                      Houseware
                    </h4>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>


      <section
        data-section-id={1}
        data-share=""

        className="py-12 mt-6 py-md-24 bg-gray-300  container mx-auto"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-sm md:max-w-xl mx-auto lg:max-w-none contents">
            <div className="flex flex-wrap mx-4 mb-3  justify-between">

              <div>
                <h1
                  className="text-3xl text-white font-bold mb-2"
                  data-config-id="auto-txt-1-2"
                >
                  Featured Collections
                </h1>
                <span>
                  <div className="w-28 mb-6  border-b border-red-700 dark:border-gray-400"></div>
                </span>
              </div>

              <p className="text-gray-500" data-config-id="auto-txt-2-2">
                Most Selling and Trending Products in our shop
              </p>


            </div>
            <div className="flex flex-wrap -mx-4">
              <Swiper
                slidesPerView={1}
                spaceBetween={10}
                freeMode={true}
                pagination={{
                  clickable: true,
                }}
                modules={[FreeMode, Pagination]}
                className=""
                breakpoints={{
                  640: {
                    slidesPerView: 1,
                    spaceBetween: 0,
                  },
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
                {
                  queryCategorySmartPhone.data &&  queryCategorySmartPhone.data.data.data.products.map((product: IProduct) => (
                    <SwiperSlide> <div key={`queryCategorySmartPhone${product._id}`} className="w-full  px-4 my-4">
                  <div className="block relative bg-white  rounded-xl overflow-hidden hover:scale-105 ease-in duration-300">
                    <Link to={`/products/${product.slug}`}>
                    <img
                      className="block w-full h-80 object-contain rounded-t-xl  "
                      src={`../../../public/images/${product.thumbnail}`}
                      alt={product.name}
                      data-config-id="auto-img-1-2"
                    />
                    </Link>
                    <a className="group block py-4 ms-3" href="#">
                      <h6
                        className="inline-block text-lg font-bold  text-black mb-2 hover:text-red-600 overflow-hidden whitespace-nowrap overflow-ellipsis w-52"
                        data-config-id="auto-txt-9-2"
                      >
                        {product.name}
                      </h6>
                      <div className="flex items-center mb-1">
                        <span
                          className="mr-2 text-sm font-bold text-black"
                          data-config-id="auto-txt-10-2"
                        >
                          {product.price}
                        </span>
                        <span
                          className="mr-auto text-xs text-gray-400 line-through"
                          data-config-id="auto-txt-11-2"
                        >
                          {product.discount}
                        </span>
                        <img
                          className="block"
                          src="vendia-assets/images/item-cards/stars-gradient.svg"
                          alt=""
                          data-config-id="auto-img-2-2"
                        />
                      </div>
                    </a>

                    <a
                      className="absolute top-0 right-0 m-3 inline-block text-white hover:text-red-600 transform duartion-200"
                      href="#"
                    >
                      <span className="text-2xl font-bold"><FaHeart /></span>
                    </a>
                  </div>

                </div></SwiperSlide>
                  ))
                }
               

              </Swiper>
            </div>
          </div>
        </div>
      </section>
      <section
        data-section-id={1}
        data-share=""
        data-category="ta-banners"
        data-component-id="b753d053_01_awz"
        className="py-8"
      >
        <picture className="relative">
          <img className='opacity-80 object-cover w-full' style={{ height: '500px' }} src="../../../public/images/model-iphone.PNG" alt="" />

          <div className="absolute xl:top-[35%] xl:left-[5%] lg:top-[35%] lg:left-[-7%] md:top-[38%] md:left-[-28%] top-[50%] left-[-20%] -translate-x-[-50%] -translate-y-[-50%] transform md:-translate-x-[-50%] md:-translate-y-[-50%]  text-center">
            <div className="w-full">
            <h3 className="mb-1 text-4xl md:text-8xl font-black text-white opacity-90">
                <span className="" data-config-id="header-p1">
                  E-COLLECTION
                </span>
              </h3>


            </div>
            <div className="mt-8 mb-8">
            <a className="text-white font-medium py-3 px-6 bg-red-600 hover:bg-red-400 rounded-md md:text-lg" href="#">
                <span data-config-id="primary-action">SHOP NOW</span>
              </a>
            </div>

          </div>

        </picture>
      </section>



     

     

   
    </div>
  );
};

export default HomePage;
