import React from 'react';
import { Button,  Form, Input, Alert } from 'antd';


type FieldType = {
  name: string;
  description?: string;
};

const Category = () => {
 
  
  const onFinish = async (values: any) => {
    console.log('Success:', values);

   
    

  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };


  return (
    <div style={{maxWidth: '600px'}}>
     
   
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item<FieldType>
        label="Name"
        name="name"
        rules={[{ required: true, message: 'Please input Category Name!' }]}
      >
        <Input />
      </Form.Item>
  
      <Form.Item<FieldType>
        label="Description"
        name="description"
        rules={[{ required: false}]}
      >
        <Input />
      </Form.Item>
  
     
  
      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
    </div>
  )
};

export default Category;