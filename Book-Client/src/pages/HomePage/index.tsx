import React from 'react';
import { Helmet } from 'react-helmet';
import styles from './HomePage.module.css';
import { FaHeart } from 'react-icons/fa';
import { IoIosArrowDropright } from 'react-icons/io';
import 'swiper/css';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Mousewheel, Keyboard } from 'swiper/modules';

import { useQuery } from '@tanstack/react-query';
import config from '../../constants/config';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

// import GetNewBookCollection from '../../components/GetNewBookCollection';

const HomePage = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const page = params.get('page');
  const limit = params.get('limit');
  const int_page = page ? parseInt(page) : 1;

  const [currentPage, setCurrentPage] = React.useState(int_page);
  //===========Category SmartPhone=======//
  // const fetchBook = async (page = 1, limit = 5) => {
  //   return axios.get(config.urlAPI + `/v1/products?page=${page}&limit=${limit}`);
  // };

  // Sử dụng useQuery để fetch data từ API
  // const queryCategorySmartPhone = useQuery({
  //   queryKey: ['products_smartphone', int_page, limit],
  //   queryFn: () => fetchBook(int_page),
  //   onSuccess: (data) => {
  //     //Thành công thì trả lại data
  //     console.log(data);
  //   },
  //   onError: (error) => {
  //     console.log(error);
  //   },
  // });

  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Home Page</title>
      </Helmet>
      {/* //========Book Slide=======// */}
      <section
        data-section-id="1"
        data-share=""
        data-category="newest-products"
        data-component-id="4f76139a_01_awz"
        className="  overflow-x-hidden mx-auto"
      >
        <div className="mx-auto">
          <div className="">
            <div className="w-full h-full lg:mb-0">
              <div className=" w-full h-96 overflow-hidden bg-contain  bg-slate-100 border">
                <Swiper
                 slidesPerView={1}
                 spaceBetween={10}
                 pagination={{ clickable: true }}
                 navigation={true}
                 modules={[Navigation, Pagination]}
                 className="mySwiper"
                >
                  <SwiperSlide className="">
                    <img className="w-full h-full object-fill" src="../../../public/images/banner_1.jpg" alt="Slide 1" />
                  </SwiperSlide>
                  <SwiperSlide>
                    <img className="w-full h-full object-cover" src="../../../public/images/banner_2.jpg" alt="Slide 2" />
                  </SwiperSlide>
                </Swiper>
              </div>
            </div>
          </div>
        </div>
        {/* Book Category */}
      </section>

      <section className="mx-auto " >
        <div className="flex justify-center items-center mb-10 sm:mb-16 bg-gray-200 opacity-90">
          <div className='overflow-x-auto'>
          <div className="flex space-x-5 md:space-x-4">
            <div className="text-left flex items-center py-3 pl-5 flex-shrink-0">
              <img src="https://arsenal.a.bigcontent.io/v1/static/star-icon" alt="Icon - Rated 4.5/5 by customers" className="h-4 mr-2" />
              <h4 className="text-base md:text-lg whitespace-nowrap ">Rated 4.5/5 by customers</h4>
            </div>
            <div className="text-left flex items-center py-3 flex-shrink-0">
              <img src="https://arsenal.a.bigcontent.io/v1/static/box-icon" alt="Icon - Buy direct and support your club" className="h-4 mr-2" />
              <h4 className="text-base md:text-lg whitespace-nowrap">Buy direct and support your</h4>
            </div>
            <div className="text-left flex items-center py-3 pr-5 flex-shrink-0">
              <img src="https://arsenal.a.bigcontent.io/v1/static/box-icon" alt="Icon - Members get 10% off" className="h-4 mr-2" />
              <h4 className="text-base md:text-lg whitespace-nowrap">Members get 10% off</h4>
            </div>
          </div>
          </div>
        </div>
      </section>


    
      <section data-section-id={1} data-share="" data-category="ta-banners" data-component-id="b753d053_01_awz" className="py-8">
        <picture className="relative">
          <img className="opacity-80 object-cover w-full" src="../../../public/images/image_books.jpg" alt="" />
        </picture>
      </section>

      {/* //========New Book Collections=======// */}
      <section data-section-id={1} data-share="" className="py-12 mt-6 py-md-24 bg-gray-300  container mx-auto">
        <div className="container mx-auto px-4">
          <div className="max-w-sm md:max-w-xl mx-auto lg:max-w-none contents">
            <div className="flex flex-wrap mx-4 mb-3  justify-between">
              <div>
                <h1 className="text-3xl text-green-700 font-bold mb-2" data-config-id="auto-txt-1-2">
                  New Collections
                </h1>
                <span>
                  <div className="w-28 mb-6  border-b border-green-700 dark:border-gray-400"></div>
                </span>
              </div>

              <div className="flex flex-row text-green-700 font-bold mb-2 text-lg" data-config-id="auto-txt-2-2">
                Find more {<IoIosArrowDropright size={25} />}
              </div>
            </div>
            <div className="flex flex-wrap -mx-4">
              {/* <GetNewBookCollection /> */}
            </div>
          </div>
        </div>
      </section>

      <section data-section-id={1} data-share="" data-category="ta-banners" data-component-id="b753d053_01_awz" className="py-8">
        <picture className="relative">
          <img className="opacity-80 object-cover w-full" src="../../../public/images/image_manga.jpg" alt="" />
        </picture>
      </section>

      <section data-section-id={1} data-share="" data-category="ta-banners" data-component-id="b753d053_01_awz" className="py-8">
        <picture className="relative">
          <img className="opacity-80 object-cover w-full" src="../../../public/images/image_series_manga.jpg" alt="" />
        </picture>
      </section>

      <section data-section-id={1} data-share="" data-category="features" data-component-id="4d2f33a1_01_awz" className="pt-10 bg-gray-100 container mx-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap -mx-4 pb-8 border-b">
            <div className="relative w-full md:w-1/2 lg:w-1/4 px-4 mb-16 lg:mb-0">
              <img className="hidden md:block absolute top-0 left-1/2 ml-16 lg:ml-8" src="yofte-assets/elements/dots.svg" alt="" data-config-id="auto-img-1" />
              <div className="relative text-center">
                <span className="inline-flex mb-16 items-center justify-center w-20 h-20 bg-white rounded-full">
                  <svg width={37} height={27} viewBox="0 0 37 27" fill="none" xmlns="http://www.w3.org/2000/svg" data-config-id="auto-svg-1-1">
                    <path
                      d="M34.9845 6.67016C33.7519 5.33682 32 4.60814 30.0543 4.60814H24.9767V1.75543C24.9767 1.2438 24.5581 0.825195 24.0465 0.825195H0.930233C0.418605 0.825195 0 1.2438 0 1.75543V22.2128C0 22.7244 0.418605 23.143 0.930233 23.143H4.63566C4.93798 24.864 6.43411 26.174 8.24031 26.174C10.0465 26.174 11.5426 24.864 11.845 23.143H24.0465H26.0853C26.3876 24.864 27.8837 26.174 29.6899 26.174C31.4961 26.174 32.9922 24.864 33.2946 23.143H36.0698C36.5814 23.143 37 22.7244 37 22.2128V12.6004C36.9922 10.143 36.3023 8.08876 34.9845 6.67016ZM1.86047 2.68566H23.1163V5.53837V21.2903H11.6822C11.1783 19.8795 9.82171 18.864 8.24031 18.864C6.65892 18.864 5.30233 19.8795 4.79845 21.2903H1.86047V2.68566ZM8.24031 24.3136C7.24806 24.3136 6.44186 23.5074 6.44186 22.5151C6.44186 21.5229 7.24806 20.7167 8.24031 20.7167C9.23256 20.7167 10.0388 21.5229 10.0388 22.5151C10.0388 23.5074 9.23256 24.3136 8.24031 24.3136ZM29.6899 24.3136C28.6977 24.3136 27.8915 23.5074 27.8915 22.5151C27.8915 21.5229 28.6977 20.7167 29.6899 20.7167C30.6822 20.7167 31.4884 21.5229 31.4884 22.5151C31.4884 23.5074 30.6822 24.3136 29.6899 24.3136ZM35.1318 21.2826H33.1318C32.6279 19.8717 31.2713 18.8562 29.6899 18.8562C28.1085 18.8562 26.7519 19.8717 26.2481 21.2826H24.9845V6.46861H30.062C33.1938 6.46861 35.1395 8.81744 35.1395 12.6004V21.2826H35.1318Z"
                      fill="black"
                    />
                  </svg>
                </span>
                <h3 className="mb-4 text-xl font-bold font-heading" data-config-id="header1">
                  Free Shipping
                </h3>
                <p data-config-id="label1">From $45</p>
              </div>
            </div>
            <div className="relative w-full md:w-1/2 lg:w-1/4 px-4 mb-16 lg:mb-0">
              <img className="hidden lg:block absolute top-0 left-1/2 ml-8" src="yofte-assets/elements/dots.svg" alt="" data-config-id="auto-img-2" />
              <div className="relative text-center">
                <span className="inline-flex mb-16 items-center justify-center w-20 h-20 bg-white rounded-full">
                  <svg width={39} height={38} viewBox="0 0 39 38" fill="none" xmlns="http://www.w3.org/2000/svg" data-config-id="auto-svg-2-1">
                    <g clipPath="url(#clip0)">
                      <path
                        d="M33.7601 6.67776C30.3819 3.38616 25.8883 1.57227 21.1139 1.57227C16.2512 1.57227 11.7014 3.44089 8.30713 6.83414C7.93802 7.20161 7.94604 7.79581 8.32318 8.16329C8.70032 8.52294 9.31017 8.51512 9.68731 8.14765C12.7205 5.12188 16.7727 3.45653 21.1139 3.45653C29.9165 3.44871 37.0742 10.4228 37.0742 18.9998C37.0742 27.5767 29.9165 34.5508 21.1139 34.5508C12.3113 34.5508 5.15359 27.5767 5.15359 18.9998V18.8043L6.7424 20.3524C6.92696 20.5322 7.17571 20.626 7.42446 20.626C7.67322 20.626 7.91395 20.5322 8.10653 20.3524C8.48367 19.9849 8.48367 19.3907 8.10653 19.0232L4.88077 15.8724C4.50363 15.5049 3.89378 15.5049 3.51664 15.8724L0.282856 19.0232C-0.0942853 19.3907 -0.0942853 19.9849 0.282856 20.3524C0.467414 20.5322 0.716167 20.626 0.96492 20.626C1.21367 20.626 1.4544 20.5322 1.64698 20.3524L3.23579 18.8043V18.9998C3.23579 23.6518 5.09742 28.0302 8.47565 31.3218C11.8539 34.6134 16.3475 36.4273 21.1219 36.4273C25.8964 36.4273 30.39 34.6134 33.7682 31.3218C37.1464 28.0302 39 23.6518 39 18.9998C39 14.3477 37.1384 9.96937 33.7601 6.67776Z"
                        fill="black"
                      />
                      <path
                        d="M21.1143 8.86719C17.9848 8.86719 15.4411 11.3457 15.4411 14.3949V17.061H13.6758C13.1462 17.061 12.7129 17.4832 12.7129 17.9992V27.358C12.7129 27.874 13.1462 28.2962 13.6758 28.2962H28.5608C29.0904 28.2962 29.5238 27.874 29.5238 27.358V18.007C29.5238 17.491 29.0904 17.0688 28.5608 17.0688H26.7955V14.4027C26.7955 11.3535 24.2438 8.86719 21.1143 8.86719ZM17.367 14.4027C17.367 12.3855 19.0521 10.7515 21.1143 10.7515C23.1766 10.7515 24.8617 12.3933 24.8617 14.4027V17.0688H17.367V14.4027ZM27.5979 26.4198H14.6387V18.9375H27.5979V26.4198Z"
                        fill="black"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0">
                        <rect width={39} height={38} fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </span>
                <h3 className="mb-4 text-xl font-bold font-heading" data-config-id="header2">
                  Secure Shopping
                </h3>
                <p data-config-id="label2">100% Guarantee</p>
              </div>
            </div>
            <div className="relative w-full md:w-1/2 lg:w-1/4 px-4 mb-16 md:mb-0">
              <img className="hidden md:block absolute top-0 left-1/2 ml-16 lg:ml-8" src="yofte-assets/elements/dots.svg" alt="" data-config-id="auto-img-3" />
              <div className="relative text-center">
                <span className="inline-flex mb-16 items-center justify-center w-20 h-20 bg-white rounded-full">
                  <svg width={31} height={37} viewBox="0 0 31 37" fill="none" xmlns="http://www.w3.org/2000/svg" data-config-id="auto-svg-3-1">
                    <path
                      d="M9.59532 15.0855C9.59532 14.5814 9.18285 14.1689 8.67872 14.1689H1.33066C0.826531 14.1689 0.414062 14.5814 0.414062 15.0855C0.414062 15.5897 0.826531 16.0021 1.33066 16.0021H8.67872C9.18285 16.0021 9.59532 15.5897 9.59532 15.0855Z"
                      fill="black"
                    />
                    <path
                      d="M29.669 14.1689H22.3209C21.8168 14.1689 21.4043 14.5814 21.4043 15.0855C21.4043 15.5897 21.8168 16.0021 22.3209 16.0021H29.669C30.1731 16.0021 30.5856 15.5897 30.5856 15.0855C30.5856 14.5814 30.1807 14.1689 29.669 14.1689Z"
                      fill="black"
                    />
                    <path
                      d="M15.4996 9.18126C16.0037 9.18126 16.4162 8.76879 16.4162 8.26466V0.916598C16.4162 0.412469 16.0037 0 15.4996 0C14.9955 0 14.583 0.412469 14.583 0.916598V8.26466C14.583 8.76879 14.9955 9.18126 15.4996 9.18126Z"
                      fill="black"
                    />
                    <path
                      d="M20.3199 11.1823C20.5567 11.1823 20.7858 11.0906 20.9691 10.915L26.1708 5.71327C26.5298 5.35427 26.5298 4.77376 26.1708 4.41476C25.8118 4.05576 25.2313 4.05576 24.8723 4.41476L19.6706 9.61645C19.3116 9.97545 19.3116 10.556 19.6706 10.915C19.8539 11.0906 20.0907 11.1823 20.3199 11.1823Z"
                      fill="black"
                    />
                    <path
                      d="M10.0305 10.915C10.2062 11.0906 10.443 11.1823 10.6798 11.1823C10.9166 11.1823 11.1457 11.0906 11.329 10.915C11.688 10.556 11.688 9.97545 11.329 9.61645L6.12733 4.41476C5.76833 4.05576 5.18782 4.05576 4.82882 4.41476C4.46982 4.77376 4.46982 5.35427 4.82882 5.71327L10.0305 10.915Z"
                      fill="black"
                    />
                    <path
                      d="M26.8398 21.178C26.1447 20.5822 25.2663 20.2537 24.3726 20.2537H23.5401H20.5458H19.1251V16.5491C19.1251 14.777 18.5981 13.4862 17.5516 12.7147C15.9017 11.5078 13.6637 12.1877 13.5644 12.2182C13.1825 12.3404 12.9228 12.6918 12.9228 13.089V17.5574C12.9228 18.917 12.2735 20.0704 10.9827 20.9946C10.005 21.6974 9.00434 22.0182 8.87448 22.0564L8.78282 22.0793C8.4391 21.6897 7.93497 21.4453 7.36974 21.4453H3.88666C2.84785 21.4453 2 22.2932 2 23.332V34.7589C2 35.7977 2.84785 36.6456 3.88666 36.6456H7.38501C7.84331 36.6456 8.27106 36.4775 8.59187 36.2025C9.29459 36.89 10.2494 37.3101 11.2806 37.3101H14.756H15.115H22.2263C23.3262 37.3101 24.2962 37.0427 25.0372 36.5463C25.9843 35.9046 26.5725 34.8887 26.7405 33.5902L28.1536 24.8062C28.3751 23.4465 27.871 22.0564 26.8398 21.178ZM7.43848 34.7589C7.43848 34.7894 7.41557 34.8124 7.38501 34.8124H3.88666C3.85611 34.8124 3.8332 34.7894 3.8332 34.7589V23.332C3.8332 23.3014 3.85611 23.2785 3.88666 23.2785H7.38501C7.41557 23.2785 7.43848 23.3014 7.43848 23.332V34.7589ZM26.3433 24.5235L24.9302 33.3229C24.9302 33.3305 24.9302 33.3458 24.9226 33.3611C24.8615 33.8881 24.6629 35.4845 22.2263 35.4845H15.115H14.756H11.2806C10.3028 35.4845 9.44736 34.7512 9.29459 33.7812C9.28695 33.743 9.27931 33.7048 9.27168 33.6742V23.8514L9.32515 23.8361C9.34042 23.8361 9.34806 23.8285 9.36334 23.8285C9.41681 23.8132 10.7153 23.4465 12.0062 22.5223C13.8012 21.2467 14.756 19.5281 14.756 17.5574V13.8452C15.2601 13.7917 15.9552 13.8146 16.467 14.1889C17.0169 14.5937 17.2919 15.3881 17.2919 16.5415V21.1627C17.2919 21.6668 17.7044 22.0793 18.2085 22.0793H20.5458H23.5401H24.3726C24.8309 22.0793 25.2816 22.255 25.6482 22.5605C26.1982 23.0341 26.4579 23.7826 26.3433 24.5235Z"
                      fill="black"
                    />
                  </svg>
                </span>
                <h3 className="mb-4 text-xl font-bold font-heading" data-config-id="header3">
                  Customer Satisfaction
                </h3>
                <p data-config-id="label3">100% Positive Feedbacks</p>
              </div>
            </div>
            <div className="relative w-full md:w-1/2 lg:w-1/4 px-4">
              <div className="relative text-center">
                <span className="inline-flex mb-16 items-center justify-center w-20 h-20 bg-white rounded-full">
                  <svg width={35} height={37} viewBox="0 0 35 37" fill="none" xmlns="http://www.w3.org/2000/svg" data-config-id="auto-svg-4-1">
                    <path
                      d="M30.0586 14.0693V12.6468C30.0586 9.24223 28.8538 6.07857 26.6695 3.73109C24.4309 1.32143 21.3527 0 17.9947 0H16.821C13.463 0 10.3849 1.32143 8.14622 3.73109C5.96197 6.07857 4.75714 9.24223 4.75714 12.6468V14.0693C2.10651 14.2481 0 16.4557 0 19.1529V21.3761C0 24.1821 2.28529 26.4674 5.09139 26.4674H7.95966C8.47269 26.4674 8.89244 26.0477 8.89244 25.5347V14.9866C8.89244 14.4735 8.47269 14.0538 7.95966 14.0538H6.62269V12.6468C6.62269 6.49832 11.0067 1.86555 16.8132 1.86555H17.987C23.8013 1.86555 28.1775 6.49832 28.1775 12.6468V14.0538H26.8405C26.3275 14.0538 25.9078 14.4735 25.9078 14.9866V25.5269C25.9078 26.0399 26.3275 26.4597 26.8405 26.4597H28.1464C27.7655 31.3256 24.4153 32.4527 22.8607 32.7092C22.4332 31.3956 21.1973 30.4473 19.7437 30.4473H17.4118C15.6084 30.4473 14.1393 31.9164 14.1393 33.7197C14.1393 35.5231 15.6084 37 17.4118 37H19.7515C21.2595 37 22.5265 35.9739 22.9074 34.5903C23.6691 34.4815 24.8739 34.2095 26.071 33.5099C27.7578 32.5227 29.7555 30.5095 30.0197 26.4519C32.6859 26.2887 34.8002 24.0733 34.8002 21.3683V19.1452C34.808 16.4557 32.7092 14.2403 30.0586 14.0693ZM7.04244 24.5941H5.10693C3.32689 24.5941 1.88109 23.1483 1.88109 21.3683V19.1452C1.88109 17.3651 3.32689 15.9193 5.10693 15.9193H7.04244V24.5941ZM19.7515 35.1345H17.4118C16.6345 35.1345 16.0048 34.5048 16.0048 33.7275C16.0048 32.9502 16.6345 32.3206 17.4118 32.3206H19.7515C20.5288 32.3206 21.1584 32.9502 21.1584 33.7275C21.1584 34.5048 20.5288 35.1345 19.7515 35.1345ZM32.9424 21.3683C32.9424 23.1483 31.4966 24.5941 29.7166 24.5941H27.7811V15.9193H29.7166C31.4966 15.9193 32.9424 17.3651 32.9424 19.1452V21.3683Z"
                      fill="black"
                    />
                  </svg>
                </span>
                <h3 className="mb-4 text-xl font-bold font-heading" data-config-id="header4">
                  Support
                </h3>
                <p data-config-id="label4">Online Support 24/7</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
