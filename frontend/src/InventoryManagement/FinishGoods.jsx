import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, DatePicker, Button, Table, Modal } from 'antd';
import axios from 'axios';
import moment from 'moment';
import './FinishGoods.css';
import Header from '../Shared/Header';
import Footer from '../Shared/Footer';

const FinishGoods = () => {
  const [formData, setFormData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [form] = Form.useForm();
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    fetchFinishedGoods();
  }, []);

  useEffect(() => {
    setFilteredData(
      formData.filter(item => 
        item.productName.toLowerCase().includes(searchText.toLowerCase())
      )
    );
  }, [formData, searchText]);

  const fetchFinishedGoods = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/finishingGoods');
      setFormData(response.data);
    } catch (error) {
      console.error('Error fetching finished goods:', error);
    }
  };

  const handleFinish = async (values) => {
    const { productName, quantity, unitPrice, dateManufactured } = values;
    const totalValue = quantity * unitPrice;
    const newData = {
      productName,
      quantity,
      unitPrice,
      dateManufactured: dateManufactured.format('YYYY-MM-DD'),
      totalValue,
    };

    try {
      if (editingIndex !== null) {
        await axios.put(`http://localhost:4000/api/finishingGoods/${formData[editingIndex]._id}`, newData);
        const updatedData = [...formData];
        updatedData[editingIndex] = newData;
        setFormData(updatedData);
      } else {
        const response = await axios.post('http://localhost:4000/api/finishingGoods/', newData);
        setFormData([...formData, response.data]);
      }
      form.resetFields();
      setEditingIndex(null);
    } catch (error) {
      console.error('Error submitting finished good:', error);
    }
  };

  const handleEdit = (index) => {
    const item = formData[index];
    form.setFieldsValue({
      productName: item.productName,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      dateManufactured: moment(item.dateManufactured),
      totalValue: item.totalValue,
    });
    setEditingIndex(index);
  };

  const handleDelete = (index) => {
    Modal.confirm({
      title: 'Confirm Deletion',
      content: 'Are you sure you want to delete this finished good?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          await axios.delete(`http://localhost:4000/api/finishingGoods/${formData[index]._id}`);
          setFormData(formData.filter((_, i) => i !== index));
        } catch (error) {
          console.error('Error deleting finished good:', error);
        }
      },
    });
  };

  const handleValuesChange = (changedValues) => {
    if (changedValues.quantity || changedValues.unitPrice) {
      const quantity = changedValues.quantity !== undefined ? changedValues.quantity : form.getFieldValue('quantity');
      const unitPrice = changedValues.unitPrice !== undefined ? changedValues.unitPrice : form.getFieldValue('unitPrice');
      const totalValue = quantity * unitPrice;
      form.setFieldsValue({ totalValue });
    }
  };

  const columns = [
    {
      title: 'Product Name',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Unit Price',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
    },
    {
      title: 'Date Manufactured',
      dataIndex: 'dateManufactured',
      key: 'dateManufactured',
      render: (text) => moment(text).format('YYYY-MM-DD'),
    },
    {
      title: 'Total Value',
      dataIndex: 'totalValue',
      key: 'totalValue',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, __, index) => (
        <>
          <Button type="primary" onClick={() => handleEdit(index)}>Edit</Button>
          <Button type="primary" danger style={{ marginLeft: '8px' }} onClick={() => handleDelete(index)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <Header/>
      <div className="inventory-container">
        <h1 className="form-heading">Finished Goods</h1>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          onValuesChange={handleValuesChange}
          className="finished-goods-form"
        >
          <Form.Item
            label="Product Name"
            name="productName"
            rules={[
              { required: true, message: 'Please enter the product name' },
              {
                pattern: /^[A-Za-z\s]+$/,
                message: 'Product Name can only contain letters and spaces!'
              }
            ]}
          >
            <Input
              placeholder="Enter product name"
              onKeyPress={(e) => {
                if (!/^[A-Za-z\s]+$/.test(e.key)) {
                  e.preventDefault();
                }
              }}
            />
          </Form.Item>

          <Form.Item
            label="Quantity"
            name="quantity"
            rules={[{ required: true, message: 'Please enter the quantity' }]}
          >
            <InputNumber min={1} placeholder="Enter quantity" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="Unit Price"
            name="unitPrice"
            rules={[{ required: true, message: 'Please enter the unit price' }]}
          >
            <InputNumber min={0} step={0.01} placeholder="Enter unit price" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="Date Manufactured"
            name="dateManufactured"
            rules={[{ required: true, message: 'Please select the manufacture date' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item label="Total Value" name="totalValue">
            <InputNumber disabled style={{ width: '100%' }} />
          </Form.Item>

          <Button type="primary" htmlType="submit" style={{ backgroundColor: '#ff6f61', borderColor: '#ff6f61', marginBottom: '20px' }}>
            {editingIndex !== null ? 'Update' : 'Submit'}
          </Button>
        </Form>

        {/* Search Bar */}
        <Input
          placeholder="Search by product name"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ margin: '20px 0', width: '100%' }}
        />

        <Table
          dataSource={filteredData}
          columns={columns}
          rowKey={(record) => record.productName + record.dateManufactured}
          pagination={false}
          className="finished-goods-table"
          style={{ width: '100%', margin: '20px auto' }} // Center the table and reduce width
        />
      </div>
      <Footer/>
    </div>
  );
};

export default FinishGoods;
