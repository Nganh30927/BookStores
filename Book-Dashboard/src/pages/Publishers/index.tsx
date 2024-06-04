import React from 'react';
import { Space, Table, Button, Modal, Form, Input, message, Pagination } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosClient } from '../../library/axiosClient';
import { useNavigate, useSearchParams } from 'react-router-dom';
import config from '../../constants/config';
import type { PaginationProps } from 'antd';
interface DataType {
  id: number;
  name: string;
  email: string;
  phonenumber: number;
}

const Publisher = () => {
  const [messageApi, contextHolder] = message.useMessage();
  //Toggle Modal Edit
  const [isModalEditOpen, setIsModalEditOpen] = React.useState(false);
  //Toggle Modal Create
  const [isModalCreateOpen, setIsModalCreateOpen] = React.useState(false);

  const navigate = useNavigate();

  //Lay danh sach danhmuc
  const getPublishers = async () => {
    return axiosClient.get(config.urlAPI + `/publishers`);
  };

  // Access the client
  const queryClient = useQueryClient();

  //Lấy danh sách về
  const queryPublisher = useQuery({
    queryKey: ['publishers'],
    queryFn: () => getPublishers(),
  });

  console.log('<<=== 🚀 queryPublisher.data ===>>', queryPublisher.data?.data);

  //======= Sự kiện XÓA =====//
  const fetchDelete = async (id: number) => {
    return axiosClient.delete(config.urlAPI + '/publishers/' + id);
  };
  // Mutations => Thêm mới, xóa, edit
  const mutationDelete = useMutation({
    mutationFn: fetchDelete,
    onSuccess: () => {
      console.log('Delete success !');
      messageApi.open({
        type: 'success',
        content: 'Delete success !',
      });
      // Làm tươi lại danh sách danh mục dựa trên key đã định nghĩa
      queryClient.invalidateQueries({ queryKey: ['publishers'] });
    },
    onError: () => {
      //khi gọi API bị lỗi
    },
  });

  //======= Sự kiện EDit =====//
  const fetchUpdate = async (formData: DataType) => {
    const { id, ...payload } = formData;
    return axiosClient.patch(config.urlAPI + '/publishers/' + id, payload);
  };
  // Mutations => Thêm mới, xóa, edit
  const mutationUpdate = useMutation({
    mutationFn: fetchUpdate,
    onSuccess: () => {
      console.log('Update success !');
      messageApi.open({
        type: 'success',
        content: 'Update success !',
      });
      // Làm tươi lại danh sách danh mục dựa trên key đã định nghĩa
      queryClient.invalidateQueries({ queryKey: ['publishers'] });
      //Ẩn modal
      setIsModalEditOpen(false);
    },
    onError: () => {
      //khi gọi API bị lỗi
    },
  });

  const [updateForm] = Form.useForm();
  //Khi nhấn nut OK trên Modal
  const handleEditOk = () => {
    // setIsModalEditOpen(false);
    console.log('edit submit');
    //Cho submit form trong Modal
    updateForm.submit();
  };
  //Khi nhấn nut Cancel trên modal
  const handleEditCancel = () => {
    setIsModalEditOpen(false);
    console.log('edit cancel');
  };

  //hàm lấy thông tin từ form Edit
  const onFinishEdit = async (values: any) => {
    console.log('Success:', values); //=> chính là thông tin ở form edit
    //Gọi API để update Publisher
    mutationUpdate.mutate(values);
  };

  const onFinishEditFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  //======= Sự kiện Create =====//
  const fetchCreate = async (formData: DataType) => {
    return axiosClient.post(config.urlAPI + '/publishers', formData);
  };
  // Mutations => Thêm mới, xóa, edit
  const mutationCreate = useMutation({
    mutationFn: fetchCreate,
    onSuccess: () => {
      console.log('Create success !');
      messageApi.open({
        type: 'success',
        content: 'Create success !',
      });
      // Làm tươi lại danh sách danh mục dựa trên key đã định nghĩa
      queryClient.invalidateQueries({ queryKey: ['publishers'] });
      //Ẩn modal
      setIsModalCreateOpen(false);
      createForm.resetFields(); //làm trống các input
    },
    onError: () => {
      //khi gọi API bị lỗi
    },
  });

  const [createForm] = Form.useForm();
  //Khi nhấn nut OK trên Modal
  const handleCreateOk = () => {
    // setIsModalCreateOpen(false);
    console.log('Create submit');
    //Cho submit form trong Modal
    createForm.submit();
  };
  //Khi nhấn nut Cancel trên modal
  const handleCreateCancel = () => {
    setIsModalCreateOpen(false);
    console.log('Create cancel');
  };

  //hàm lấy thông tin từ form Create
  const onFinishCreate = async (values: any) => {
    console.log('Success:', values); //=> chính là thông tin ở form edit
    //Gọi API để update Publisher
    mutationCreate.mutate(values);
  };

  const onFinishCreateFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const columns: ColumnsType<DataType> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone number',
      dataIndex: 'phonenumber',
      key: 'phonenumber',
    },

    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            onClick={() => {
              console.log('Edit this item');
              setIsModalEditOpen(true); //show modal edit lên
              updateForm.setFieldsValue(record);
            }}
          >
            Edit
          </Button>

          <Button
            danger
            onClick={() => {
              console.log('Delete this item', record);
              mutationDelete.mutate(record.id);
            }}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      {contextHolder}
      <Button
        type="primary"
        onClick={() => {
          console.log('Open Model Create Publisher');
          //show modal them moi
          setIsModalCreateOpen(true);
        }}
      >
        Create a new Publisher
      </Button>

      <Table pagination={{ pageSize: 5 }} columns={columns} key={'id'} dataSource={queryPublisher.data?.data} />
      <div></div>
      {/* begin Edit Modal */}
      <Modal title="Edit Publisher" open={isModalEditOpen} onOk={handleEditOk} onCancel={handleEditCancel}>
        <Form
          form={updateForm}
          name="edit-form"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          onFinish={onFinishEdit}
          onFinishFailed={onFinishEditFailed}
          autoComplete="off"
        >
          <Form.Item<DataType>
            label="Name"
            name="name"
            rules={[
              { required: true, message: 'Please input Publisher Name!' },
              // {min: 4, message: 'Tối thiểu 4 kí tự'}
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item<DataType> label="Email" name="email" rules={[{ max: 500, message: 'Tối đa 500 kí tự' }]}>
            <Input />
          </Form.Item>

          <Form.Item<DataType> label="Phone number" name="phonenumber" rules={[{ max: 500, message: 'Tối đa 500 kí tự' }]}>
            <Input />
          </Form.Item>

          <Form.Item hidden label="Id" name="id">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      {/* End Edit Modal */}

      {/* begin Create Modal */}
      <Modal title="Create Publisher" open={isModalCreateOpen} onOk={handleCreateOk} onCancel={handleCreateCancel}>
        <Form
          form={createForm}
          name="create-form"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          onFinish={onFinishCreate}
          onFinishFailed={onFinishCreateFailed}
          autoComplete="off"
        >
          <Form.Item<DataType> label="Name" name="name" rules={[{ required: true, message: 'Please input Publisher Name!' }]}>
            <Input />
          </Form.Item>

          <Form.Item<DataType>
            label="Email"
            name="email"
            rules={[
              {
                type: 'email',
                message: 'The input is not valid E-mail!',
              },
              {
                required: true,
                message: 'Please input your E-mail!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item<DataType>
            label="Phone number"
            name="phonenumber"
            rules={[
              { required: true, message: 'Please input your phone number!' },
              {
                max: 10,
                message: 'Tối đa 10 số',
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      {/* End Create Modal */}
    </>
  );
};

export default Publisher;
