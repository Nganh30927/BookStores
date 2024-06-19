import React from 'react';
import { Helmet } from 'react-helmet';
import config from '../../constants/config';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Link, useSearchParams, useParams, useNavigate } from 'react-router-dom';
import { useCartStore } from '../../hooks/useCartStore';
import Pagination from '../../components/Pagination';
import ProductFilter from '../../components/ProductFilter';
import MobileFilter from '../../components/MobileFillter';
import { RiShoppingCartLine } from 'react-icons/ri';

type FiltersType = {
  keyword?: string
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
};

const BooksPage = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const page = params.get('page');
  // const limit = params.get('limit');

  const int_page = page ? parseInt(page) : 1;
  const limit = 6;
  // const int_limit = limit ? parseInt(limit) : 6;

  const cid = params.get('categoryId');
  const int_cid = cid ? parseInt(cid) : 0;

  const pmin = params.get('minPrice');
  const int_price_min = pmin ? parseInt(pmin) : 0;

  const pmax = params.get('maxPrice');
  const int_price_max = pmax ? parseInt(pmax) : 0;

  console.log('<<=== 🚀 page ===>>', page, params);
  let newParams = {};

  if (cid) {
    newParams = { ...newParams, categoryId: int_cid };
  }

  if (page) {
    newParams = { ...newParams, page: int_page };
  }
  const [currentPage, setCurrentPage] = React.useState(int_page);
  const { addItem } = useCartStore();

  //Hàm fetch products
  const getBooks = async (page= 1, limit= 6, filters: FiltersType) => {
    // const offset = (page - 1) * limit;

    let url = new URL(`http://localhost:9000/books?page=${page}&limit=${limit}`);
    // url.searchParams.append('offset', String(offset));
    // url.searchParams.append('limit', String(limit));

    if (filters.categoryId && filters.categoryId > 0) {
      url.searchParams.append('categoryId', String(filters.categoryId));
    }
    if (filters.minPrice && filters.minPrice > 0) {
      url.searchParams.append('minPrice', String(filters.minPrice));
    }
    if (filters.maxPrice && filters.maxPrice > 0) {
      url.searchParams.append('maxPrice', String(filters.maxPrice));
    }
    return axios.get(url.toString());
  };

  // Truy vấn
  const queryBooks = useQuery({
    queryKey: ['books', { int_page, limit, int_cid, int_price_min, int_price_max }],
    queryFn: () => getBooks(int_page, limit, { categoryId: int_cid, minPrice: int_price_min, maxPrice: int_price_max }),
    onSuccess: (data) => {
      console.log('getBooks:', data?.data.books);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  // const totalPages = 12; //Tổng số trang

  // Handle lỗi khi ko fetch được API
  if (queryBooks.isError) {
    return <h1>Error Processing</h1>;
  }
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Products Page</title>
      </Helmet>

      <section data-section-id="1" data-share="" data-category="search-solid" data-component-id="fce12138_02_awz" className="py-10">
        <div className="container px-4 mx-auto">
          <div className=" flex flex-wrap -mx-4">
            <div className="w-full lg:w-4/12 xl:w-3/12 px-4">
              <ProductFilter queryString={newParams} currentPage={int_page} setCurrentPage={setCurrentPage} currentCategoryId={int_cid} />
            </div>

            <div className="w-full lg:w-8/12 xl:9/12 px-4">
              <div className="flex flex-col lg:hidden sm:flex-row mb-6 sm:items-center pb-6 border-b border-gray-400  ">
                <MobileFilter queryString={newParams} currentCategoryId={int_cid} />
              </div>
              <div className="flex flex-wrap mb-20">
                {queryBooks.data && queryBooks.data?.data
                  ? queryBooks.data?.data.books.map((book: any) => {
                      return (
                        <div key={`queryBooks${book.id}`} className="w-full sm:w-1/2  xl:w-1/3 bg-white overflow-hidden group border border-gray-300 relative hover:border-yellow-200">
                           <div
                                  className="absolute top-2 right-5 flex items-center justify-center w-12 h-12 font-bold bg-sky-300 rounded-3xl z-20"
                                  data-config-id="auto-txt-5-4"
                                >
                                 <span className='leading-7 text-white'> - {book.discount}%</span>
                                </div>
                          <Link to={`/booksdetail/${book.id}`} className="block p-5">
                            <img
                              className="block w-full h-80 mb-3 object-contain  transition-all group-hover:scale-105"
                              src={`http://localhost:9000` + `${book.imageURL}`}
                              alt={book.name}
                              data-config-id="auto-img-1-9"
                            />
                            <div className="">
                              <h6 className="font-bold text-black pt-3 pb-5 overflow-hidden whitespace-nowrap overflow-ellipsis w-50" data-config-id="auto-txt-2-9">
                                {book.name}
                              </h6>

                              <div className="flex justify-between items-center mb-3">
                                <div>
                                  <span className="font-bold text-red-600" data-config-id="auto-txt-1-9">
                                  {Number((book.price) * (1 - (book.discount) / 100)).toFixed(0)} đ
                                  </span>
                                  <del className="ms-2 font-semibold text-black">{book.price}</del>
                                </div>
                              </div>
                            </div>
                          </Link>
                            <div className='absolute right-6 bottom-5'>
                            <div className="w-12 h-12  text-sky-500 hover:bg-sky-600 hover:text-white rounded-3xl border border-sky-500 flex items-center justify-center">
                                  <a className='cursor-pointer'
                                    onClick={() => {
                                      console.log('Thêm giỏ hàng ID', book.id);
                                      const item: any = queryBooks.data.data;

                                      addItem({
                                        id: item.id,
                                        price: item.price,
                                        name: item.name,
                                        quantity: 1,
                                        imageURL: item.imageURL,
                                        discount: item.discount,
                                      });
                                    }}
                                  >
                                    <RiShoppingCartLine />
                                  </a>
                                </div>
                            </div>
                         
                        </div>
                      );
                    })
                  : null}
              </div>
              <nav>
                {queryBooks.data && queryBooks.data?.data.books.length > 0 ? (
                  <div className="text-center mt-10">
                    <Pagination
                      queryString={newParams}
                      totalPages={queryBooks?.data.data.totalPages}
                      currentPage={currentPage}
                      setCurrentPage={setCurrentPage}
                    />
                  </div>
                ) : null}
              </nav>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BooksPage;
