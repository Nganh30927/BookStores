import React from 'react';
import Skeleton from 'react-loading-skeleton';
import { useQuery } from '@tanstack/react-query';
import styles from '../../Layouts/Header/Header.module.css';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';


type queryType = {
  categoryId?: number;
};

type ProductFilterType = {

  currentCategoryId: number;
};

const HeaderCategory = ({ currentCategoryId }: ProductFilterType) => {
    const navigate = useNavigate();
  const [params] = useSearchParams();

  const cid = params.get('categoryId');
  console.log('cid:', cid);
  const int_cid = cid ? parseInt(cid) : 0;

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
    <div className={` hidden absolute ${styles.menu_category}`}>
      <ul>
       {
        queryCategory.data && queryCategory.data?.data
        ? queryCategory.data?.data.map((item:any) => {
            return(
                <li key={`queryCategory${item.id}`}>
                <a
                onClick={() => {
                    navigate(`/books?categoryId=${item.id}`);
                  }}
                  className={`flex font-medium text-center px-3 py-3 ${currentCategoryId == item.id ? 'your-active-class' : 'your-inactive-class'}`}>
                  {/* <CiMobile1 className="text-lg me-4" /> */}
                  <span className="text-sm">{item.name}</span>
                </a>
              </li>
            )
        }): null
       }
      </ul>
    </div>
  );
};

export default HeaderCategory;
