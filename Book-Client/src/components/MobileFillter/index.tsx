import React from 'react';
import { useQuery } from '@tanstack/react-query';

import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

type queryType = {
  categoryId?: number;
};

type ProductFilterType = {
  queryString: queryType;
  currentCategoryId: number;
};

function encodeQueryData(data: Record<string, any>) {
  const ret = [];
  for (const d in data) ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
  return ret.join('&');
}

const MobileFilter = ({ queryString, currentCategoryId }: ProductFilterType) => {
  const navigate = useNavigate();

  const getCategories = async () => {
    return axios.get(`http://localhost:9000/categories`);
  };

  const queryCategory = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories(),
    onSuccess: (data) => {
      //Thành công thì trả lại data
      console.log('get categories', data?.data);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  return (
    <>
      <div className="mb-3 sm:mb-0 sm:mr-5">
        <div className="relative border border-gray-600">
          <span className="absolute top-1/2 right-0 mr-4 transform -translate-y-1/2" data-config-id="auto-txt-18-2">
            <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M0.96967 0.71967C1.26256 0.426777 1.73744 0.426777 2.03033 0.71967L6 4.68934L9.96967 0.71967C10.2626 0.426777 10.7374 0.426777 11.0303 0.71967C11.3232 1.01256 11.3232 1.48744 11.0303 1.78033L6.53033 6.28033C6.23744 6.57322 5.76256 6.57322 5.46967 6.28033L0.96967 1.78033C0.676777 1.48744 0.676777 1.01256 0.96967 0.71967Z"
                fill="white"
              ></path>
            </svg>
          </span>
          <select
            className="relative w-full pl-6 pr-10 py-4 bg-transparent font-medium text-gray-600 outline-none appearance-none"
            name=""
            id=""
            data-config-id="auto-input-7-1"
            onChange={(e) => {
              if (e.target.value === 'all') {
                navigate(`/books`);
              } else {
                navigate(`/books/list?categoryId=${e.target.value}`);
              }
            }}
          >
            <option value="all" selected={currentCategoryId === 0}>
              Tất cả
            </option>
            {queryCategory.data && queryCategory.data?.data
              ? queryCategory.data?.data.map((item: any) => {
                  return (
                    <option key={`queryCategory${item.id}`} value={item.id} selected={currentCategoryId === item.id}>
                      {item.name}
                    </option>
                  );
                })
              : null}
          </select>
        </div>
      </div>
      <div className="mb-3 sm:mb-0 sm:mr-5">
        <div className="relative border border-gray-600">
          <span className=" absolute top-1/2 right-0 mr-4 transform -translate-y-1/2" data-config-id="auto-txt-19-2">
            <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M0.96967 0.71967C1.26256 0.426777 1.73744 0.426777 2.03033 0.71967L6 4.68934L9.96967 0.71967C10.2626 0.426777 10.7374 0.426777 11.0303 0.71967C11.3232 1.01256 11.3232 1.48744 11.0303 1.78033L6.53033 6.28033C6.23744 6.57322 5.76256 6.57322 5.46967 6.28033L0.96967 1.78033C0.676777 1.48744 0.676777 1.01256 0.96967 0.71967Z"
                fill="white"
              ></path>
            </svg>
          </span>
          <select
            className="relative w-full pl-6 pr-10 py-4 bg-transparent font-medium text-gray-600 outline-none appearance-none"
            name=""
            id=""
            data-config-id="auto-input-7-1"
            onChange={(e) => {
              switch (e.target.value) {
                case '1':
                  navigate(`/books?maxPrice=100000`);
                  break;
                case '2':
                  navigate(`/books?minPrice=100000&maxPrice=200000`);
                  break;
                case '3':
                  navigate(`/books?minPrice=200000&maxPrice=250000`);
                  break;
                case '4':
                  navigate(`/books?minPrice=250000&maxPrice=300000`);
                  break;
                case '5':
                  navigate(`/books?minPrice=300000`);
                  break;
                case '6':
                  navigate(`/books`);
                  break;
                default:
                  break;
              }
            }}
          >
            <option value="" disabled selected>
              Price
            </option>
            <option value="1">{'<'} 100.000</option>
            <option value="2">100.000 - 200.000</option>
            <option value="3">200.000 - 250.000</option>
            <option value="4">250.000 - 300.000</option>
            <option value="5">{'>'} 300.000</option>
            <option value="6">Clear Filter</option>
          </select>
        </div>
      </div>
    </>
  );
};

export default MobileFilter;
