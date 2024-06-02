// import React, { useRef, useState } from 'react';
// // Import Swiper React components
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { axiosClient } from '../../library/axiosClient';
// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// // Import Swiper styles
// import 'swiper/css';
// import 'swiper/css/navigation';
// import 'swiper/css/pagination';

// // import required modules
// import { Keyboard, Navigation, Pagination } from 'swiper/modules';
// import { Button } from '@mui/material';
// import { FaHeart } from 'react-icons/fa';

// export default function GetNewBookCollection() {
//   const [BookData, setBookData] = useState<any[]>([]);
//   const [refresh, setRefresh] = useState<boolean>(true);

//   const queryClient = useQueryClient();

//   const fetchBooks = async () => {
//     const response = await axiosClient.get(`http://localhost:9000` + `/books`);
//     setBookData(response.data);
//     console.log(response.data);
//   };

//   const queryBooks = useQuery({
//     queryKey: ['books'],
//     queryFn: () => fetchBooks(),
//   });

//   return (
//     <>
//       <Swiper
//         slidesPerView={5}
//         slidesPerGroupSkip={1}
//         centeredSlides={false}
//         grabCursor={true}
//         keyboard={{
//           enabled: true,
//         }}
//         breakpoints={{
//           640: {
//             slidesPerView: 1,
//             spaceBetween: 0,
//           },
//           768: {
//             slidesPerView: 3,
//             spaceBetween: 0,
//           },
//           1024: {
//             slidesPerView: 4,
//             spaceBetween: 0,
//           },
//           1280: {
//             slidesPerView: 5,
//             spaceBetween: 0,
//           },
//         }}
//         scrollbar={true}
//         navigation={true}
//         pagination={{
//           clickable: true,
//           type: 'bullets',
//         }}
//         modules={[Keyboard, Navigation, Pagination]}
//         className="mySwiper"
//       >
//         {BookData &&
//           BookData.map((book, index) => (
//             <SwiperSlide>
//               <div className="w-full  px-4 my-4">
//                 <div className="block w-full h-full relative bg-white rounded-xl overflow-hidden hover:scale-105 ease-in duration-300">
//                   <img
//                     className="block w-full h-72 object-contain rounded-t-xl  "
//                     src={`http://localhost:9000` + `${book.imageURL}`}
//                     alt={book.name}
//                     data-config-id="auto-img-1-2"
//                   />

//                   <a className="group block py-4 ms-3" href="#">
//                     <h6
//                       className="inline-block text-lg font-bold  text-black mb-2 hover:text-red-600 overflow-hidden whitespace-nowrap overflow-ellipsis w-52"
//                       data-config-id="auto-txt-9-2"
//                     >
//                       {book.name}
//                     </h6>
//                     <div className="flex items-center mb-1">
//                       <span className=" text-lg font-bold text-black pa" data-config-id="auto-txt-10-2">
//                         {book.price}$
//                       </span>
//                       <span className="mx-5 text-sm text-red-500 font-bold outline outline-offset-2 outline-1 rounded " data-config-id="auto-txt-11-2">
//                         - {book.discount}%
//                       </span>
//                       <img className="block" src="vendia-assets/images/item-cards/stars-gradient.svg" alt="" data-config-id="auto-img-2-2" />
//                     </div>
//                   </a>

//                   <a className="absolute top-0 right-0 m-3 inline-block text-pink-500 hover:text-red-600 transform duartion-200" href="#">
//                     <span className="text-2xl font-bold">
//                       <FaHeart />
//                     </span>
//                   </a>
//                 </div>
//               </div>
//             </SwiperSlide>
//           ))}
//       </Swiper>
//     </>
//   );
// }
