import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { CiSearch } from 'react-icons/ci';
import axios from 'axios';
import config from '../../../constants/config';
import styles from '../../Layouts/Header/Header.module.css'
import { Link } from 'react-router-dom';

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

const HomeSearch = () => {
  const [showSearchResult, setShowSearchResult] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const handleSearchButtonClick = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setShowSearchResult(!showSearchResult);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const { data: books, isLoading } = useQuery(['books', searchValue], async () => {
    const response = await axios.get(config.urlAPI + `/books/search?keyword=${encodeURIComponent(searchValue)}`);
    return response.data;
  }, {
    enabled: !!searchValue,
  });

  return (
    <>
      <form className="form" onSubmit={(e) => e.preventDefault()}>
        <input type="search" placeholder="Search products..." value={searchValue} onChange={handleSearchChange} />
        <button type="submit">
          <CiSearch />
        </button>
      </form>
      {isLoading ? (
       <></>
      ) : (
        books && books.length > 0 && (
          <div className={`absolute ${styles.search_result}`}>
            {books.slice(0, 5).map((book: any) => ( // Sử dụng slice(0, 5) ở đây
              <Link to={`/booksdetail/${book.id}`} key={book.id}>
                <div className={`flex ${styles.product_item}`}>
                  <img style={{ width: "60px", height: "60px" }} src={`http://localhost:9000` + `${book.imageURL}`} alt="" />
                  <div className={styles.product_content}>
                    <h3 className="text-sm font-normal">{book.name}</h3>
                    <strong>${book.price}</strong>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )
      )}
    </>
  );
};

export default HomeSearch;
