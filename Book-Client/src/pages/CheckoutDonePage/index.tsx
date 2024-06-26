import { Link } from 'react-router-dom';
import { useCartStore } from '../../hooks/useCartStore';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import numeral from 'numeral';
import { CheckCircleOutlined } from '@ant-design/icons';

const CheckoutDonePage = () => {
  const navigate = useNavigate();

  const { order, items, total, itemCount, placeOrder } = useCartStore();

  console.log(items);
  console.log(order);

  return (
    <section className="flex items-center py-16 bg-gray-100 md:py-20 font-poppins dark:bg-gray-800 ">
      <div className="justify-center flex-1 max-w-6xl px-4 py-4 mx-auto bg-white border rounded-md dark:border-gray-900 dark:bg-gray-900 md:py-10 md:px-10">
        {order.map((item, index) => {
          return (
            <div key={index}>
              <div className="flex">
                <span className="px -4 mb-8 text-2xl font-semibold tracking-wide text-green-700 dark:text-gray-300 mr-3">{<CheckCircleOutlined />}</span>
                <span className="px -4 mb-8 text-2xl font-semibold tracking-wide text-gray-700 dark:text-gray-300">
                  Thank you. Your order has been received
                </span>
              </div>

              <div className="flex border-b border-gray-200 dark:border-gray-700  items-stretch justify-start w-full h-full px-4 mb-8 md:flex-row xl:flex-col md:space-x-6 lg:space-x-8 xl:space-x-0">
                <div className="flex items-start justify-start flex-shrink-0">
                  <div className="flex flex-col justify-start gap-10 w-full pb-6 md:justify-start">
                    {order[0].orderDetails.map((book: any, index: number) => {
                      return (
                        <div key={index} className="flex gap-5 ">
                          <img
                            src={`http://localhost:9000` + `${book.book.imageURL}`}
                            alt={book.book.name}
                            className=" flex flex-col object-cover w-16 h-16 rounded-md"
                          />
                          <div className="flex flex-col items-start justify-start space-y-2">
                            <p className="text-lg font-semibold text-left text-gray-800 dark:text-gray-400">{book.book.name}</p>
                            <p className="text-sm font-semibold leading-4 text-gray-600 dark:text-gray-400">Quantity: {book.quantity}</p>
                            <p className="text-sm font-semibold leading-4 text-gray-600 dark:text-gray-400">Discount: {book.discount} %</p>
                            <p className="text-md font-semibold leading-4 text-red-600 dark:text-gray-400"> {numeral(book.price).format('0,0')} VND</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center pb-4 mb-10 border-b border-gray-200 dark:border-gray-700">
                <div className="w-full px-4 mb-4 md:w-1/4">
                  <p className="mb-2 text-sm leading-5 text-gray-600 dark:text-gray-400 ">Order Number: {item.id} </p>
                  <p className="text-base font-semibold leading-4 text-gray-800 dark:text-gray-400"></p>
                </div>
                <div className="w-full px-4 mb-4 md:w-1/4">
                  <p className="mb-2 text-sm leading-5 text-gray-600 dark:text-gray-400 ">Date: {moment(item.shippedDate).format('DD-MM-YYYY')} </p>
                  <p className="text-base font-semibold leading-4 text-gray-800 dark:text-gray-400">{item.shippedDate}</p>
                </div>
                <div className="w-full px-4 mb-4 md:w-1/4">
                  <p className="mb-2 text-sm leading-5 text-gray-600 dark:text-gray-400 ">Payment Method: </p>
                  <p className="text-base font-semibold leading-4 text-gray-800 dark:text-gray-400 ">{item.paymenttype}</p>
                </div>
                <div className="w-full px-4 mb-4 md:w-1/4">
                  <p className="text-base font-semibold text-blue-600 dark:text-gray-400">Total: </p>
                  <p className="text-base font-semibold leading-4 text-gray-800 dark:text-gray-400 ">{numeral(total).format('0,0')} VND</p>
                </div>
              </div>

              <div className="px-4 mb-10">
                <div className="flex flex-col items-stretch justify-center w-full md:flex-row md:space-y-0 md:space-x-8">
                  {/* <div className="flex flex-col w-full space-y-6 ">
                    <h2 className="mb-2 text-xl font-semibold text-gray-700 dark:text-gray-400">Order details</h2>
                    <div className="flex flex-col items-center justify-center w-full pb-4 space-y-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between w-full">
                        <p className="text-base leading-4 text-gray-800 dark:text-gray-400">Subtotal</p>
                        <p className="text-base leading-4 text-gray-600 dark:text-gray-400">Rs.1000</p>
                      </div>
                      <div className="flex items-center justify-between w-full">
                        <p className="text-base leading-4 text-gray-800 dark:text-gray-400">Discount</p>
                        <p className="text-base leading-4 text-gray-600 dark:text-gray-400">10%</p>
                      </div>
                      <div className="flex items-center justify-between w-full">
                        <p className="text-base leading-4 text-gray-800 dark:text-gray-400">Shipping</p>
                        <p className="text-base leading-4 text-gray-600 dark:text-gray-400">Rs.100</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between w-full">
                      <p className="text-base font-semibold leading-4 text-gray-800 dark:text-gray-400">Total</p>
                      <p className="text-base font-semibold leading-4 text-gray-600 dark:text-gray-400">Rs.700</p>
                    </div>
                  </div> */}
                  <div className="flex flex-col w-full px-2 space-y-4 md:px-8 ">
                    <h2 className="mb-2 text-xl font-semibold text-gray-700 dark:text-gray-400">Shipping</h2>
                    <div className="flex items-start justify-between w-full">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-8 h-8">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="w-6 h-6 text-blue-600 dark:text-blue-400 bi bi-truck"
                            viewBox="0 0 16 16"
                          >
                            <path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h9A1.5 1.5 0 0 1 12 3.5V5h1.02a1.5 1.5 0 0 1 1.17.563l1.481 1.85a1.5 1.5 0 0 1 .329.938V10.5a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 1 1-4 0H5a2 2 0 1 1-3.998-.085A1.5 1.5 0 0 1 0 10.5v-7zm1.294 7.456A1.999 1.999 0 0 1 4.732 11h5.536a2.01 2.01 0 0 1 .732-.732V3.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .294.456zM12 10a2 2 0 0 1 1.732 1h.768a.5.5 0 0 0 .5-.5V8.35a.5.5 0 0 0-.11-.312l-1.48-1.85A.5.5 0 0 0 13.02 6H12v4zm-9 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm9 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"></path>
                          </svg>
                        </div>
                        <div className="flex flex-col items-center justify-start">
                          <p className="text-lg font-semibold leading-6 text-gray-800 dark:text-gray-400">
                            Delivery
                            <br />
                            <span className="text-sm font-normal">Delivery with 24 Hours</span>
                          </p>
                        </div>
                      </div>
                      <p className="text-lg font-semibold leading-6 text-gray-800 dark:text-gray-400">50.000 VND</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-start gap-4 px-4 mt-6 ">
                <Link
                  to={'/books'}
                  className="w-full px-4 py-2 text-blue-500 border border-blue-500 rounded-md md:w-auto hover:text-gray-100 hover:bg-blue-600 dark:border-gray-700 dark:hover:bg-gray-700 dark:text-gray-300"
                >
                  Go back shopping
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default CheckoutDonePage;
