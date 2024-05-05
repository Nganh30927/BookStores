import React, { useState } from "react";
import {
  Space,
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Pagination,
  Card,
  Popconfirm,
  Select,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "../../library/axiosClient";
import { useNavigate, useSearchParams } from "react-router-dom";
import config from "../../constants/config";
import type { PaginationProps, TableColumnsType } from "antd";
import { CalendarOutlined, DeleteOutlined, EditOutlined, FolderAddOutlined, MailOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';
import numeral from 'numeral';
import dayjs from 'dayjs';

interface DataType {
    id: number,
    orderday: Date,
    shippedday?: Date,
    status: string,
    shippingaddress: string,
    paymenttype: string,
    description?: string,
    employeeId: number,
    memberId: number
}

type Props = {};

export default function Orders({}: Props) {
  const [createForm] = Form.useForm<DataType>();
  const [updateForm] = Form.useForm<DataType>();

  const [orders, setOrders] = React.useState([]);
  const [selectedOrder, setSelectedOrder] = React.useState<any>(null);
  const [selectedOrderToAddOrderDetails, setSelectedOrderToAddOrderDetails] = React.useState<any>(null);

  const [members, setMembers] = React.useState([]);
  const [employees, setEmployees] = React.useState([]);

  // Search products
  const [books, setBooks] = React.useState([]);

  // Selected products
  const [selectedBooks, setSelectedBooks] = React.useState<any[]>([]);

  const getOrders = async () => {
    try {
      const response = await axiosClient.get(config.urlAPI+'/orders');
      setOrders(response.data);
      console.log('orders', response.data?.data)
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const getMembers = async () => {
    try {
      const response = await axiosClient.get(config.urlAPI+'/members');
      setMembers(response.data);
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const getEmployees = async () => {
    try {
      const response = await axiosClient.get(config.urlAPI+'/employees');
      setEmployees(response.data);
    } catch (error) {
      console.log('Error:', error);
    }
  };

  React.useEffect(() => {
    getMembers();
    getEmployees();
    getOrders();
  }, []);

  const onFinish = async (values: DataType) => {
    try {
      console.log('Success:', values);
      await axiosClient.post(config.urlAPI+'/orders', values);
      getOrders();
      createForm.resetFields();
      message.success('Create order successfully!');
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const onDelete = async (id: number) => {
    try {
      await axiosClient.delete(config.urlAPI+`/orders/${id}`);
      getOrders();
      message.success('Order deleted successfully!');
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const onUpdate = async (values: any) => {
    try {
      console.log('Success:', values);
      await axiosClient.patch(config.urlAPI+`/orders/${selectedOrder.id}`, values);
      getOrders();
      setSelectedOrder(null);
      message.success('Order updated successfully!');
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const onFinishSearchProducts = async (values: any) => {
    try {
      let keyword = values.keyword;
      const response = await axiosClient.get(config.urlAPI+`/books/search?keyword=${encodeURIComponent(keyword)}`);
      console.log(response.data);
      setBooks(response.data);
    } catch (error) {}
  };

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
      width: 200,
      render: (text: string, record: any, index: number) => {
        return <span>{text}</span>;
      },
    },
    {
      title: () => {
        return <div style={{ whiteSpace: 'nowrap' }}>Payment Type</div>;
      },
      dataIndex: 'paymentType',
      key: 'paymenttype',
      width: 200,
      render: (text: string, record: any, index: number) => {
        return <span>{text}</span>;
      },
    },
    {
      title: 'Date',
      dataIndex: 'orderday',
      key: 'orderday',
      width: 200,
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
      width: 200,
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
      width: 120,
      render: (text: string, record: any, index: number) => {
        return <span>{text}</span>;
      },
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',

      fixed: 'right',
      render: (text: any, record: any) => {
        return (
          <Space size='small'>
            <Button
              type='primary'
              icon={<FolderAddOutlined />}
              onClick={() => {
                setSelectedOrderToAddOrderDetails(record);
              }}
            />

            <Button
              type='primary'
              icon={<EditOutlined />}
              onClick={() => {
                setSelectedOrder(record);
                updateForm.setFieldsValue(record);
              }}
            />

            <Popconfirm title='Delete the order' description='Are you sure to delete this order?' onConfirm={() => {}}>
              <Button type='primary' danger icon={<DeleteOutlined />} />
            </Popconfirm>
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
      key: 'name',
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

  return (
    <div style={{ padding: 36 }}>
      <Card title='Create new order' style={{ width: '100%' }}>
        <Form
          name='create-order'
          form={createForm}
          initialValues={{
            status: 'WAITING',
            paymentType: 'CASH',
          }}
          onFinish={onFinish}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
        >
          <Form.Item<DataType> name='memberId' label='Member'>
            <Select
              options={members.map((item: any) => {
                return {
                  label: item.name + ' - ' + item.email + ' - ' + item.contact,
                  value: item.id,
                };
              })}
            />
          </Form.Item>

          <Form.Item<DataType> name='employeeId' label='Employee'>
            <Select
              options={employees.map((item: any) => {
                return {
                  label: item.name + ' - ' + item.email + ' - ' + item.phonenumber,
                  value: item.id,
                };
              })}
            />
          </Form.Item>
          <Form.Item<DataType> name='paymenttype' label='Payment Type'>
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

          <Form.Item<DataType> name='description' label='Description'>
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type='primary' htmlType='submit'>
              Save changes
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card title='List of orders' style={{ width: '100%', marginTop: 36 }}>
        <Table dataSource={orders} columns={columns} bordered scroll={{ x: 1800 }} />
      </Card>

      <Modal
        centered
        width={800}
        title='Edit order'
        open={selectedOrder}
        okText='Save changes'
        onOk={() => {
          updateForm.submit();
        }}
        onCancel={() => {
          setSelectedOrder(null);
        }}
      >
        <Form form={updateForm} name='update-order' labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} initialValues={{}} onFinish={onUpdate}>
          <Form.Item<DataType> name='memberId' label='Member'>
            <Select
              disabled
              options={members.map((item: any) => {
                return {
                  label: item.name + ' - ' + item?.email + ' - ' + item.contact,
                  value: item.id,
                };
              })}
            />
          </Form.Item>

          <Form.Item<DataType> name='employeeId' label='Employee'>
            <Select
              options={employees.map((item: any) => {
                return {
                  label: item.name + ' - ' + item.email + ' - ' + item.phonenumber,
                  value: item.id,
                };
              })}
            />
          </Form.Item>

          <Form.Item<DataType> name='status' label='Status'>
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
                  label: 'Cancelled',
                  value: 'CANCELLED',
                },
              ]}
            />
          </Form.Item>

          <Form.Item<DataType> name='paymenttype' label='Payment Type'>
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
          <Form.Item<DataType> name='shippedday' label='Shipping Address'>
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item<DataType> name='shippedday' label='Shipped Date'>
            <Input />
          </Form.Item>
          <Form.Item<DataType> name='description' label='Description'>
            <Input.TextArea rows={2} />
          </Form.Item>
        </Form>
      </Modal>

      {/* ADD ORDER DETAILS */}

      <Modal
        centered
        width={800}
        title='Add products to order'
        open={selectedOrderToAddOrderDetails}
        okText='Add to order'
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
      >
        <Form name='search-books' layout='inline' onFinish={onFinishSearchProducts}>
          <Form.Item name='keyword' label='Name'>
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type='primary' htmlType='submit'>
              Search
            </Button>
          </Form.Item>
        </Form>

        <Table
          rowKey='id'
          columns={books_columns}
          dataSource={books}
          rowSelection={{
            type: 'checkbox',
            onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
              // console.log(selectedRows);
              setSelectedBooks(selectedRows);
            },
          }}
        />
      </Modal>
    </div>
  );
}
