import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import axios from 'axios';
import config from '../../constants/config';
import { useCartStore } from '../../hooks/useCartStore';
import { useSaveOrderId } from '../../hooks/useSaveOrderId';

type FormData = {
  name: string;
  email: string;
  contact: number;
  shippingaddress: string;
  paymenttype: string;
  description?: string;
};

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, placeOrder, total, itemTotal } = useCartStore();
  const { saveOrderId } = useSaveOrderId();
  const [members, setMembers] = useState<any[]>([]);
  const [payMethod, setPayMethod] = useState("cash");

  useEffect(() => {
    const fetchMembers = async () => {
      const response = await axios.get('http://localhost:9000/members');
      setMembers(response.data);
    };
    fetchMembers();
  }, []);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const newMemberData = {
        name: data.name,
        contact: data.contact,
        email: data.email,
        address: data.shippingaddress,
      };
  
      const existingMember = members.find(
        (member) =>
          member.contact === newMemberData.contact && member.email === newMemberData.email
      );
  
      let orderData;
      if (existingMember) {
        orderData = {
          status: 'WAITING',
          shippingAddress: data.shippingaddress,
          paymenttype: data.paymenttype,
          description: data.description,
          memberId: existingMember.id,
        };
      } else {
        const pushMember = await axios.post(config.urlAPI + '/members', newMemberData);
        orderData = {
          status: 'WAITING',
          shippingAddress: data.shippingaddress,
          paymenttype: data.paymenttype,
          description: data.description,
          memberId: pushMember.data.id,
        };
      }
  
      const payload = {
        ...orderData,
        orderDetails: items.map((item) => ({
          bookId: item.id,
          quantity: item.quantity,
          discount: item.discount,
          imageURL: item.imageURL,
          name: item.name,
          price: item.price,
        })),
      };
  
      // Create order and update stock
      const createOrder = async () => {
        const response = await axios.post(config.urlAPI + `/orders`, payload);
        await axios.post(config.urlAPI + `/books/orderp/${response.data.id}/stock`);
        return response.data.id;
      };
  
      const orderId = await createOrder();
  
      // Handle payment based on the payment method
      const amount = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  
      if (payMethod === 'cash') {
        saveOrderId(orderId);
        navigate('/checkout-done');
      } else if (payMethod === 'momo') {
        const response = await axios.post(config.urlAPI + `/orders/payment/momo`, { amount });
        window.location.href = response.data.urlPay;
      } else if (payMethod === 'vnpay') {
        const response = await axios.post(config.urlAPI + `/orders/payment/create_vnpay_url`, { amount });
        window.location.href = response.data.urlPay;
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Có lỗi xảy ra trong quá trình xử lý đơn hàng. Vui lòng thử lại.');
    }
  };
  
  
  return (
    <section>
      <form onSubmit={handleSubmit(onSubmit)}>
      <div className="container mx-auto px-4">
    <div className="flex flex-wrap items-center gap-2 mb-14">
      <a href="#" className="group">
        <div className="flex flex-wrap items-center">
          <span
            className="text-xs text-gray-500 group-hover:text-gray-900 transition duration-200"
            data-config-id="txt-c7761e-26"
          >
            Cart
          </span>
          <div className="text-gray-500 group-hover:text-gray-900 transition duration-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={20}
              height={20}
              viewBox="0 0 20 20"
              fill="none"
              data-config-id="svg-c7761e-1"
            >
              <path
                d="M12.9465 9.40832L8.22986 4.69999C8.15239 4.62188 8.06022 4.55989 7.95867 4.51758C7.85712 4.47527 7.7482 4.45349 7.63819 4.45349C7.52818 4.45349 7.41926 4.47527 7.31771 4.51758C7.21616 4.55989 7.124 4.62188 7.04653 4.69999C6.89132 4.85613 6.8042 5.06734 6.8042 5.28749C6.8042 5.50764 6.89132 5.71885 7.04653 5.87499L11.1715 10.0417L7.04653 14.1667C6.89132 14.3228 6.8042 14.534 6.8042 14.7542C6.8042 14.9743 6.89132 15.1855 7.04653 15.3417C7.12371 15.4204 7.21574 15.483 7.31731 15.526C7.41887 15.5689 7.52794 15.5912 7.63819 15.5917C7.74845 15.5912 7.85752 15.5689 7.95908 15.526C8.06064 15.483 8.15268 15.4204 8.22986 15.3417L12.9465 10.6333C13.0311 10.5553 13.0986 10.4606 13.1448 10.3552C13.191 10.2497 13.2148 10.1359 13.2148 10.0208C13.2148 9.90574 13.191 9.7919 13.1448 9.68648C13.0986 9.58107 13.0311 9.48636 12.9465 9.40832Z"
                fill="currentColor"
              />
            </svg>
          </div>
        </div>
      </a>
      <a href="#" className="group">
        <div className="flex flex-wrap items-center">
          <span
            className="text-xs text-gray-900 transition duration-200 font-semibold"
            data-config-id="txt-c7761e-27"
          >
            Checkout
          </span>
          <div className="text-gray-500 group-hover:text-gray-900 transition duration-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={20}
              height={20}
              viewBox="0 0 20 20"
              fill="none"
              data-config-id="svg-c7761e-2"
            >
              <path
                d="M12.9465 9.40832L8.22986 4.69999C8.15239 4.62188 8.06022 4.55989 7.95867 4.51758C7.85712 4.47527 7.7482 4.45349 7.63819 4.45349C7.52818 4.45349 7.41926 4.47527 7.31771 4.51758C7.21616 4.55989 7.124 4.62188 7.04653 4.69999C6.89132 4.85613 6.8042 5.06734 6.8042 5.28749C6.8042 5.50764 6.89132 5.71885 7.04653 5.87499L11.1715 10.0417L7.04653 14.1667C6.89132 14.3228 6.8042 14.534 6.8042 14.7542C6.8042 14.9743 6.89132 15.1855 7.04653 15.3417C7.12371 15.4204 7.21574 15.483 7.31731 15.526C7.41887 15.5689 7.52794 15.5912 7.63819 15.5917C7.74845 15.5912 7.85752 15.5689 7.95908 15.526C8.06064 15.483 8.15268 15.4204 8.22986 15.3417L12.9465 10.6333C13.0311 10.5553 13.0986 10.4606 13.1448 10.3552C13.191 10.2497 13.2148 10.1359 13.2148 10.0208C13.2148 9.90574 13.191 9.7919 13.1448 9.68648C13.0986 9.58107 13.0311 9.48636 12.9465 9.40832Z"
                fill="currentColor"
              />
            </svg>
          </div>
        </div>
      </a>
      <a
        href="#"
        className="text-xs text-gray-500 hover:text-gray-900 transition duration-200"
        data-config-id="txt-c7761e-24"
      >
        Payment
      </a>
    </div>
    <div className="flex flex-wrap -m-8 xl:-m-16">
      <div className="w-full md:w-7/12 p-8 xl:p-16">
        <h6
          className="mb-4 text-lg font-semibold uppercase"
          data-config-id="txt-c7761e-1"
        >
          Thông tin đặt hàng
        </h6>
        <div className="">
            <div className="space-x-0 lg:flex lg:space-x-4">
              <div className="w-full lg:w-1/2">
                <label className="block mb-3 text-sm font-semibold text-gray-500">Name</label>
                <input
                  required={true}
                  {...register('name', { required: true, maxLength: 10 })}
                  type="text"
                  placeholder="Name"
                  className="w-full px-4 py-2 text-sm border border-gray-300 rounded lg:text-sm focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
                {errors.name?.type === 'required' && (
                  <p className="text-red-500" role="alert">
                    Name is required
                  </p>
                )}
              </div>
              <div className="w-full lg:w-1/2 ">
                <label className="block mb-3 text-sm font-semibold text-gray-500">Phone number</label>
                <input
                  {...register('contact', { required: true, maxLength: 10 })}
                  type="text"
                  placeholder="Phone number"
                  className="w-full px-4 py-2 text-sm border border-gray-300 rounded lg:text-sm focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
                {errors.contact?.type === 'required' && (
                  <p className="text-red-500" role="alert">
                    Phone number is required
                  </p>
                )}
              </div>
            </div>
            <div className="space-x-0 lg:flex lg:space-x-4 mt-4">
              <div className="w-full lg:w-1/2">
                <label className="block mb-3 text-sm font-semibold text-gray-500">Email</label>
                <input
                  {...register('email', { required: true })}
                  type="email"
                  placeholder="Email"
                  className="w-full px-4 py-2 text-sm border border-gray-300 rounded lg:text-sm focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
                {errors.email?.type === 'required' && (
                  <p className="text-red-500" role="alert">
                    Email is required
                  </p>
                )}
              </div>
              <div className="w-full lg:w-1/2 ">
                <label className="block mb-3 text-sm font-semibold text-gray-500"> Address</label>
                <textarea
                  {...register('shippingaddress')}
                  className="flex items-center w-full px-4 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-600"
                  rows={2}
                  placeholder="Shipping Address"
                />
                {errors.shippingaddress?.type === 'required' && (
                  <p className="text-red-500" role="alert">
                    Shipping address is required
                  </p>
                )}
              </div>
            </div>
            <div className="my-8 px-4 py-6 border border-gray-100 rounded-lg">
              <h3 className="pb-4 text-lg font-semibold uppercase" data-config-id="txt-040ffd-1">
                CHọn hình thức thanh toán
              </h3>
          
              <div className="flex flex-wrap -m-2">
                <div className="w-full p-2">
                  <div className="p-4 border border-gray-100 rounded-lg">
                    <div className="flex flex-wrap items-center justify-between -m-2">
                      <div className="w-auto p-2">
                        <label className="relative flex items-center gap-2">
                          <input {...register('paymenttype', { required: true })} className=" h-4 w-4" id="paymentCash"  type="radio"  value="CASH"/>
          
                          <span className="text-sm" data-config-id="txt-040ffd-19">
                            CASH
                          </span>
                        </label>
                      </div>
                      <div className="w-auto p-2">
                        <img src="shopky-assets/payment/paypal.png" alt="" data-config-id="img-040ffd-2" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full p-2">
                  <div className="p-4 border border-gray-100 rounded-lg">
                    <div className="flex flex-wrap items-center justify-between -m-2">
                      <div className="w-auto p-2">
                        <label className="relative flex items-center gap-2">
                          <input {...register('paymenttype', { required: true })} className=" h-4 w-4" id="paymentCredit" type="radio" value="CREDIT" />
                          <span className="text-sm" data-config-id="txt-040ffd-20">
                            CREDIT
                          </span>
                        </label>
                      </div>
                      <div className="w-auto p-2">
                        <div className="flex flex-wrap items-center -m-1.5">
                          <div className="w-auto p-1.5">
                            <img src="shopky-assets/payment/spay.png" alt="" data-config-id="img-040ffd-3" />
                          </div>
                          <div className="w-auto p-1.5">
                            <img src="shopky-assets/payment/dana.png" alt="" data-config-id="img-040ffd-4" />
                          </div>
                          <div className="w-auto p-1.5">
                            <img src="shopky-assets/payment/ovo.png" alt="" data-config-id="img-040ffd-5" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full p-2">
                  <div className="p-4 border border-gray-100 rounded-lg">
                    <div className="flex flex-wrap items-center justify-between -m-2">
                      <div className="w-auto p-2">
                        <label className="relative flex items-center gap-2">
                          <input {...register('paymenttype', { required: true })} className="h-4 w-4" id="paymentVnpay" type="radio" value="VNPAY"  />
                          <span className="text-sm" data-config-id="txt-040ffd-20">
                            VNPAY
                          </span>
                        </label>
                      </div>
                      <div className="w-auto p-2">
                        <div className="flex flex-wrap items-center -m-1.5">
                          <div className="w-auto p-1.5">
                            <img src="https://static.shuffle.dev/components/preview/928b7c01-6cbd-4e98-803d-a6199b9aea57/assets/public/shopky-assets/payment/paypal.png" alt="" data-config-id="img-040ffd-3" />
                          </div>
                          <div className="w-auto p-1.5">
                            <img src="shopky-assets/payment/dana.png" alt="" data-config-id="img-040ffd-4" />
                          </div>
                          <div className="w-auto p-1.5">
                            <img src="shopky-assets/payment/ovo.png" alt="" data-config-id="img-040ffd-5" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full p-2">
                  <div className="p-4 border border-gray-100 rounded-lg">
                    <div className="flex flex-wrap items-center justify-between -m-2">
                      <div className="w-auto p-2">
                        <label className="relative flex items-center gap-2">
                          <input {...register('paymenttype', { required: true })} className="h-4 w-4" id="paymentMomo" type="radio" value="MOMO"  />
                          <span className="text-sm" data-config-id="txt-040ffd-20">
                            MOMO
                          </span>
                        </label>
                      </div>
                      <div className="w-auto p-2">
                        <div className="flex flex-wrap items-center -m-1.5">
                          <div className="w-auto p-1.5">
                            <img src="https://cdn2.cellphones.com.vn/x/media/wysiwyg/momo_1.png" alt="" data-config-id="img-040ffd-3" />
                          </div>
                            <div className="w-auto p-1.5">
                              <img src="shopky-assets/payment/dana.png" alt="" data-config-id="img-040ffd-4" />
                            </div>
                            <div className="w-auto p-1.5">
                              <img src="shopky-assets/payment/ovo.png" alt="" data-config-id="img-040ffd-5" />
                            </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
           
          </div>
      </div>
      <div className="w-full md:w-5/12 p-8 xl:p-16">
        <h6
          className="mb-4 text-lg font-semibold uppercase"
          data-config-id="txt-c7761e-4"
        >
          Đơn hàng
        </h6>
        <div className="border-b border-dashed border-gray-500 h-56 overflow-hidden overflow-y-scroll p-3">
            {
              items.map((item, index) => {
                return(
                  <div className="flex flex-wrap -m-2 mb-2" key={index}>
                  <div className="w-full md:w-3/4 p-2">
                    <div className="flex flex-wrap -m-2">
                      <div className="w-auto p-2">
                        <img
                          className="w-24 h-24 object-contain rounded-lg border-2 border-gray-400"
                          src={`http://localhost:9000` + `${item.imageURL}`} alt={item.name}
                          data-config-id="img-c7761e-1"
                        />
                      </div>
                      <div className="flex-1 p-2">
                        <p className="mb-1.5 w-40 overflow-hidden whitespace-nowrap overflow-ellipsis text-base font-bold" data-config-id="txt-c7761e-6">
                          {item.name}
                        </p>
                        <p className="mb-1.5" data-config-id="txt-c7761e-7">
                          quantity
                        </p>
                        <p data-config-id="txt-c7761e-8">x {item.quantity}</p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full md:w-1/4 p-2">
                    <p
                      className="flex justify-end font-semibold"
                      data-config-id="txt-c7761e-9"
                    >
                      {item.price}
                    </p>
                  </div>
                </div>
                )
              })
            }
        </div>
        <div className="pt-6 pb-2 border-b border-dashed border-gray-300">
          <h6
            className="mb-2 text-lg font-semibold uppercase"
            data-config-id="txt-c7761e-5"
          >
            Mã giảm giá
          </h6>
          <form action="#">
            <div className="flex flex-wrap items-center -m-2 mb-0.5">
              <div className="w-full lg:flex-1 p-2">
                <input
                  type="text"
                  name="voucher"
                  className="py-3 px-4 w-full text-sm placeholder-gray-400 bg-gray-50 outline-none focus:ring focus:ring-gray-100 border border-gray-100 rounded-lg transition duration-200"
                  placeholder="Enter your voucher"
                  data-config-id="input-c7761e-11"
                />
              </div>
              <div className="w-full lg:w-auto p-2">
                <button
                  className="py-3 px-7 w-full text-sm font-semibold bg-gray-50 hover:bg-gray-100 focus:bg-gray-100 focus:ring-4 focus:ring-gray-200 rounded-lg transition duration-300"
                  data-config-id="txt-c7761e-50"
                >
                  Apply
                </button>
              </div>
            </div>
          </form>
          <p className="text-sm">
            New customer?{" "}
            <a
              href="#"
              className="inline-block text-green-800 hover:text-green-900 font-semibold"
              data-config-id="txt-c7761e-25"
            >
              Sign up
            </a>{" "}
            to get better deals
          </p>
        </div>
        <div className="py-2 border-b border-dashed border-gray-300">
          <div className="flex flex-wrap justify-between -m-2">
            <div className="w-auto p-2">
              <span className="text-gray-300" data-config-id="txt-c7761e-37">
                Subtotal
              </span>
            </div>
            <div className="w-auto p-2">
              <span className="font-semibold" data-config-id="txt-c7761e-38">
                {itemTotal}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap justify-between -m-2">
            <div className="w-auto p-2">
              <span className="text-gray-300" data-config-id="txt-c7761e-39">
                Discount
              </span>
            </div>
            <div className="w-auto p-2">
              <span
                className="font-semibold text-gray-300"
                data-config-id="txt-c7761e-40"
              >
                -0
              </span>
            </div>
          </div>
          <div className="flex flex-wrap justify-between -m-2">
            <div className="w-auto p-2">
              <span className="text-gray-300" data-config-id="txt-c7761e-41">
                Shipment cost
              </span>
            </div>
            <div className="w-auto p-2">
              <span
                className="font-semibold text-gray-300"
                data-config-id="txt-c7761e-42"
              >
                0
              </span>
            </div>
          </div>
        </div>
        <div className="pt-2.5 mb-9">
          <div className="flex flex-wrap items-center justify-between -m-2">
            <div className="w-auto p-2">
              <p className="font-semibold" data-config-id="txt-c7761e-22">
                Tổng tiền
              </p>
            </div>
            <div className="w-auto p-2">
              <p
                className="text-2xl font-semibold"
                data-config-id="txt-c7761e-23"
              >
                {total}
              </p>
            </div>
          </div>
        </div>
        <button
          className="py-3 px-7 w-full uppercase text-sm text-white font-semibold bg-gray-900 hover:bg-gray-800 focus:bg-gray-800 focus:ring-4 focus:ring-gray-200 rounded-4xl transition duration-300"
          data-config-id="txt-c7761e-51"
        >
          Đặt hàng
        </button>
      </div>
    </div>
  </div>
      </form>
    </section>
  );
};

export default CheckoutPage;
