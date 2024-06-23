import React from 'react';
import Skeleton from 'react-loading-skeleton';
import { useQuery } from '@tanstack/react-query';

import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

type queryType = {
  page?: number;
  categoryId?: number;
};

type ProductFilterType = {
  queryString: queryType;
  currentCategoryId: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
};

function encodeQueryData(data: Record<string, any>) {
  const ret = [];
  for (const d in data) ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
  return ret.join('&');
}

const ProductFilter = ({ queryString, currentCategoryId, currentPage, setCurrentPage }: ProductFilterType) => {
  const navigate = useNavigate();
  const [categories, setCategories] = React.useState<any[]>([]);
  const [refresh, setRefresh] = React.useState<boolean>(false);
  const [params] = useSearchParams();
  const minPrice = params.get('minPrice');
  const maxPrice = params.get('maxPrice');

  React.useEffect(() => {
    const getCategories = async () => {
      const response = await axios.get(`http://localhost:9000/categories`);
      setCategories(response.data);
    };
    getCategories();
  }, [refresh]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-1 gap-6 md:gap-8 lg:gap-10 lg:max-w-2xs lg:pt-6  lg:pb-9 px-4">
      <div className="hidden lg:block pb-10 lg:border-b border-gray-300">
        <h4 className="font-bold text-black mb-8 uppercase" data-config-id="auto-txt-5-2">
          Book Categories
        </h4>
        <li className="list-none hover:bg-slate-200 py-1 px-2">
          <button
            onClick={() => {
              navigate(`/books`);
            }}
            className={currentCategoryId === 0 ? `hover:text-indigo-500 font-bold text-indigo-500 btn-empty` : `btn-empty hover:text-indigo-500`}
          >
            Tất cả
          </button>
        </li>
        {categories
          ? categories.map((item: any) => {
              return (
                <ul className="list-unstyled mt-2">
                  <li key={item.id} className="mb-2 py-1 px-2 hover:bg-slate-100 font-medium">
                    <button
                      onClick={() => {
                        navigate(`/books?categoryId=${item.id}`);
                      }}
                      className={
                        currentCategoryId === item.id ? `hover:text-indigo-500 font-bold text-indigo-500 btn-empty` : `btn-empty hover:text-indigo-500`
                      }
                    >
                      {item.name}
                    </button>
                  </li>
                </ul>
              );
            })
          : null}
      </div>

      <div className="hidden lg:block pb-10 lg:border-b border-gray-300">
        <h4 className="font-bold text-black mb-8 uppercase" data-config-id="auto-txt-5-2">
          Filter by Price
        </h4>
        <>
          <ul className="list-unstyled mt-2">
            <li className="mb-2 py-1 px-2 hover:bg-slate-100 font-medium">
              <button
                onClick={() => {
                  queryString = { ...queryString };
                  const pageUrl = encodeQueryData(queryString) ? `/books?` + encodeQueryData(queryString) + `&maxPrice=100000` : `/books?` + `maxPrice=100000`;
                  navigate(pageUrl);
                }}
                className={maxPrice === '100000' ? `hover:text-indigo-500 font-bold text-indigo-500 btn-empty` : `btn-empty hover:text-indigo-500`}
              >
                {'<'} 100.000
              </button>
            </li>

            <li className="mb-2 py-1 px-2 hover:bg-slate-100 font-medium">
              <button
                onClick={() => {
                  queryString = { ...queryString };
                  const pageUrl = encodeQueryData(queryString)
                    ? `/books?` + encodeQueryData(queryString) + `&minPrice=100000&maxPrice=200000`
                    : `/books?` + `minPrice=100000&maxPrice=200000`;
                  navigate(pageUrl);
                }}
                className={
                  minPrice === '100000' && maxPrice === '200000'
                    ? `hover:text-indigo-500 font-bold text-indigo-500 btn-empty`
                    : `btn-empty hover:text-indigo-500`
                }
              >
                100.000 - 200.000
              </button>
            </li>

            <li className="mb-2 py-1 px-2 hover:bg-slate-100 font-medium">
              <button
                onClick={() => {
                  queryString = { ...queryString };
                  const pageUrl = encodeQueryData(queryString)
                    ? `/books?` + encodeQueryData(queryString) + `&minPrice=200000&maxPrice=250000`
                    : `/books?` + `minPrice=200000&maxPrice=250000`;
                  navigate(pageUrl);
                }}
                className={
                  minPrice === '200000' && maxPrice === '250000'
                    ? `hover:text-indigo-500 font-bold text-indigo-500 btn-empty`
                    : `btn-empty hover:text-indigo-500`
                }
              >
                200.000 - 250.000
              </button>
            </li>

            <li className="mb-2 py-1 px-2 hover:bg-slate-100 font-medium">
              <button
                onClick={() => {
                  queryString = { ...queryString };
                  const pageUrl = encodeQueryData(queryString)
                    ? `/books?` + encodeQueryData(queryString) + `&minPrice=250000&maxPrice=300000`
                    : `/books?` + `minPrice=250000&maxPrice=300000`;
                  navigate(pageUrl);
                }}
                className={
                  minPrice === '250000' && maxPrice === '300000'
                    ? `hover:text-indigo-500 font-bold text-indigo-500 btn-empty`
                    : `btn-empty hover:text-indigo-500`
                }
              >
                250.000 - 300.000
              </button>
            </li>

            <li className="mb-2 py-1 px-2 hover:bg-slate-100 font-medium">
              <button
                onClick={() => {
                  queryString = { ...queryString };
                  const pageUrl = encodeQueryData(queryString) ? `/books?` + encodeQueryData(queryString) + `&minPrice=300000` : `/books?` + `minPrice=300000`;
                  navigate(pageUrl);
                }}
                className={minPrice === '300000' ? `hover:text-indigo-500 font-bold text-indigo-500 btn-empty` : `btn-empty hover:text-indigo-500`}
              >
                {'>'} 300.000
              </button>
            </li>
            <li className="list-none hover:bg-slate-200 py-1 px-2">
              <button
                onClick={() => {
                  navigate(`/books`);
                }}
                className={currentCategoryId === 0 ? `hover:text-red-400 font-bold text-red-600 btn-empty` : `btn-empty hover:text-red-400`}
              >
                Clear Filter
              </button>
            </li>
          </ul>
        </>
      </div>
    </div>
  );
};

export default ProductFilter;
