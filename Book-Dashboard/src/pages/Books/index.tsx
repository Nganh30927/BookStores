/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    Button,
    Form,
    Input,
    Modal,
    Select,
    Space,
    Table,
    Image,
    // Button,
    // Modal,
    // Form,
    // Input,
    message,
    Card,
    Popconfirm,
    Spin,
    InputNumber,
    Upload,
    // Pagination,
  } from "antd";
  // import type { ColumnsType } from "antd/es/table";
  import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
  import { useNavigate, useSearchParams } from "react-router-dom";
  import { axiosClient } from "../../library/axiosClient";
  import config from "../../constants/config";
  import React, { useState } from "react";
  import { AnyObject } from "antd/es/_util/type";
  import { ColumnsType } from "antd/es/table";
  import numeral from 'numeral';
  import {
    CloseOutlined,
    DeleteOutlined,
    EditOutlined,
    QuestionCircleOutlined,
    UploadOutlined
  } from "@ant-design/icons";

  import form from "antd/es/form";
  import axios from "axios";
import TextArea from "antd/es/input/TextArea";
  
  // import { useNavigate, useSearchParams } from "react-router-dom";
  // import config from "../../constants/config";
  // import type { PaginationProps } from "antd";


  interface DataType{
    id: number,
    name: string,
    author?: string,
    title?: string,
    quantity: number,
    price: number,
    serialnumber: number,
    descrpition?: string,
    discount: number,
    imageURL?: string,
    categoryId: number,
    publisherId: number
    // category?: { id: number; name: string };
    // publisher?: { id: number; name: string };
  }
  
 
  
  const BooksPage = () => {
    const navigate = useNavigate();
    //message edit
    const [messageApi, contextHolder] = message.useMessage();
    //Toggle Modal Edit
    const [isModalEditOpen, setIsModalEditOpen] = React.useState(false);
    //Toggle Modal Create
    const [isModalCreateOpen, setIsModalCreateOpen] = React.useState(false);
    const [categories, setCategories] = React.useState<any[]>([]); // Kiểu dữ liệu của categories phụ thuộc vào dữ liệu thực tế
  const [publishers, setPublishers] = React.useState<any[]>([]);
    const [file, setFile] = React.useState(null);
  
  
    
  
    //======= lấy sản phẩm  =====//
    // Access the client
    const queryClient = useQueryClient();

    const fetchBooks = async () => {
      return axiosClient.get(config.urlAPI + `/books`);
    };

    const queryBooks = useQuery({
      queryKey: ['books'],
      queryFn: () => fetchBooks(),
    }); 

    console.log("queryBooks", queryBooks.data?.data);
  
    //======= lấy danh mục  =====//
    const queryCategories = useQuery({
      queryKey: ["categories"],
      queryFn: async () =>
        await axiosClient.get(config.urlAPI+`/categories`),
    });
    console.log("queryCategories", queryCategories.data?.data);
  
    //======= lấy suppliers  =====//
    const queryPublishers = useQuery({
      queryKey: ["suppliers"],
      queryFn: async () =>
        await axiosClient.get(config.urlAPI+`/publishers`),
    });
    console.log("queryPublishers", queryPublishers.data?.data);
  
    //======= Sự kiện XÓA =====//
    const fetchDelete = async (id: number) => {
      return await axiosClient.delete(config.urlAPI + "/books/" + id);
    };
    const mutationDelete = useMutation({
      mutationFn: fetchDelete,
      onSuccess: () => {
        console.log("Delete success !");
        messageApi.open({
          type: "success",
          content: "Delete success !",
        });
        // Làm tươi lại danh sách danh mục dựa trên key đã định nghĩa
        queryClient.invalidateQueries({ queryKey: ["books"] });
      },
      onError: () => {
        //khi gọi API bị lỗi
        console.log("mutationDelete error Api");
      },
    });
    //======= Sự kiện EDit =====//
    const fetchUpdate = async (formData: DataType) => {
      const { id, ...payload } = formData;
      return axiosClient.patch(config.urlAPI+'/books/'+ id, payload);
    };
    const mutationUpdate = useMutation({
      mutationFn: fetchUpdate,
      onSuccess: () => {
        console.log("Update success !");
        messageApi.open({
          type: "success",
          content: "Update success !",
        });
        // Làm tươi lại danh sách danh mục dựa trên key đã định nghĩa
        queryClient.invalidateQueries({ queryKey: ["books"] });
        //Ẩn modal
        setIsModalEditOpen(false);
      },
      onError: () => {
        //khi gọi API bị lỗi
        console.log("mutationUpdate error Api");
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
    //Gọi API để update product
    mutationUpdate.mutate(values);
  };

  const onFinishEditFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  //======= Sự kiện Create =====//
  const fetchCreate = async (formData: DataType) => {
    try {
      console.log('Success:', formData);
      const response = await axiosClient.post(config.urlAPI + '/books', formData);
      console.log(response.data);

      const id = response.data.id;

      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('name', 'Category 1234');
        formData.append('description', 'Mo ta 1234');

        await axios.post('http://127.0.0.1:9000/uploads/books/' + id, formData);
      }

      fetchBooks();
      createForm.resetFields();
    } catch (error) {
      console.log('Error:', error);
    }
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
      queryClient.invalidateQueries({ queryKey: ['products'] });
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
    //Gọi API để update product
    mutationCreate.mutate(values);
  };

  const onFinishCreateFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  // //============== get Categories ================/
  // //Lay danh sach danhmuc
  // const fetchCategories = async () => {
  //   /**
  //    * Nếu thêm limit thì nó mặc định chỉ lấy về 5 records
  //    */
  //   return axiosClient.get(config.urlAPI + `/v1/categories?limit=50`);
  // };
  // //Lấy danh sách về
  // const queryCategory = useQuery({
  //   queryKey: ['categories'],
  //   queryFn: fetchCategories,
  //   onSuccess: (data) => {
  //     console.log('queryCategory', data);
  //   },
  // });

  // //============== get Suppliers ================/
  // //Lay danh sach danhmuc
  // const fetchSuppliers = async () => {
  //   /**
  //    * Nếu thêm limit thì nó mặc định chỉ lấy về 10 records
  //    */
  //   return axiosClient.get(config.urlAPI + `/v2/suppliers?limit=50`);
  // };
  // //Lấy danh sách về
  // const querySupplier = useQuery({
  //   queryKey: ['suppliers'],
  //   queryFn: fetchSuppliers,
  //   onSuccess: (data) => {
  //     console.log('querySupplier', data);
  //   },
  // });

  const columns: ColumnsType<DataType> = [
    {
      title: 'Picture',
      key: 'imageUrl',
      dataIndex: 'imageUrl',
      width: '1%',
      render: (text: string, record: any, index: number) => {
        return <img src={'http://localhost:9000' + text} style={{ height: 60 }} alt='' />;
      },
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: 'Author',
      dataIndex: 'author',
      key: 'author',
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text) => {
        // Kiểm tra nếu mô tả không tồn tại
        if (!text) {
          return <span>Null...</span>;
        }

        // Truncate the string to 3 characters and append "..."
        const truncatedText =
          text.length > 2 ? text.substring(0, 2) + "..." : text;
        return <span>{truncatedText}</span>;
      },
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (_, record: any) => <span>{record.category.name}</span>,
    },
    {
      title: 'Publisher',
      dataIndex: 'publisher',
      key: 'publisher',
      render: (_, record: any) => <span>{record.publisher.name}</span>,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (text) => <strong>${text}</strong>,
    },
    {
      title: 'Serial number',
      dataIndex: 'serialnumber',
      key: 'serialnumber',
    },
    {
      title: 'Description',
      dataIndex: 'descrpition',
      key: 'description',
    },
    {
      title: 'Discount',
      dataIndex: 'discount',
      key: 'discount',
      render: (text: string, record: any, index: number) => {
        let color = '#4096ff';

        if (record.discount >= 50) {
          color = '#ff4d4f';
        }

        return <div style={{ textAlign: 'right', color: color }}>{numeral(text).format('0,0.0')}%</div>;
      },
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
              updateForm.setFieldsValue({ ...record});
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
          console.log('Open Model Create Product');
          //show modal them moi
          setIsModalCreateOpen(true);
        }}
      >
        Create a new Product
      </Button>

      <Table pagination={{pageSize: 5}} columns={columns} key={'id'} dataSource={queryBooks.data?.data} />
      <div
        style={{
          marginTop: '20px',
        }}
      >
        
      </div>
      {/* begin Edit Modal */}
      <Modal width={960} title="Edit Product" okText='Update Product' open={isModalEditOpen} onOk={handleEditOk} onCancel={handleEditCancel}>
        <Form
          form={updateForm}
          name="edit-form"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          initialValues={{ remember: true }}
          onFinish={onFinishEdit}
          onFinishFailed={onFinishEditFailed}
          autoComplete="off"
        >
          <Form.Item<DataType>
            hasFeedback
            label="Name"
            name="name"
            rules={[
              { required: true, message: 'Please input Book name!' },
             
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item<DataType>
            hasFeedback
            label="Author"
            name="author"
            rules={[
              { required: true, message: 'Please input Book Author!' },
             
            ]}
           
          >
            <Input />
          </Form.Item>

          <Form.Item<DataType>
            hasFeedback
            label="Title"
            name="title"
            rules={[
              { required: true, message: 'Please input Book Title!' },
             
            ]}
           
          >
            <Input />
          </Form.Item>

          <Form.Item<DataType>
            hasFeedback
            label="Quantity"
            name="quantity"
            rules={[
              { required: true, message: 'Please input Book quantity!' },
              {
                type: 'number',
                min: 0,
                message: 'Tối thiểu phải là 0',
              },
            ]}
          >
            <InputNumber min={0} defaultValue={0} />
          </Form.Item>

          <Form.Item<DataType>
            hasFeedback
            label="Price"
            name="price"
            rules={[
              { required: true, message: 'Please input book Price!' },
              {
                type: 'number',
                min: 0,
                message: 'Tối thiểu phải là 0',
              },
            ]}
          >
            <InputNumber min={0} addonAfter="$" defaultValue={0} />
          </Form.Item>

          <Form.Item<DataType>
            hasFeedback
            label="Serial Number"
            name="serialnumber"
            rules={[
              { required: true, message: 'Please input Book quantity!' },
              {
                type: 'number',
                min: 0,
                message: 'Tối thiểu phải là 0',
              },
            ]}
          >
            <InputNumber min={0} defaultValue={0} />
          </Form.Item>
         
          {/* Xem Rules https://ant.design/components/form#rule */}
          <Form.Item<DataType>
            hasFeedback
            label="Discount"
            name="discount"
            rules={[
              {
                type: 'number',
                min: 0,
                max: 90,
                message: 'Chỉ cho phép từ 0 - 90 %',
              },
            ]}
            extra="Chỉ cho phép từ 0 - 90 %"
          >
            <InputNumber min={0} max={90} defaultValue={0} />
          </Form.Item>

          <Form.Item<DataType> label="Category" name="categoryId" rules={[{ required: true, message: 'Please input book Category!' }]} hasFeedback>
            <Select
              options={ queryCategories && queryCategories.data && queryCategories.data.data &&
                queryCategories.data?.data.map((item: any) => {
                return {
                  label: item.name,
                  value: item.id,
                };
              })}
            />
          </Form.Item>

          <Form.Item<DataType> hasFeedback label="Publisher" name="publisherId" rules={[{ required: true, message: 'Please input book Publisher!' }]}>
            <Select
               options={ queryPublishers && queryPublishers.data && queryPublishers.data.data &&
                queryPublishers.data?.data.map((item: any) => {
                return {
                  label: item.name,
                  value: item.id,
                };
              })}
            />
          </Form.Item>

          <Form.Item<DataType> hasFeedback label="Description" name="descrpition" rules={[{ max: 500, message: 'Tối đa 500 kí tự' }]}>
            <TextArea rows={3} />
          </Form.Item>

          <Form.Item label='Image'>
            <Upload
              listType='text'
              showUploadList={true}
              beforeUpload={(f: any) => {
                setFile(f);
                return false;
              }}
            >
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>

          <Form.Item hidden label="Id" name="id">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      {/* End Edit Modal */}

      {/* begin Create Modal */}
      <Modal width={960} title="Create Product" 
      open={isModalCreateOpen} 
      onOk={handleCreateOk} 
      onCancel={handleCreateCancel}
      okText='Create Product'
      >
        <Form
          form={createForm}
          name="create-form"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          initialValues={{ remember: true }}
          onFinish={onFinishCreate}
          onFinishFailed={onFinishCreateFailed}
          autoComplete="off"
        >
           <Form.Item<DataType>
            hasFeedback
            label="Name"
            name="name"
            rules={[
              { required: true, message: 'Please input Book name!' },
             
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item<DataType>
            hasFeedback
            label="Author"
            name="author"
            rules={[
              { required: true, message: 'Please input Book Author!' },
             
            ]}
           
          >
            <Input />
          </Form.Item>

          <Form.Item<DataType>
            hasFeedback
            label="Title"
            name="title"
            rules={[
              { required: true, message: 'Please input Book Title!' },
             
            ]}
           
          >
            <Input />
          </Form.Item>

          <Form.Item<DataType>
            hasFeedback
            label="Quantity"
            name="quantity"
            rules={[
              { required: true, message: 'Please input Book quantity!' },
              {
                type: 'number',
                min: 0,
                message: 'Tối thiểu phải là 0',
              },
            ]}
          >
            <InputNumber min={0} defaultValue={0} />
          </Form.Item>

          <Form.Item<DataType>
            hasFeedback
            label="Serial Number"
            name="serialnumber"
            rules={[
              { required: true, message: 'Please input Book quantity!' },
              {
                type: 'number',
                min: 0,
                message: 'Tối thiểu phải là 0',
              },
            ]}
          >
            <InputNumber min={0} defaultValue={0} />
          </Form.Item>

          <Form.Item<DataType>
            hasFeedback
            label="Price"
            name="price"
            rules={[
              { required: true, message: 'Please input book Price!' },
              {
                type: 'number',
                min: 0,
                message: 'Tối thiểu phải là 0',
              },
            ]}
          >
            <InputNumber min={0} addonAfter="$" defaultValue={0} />
          </Form.Item>
         
          {/* Xem Rules https://ant.design/components/form#rule */}
          <Form.Item<DataType>
            hasFeedback
            label="Discount"
            name="discount"
            rules={[
              {
                type: 'number',
                min: 0,
                max: 90,
                message: 'Chỉ cho phép từ 0 - 90 %',
              },
            ]}
            extra="Chỉ cho phép từ 0 - 90 %"
          >
            <InputNumber min={0} max={90} defaultValue={0} />
          </Form.Item>

          <Form.Item<DataType> label="Category" name="categoryId" rules={[{ required: true, message: 'Please input book Category!' }]} hasFeedback>
            <Select
              options={ queryCategories && queryCategories.data && queryCategories.data.data &&
                queryCategories.data?.data.map((item: any) => {
                return {
                  label: item.name,
                  value: item.id,
                };
              })}
            />
          </Form.Item>

          <Form.Item<DataType> hasFeedback label="Publisher" name="publisherId" rules={[{ required: true, message: 'Please input book Publisher!' }]}>
            <Select
               options={ queryPublishers && queryPublishers.data && queryPublishers.data.data &&
                queryPublishers.data?.data.map((item: any) => {
                return {
                  label: item.name,
                  value: item.id,
                };
              })}
            />
          </Form.Item>

          <Form.Item<DataType> hasFeedback label="Description" name="descrpition" rules={[{ max: 500, message: 'Tối đa 500 kí tự' }]}>
            <TextArea rows={3} />
          </Form.Item>

          <Form.Item label='Image'>
            <Upload
              listType='text'
              showUploadList={true}
              beforeUpload={(f: any) => {
                setFile(f);
                return false;
              }}
            >
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>

          <Form.Item hidden label="Id" name="id">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      {/* End Create Modal */}
    </>
  );
};

export default BooksPage;