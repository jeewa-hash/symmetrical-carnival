import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Button, Table, Select, DatePicker, message, Modal } from 'antd';
import moment from 'moment';
import Header from '../Shared/Header';
import Footer from '../Shared/Footer';
import axios from 'axios';
import backgroundImage from '../image/design.png'; // Adjust the path according to your structure

const { Option } = Select;

const RawMaterialRequest = () => {
  const [formData, setFormData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/rawMaterialRequest');
        setFormData(response.data);
      } catch (error) {
        message.error('Failed to fetch data');
      }
    };
    fetchData();
  }, []);

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (text) => moment(text).format('YYYY-MM-DD'),
    },
    {
      title: 'Material Name',
      dataIndex: 'materialName',
      key: 'materialName',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Comments',
      dataIndex: 'comments',
      key: 'comments',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button type="primary" onClick={() => onEdit(record)}>Edit</Button>
          <Button type="primary" danger style={{ marginLeft: '8px' }} onClick={() => confirmDelete(record)}>Delete</Button>
        </div>
      ),
    },
  ];

  const onFinish = async (values) => {
    try {
      const newData = {
        ...values,
        date: values.date.toDate(),
      };
      if (isEditing) {
        await axios.put(`http://localhost:4000/api/rawMaterialRequest/${editingRecord._id}`, newData);
        const updatedData = formData.map((item) =>
          item._id === editingRecord._id ? { ...item, ...newData } : item
        );
        setFormData(updatedData);
        message.success('Request updated successfully');
      } else {
        const response = await axios.post('http://localhost:4000/api/rawMaterialRequest', newData);
        setFormData([...formData, { key: response.data.key, ...newData }]);
        message.success('Request created successfully');
      }
      form.resetFields();
      setIsEditing(false);
      setEditingRecord(null);
    } catch (error) {
      message.error('Failed to save request');
    }
  };

  const confirmDelete = (record) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this request?',
      content: 'This action cannot be undone.',
      onOk: () => onDelete(record),
      onCancel() {
        // Handle cancel action if needed
      },
    });
  };

  const onDelete = async (record) => {
    try {
      await axios.delete(`http://localhost:4000/api/rawMaterialRequest/${record._id}`);
      const newData = formData.filter((item) => item._id !== record._id);
      setFormData(newData);
      message.success('Request deleted successfully');
    } catch (error) {
      message.error('Failed to delete request');
    }
  };

  const onEdit = (record) => {
    setIsEditing(true);
    setEditingRecord(record);
    form.setFieldsValue({
      ...record,
      date: moment(record.date),
    });
  };

  const filteredData = formData.filter(item =>
    item.materialName.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <h1 className="form-heading text-4xl font-bold text-purple-600 mb-4 text-center">Raw Material Request</h1>

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            className="space-y-4"
          >
            <Form.Item
              label="Date"
              name="date"
              rules={[{ required: true, message: 'Please select a date' }]}
            >
              <DatePicker 
                format="YYYY-MM-DD" 
                style={{ width: '100%' }} 
                disabledDate={(current) => current && current < moment().endOf('day')}
              />
            </Form.Item>

            <Form.Item
              label="Material Name"
              name="materialName"
              rules={[{ required: true, message: 'Please enter the material name' }]}
            >
              <Input 
                placeholder="Enter material name" 
                style={{ width: '100%' }} 
                onKeyPress={(e) => {
                  if (/^[0-9]$/.test(e.key)) {
                    e.preventDefault();
                  }
                }} 
              />
            </Form.Item>

            <Form.Item
              label="Quantity"
              name="quantity"
              rules={[
                { required: true, message: 'Please enter the quantity' },
                { type: 'number', message: 'Quantity must be a number' },
                { validator: (_, value) => {
                    if (value !== undefined && (value < 0 || !Number.isInteger(value))) {
                      return Promise.reject(new Error('Quantity must be a non-negative integer'));
                    }
                    return Promise.resolve();
                  }
                }
              ]}
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
              label="Status"
              name="status"
              rules={[{ required: true, message: 'Please select the status' }]}
            >
              <Select placeholder="Select status" style={{ width: '100%' }}>
                <Option value="InStock">InStock</Option>
                <Option value="LowStock">LowStock</Option>
                <Option value="OutOfStock">OutOfStock</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Comments"
              name="comments"
              rules={[{ required: true, message: 'Please enter comments' }]}
            >
              <Input.TextArea rows={3} placeholder="Enter any comments" style={{ width: '100%' }} />
            </Form.Item>

            <div className="flex justify-center">
              <Button type="primary" htmlType="submit" style={{ backgroundColor: '#ff6f61', borderColor: '#ff6f61' }}>
                {isEditing ? 'Save Changes' : 'Submit'}
              </Button>
            </div>
          </Form>

          {/* Search Bar */}
          <Input
            placeholder="Search by Material Name"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              marginBottom: '20px',
              width: '100%',
              borderRadius: '4px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            }}
          />

          <Table
            dataSource={filteredData}
            columns={columns}
            rowKey={(record) => record.key}
            pagination={false}
            className="raw-material-request-table"
            style={{ width: '100%', margin: '20px auto' }}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RawMaterialRequest;
