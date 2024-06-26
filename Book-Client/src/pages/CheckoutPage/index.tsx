import { useCartStore } from '../../hooks/useCartStore';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import axios from 'axios';
import moment from 'moment';
import { axiosClient } from '../../library/axiosClient';
import config from '../../constants/config';

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
  const { items, total, itemCount, placeOrder, isLoading, error } = useCartStore();
  const [members, setMembers] = React.useState<any[]>([]);
  const [refresh, setRefresh] = React.useState<boolean>(false);

  React.useEffect(() => {
    const fetchMembers = async () => {
      const response = await axios.get('http://localhost:9000/members');
      setMembers(response.data);
    };
    fetchMembers();
    console.log(members);
  }, [refresh]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    console.log(data);

    const newMemberdata = {
      name: data.name,
      contact: data.contact,
      email: data.email,
      address: data.shippingaddress,
    };

    console.log(newMemberdata);

    //check new member exist in database or not
    const existingMember = members.find(
      (member) => (member.contact === newMemberdata.contact && member.email === newMemberdata.email) || member.email === newMemberdata.email,
    );

    if (existingMember) {
      const newOrderData = {
        status: 'WAITING',
        shippingAddress: data.shippingaddress,
        paymenttype: data.paymenttype,
        description: data.description,
        memberId: existingMember.id,
      };
      console.log('exist', newOrderData);
      const payload = {
        ...newOrderData,
        orderDetails: items.map((item) => ({
          bookId: item.id,
          quantity: item.quantity,
          discount: item.discount,
          imageURL: item.imageURL,
          name: item.name,
          price: item.price,
        })),
      };
      console.log(payload);
      const result = await placeOrder(payload);
      if (result.ok) {
        navigate('/checkout-done');
      }
    } else {
      const pushMember = await axios.post(config.urlAPI + '/members', newMemberdata);
      console.log(pushMember.data);
      const newOrderData = {
        status: 'WAITING',
        shippingAddress: data.shippingaddress,
        paymenttype: data.paymenttype,
        description: data.description,
        memberId: pushMember.data.id,
      };
      console.log(newOrderData);
      const payload = {
        ...newOrderData,
        orderDetails: items.map((item) => ({
          bookId: item.id,
          quantity: item.quantity,
          discount: item.discount,
          imageURL: item.imageURL,
          name: item.name,
          price: item.price,
        })),
      };
      console.log(payload);
      const result = await placeOrder(payload);
      if (result.ok) {
        navigate('/checkout-done');
      }
    }
  };

  return (
    <div className="container p-12 mx-auto">
      {/* {error ? <div className="p-5 mb-3 text-red-500 bg-red-100">{error}</div> : null} */}
      <div className="flex flex-col w-full px-0 mx-auto lg:flex-row">
        <div className="flex flex-col md:w-full">
          <h2 className="mb-4 font-bold md:text-xl text-heading ">Shipping Information</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="justify-center w-full mx-auto">
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

              <div className="relative pt-3 xl:pt-6">
                <label className="block mb-3 text-sm font-semibold text-gray-500"> Notes (Optional)</label>
                <textarea
                  {...register('description')}
                  className="flex items-center w-full px-4 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-600"
                  rows={2}
                  placeholder="Notes for delivery"
                ></textarea>
              </div>
              <h2 className="mt-8 font-bold md:text-xl text-heading ">Payment methods</h2>
              <div className="mt-4 flex justify-between">
                <div className="w-full lg:w-1/2 flex items-center gap-x-4">
                  <input {...register('paymenttype', { required: true })} className="h-5 w-5" id="paymentCash" type="radio" value="CASH" />
                  <label htmlFor="paymentCash">Cash</label>
                </div>

                <div className="w-full lg:w-1/2 flex items-center gap-x-4">
                  <input {...register('paymenttype', { required: true })} className="h-5 w-5" id="paymentCredit" type="radio" value="CREDIT" />
                  <label htmlFor="paymentCredit">Credit Card</label>
                </div>
              </div>
              <h2 className="mt-8 font-bold md:text-xl text-heading ">Promotion Code</h2>
              <div className="my-5 flex gap-x-5">
                <div className="flex-1">
                  <input
                    placeholder="Enter your promotion code"
                    type="text"
                    className="w-full px-4 py-2 text-sm border border-gray-300 rounded lg:text-sm focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>
                <div className="w-1/2">
                  <button className="bg-white px-4 py-2 text-slate-900 border-slate-200 border hover:bg-slate-100 rounded">Apply</button>
                </div>
              </div>
              <button
                onClick={() => {
                  setRefresh(!refresh);
                }}
                type="submit"
                className="mt-4 w-full px-6 py-3 text-white bg-indigo-600 hover:bg-indigo-700 rounded font-bold text-xl"
              >
                {isLoading ? 'Submitting....' : 'Place Order'}
              </button>
            </div>
          </form>
        </div>
        <div className="flex flex-col w-full ml-0 lg:ml-12 lg:w-3/5 bg-slate-100 p-4 rounded">
          <div className="pt-12 md:pt-0 2xl:ps-4">
            <h2 className="text-xl font-bold">Order Summary</h2>
            {items.map((item, index) => {
              return (
                <div className="mt-8" key={index}>
                  <div className="flex flex-col space-y-4">
                    <div className="flex space-x-4">
                      <div className="w-10">
                        <img src={`http://localhost:9000` + `${item.imageURL}`} alt={item.name} className="w-full" />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-xl">{item.name}</h2>
                        <p className="text-sm">Attributes</p>
                        <p className="flex justify-between">
                          <span className="text-red-600">Price</span>
                          <span>
                            ${item.price} * {item.quantity} = ${item.price * item.quantity}
                          </span>
                        </p>
                        <p className="flex justify-between">
                          <span className="text-red-600">Discount</span>
                          <span>- ${item.discount}%</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div className="flex items-center justify-end w-full py-4 text-sm font-semibold border-b border-gray-300 lg:py-5 text-heading last:border-b-0 last:text-base last:pb-0">
              Subtotal<span className="ml-2">${total}</span>
            </div>
            <div className="flex items-center justify-end w-full py-4 text-sm font-semibold border-b border-gray-300 lg:py-5 text-heading last:border-b-0 last:text-base last:pb-0">
              Shipping Tax<span className="ml-2"></span>
            </div>
            {/* <div className="flex items-center justify-end w-full py-4 text-sm font-semibold border-b border-gray-300 lg:py-5 text-heading last:border-b-0 last:text-base last:pb-0">
              Discount<span className="ml-2">-${discount}%</span>
            </div> */}
            <div className="flex items-center justify-end w-full py-4 text-lg text-red-500 font-semibold border-b border-gray-300 lg:py-5 text-heading last:border-b-0 last:text-lg last:pb-0">
              Total<span className="ml-2">${total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
