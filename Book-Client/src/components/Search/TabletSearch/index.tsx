import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState, useRef } from 'react';
import { useQuery } from 'react-query';
import { CiSearch } from 'react-icons/ci';
import axios from 'axios';
import config from '../../../constants/config';
import styles from './TabletSearch.module.css'
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

const TabletSearch = () => {
  const [showSearchResult, setShowSearchResult] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);

  const handleSearchButtonClick = (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowSearchResult(true);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
      setShowSearchResult(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  const { data: books, isLoading } = useQuery(['books', searchValue], async () => {
    const response = await axios.get(config.urlAPI + `/books/search?keyword=${encodeURIComponent(searchValue)}`);
    return response.data;
  }, {
    enabled: !!searchValue,
  });

  const handleLinkClick = () => {
    setShowSearchResult(false);
  };

  return (
    <div ref={searchRef} className={`col-span-3 relative ${styles.search}`}>
      <form
        onClick={handleSearchButtonClick}
        className="form"
        action=""
        method="get"
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          type="search"
          placeholder="Search products..."
          value={searchValue}
          onChange={handleSearchChange}
        />
        {/* <button type="submit">
          <CiSearch />
        </button> */}
      </form>
      {showSearchResult && (
        isLoading ? (
          <></>
        ) : (
          books && books.length > 0 && (
            <div className={`absolute ${styles.search_result}`}>
              {books.map((book: any) => (
                <Link
                  to={`/booksdetail/${book.id}`}
                  key={book.id}
                  onClick={handleLinkClick}
                >
                  <div className={`flex ${styles.product_item}`}>
                    <img
                      style={{ width: "60px", height: "60px" }}
                      src={`http://localhost:9000${book.imageURL}`}
                      alt=""
                    />
                    <div className={styles.product_content}>
                      <h3 className="text-sm font-normal">{book.name}</h3>
                      <strong>${book.price}</strong>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )
        )
      )}
    </div>
  );
};

export default TabletSearch;
