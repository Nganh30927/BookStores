import React from 'react';
import { Space, Table, Button, Modal, Form, Input, message, Select, DatePicker } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosClient } from '../../library/axiosClient';
import config from '../../constants/config';
import moment from 'moment';
import type { DatePickerProps } from 'antd';
import { EyeOutlined, EyeTwoTone, EyeInvisibleOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

interface DataType {

  id: number;
  name: string;
  email: string;
  phonenumber: number;
  gender: string;
  address: string;
  position: string;
  birthday?: Date;
  password: string
 
}

const Employee = () => {
  const [messageApi, contextHolder] = message.useMessage();
  //Toggle Modal Edit
  const [isModalEditOpen, setIsModalEditOpen] = React.useState(false);
  //Toggle Modal Create
  const [isModalCreateOpen, setIsModalCreateOpen] = React.useState(false);
  // Ẩn mật khẩu
  const [showPassword, setShowPassword] = React.useState(false);


  const onChange: DatePickerProps['onChange'] = (date, dateString) => {
    console.log(date, dateString);
  };

  //Lay danh sach danhmuc
  const getEmployees = async () => {
    return axiosClient.get(config.urlAPI + `/employees`);
  };

  // Access the client
  const queryClient = useQueryClient();

  //Lấy danh sách về
  const queryEmployee = useQuery({
    queryKey: ['employees'],
    queryFn: () => getEmployees(),
  });

  console.log('<<=== 🚀 queryEmployee.data ===>>', queryEmployee.data?.data);

  //======= Sự kiện XÓA =====//
  const fetchDelete = async (id: number) => {
    return axiosClient.delete(config.urlAPI + '/employees/' + id);
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
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
    onError: () => {
      //khi gọi API bị lỗi
    },
  });

  //======= Sự kiện EDit =====//
  const fetchUpdate = async (formData: DataType) => {
    const { id, ...payload } = formData;
    return axiosClient.patch(config.urlAPI + '/employees/' + id, payload);
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
      queryClient.invalidateQueries({ queryKey: ['employees'] });
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
    //Gọi API để update Employee
    mutationUpdate.mutate(values);
  };

  const onFinishEditFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  //======= Sự kiện Create =====//
  const fetchCreate = async (formData: DataType) => {
    return axiosClient.post(config.urlAPI + '/employees', formData);
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
      queryClient.invalidateQueries({ queryKey: ['employees'] });
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
    //Gọi API để update Employee
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
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
    },
    {
      title: 'Position',
      dataIndex: 'position',
      key: 'position',
    },
    {
      title: 'Birthday',
      dataIndex: 'birthday',
      key: 'birthday',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },

    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            onClick={() => {
              console.log('Edit this item', record);
              setIsModalEditOpen(true); //show modal edit lên
              const newvalues = { ...record, birthday: moment(record.birthday) };
              updateForm.setFieldsValue(newvalues);
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
          console.log('Open Model Create Employee');
          //show modal them moi
          setIsModalCreateOpen(true);
        }}
      >
        Create a new Employee
      </Button>

      <Table pagination={{ pageSize: 5 }} columns={columns} key={'id'} dataSource={queryEmployee.data?.data} />
      <div></div>
      {/* begin Edit Modal */}
      <Modal title="Edit Employee" open={isModalEditOpen} onOk={handleEditOk} onCancel={handleEditCancel}>
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
            hidden
            label="Password"
            name="password"
            rules={[
              // { required: true, message: 'Please input employee password!' },
              { min: 8, message: 'Tối thiểu 8 kí tự' },
            ]}
          >
            <Input.Password
              type={showPassword ? 'text' : 'password'}
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              // Thêm sự kiện click để chuyển đổi giữa hiển thị và ẩn mật khẩu
              suffix={<EyeOutlined onClick={() => setShowPassword(!showPassword)} style={{ cursor: 'pointer' }} />}
            />
          </Form.Item>

          <Form.Item<DataType>
            label="Name"
            name="name"
            rules={[
              { required: true, message: 'Please input employee Name!' },
              // {min: 4, message: 'Tối thiểu 4 kí tự'}
            ]}
          >
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

          <Form.Item<DataType> name="gender" label="Gender">
            <Select
              options={[
                {
                  label: 'Male',
                  value: 'Male',
                },
                {
                  label: 'Female',
                  value: 'Female',
                },
                {
                  label: 'Others',
                  value: 'Others',
                },
              ]}
            />
          </Form.Item>

          <Form.Item<DataType> name="position" label="Position">
            <Select
              options={[
                {
                  label: 'STAFF',
                  value: 'Staff',
                },
                {
                  label: 'ADMIN',
                  value: 'Admin',
                },
              ]}
            />
          </Form.Item>

          <Form.Item<DataType> label="Birthday" name="birthday">
            <DatePicker onChange={onChange} />
          </Form.Item>

      <Form.Item<DataType>
        label="Address"
        name="address"
        rules={[{ max: 500, message: 'Tối đa 500 kí tự' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item<DataType>
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Please input employee password!" },
              { min: 8, message: "Tối thiểu 8 kí tự" },
            ]}
          >
            <Input.Password
              type={showPassword ? "text" : "password"}
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              // Thêm sự kiện click để chuyển đổi giữa hiển thị và ẩn mật khẩu
              suffix={
                <EyeOutlined
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ cursor: "pointer" }}
                />
              }
            />
          </Form.Item>

      <Form.Item hidden label='Id' name='id'>
            <Input />
          </Form.Item>

          <Form.Item hidden label="Id" name="id">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      {/* End Edit Modal */}

      {/* begin Create Modal */}
      <Modal title="Create Employee" open={isModalCreateOpen} onOk={handleCreateOk} onCancel={handleCreateCancel}>
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
          <Form.Item<DataType>
            hidden
            label="Password"
            name="password"
            rules={[
              // { required: true, message: 'Please input employee password!' },
              { min: 8, message: 'Tối thiểu 8 kí tự' },
            ]}
          >
            <Input.Password
              type={showPassword ? 'text' : 'password'}
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              // Thêm sự kiện click để chuyển đổi giữa hiển thị và ẩn mật khẩu
              suffix={<EyeOutlined onClick={() => setShowPassword(!showPassword)} style={{ cursor: 'pointer' }} />}
            />
          </Form.Item>

          <Form.Item<DataType>
            label="Name"
            name="name"
            rules={[
              { required: true, message: 'Please input employee Name!' },
              // {min: 4, message: 'Tối thiểu 4 kí tự'}
            ]}
          >
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

          <Form.Item<DataType> name="gender" label="Gender">
            <Select
              options={[
                {
                  label: 'Male',
                  value: 'Male',
                },
                {
                  label: 'Female',
                  value: 'Female',
                },
                {
                  label: 'Others',
                  value: 'Others',
                },
              ]}
            />
          </Form.Item>

          <Form.Item<DataType> name="position" label="Position">
            <Select
              options={[
                {
                  label: 'STAFF',
                  value: 'Staff',
                },
                {
                  label: 'ADMIN',
                  value: 'Admin',
                },
              ]}
            />
          </Form.Item>

          <Form.Item<DataType> label="Birthday" name="birthday">
            <DatePicker onChange={onChange} />
          </Form.Item>

      <Form.Item<DataType>
        label="Address"
        name="address"
        rules={[{ max: 500, message: 'Tối đa 500 kí tự' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item<DataType>
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Please input employee password!" },
              { min: 8, message: "Tối thiểu 8 kí tự" },
            ]}
          >
            <Input.Password
              type={showPassword ? "text" : "password"}
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              // Thêm sự kiện click để chuyển đổi giữa hiển thị và ẩn mật khẩu
              suffix={
                <EyeOutlined
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ cursor: "pointer" }}
                />
              }
            />
          </Form.Item>

    </Form>
        
      </Modal>
      {/* End Create Modal */}
    </>
  );
};

export default Employee;
