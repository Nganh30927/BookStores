import React from 'react';
import { Button,  Form, Input, Alert, Select } from 'antd';


type FieldType = {
  name: string;
  // email: string;
  contact: number;
  gender: string;
  address: string
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
        rules={[
          { required: true, message: 'Please input category Name!' },
          // {min: 4, message: 'Tối thiểu 4 kí tự'}
        ]}
      >
        <Input />
      </Form.Item>
  
      {/* <Form.Item<FieldType>
        label="Email"
        name="email"
        rules={[{ max: 500, message: 'Tối đa 500 kí tự' }]}
      >
        <Input />
      </Form.Item> */}

      <Form.Item<FieldType>
        label="Contact"
        name="contact"
        rules={[{ max: 10, message: 'Tối đa 10 kí tự' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item<FieldType> name='gender' label='Gender'>
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
                }
              ]}
            />
      </Form.Item>
      

      <Form.Item<FieldType>
        label="Address"
        name="address"
        rules={[{ max: 500, message: 'Tối đa 500 kí tự' }]}
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