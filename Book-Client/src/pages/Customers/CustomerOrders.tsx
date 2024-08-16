import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog } from '@headlessui/react';
import { AiOutlineExclamationCircle } from 'react-icons/ai';
import useAuth from '../../hooks/useAuth';
import { axiosClient } from '../../library/axiosClient';
import { useCartStore } from '../../hooks/useCartStore';


  interface DataType {
    id: number;
    orderday: string;
    shippedday: string | null;
    status: string;
    shippingaddress: string;
    paymenttype: string;
    description: string;
    employeeId: number | null;
    memberId: number | null;
    member: {
      id: number;
      name: string;
    };
    employee: {
      id: number;
      name: string;
    };
    orderDetails: {
      orderId?: number;
      book: {
        id: number;
        name: string;
        author?: string;
        title: string;
        quantity: number;
        price: number;
        serialnumber: number;
        description?: string;
        discount: number;
        imageURL: string;
        slug?: string;
        categoryId: number;
        category: {
          id: number;
          name: string;
          description: string;
        };
        punlisherId: number;
      };
      quantity: number;
      price: number;
      discount: number;
      subtotalorder?: number;
    }[];
  }

  const CustomerOrders = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [userOrders, setUserOrders] = useState<DataType[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<DataType | null>(null);
    const [loadingTable, setLoadingTable] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [orderToCancel, setOrderToCancel] = useState<DataType | null>(null);
    const { total } = useCartStore();
    useEffect(() => {
      if (user) {
        axiosClient.get(`/orders/personal/${user?.id}`).then((res) => {
          setUserOrders(res.data.orders);
          setLoadingTable(false);
        });
      }
    }, [axiosClient, user, user?.id]);

    useEffect(() => {
      const updatedSelectedOrder = userOrders?.find((order) => order.id === selectedOrder?.id);
      setSelectedOrder(updatedSelectedOrder || null);
    }, [selectedOrder?.id, userOrders]);


    const handleCancelOrder = async (order: DataType) => {
      try {
        const handleCanceled = await axiosClient.patch(`/orders/${order.id}`, {
          status: 'CANCELED',
        });
        
        if (handleCanceled?.data.id) {
          console.log('handleCanceled')
          await axiosClient.post(`/books/orderm/${order.id}/stock`);
          setUserOrders((prevOrders) =>
            prevOrders.map((o) => (o.id === order.id ? { ...o, status: 'CANCELED' } : o))
          );
          setIsModalOpen(false);
        } else {
          console.error('ERROR!');
        }
      } catch (error) {
        console.error('Error occurred:', error);
      }
      
    };
    
  const calculateTotalPrice = (orderDetails: DataType['orderDetails']) => {
    return orderDetails.reduce((total, item) => {
      return total + item.price * item.quantity * (1 - item.discount / 100);
    }, 0);
  };

  const openCancelModal = (order: DataType) => {
    setOrderToCancel(order);
    setIsModalOpen(true);
  };

  return (
    <>
      <section data-section-id={1} data-share="" data-category="order-history" data-component-id="cfc459fa_07_awz" className="py-12 bg-purple-100 relative">
        <div className="container px-4 mx-auto">
          <p className="text-rhino-300 text-center text-xs font-bold tracking-widest uppercase">Recent orders</p>
          <h1 className="font-heading text-rhino-700 text-center text-4xl font-semibold mb-12">Order History</h1>
          <div className="bg-white rounded-xl shadow-md">
            <div className="border-b border-gray-100"></div>
            <div className="overflow-x-auto">
              <table className="max-w-full">
                <thead>
                  <tr>
                    <th className="py-4 px-10 border-b border-coolGray-200 text-rhino-800 text-sm">Nr</th>
                    <th className="py-4 px-10 border-b border-coolGray-200 text-rhino-800 text-sm">Sản phẩm</th>
                    <th className="py-4 px-10 border-b border-coolGray-200 text-rhino-800 text-sm">Số lượng</th>
                    <th className="py-4 px-10 border-b border-coolGray-200 text-rhino-800 text-sm">Giá</th>
                    <th className="py-4 px-10 border-b border-coolGray-200 text-rhino-800 text-sm">Hình thức</th>
                    <th className="py-4 px-10 border-b border-coolGray-200 text-rhino-800 text-sm">Trạng thái</th>
                    <th className="py-4 px-15 border-b border-coolGray-200 text-rhino-800 text-sm"></th>
                  </tr>
                </thead>
                <tbody>
                  {userOrders.map((order, index) => (
                    <tr key={order.id}>
                      <td className="py-4 px-10 border-b border-coolGray-200 text-rhino-800 text-sm">{index + 1}</td>
                      <td className="py-4 px-10 border-b border-coolGray-200">
                        <div className="flex items-center gap-5">
                          <div className="bg-gray-100 rounded-lg w-20 h-20 flex items-center justify-center">
                            <img className="h-full" src={`http://localhost:9000${order.orderDetails[0]?.book.imageURL}`} alt="" />
                          </div>
                          <p className="text-rhino-800 text-sm whitespace-nowrap">{order.orderDetails[0]?.book.name}</p>
                        </div>
                      </td>
                      <td className="py-4 px-10 border-b border-coolGray-200 text-center text-rhino-300 text-sm">{order.orderDetails[0]?.quantity}</td>
                      <td className="py-4 px-10 border-b border-coolGray-200 text-rhino-300 text-sm">
                        {Number(order.orderDetails[0]?.price * (1 - order.orderDetails[0]?.discount / 100)).toLocaleString('vi-VN', {
                          style: 'currency',
                          currency: 'VND',
                        })}
                      </td>
                      <td className="py-4 px-10 border-b border-coolGray-200 text-rhino-300 text-sm text-right">
                        <span className="inline-block py-1 px-3 rounded-xl bg-sky-500 uppercase text-white text-xs font-bold tracking-widest">
                          {order.paymenttype}
                        </span>
                      </td>
                      <td className="py-4 px-10 border-b border-coolGray-200 text-rhino-800 text-sm">
                        {order.status === 'WAITING' ? (
                          <span className="inline-block py-1 px-3 rounded-xl bg-yellow-500 uppercase text-white text-xs font-bold tracking-widest">
                            {order.status}
                          </span>
                        ) : order.status === 'COMPLETED' ? (
                          <span className="inline-block py-1 px-3 rounded-xl bg-sky-500 uppercase text-white text-xs font-bold tracking-widest">
                            {order.status}
                          </span>
                        ) : (
                          <span className="inline-block py-1 px-3 rounded-xl bg-red-500 uppercase text-white text-xs font-bold tracking-widest">
                            {order.status}
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-10 border-b">
                        <div className="flex justify-around items-center gap-2 px-6">
                          <button
                            className="inline-block py-1 px-3 rounded-xl uppercase text-black border-2 border-gray-400 text-xs font-bold tracking-widest"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <span>Xem đơn</span>
                          </button>
                          {order.status === 'WAITING' && (
                            <button
                              className="inline-block py-1 px-3 rounded-xl bg-orange-500 uppercase text-white text-xs font-bold tracking-widest"
                              onClick={() => openCancelModal(order)}
                            >
                              <span>Huỷ đơn</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-2"></div>
          </div>
        </div>

        <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="relative z-10">
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="mx-auto max-w-sm rounded bg-white p-6">
              <Dialog.Title className="text-lg font-medium text-gray-900">Xác nhận huỷ đơn hàng</Dialog.Title>
              <Dialog.Description className="mt-2 text-sm text-gray-500">
                Bạn có chắc chắn muốn huỷ đơn hàng này không? Hành động này không thể hoàn tác.
              </Dialog.Description>
              <div className="mt-4 flex justify-end gap-2">
                <button className="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600" onClick={() => handleCancelOrder(orderToCancel!)}>
                  Huỷ đơn
                </button>
                <button className="rounded-md bg-gray-200 px-4 py-2" onClick={() => setIsModalOpen(false)}>
                  Đóng
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </section>

      <div>
  {selectedOrder && (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
      <div className="py-5 bg-white border border-coolGray-200 rounded-xl shadow-md mb-6 absolute container right-14 top-64 z-50">
        <div className="p-6 border-b border-gray-100">
          {selectedOrder.status === 'WAITING' ? (
            <span className="mb-4 inline-block py-1 px-3 rounded-xl bg-yellow-500 uppercase text-white text-xs font-bold tracking-widest">
              {selectedOrder.status}
            </span>
          ) : selectedOrder.status === 'COMPLETED' ? (
            <span className="mb-4 inline-block py-1 px-3 rounded-xl bg-sky-500 uppercase text-white text-xs font-bold tracking-widest">
              {selectedOrder.status}
            </span>
          ) : (
            <span className="mb-4 inline-block py-1 px-3 rounded-xl bg-red-500 uppercase text-white text-xs font-bold tracking-widest">
              {selectedOrder.status}
            </span>
          )}

          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <h2 className="font-heading text-rhino-800 text-2xl font-semibold" data-config-id="auto-txt-4-5">
              ID number: {selectedOrder.id}
            </h2>
            <div className="flex flex-wrap gap-2">
              <a
                className="py-2 px-4 bg-purple-500 rounded-sm text-center text-sm text-white font-medium hover:bg-purple-600 transition duration-200"
                onClick={() => setSelectedOrder(null)}
              >
                Đóng
              </a>
            </div>
          </div>
          <div className="flex gap-12 flex-wrap mb-4">
            <div>
              <p className="text-rhino-400 text-sm font-semibold mb-1" data-config-id="auto-txt-7-7">
                Khách hàng
              </p>
              <p className="text-rhino-700 text-sm" data-config-id="auto-txt-8-7">
                {selectedOrder.member.name}
              </p>
            </div>
            <div>
              <p className="text-rhino-400 text-sm font-semibold mb-1" data-config-id="auto-txt-9-7">
                Hình thức thanh toán
              </p>
              <p className="text-rhino-700 text-sm" data-config-id="auto-txt-10-7">
                {selectedOrder.paymenttype}
              </p>
            </div>
            <div>
              <p className="text-rhino-400 text-sm font-semibold mb-1" data-config-id="auto-txt-11-7">
                Địa chỉ
              </p>
              <p className="text-rhino-700 text-sm" data-config-id="auto-txt-12-7">
                {selectedOrder.shippingaddress}
              </p>
            </div>
            <div>
              <p className="text-rhino-400 text-sm font-semibold mb-1" data-config-id="auto-txt-13-7">
                Ngày đặt hàng
              </p>
              <p className="text-rhino-700 text-sm" data-config-id="auto-txt-14-7">
                {selectedOrder.orderday}
              </p>
            </div>
          </div>
          <div className="flex gap-12 flex-wrap">
            <div>
              <p className="text-rhino-400 text-sm font-semibold mb-1" data-config-id="auto-txt-7-7">
                Nhân viên
              </p>
              <p className="text-rhino-700 text-sm" data-config-id="auto-txt-8-7">
                {selectedOrder.employee?.name}
              </p>
            </div>
            <div>
              <p className="text-rhino-400 text-sm font-semibold mb-1" data-config-id="auto-txt-9-7">
                Ngày giao
              </p>
              <p className="text-rhino-700 text-sm" data-config-id="auto-txt-10-7">
                {selectedOrder.shippedday}
              </p>
            </div>
            <div>
              <p className="text-rhino-400 text-sm font-semibold mb-1" data-config-id="auto-txt-11-7">
                Tổng tiền
              </p>
              <p className="text-rhino-700 text-sm" data-config-id="auto-txt-12-7">
                {calculateTotalPrice(selectedOrder.orderDetails).toLocaleString('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                })}
              </p>
            </div>
            <div>
              <p className="text-rhino-400 text-sm font-semibold mb-1" data-config-id="auto-txt-13-7">
                Ghi chú
              </p>
              <p className="text-rhino-700 text-sm" data-config-id="auto-txt-14-7">
                {selectedOrder?.description}
              </p>
            </div>
          </div>
        </div>
        <div className="p-6 border-b border-gray-100">
          {selectedOrder.orderDetails.map((item) => (
            <div key={item.orderId} className="flex items-center flex-wrap -mx-6">
              <div className="w-full md:w-auto px-4 mb-6 md:mb-0">
                <div className="bg-gray-100 w-20 h-20 rounded-lg flex items-center justify-center">
                  <img className="h-full" src={`http://localhost:9000${item.book.imageURL}`} alt="" data-config-id="auto-img-1-5" />
                </div>
              </div>
              <div className="w-full md:w-2/3 xl:w-5/6 px-4 flex-grow">
                <div className="flex flex-col sm:flex-row flex-wrap sm:items-center justify-between gap-4 mb-2 px-3">
                  <h2 className="text-rhino-800 font-semibold" data-config-id="auto-txt-11-5">
                    {item.book.name}
                  </h2>
                  <p className="text-rhino-500 font-semibold" data-config-id="auto-txt-12-5">
                    {Number(item.price).toLocaleString('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    })}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row flex-wrap sm:items-center justify-between gap-4 px-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-rhino-300 text-sm" data-config-id="auto-txt-13-5">
                      {item.book?.author}
                    </p>
                    <div className="w-px h-3 bg-rhino-200" />
                    <p className="text-rhino-300 text-sm" data-config-id="auto-txt-14-5">
                      {item.discount}%
                    </p>
                  </div>
                  <p className="text-sm text-rhino-300" data-config-id="auto-txt-16-5">
                    Qty: {item.quantity}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )}
</div>

    </>
  );
};

export default CustomerOrders;
