import React from 'react';
import { Space, Table, Button, Modal, Form, Input, message, Pagination   } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  useQuery,
  useMutation,
  useQueryClient
} from '@tanstack/react-query';
import { axiosClient } from '../../library/axiosClient';
import { useNavigate, useSearchParams } from 'react-router-dom';
import config from '../../constants/config';
import type { PaginationProps } from 'antd';
interface DataType {
  id: number;
  name: string;
  description: string;
 
}

const Category= () => {

  const [messageApi, contextHolder] = message.useMessage();
  //Toggle Modal Edit
  const [isModalEditOpen, setIsModalEditOpen] = React.useState(false);
  //Toggle Modal Create
  const [isModalCreateOpen, setIsModalCreateOpen] = React.useState(false);
  
  const navigate = useNavigate();
  //=========================== PHÂN TRANG =================================//
  // const [params] = useSearchParams();
  // const page = params.get('page');
  // const limit = params.get('limit');
  // const int_page = page ? parseInt(page) : 1;
  // const int_limit = limit ? parseInt(limit) :5;
  // const onChangePagination: PaginationProps['onChange'] = (pageNumber) => {
  //   console.log('Page: ', pageNumber);
  //   navigate(`/category?page=${pageNumber}`);
  // };

 
  //Lay danh sach danhmuc
  const getCategories = async ()=> {
      return axiosClient.get(config.urlAPI+`/categories`);
  }

  // Access the client
  const queryClient = useQueryClient()

  //Lấy danh sách về
  const queryCategory = useQuery({
    queryKey: ['categories'],
    queryFn: ()=>getCategories() 
  });

  console.log('<<=== 🚀 queryCategory.data ===>>',queryCategory.data?.data);


  //======= Sự kiện XÓA =====//
  const fetchDelete = async (id: number)=> {
      return axiosClient.delete(config.urlAPI+'/categories/'+id);
  } 
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
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
    onError: ()=>{
      //khi gọi API bị lỗi
    }
  });

  //======= Sự kiện EDit =====//
  const fetchUpdate = async (formData: DataType) => {
    const {id, ...payload} = formData;
    return axiosClient.patch(config.urlAPI+'/categories/'+id, payload);
  } 
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
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      //Ẩn modal
      setIsModalEditOpen(false);
    },
    onError: ()=>{
      //khi gọi API bị lỗi
    }
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

  //======= Sự kiện Create =====//
  const fetchCreate = async (formData: DataType) => {
    return axiosClient.post(config.urlAPI+'/categories', formData);
  } 
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
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      //Ẩn modal
      setIsModalCreateOpen(false);
      createForm.resetFields();//làm trống các input
    },
    onError: ()=>{
      //khi gọi API bị lỗi
    }
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
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
      <Space size="middle">

          <Button onClick={()=>{
            console.log('Edit this item');
            setIsModalEditOpen(true); //show modal edit lên
            updateForm.setFieldsValue(record);
          }}>Edit</Button>

          <Button danger onClick={()=>{
            console.log('Delete this item', record);
              mutationDelete.mutate(record.id);
          }}>Delete</Button>

        </Space>
      ),
    },
  ];

  

  

  return (
    <>
    {contextHolder}
     <Button type="primary" onClick={()=>{
       console.log('Open Model Create Category');
       //show modal them moi
       setIsModalCreateOpen(true);
     }}>Create a new Category</Button>

    <Table pagination={{pageSize: 5}} columns={columns} key={'id'} dataSource={queryCategory.data?.data}/>
    <div>
    
    </div>
     {/* begin Edit Modal */}
     <Modal title="Edit Category" open={isModalEditOpen} onOk={handleEditOk} onCancel={handleEditCancel}>
     <Form
      form={updateForm}
      name='edit-form'
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
        label="Description"
        name="description"
        rules={[{ max: 500, message: 'Tối đa 500 kí tự' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item hidden label='Id' name='id'>
            <Input />
      </Form.Item>
     
    </Form>
   
      </Modal>
      {/* End Edit Modal */}

      {/* begin Create Modal */}
     <Modal title="Create Category" open={isModalCreateOpen} onOk={handleCreateOk} onCancel={handleCreateCancel}>
     <Form
      form={createForm}
      name='create-form'
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
        ]}
      >
        <Input />
      </Form.Item>
  
      <Form.Item<DataType>
        label="Description"
        name="description"
        rules={[{ max: 500, message: 'Tối đa 500 kí tự' }]}
      >
        <Input />
      </Form.Item>

    </Form>
        
      </Modal>
      {/* End Create Modal */}
    </>
  )
};

export default Category;