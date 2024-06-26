import React, { useContext, useEffect, useRef, useState } from 'react';
import type { GetRef, InputRef } from 'antd';
import { Button, Form, Input, InputNumber, Popconfirm, Table } from 'antd';
import numeral from 'numeral';

type FormInstance<T> = GetRef<typeof Form<T>>;

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface OrderItem {
  orderId?: number;
  id: number;
  quantity: number;
  price: number;
  discount: number;
  subtotalorder?: number;
}

interface EditableRowProps {
  index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [Quantityform] = Form.useForm();
  return (
    <Form form={Quantityform} component={false}>
      <EditableContext.Provider value={Quantityform}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  dataIndex: keyof OrderItem;
  record: OrderItem;
  handleSave: (record: OrderItem) => void;
}

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({ title, editable, children, dataIndex, record, handleSave, ...restProps }) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();

      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} type="number" />
      </Form.Item>
    ) : (
      <div className="editable-cell-value-wrap" style={{ paddingRight: 24 }} onClick={toggleEdit}>
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

type EditableTableProps = Parameters<typeof Table>[0];

interface DataType {
  orderId?: number;
  id: number;
  quantity: number;
  price: number;
  discount: number;
  subtotalorder?: number;
}

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;

type Props = {};

const OrderDetailTable: React.FC = () => {
  const [OrderDetailsData, setOrderDetailsData] = useState<DataType[]>([
    {
      id: 1,
      quantity: 1,
      price: 100,
      discount: 0,
    },
  ]);

  const selectedBookscolumns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[] = [
    {
      title: 'No.',
      dataIndex: 'id',
      key: 'id',
      width: '1%',
      render: (text: string, record: any, index: number) => {
        return <div style={{ textAlign: 'right' }}>{index + 1}</div>;
      },
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
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
      editable: true,
    },
    {
      title: 'Total Price',
      dataIndex: 'subtotalorder',
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

  const handleSave = (row: DataType) => {
    const newData = [...OrderDetailsData];
    const index = newData.findIndex((item) => row.id === item.id);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setOrderDetailsData(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = selectedBookscolumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  return (
    <div>
      <Button
        onClick={() => {
          console.log('orderDetails', OrderDetailsData);
        }}
        type="primary"
        style={{ marginBottom: 16 }}
      >
        Save
      </Button>
      <Table components={components} rowClassName={() => 'editable-row'} bordered dataSource={OrderDetailsData} columns={columns as ColumnTypes} />
    </div>
  );
};

export default OrderDetailTable;
