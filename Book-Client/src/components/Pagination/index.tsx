import React from 'react';
import { useNavigate } from 'react-router-dom';

type queryType = {
  page?: number;
  categoryId?: string;
  [key: string]: any;
};

type TPagination = {
  queryString: queryType;
  totalPages: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
};
function encodeQueryData(data: Record<string, any>, existingParams: queryType) {
  const ret = [];
  // Loại bỏ các tham số không mong muốn từ existingParams
  const filteredExistingParams = { ...existingParams };
  for (const key in data) {
    if (filteredExistingParams.hasOwnProperty(key)) {
      delete filteredExistingParams[key];
    }
  }
  // Thêm các tham số từ existingParams đã được lọc
  for (const d in filteredExistingParams) {
    if (filteredExistingParams[d] !== undefined) {
      ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(filteredExistingParams[d]));
    }
  }
  // Thêm các tham số mới từ data
  for (const d in data) {
    if (data[d] !== undefined) {
      ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
    }
  }
  return ret.join('&');
}

const Pagination = ({ queryString, totalPages, currentPage, setCurrentPage }: TPagination) => {
  const navigate = useNavigate();
  // React.useEffect(() => {
  //   const newParams = { ...queryString, page: currentPage };
  //   const pageUrl = `/books?` + encodeQueryData(newParams, queryString);
  //   navigate(pageUrl);
  // }, [currentPage, queryString, navigate]);

  const pageNumbers = [...Array(totalPages + 1).keys()].slice(1);

  console.log(pageNumbers);
  const goToNextPage = () => {
    if (currentPage !== totalPages) {
      setCurrentPage(currentPage + 1);
      navigate(`/books?page=${currentPage + 1}`);
    }
  };
  const goToPrevPage = () => {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
      navigate(`/books?page=${currentPage - 1}`);
    }
  };

  return (
    <>
      <ul className="flex items-center justify-center">
        <li>
          <a
            onClick={goToPrevPage}
            className="flex w-9 h-9 items-center justify-center border border-gray-800 text-gray-400 hover:text-gray-200"
            href="#"
            aria-label="previous"
          >
            <svg width={7} height={12} viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg" data-config-id="auto-svg-1-2">
              <path d="M6 10.6666L1.33333 5.99992L6 1.33325" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </li>

        {pageNumbers.map((pgNumber) => (
          <li className="cursor-pointer">
            <a
              key={pgNumber}
              className={
                pgNumber === currentPage
                  ? 'relative z-10 inline-flex bg-yellow-400  w-9 h-9 items-center justify-center border border-gray-800 font-bold text-white hover:bg-yellow-400 focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-400 '
                  : ' relative z-10 inline-flex  w-9 h-9 items-center justify-center text-gray-900 border border-gray-800 hover:bg-gray-50 focus:outline-offset-0'
              }
              onClick={() => {
                setCurrentPage(pgNumber);
                const newParams = { ...queryString, page: pgNumber };
                const pageUrl = `/books?` + encodeQueryData(newParams, queryString);
                navigate(pageUrl);
              }}
            >
              {pgNumber}
            </a>
          </li>
        ))}

        <li>
          <a
            onClick={goToNextPage}
            className="flex w-9 h-9 items-center justify-center border border-gray-800 text-gray-400 hover:text-gray-200"
            href="#"
            aria-label="next"
          >
            <svg width={7} height={12} viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg" data-config-id="auto-svg-2-2">
              <path d="M1 1.33341L5.66667 6.00008L1 10.6667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </li>
      </ul>
    </>
  );
};

export default Pagination;

// setCurrentPage(pgNumber);
// queryString = {...queryString, page: pgNumber};
// const pageUrl = `/books?`+encodeQueryData(queryString);
// navigate(pageUrl);
