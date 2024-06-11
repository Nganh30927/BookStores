import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { CiSearch } from 'react-icons/ci';
import axios from 'axios';
import config from '../../../constants/config';
import styles from './MobileSearch.module.css'
import { Drawer } from '@mui/material';

interface DataType {
  id: number;
  name: string;
  quantity: number;
  price: number;
  discount: number;
  imageURL?: string;
}

type KeywordType = {
  keywordSearch: string;
}

const MobileSearch = () => {
const [openSearch, setopenSearch] = useState(false);
  const [showSearchResult, setShowSearchResult] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const toggleDrawerSearch = (isOpenSearch: boolean) => () => {
    setopenSearch(isOpenSearch);
  };

  const handleSearchButtonClick = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setShowSearchResult(!showSearchResult);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const { data: books} = useQuery(['books', searchValue], async () => {
    const response = await axios.get(config.urlAPI + `/books/search?keyword=${encodeURIComponent(searchValue)}`);
    return response.data;
  }, {
    enabled: !!searchValue,
  });

  return (
    <>
       <a onClick={toggleDrawerSearch(true)} className="item text-xl">
              <span><CiSearch /></span>
            </a>
            <Drawer
              anchor="top"
              open={openSearch}
              onClose={toggleDrawerSearch(false)}
              className={styles.show_Search}
            >
              <div className={` relative py-5  ${styles.search}`}>
                <form
                  onSubmit={(e) => e.preventDefault()}
                  className="form text-center"
                  action=""
                  method="get"
                >
                  <input type="search" placeholder="Search products..." value={searchValue} onChange={handleSearchChange}/>
                  <button type="submit">
                    <CiSearch />
                  </button>
                </form>
              </div>
            </Drawer>
      {/* {isLoading ? (
       <></>
      ) : (
        books && books.length > 0 && (
          <div className={`absolute ${styles.search_result}`}>
            {books.slice(0, 5).map((book: any) => ( // Sử dụng slice(0, 5) ở đây
              <a href="#" key={book.id}>
                <div className={`flex ${styles.product_item}`}>
                  <img style={{ width: "60px", height: "60px" }} src={`http://localhost:9000` + `${book.imageURL}`} alt="" />
                  <div className={styles.product_content}>
                    <h3 className="text-sm font-normal">{book.name}</h3>
                    <strong>${book.price}</strong>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )
      )} */}
    </>
  );
};

export default MobileSearch;
