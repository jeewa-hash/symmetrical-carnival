import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, DatePicker, Button, Table, Modal, Select } from 'antd';
import axios from 'axios';
import moment from 'moment';
import Header from '../Shared/Header';
import Footer from '../Shared/Footer';
import backgroundImage from '../image/design.png'; // Adjust the path according to your structure

const { Option } = Select;

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
    const { productName, quantity, unitPrice, dateManufactured, unitMeasurement } = values;
    const totalValue = quantity * unitPrice;
    const newData = {
      productName,
      quantity,
      unitPrice,
      dateManufactured: dateManufactured.format('YYYY-MM-DD'),
      totalValue,
      unitMeasurement, // Including unitMeasurement in form data
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
      unitMeasurement: item.unitMeasurement, // Setting unitMeasurement value in form
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
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button type="primary" onClick={() => handleEdit(index)}>Edit</Button>
          <Button type="primary" danger onClick={() => handleDelete(index)}>Delete</Button>
        </div>
      ),
    },
  ];

  return (
    <div
      className="flex flex-col min-h-screen relative"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Header />
      <div className="flex-1 flex justify-center items-center relative">
        <div className="max-w-2xl w-full bg-pink-100 bg-opacity-80 backdrop-blur-lg rounded-lg shadow-xl p-10 border border-gray-200 space-y-6 z-10">
          <h1 className="form-heading text-4xl font-bold text-purple-600 mb-4 text-center">Finished Goods</h1>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            onValuesChange={handleValuesChange}
            className="space-y-4"
          >
            <Form.Item
              label="Product Name"
              name="productName"
              rules={[{ required: true, message: 'Please enter the product name' },
              { pattern: /^[A-Za-z\s]+$/, message: 'Product Name can only contain letters and spaces!' }]}
            >
              <Input
                placeholder="Enter product name"
                onKeyPress={(e) => {
                  if (!/^[A-Za-z\s]+$/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
                className="w-full h-10 border border-gray-300 p-1 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </Form.Item>

            <Form.Item
              label="Quantity"
              name="quantity"
              rules={[{ required: true, message: 'Please enter the quantity' }]}
            >
              <InputNumber
                min={1}
                placeholder="Enter Quantity"
                style={{ width: '100%' }}
                className="w-full h-10 border border-gray-300 p-1 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                onKeyPress={(e) => {
                  if (!/[0-9]/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
            </Form.Item>

            <Form.Item
              label="Unit Measurement"
              name="unitMeasurement"
              rules={[{ required: true, message: 'Please select a unit of measurement' }]}
            >
              <Select
                placeholder="Select unit measurement"
                className="w-full h-10 border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <Option value="sets">Sets</Option>
                <Option value="pk">Packs</Option>
                <Option value="pair">Pair</Option>
                <Option value="each">Each</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Unit Price"
              name="unitPrice"
              rules={[{ required: true, message: 'Please enter the unit price' }]}
            >
              <InputNumber
                min={1}
                placeholder="Enter price"
                style={{ width: '100%' }}
                className="w-full h-10 border border-gray-300 p-1 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                onKeyPress={(e) => {
                  if (!/[0-9]/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
            </Form.Item>

            <Form.Item
              label="Date Manufactured"
              name="dateManufactured"
              rules={[{ required: true, message: 'Please select the manufacture date' }]}
            >
              <DatePicker style={{ width: '100%' }} className="w-full h-10 border border-gray-300 p-1 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </Form.Item>

            <Form.Item label="Total Value" name="totalValue">
              <InputNumber disabled style={{ width: '100%' }} />
            </Form.Item>

            <div className="flex justify-center">
              <Button type="primary" htmlType="submit" style={{ backgroundColor: '#ff6f61', borderColor: '#ff6f61' }} className="bg-purple-600 text-white rounded-lg px-4 py-2 hover:bg-purple-700 transition duration-300">Submit</Button>
            </div>
          </Form>

          <Input
            placeholder="Search by product name"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full h-10 border border-gray-300 p-1 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <Table columns={columns} dataSource={filteredData} rowKey="_id" />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FinishGoods;
