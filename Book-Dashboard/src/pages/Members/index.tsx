import React, { useRef, useState } from 'react';
import { Space, Table, Button, Modal, Form, Input, message, Pagination, Select } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { EyeOutlined, EyeTwoTone, EyeInvisibleOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { axiosClient } from '../../library/axiosClient';
import { useNavigate, useSearchParams } from 'react-router-dom';
import config from '../../constants/config';
import type { DatePickerProps, InputRef } from 'antd';
import type { PaginationProps } from 'antd';
import { number } from 'yup';
import type { ColumnType, FilterDropdownProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
interface DataType {
  id: number;
  name: string;
  email?: string;
  contact: number;
  gender: string;
  address: string;
  password?: string;
}
type DataIndex = keyof DataType;
const Member = () => {
  const [messageApi, contextHolder] = message.useMessage();
  //Toggle Modal Edit
  const [isModalEditOpen, setIsModalEditOpen] = React.useState(false);
  //Toggle Modal Create
  const [isModalCreateOpen, setIsModalCreateOpen] = React.useState(false);
  // Ẩn mật khẩu
  const [showPassword, setShowPassword] = React.useState(false);

  const navigate = useNavigate();

  //Lay danh sach danhmuc
  const getMembers = async () => {
    return axiosClient.get(config.urlAPI + `/members`);
  };

  // Access the client
  const queryClient = useQueryClient();

  //Lấy danh sách về
  const queryMember = useQuery({
    queryKey: ['members'],
    queryFn: () => getMembers(),
  });

  console.log('<<=== 🚀 queryMember.data ===>>', queryMember.data?.data);

  //======= Sự kiện XÓA =====//
  const fetchDelete = async (id: number) => {
    return axiosClient.delete(config.urlAPI + '/members/' + id);
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
      queryClient.invalidateQueries({ queryKey: ['members'] });
    },
    onError: () => {
      //khi gọi API bị lỗi
    },
  });

  //======= Sự kiện EDit =====//
  const fetchUpdate = async (formData: DataType) => {
    const { id, ...payload } = formData;
    return axiosClient.patch(config.urlAPI + '/members/' + id, payload);
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
      queryClient.invalidateQueries({ queryKey: ['members'] });
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
    //Gọi API để update category
    mutationUpdate.mutate(values);
  };

  const onFinishEditFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps['confirm'],
    dataIndex: DataIndex,
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<DataType> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }: FilterDropdownProps) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            Close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes((value as string).toLowerCase())
        : false,
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });
  
  //======= Sự kiện Create =====//
  const fetchCreate = async (formData: DataType) => {
    return axiosClient.post(config.urlAPI + '/members', formData);
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
      queryClient.invalidateQueries({ queryKey: ['members'] });
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
    //Gọi API để update category
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
      ...getColumnSearchProps('name'),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      ...getColumnSearchProps('email'),
    },
    {
      title: 'Contact',
      dataIndex: 'contact',
      key: 'contact',
      ...getColumnSearchProps('contact'),
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
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
          console.log('Open Model Create Member');
          //show modal them moi
          setIsModalCreateOpen(true);
        }}
      >
        Create a new Member
      </Button>

      <Table pagination={{ pageSize: 5 }} columns={columns} key={'id'} dataSource={queryMember.data?.data} />
      <div></div>
      {/* begin Edit Modal */}
      <Modal title="Edit Category" open={isModalEditOpen} onOk={handleEditOk} onCancel={handleEditCancel}>
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
              { required: true, message: 'Please input category Name!' },
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

          <Form.Item<DataType> label="Contact" name="contact" rules={[{ required: true, max: 10, message: 'Tối đa 10 kí tự' }]}>
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

          <Form.Item<DataType> label="Address" name="address" rules={[{ max: 500, message: 'Tối đa 500 kí tự' }]}>
            <Input />
          </Form.Item>

          <Form.Item<DataType>
            label="Password"
            name="password"
            rules={[
              { required: true, message: 'Please input members password!' },
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

          <Form.Item hidden label="Id" name="id">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      {/* End Edit Modal */}

      {/* begin Create Modal */}
      <Modal title="Create Member" open={isModalCreateOpen} onOk={handleCreateOk} onCancel={handleCreateCancel}>
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
            label="Name"
            name="name"
            rules={[
              { required: true, message: 'Please input category Name!' },
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

          <Form.Item<DataType> label="Contact" name="contact" rules={[{ required: true, max: 10, message: 'Tối đa 10 kí tự' }]}>
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

          <Form.Item<DataType> label="Address" name="address" rules={[{ max: 500, message: 'Tối đa 500 kí tự' }]}>
            <Input />
          </Form.Item>

          <Form.Item<DataType>
            label="Password"
            name="password"
            rules={[
              { required: true, message: 'Please input members password!' },
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
        </Form>
      </Modal>
      {/* End Create Modal */}
    </>
  );
};

export default Member;
