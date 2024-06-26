import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const BookSkeleton = ({ count }: { count: number }) => {
  const totalCards = [...Array(count + 1).keys()].slice(1);
  return (
    <div className="flex flex-wrap mb-20">
      {totalCards.map((card) => {
        return (
          <div key={`card${card}`} className="w-1/2 sm:w-1/2 md:w-1/3 xl:w-1/3 bg-white border border-gray-300 ">
            <div className="block p-5">
              <Skeleton height={320} />
              <div className="mt-3">
              <Skeleton count={2} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BookSkeleton;
