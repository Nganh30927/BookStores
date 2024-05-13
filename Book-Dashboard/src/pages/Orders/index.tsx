import React, { useState } from 'react';
import { Space, Table, Button, Modal, Form, Input, message, Pagination, Card, Popconfirm, Select, Divider, DatePicker, Drawer } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosClient } from '../../library/axiosClient';
import { useNavigate, useSearchParams } from 'react-router-dom';
import config from '../../constants/config';
import type { PaginationProps, TableColumnsType } from 'antd';
import {
  CalendarOutlined,
  DeleteOutlined,
  EditOutlined,
  FolderAddOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import numeral from 'numeral';
import dayjs from 'dayjs';
import moment from 'moment';
import { PopconfirmProps, Descriptions, DescriptionsProps, Badge } from 'antd';
import type { DatePickerProps, CheckboxProps } from 'antd';

interface DataType {
  id: number;
  orderday: Date;
  shippedday?: Date;
  status: string;
  shippingaddress: string;
  paymenttype: string;
  description?: string;
  employeeId: number;
  memberId: number;
  orderDetails: any[];
}

// type orderDetailsType= {
//   bookId: number;
//   quantity: number;
//   price: number;
//   discount: number;
//   orderId: number;
// };

type Props = {};

export default function Orders({}: Props) {
  const [createForm] = Form.useForm<DataType>();
  const [updateForm] = Form.useForm<DataType>();
  const [formSearchBook] = Form.useForm();
  const [refresh, setRefresh] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [orders, setOrders] = React.useState([]);
  const [selectedOrder, setSelectedOrder] = React.useState<any>(null);
  const [selectedOrderToAddOrderDetails, setSelectedOrderToAddOrderDetails] = React.useState<any>(false);
  const [orderId, setOrderId] = React.useState<any>(0);
  const [order, setOrder] = React.useState<any>([]);
  const [orderDetails, setOrderDetails] = React.useState<any>([{ quantity: 0 }]);
  const [members, setMembers] = React.useState([]);
  const [employees, setEmployees] = React.useState([]);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // Search products
  const [books, setBooks] = React.useState([]);

  // Selected products
  const [finalSelectedBooks, setFinalSelectedBooks] = React.useState<any[]>([]);
  const [selectedBooks, setSelectedBooks] = React.useState<any[]>([]);

  //Checkbox selection

  const onSelectChange = (newSelectedRowKeys: React.Key[], selectedRows: any[]) => {
    console.log(selectedRows, newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
    if (selectedRows.length > 0) {
      setSelectedBooks(selectedRows);
    }
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedBooks([]);
    setFinalSelectedBooks([]);
  };

  const onChange: DatePickerProps['onChange'] = (date, dateString) => {
    console.log(date, dateString);
  };

  const confirm: PopconfirmProps['onConfirm'] = (e) => {
    onDelete(orderId);
  };

  const getOrders = async () => {
    try {
      const response = await axiosClient.get(config.urlAPI + '/orders');
      setOrders(response.data);
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const getMembers = async () => {
    try {
      const response = await axiosClient.get(config.urlAPI + '/members');
      setMembers(response.data);
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const getEmployees = async () => {
    try {
      const response = await axiosClient.get(config.urlAPI + '/employees');
      setEmployees(response.data);
    } catch (error) {
      console.log('Error:', error);
    }
  };

  React.useEffect(() => {
    getMembers();
    getEmployees();
    getOrders();
  }, [refresh]);

  const getOrderbyId = async (orderId: any) => {
    try {
      const response: any = await axiosClient.get(`/orders/${orderId}`);
      setOrder([response.data]);
      setOrderDetails(response.data?.orderDetails);
      console.log('orderDetails', orderDetails);
      setRefresh(!refresh);
    } catch (error) {
      console.log(error);
    }
  };

  const onFinish = async (values: DataType) => {
    try {
      createForm.setFieldsValue({ orderDetails: [] });
      console.log('Success:', values);
      await axiosClient.post(config.urlAPI + '/orders', values);
      getOrders();
      createForm.resetFields();
      message.success('Create order successfully!');
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const onDelete = async (id: number) => {
    try {
      await axiosClient.delete(config.urlAPI + `/orders/${id}`);
      getOrders();
      message.success('Order deleted successfully!');
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const onUpdate = async (values: any) => {
    try {
      console.log('Success:', values);
      await axiosClient.patch(config.urlAPI + `/orders/${selectedOrder.id}`, values);
      getOrders();
      setSelectedOrder(null);
      message.success('Order updated successfully!');
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const onFinishSearchProducts = async (values: any) => {
    try {
      let keyword = values.name;
      const response = await axiosClient.get(config.urlAPI + `/books/search?keyword=${encodeURIComponent(keyword)}`);
      if (response.data.length > 0) {
        setBooks(response.data);
        message.success('Found ' + response.data.length + ' books');
      } else {
        message.error('Not found!');
      }
      setRefresh(!refresh);
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const addBookToOrderDetails = async (bookId: number, orderId: number) => {
    // 1. selectedOrderToAddOrderDetails
    // 2. selectedProducts (quantity = 1)
    try {
      //Find book in orderDetails
      if (orderDetails.length > 0) {
        let found = orderDetails.find((item: any) => item.bookId === bookId);
        if (found) {
          found.quantity += 1;
          found.subtotalorder = found.quantity * found.price * (1 - found.discount / 100);
          console.log('newOrderDetails', orderDetails);
        } else {
          setOrderDetails(selectedBooks.map((p: any) => ({ bookId: p.id, quantity: 1, price: p.price, discount: p.discount })));
          console.log('orderDetails', orderDetails);
        }
      }

      // let orderDetails = selectedBooks.map((p: any) => {
      //   return {
      //     bookId: p.id,
      //     quantity: 1,
      //     price: p.price,
      //     discount: p.discount,
      //   };
      // });

      // console.log('orderDetails', orderDetails);

      // const result = await axiosClient.patch(`/orders/${selectedOrderToAddOrderDetails.id}`, {
      //   orderDetails: orderDetails,
      // });

      // setSelectedOrderToAddOrderDetails(null);
      // setSelectedBooks([]);
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const addSelectedBooks = async () => {
    const found = finalSelectedBooks.find((item: any) => item.id === selectedBooks[0].id);
    if (found) {
      setFinalSelectedBooks(finalSelectedBooks.map((item: any) => (item.id === selectedBooks[0].id ? { ...item } : item)));
    } else {
      setFinalSelectedBooks([...finalSelectedBooks, ...selectedBooks]);
    }
    setSelectedOrderToAddOrderDetails(null);
  };
  console.log('finalSelectedBooks', finalSelectedBooks);

  const columns: TableColumnsType<DataType> = [
    {
      title: 'No.',
      dataIndex: 'index',
      key: 'index',
      width: 60,
      fixed: 'left',

      render: (text: string, record: any, index: number) => {
        return <div style={{ textAlign: 'right' }}>{index + 1}</div>;
      },
    },
    {
      title: 'Member',
      dataIndex: 'member',
      key: 'member',
      fixed: 'left',
      width: 200,
      children: [
        {
          title: 'Name',
          dataIndex: 'member-name',
          key: 'member-name',
          width: '10%',
          render: (text: string, record: any, index: number) => {
            return (
              <div style={{ whiteSpace: 'nowrap' }}>
                <Space>
                  <UserOutlined />
                  <span>{record.member.name}</span>
                </Space>
              </div>
            );
          },
        },
        {
          title: 'Phone',
          dataIndex: 'member-phone',
          key: 'member-phone',
          width: '8%',
          render: (text: string, record: any, index: number) => {
            return (
              <div>
                <Space>
                  <PhoneOutlined />
                  <span>{record.member.contact}</span>
                </Space>
              </div>
            );
          },
        },
        {
          title: 'Email',
          dataIndex: 'member-email',
          key: 'member-email',
          width: '10%',
          render: (text: string, record: any, index: number) => {
            return (
              <div>
                <Space>
                  <MailOutlined />
                  <span>{record.member.email}</span>
                </Space>
              </div>
            );
          },
        },
      ],
    },
    {
      title: 'Employee',
      dataIndex: 'employee',
      key: 'employee',
      children: [
        {
          title: 'Name',
          dataIndex: 'employee-name',
          key: 'employee-name',
          width: '10%',
          render: (text: string, record: any, index: number) => {
            return (
              <div style={{ whiteSpace: 'nowrap' }}>
                <Space>
                  <UserOutlined />
                  <span>{record.employee.name}</span>
                </Space>
              </div>
            );
          },
        },
        {
          title: 'Phone',
          dataIndex: 'employee-phone',
          key: 'employee-phone',
          width: '8%',
          render: (text: string, record: any, index: number) => {
            return (
              <div>
                <Space>
                  <PhoneOutlined />
                  <span>{record.employee.phonenumber}</span>
                </Space>
              </div>
            );
          },
        },
        {
          title: 'Email',
          dataIndex: 'employee-email',
          key: 'employee-email',
          width: '10%',
          render: (text: string, record: any, index: number) => {
            return (
              <div>
                <Space>
                  <MailOutlined />
                  <span>{record.employee.email}</span>
                </Space>
              </div>
            );
          },
        },
      ],
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: '7%',
      render: (text: string, record: any, index: number) => {
        return <span>{text}</span>;
      },
    },
    {
      title: () => {
        return <div style={{ whiteSpace: 'nowrap' }}>Payment Type</div>;
      },
      dataIndex: 'paymenttype',
      key: 'paymenttype',
      width: '8%',
      render: (text: string, record: any, index: number) => {
        return <span>{text}</span>;
      },
    },
    {
      title: 'Date',
      dataIndex: 'orderday',
      key: 'orderday',
      width: '11%',
      render: (text: string, record: any, index: number) => {
        return (
          <div style={{ whiteSpace: 'nowrap' }}>
            <Space>
              <CalendarOutlined />
              <span>{dayjs(text).format('DD MMM YYYY HH:mm')}</span>
            </Space>
          </div>
        );
      },
    },
    {
      title: 'Shipped Date',
      dataIndex: 'shippedday',
      key: 'shippedday',
      width: '11%',
      render: (text: string, record: any, index: number) => {
        return (
          <div style={{ whiteSpace: 'nowrap' }}>
            <Space>
              {text && <CalendarOutlined />}
              <span> {text ? dayjs(text).format('DD MMM YYYY HH:mm') : ''}</span>
            </Space>
          </div>
        );
      },
    },

    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: '10%',
      render: (text: string, record: any, index: number) => {
        return <span>{text}</span>;
      },
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      width: '12%',
      align: 'center',
      fixed: 'right',
      render: (text: any, record: any) => {
        return (
          <Space size="small">
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => {
                setSelectedOrder(record);
                const newvalues = { ...record, orderday: moment(record.orderday), shippedday: moment(record.shippedday) };
                updateForm.setFieldsValue(newvalues);
                console.log('record', newvalues);
              }}
            />
            <Popconfirm title="Delete the order" description="Are you sure to delete this order?" onConfirm={confirm}>
              <Button
                type="primary"
                danger
                icon={<DeleteOutlined />}
                onClick={() => {
                  setOrderId(record.id);
                }}
              />
            </Popconfirm>

            <Button
              type="primary"
              onClick={() => {
                setIsModalOpen(true);
                getOrderbyId(record.id);
                console.log('orderDetails', orderDetails);
              }}
            >
              +
            </Button>
          </Space>
        );
      },
    },
  ];

  const books_columns: TableColumnsType<any> = [
    {
      title: 'No.',
      dataIndex: 'index',
      key: 'index',
      width: '1%',
      render: (text: string, record: any, index: number) => {
        return <div style={{ textAlign: 'right' }}>{index + 1}</div>;
      },
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: '20%',
      render: (text: string, record: any, index: number) => {
        return <span>{record.category.name}</span>;
      },
    },
    {
      title: 'Publisher',
      dataIndex: 'publisher',
      key: 'supplier',
      width: '20%',
      render: (text: string, record: any, index: number) => {
        return <span>{record.publisher.name}</span>;
      },
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name1',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      width: '1%',
      render: (text: string, record: any, index: number) => {
        return <div style={{ textAlign: 'right' }}>{numeral(text).format('$0,0')}</div>;
      },
    },
    {
      title: 'Discount',
      dataIndex: 'discount',
      key: 'discount',
      width: '1%',
      render: (text: string, record: any, index: number) => {
        let color = '#4096ff';

        if (record.discount >= 50) {
          color = '#ff4d4f';
        }

        return <div style={{ textAlign: 'right', color: color }}>{numeral(text).format('0,0.0')}%</div>;
      },
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      width: '1%',
      render: (text: string, record: any, index: number) => {
        return <div style={{ textAlign: 'right' }}>{numeral(text).format('$0,0')}</div>;
      },
    },

    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      width: '1%',
      render: (text: string, record: any, index: number) => {
        return <div style={{ textAlign: 'right' }}>{numeral(text).format('0,0.0')}</div>;
      },
    },
  ];

  const OrdersDetail: DescriptionsProps['items'] = [
    {
      key: 'id',
      label: 'Order ID',
      span: 2,
      children: order && order?.map((item: any, index: number) => <span key={index}>{item.id}</span>),
    },

    {
      key: 'status',
      label: 'Status',
      children:
        order &&
        order?.map((item: any, index: number) => {
          return (
            <Badge
              key={index}
              status={
                item.status === 'COMPLETED'
                  ? 'success'
                  : 'processing' && item.status === 'CANCELED'
                  ? 'error'
                  : 'processing' && item.status === 'WAITING'
                  ? 'processing'
                  : 'error'
              }
              text={item.status}
            />
          );
        }),
      span: 2,
    },

    {
      key: 'members',
      label: 'Member',
      children:
        order &&
        order?.map((item: any, index: number) => {
          return <span key={index}>{item.member.name}</span>;
        }),
      span: 2,
    },
    {
      key: 'employees',
      label: 'Employees',
      children:
        order &&
        order?.map((item: any, index: number) => {
          return <span key={index}>{item.employee.name}</span>;
        }),
      span: 2,
    },

    {
      key: 'description',
      label: 'Mô tả',
      children:
        order &&
        order?.map((item: any, index: number) => {
          return <span key={index}>{item.description}</span>;
        }),
      span: 4,
    },
  ];

  const selectedBookscolumns: TableColumnsType<DataType> = [
    {
      title: 'No.',
      dataIndex: 'index',
      key: 'index',
      width: '1%',
      render: (text: string, record: any, index: number) => {
        return <div style={{ textAlign: 'right' }}>{index + 1}</div>;
      },
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name2',
      width: '1%',
    },
    {
      title: 'Author',
      dataIndex: 'author',
      key: 'author',
      width: '1%',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      width: '1%',
      render: (text: string, record: any, index: number) => {
        return (
          <div style={{ textAlign: 'right' }} key={index}>
            {numeral(text).format('$0,0')}
          </div>
        );
      },
    },
    {
      title: 'Discount',
      dataIndex: 'discount',
      key: 'discount',
      width: '1%',
      render: (text: string, record: any, index: number) => {
        let color = '#4096ff';

        if (record.discount >= 50) {
          color = '#ff4d4f';
        }

        return (
          <div style={{ textAlign: 'right', color: color }} key={index}>
            {numeral(text).format('0,0.0')}%
          </div>
        );
      },
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      width: '1%',
      align: 'right',
      render: (text: string, record: any, index: number) => {
        return <span key={index}>1</span>;
      },
    },
    {
      title: 'Total Price',
      key: 'total',
      width: '1%',
      render: (text: string, record: any, index: number) => {
        return (
          <div style={{ textAlign: 'right' }} key={index}>
            {numeral((record.price - ((100 - record.discount) / 100) * record.price) * record.quantity).format('$0,0')}
          </div>
        );
      },
    },
  ];

  return (
    <div style={{ padding: 36 }}>
      <Card title="Create new order" style={{ width: '100%' }}>
        <Form
          name="create-order"
          form={createForm}
          initialValues={{
            status: 'WAITING',
            paymentType: 'CASH',
          }}
          onFinish={onFinish}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
        >
          <Form.Item<DataType> name="memberId" label="Member">
            <Select
              options={
                members &&
                members?.map((item: any) => {
                  return {
                    label: item.name + ' - ' + item.email + ' - ' + item.contact,
                    value: item.id,
                  };
                })
              }
            />
          </Form.Item>

          <Form.Item<DataType> name="employeeId" label="Employee">
            <Select
              options={
                employees &&
                employees?.map((item: any) => {
                  return {
                    label: item.name + ' - ' + item.email + ' - ' + item.phonenumber,
                    value: item.id,
                  };
                })
              }
            />
          </Form.Item>
          <Form.Item<DataType> name="paymenttype" label="Payment Type">
            <Select
              options={[
                {
                  label: 'Cash',
                  value: 'CASH',
                },
                {
                  label: 'Credit',
                  value: 'CREDIT',
                },
              ]}
            />
          </Form.Item>

          <Form.Item<DataType> name="description" label="Description">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item name="orderDetails" hidden={true}></Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Save changes
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Divider />

      <Table
        dataSource={orders}
        columns={columns}
        bordered
        scroll={{ x: 1800 }}
        title={() => {
          return (
            <div>
              <h3>LIST OF ORDERS</h3>
            </div>
          );
        }}
      />
      <Modal
        centered
        width={800}
        title="Edit order"
        open={selectedOrder}
        okText="Save changes"
        onOk={() => {
          updateForm.submit();
        }}
        onCancel={() => {
          setSelectedOrder(null);
        }}
      >
        <Form form={updateForm} name="update-order" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} initialValues={{ remember: true }} onFinish={onUpdate}>
          <Form.Item<DataType> name="memberId" label="Member">
            <Select
              disabled
              options={
                members &&
                members?.map((item: any) => {
                  return {
                    label: item.name + ' - ' + item?.email + ' - ' + item.contact,
                    value: item.id,
                  };
                })
              }
            />
          </Form.Item>

          <Form.Item<DataType> name="employeeId" label="Employee">
            <Select
              options={
                employees &&
                employees?.map((item: any) => {
                  return {
                    label: item.name + ' - ' + item.email + ' - ' + item.phonenumber,
                    value: item.id,
                  };
                })
              }
            />
          </Form.Item>

          <Form.Item<DataType> name="status" label="Status">
            <Select
              options={[
                {
                  label: 'Waiting',
                  value: 'WAITING',
                },
                {
                  label: 'Completed',
                  value: 'COMPLETED',
                },
                {
                  label: 'Canceled',
                  value: 'CANCELED',
                },
              ]}
            />
          </Form.Item>

          <Form.Item<DataType> name="paymenttype" label="Payment Type">
            <Select
              options={[
                {
                  label: 'Cash',
                  value: 'CASH',
                },
                {
                  label: 'Credit',
                  value: 'CREDIT',
                },
              ]}
            />
          </Form.Item>
          <Form.Item<DataType> name="shippingaddress" label="Shipping Address">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item<DataType> name="shippedday" label="Shipped Date">
            <DatePicker onChange={onChange} />
          </Form.Item>
          <Form.Item<DataType> name="description" label="Description">
            <Input.TextArea rows={2} />
          </Form.Item>

          <Form.Item hidden label="Id" name="id">
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {/* ADD ORDER DETAILS */}
      <Modal
        centered
        width={800}
        title="Add books to order"
        open={selectedOrderToAddOrderDetails}
        onOk={() => {
          console.log('orderDetails', orderDetails);
        }}
        onCancel={() => {
          setSelectedOrderToAddOrderDetails(null);
        }}
      >
        <Form form={formSearchBook} name="search-books" layout="inline" onFinish={onFinishSearchProducts} style={{ paddingBottom: 25 }}>
          <Form.Item name="name" label="Name">
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Search
            </Button>
          </Form.Item>
        </Form>

        <Table rowKey="id" columns={books_columns} dataSource={books} rowSelection={rowSelection} />
        <Button type="primary" icon={<ShoppingCartOutlined />} style={{ marginTop: 25 }} onClick={addSelectedBooks} disabled={!hasSelected}>
          Add
        </Button>
      </Modal>

      <Drawer title="Order Details" placement="right" onClose={handleCancel} open={isModalOpen} width={'40%'}>
        <Descriptions bordered items={OrdersDetail}></Descriptions>
        <Divider />
        <Button
          type="primary"
          icon={<FolderAddOutlined />}
          onClick={() => {
            setSelectedOrderToAddOrderDetails(true);
            formSearchBook.resetFields;
            setSelectedRowKeys([]);
          }}
        >
          Search book
        </Button>
        <Divider />
        <Table rowKey="id" columns={selectedBookscolumns} dataSource={finalSelectedBooks}></Table>
        <Divider />
      </Drawer>

      {/* <Modal
        centered
        width={800}
        title="Add books to order"
        open={selectedOrderToAddOrderDetails}
        okText="Add to order"
        onOk={async () => {
          // 1. selectedOrderToAddOrderDetails
          // 2. selectedProducts (quantity = 1)
          try {
            let orderDetails = selectedBooks.map((p: any) => {
              return {
                bookId: p.id,
                quantity: 1,
                price: p.price,
                discount: p.discount,
              };
            });

            console.log('orderDetails', orderDetails);

            const result = await axiosClient.patch(`/orders/${selectedOrderToAddOrderDetails.id}`, {
              orderDetails: orderDetails,
            });

            setSelectedOrderToAddOrderDetails(null);
            setSelectedBooks([]);
          } catch (error) {
            console.log('Error:', error);
          }
        }}
        onCancel={() => {
          setSelectedOrderToAddOrderDetails(null);
        }}
      ></Modal> */}
    </div>
  );
}
