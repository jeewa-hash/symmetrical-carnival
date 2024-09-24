import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Button, Table, Select, DatePicker, message, Modal } from 'antd';
import moment from 'moment';
import Header from '../Shared/Header';
import Footer from '../Shared/Footer';
import axios from 'axios';
import './RawMaterialRequest.css';

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
        <>
          <Button type="primary" onClick={() => onEdit(record)}>Edit</Button>
          <Button type="primary" danger style={{ marginLeft: '8px' }} onClick={() => confirmDelete(record)}>Delete</Button>
        </>
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
    <div>
      <Header />
      <div className="raw-material-request-container">
        <h1 className="form-heading">Raw Material Request</h1>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="raw-material-request-form"
        >
          <Form.Item
            label="Date"
            name="date"
            rules={[{ required: true, message: 'Please select a date' }]}
            className="form-item"
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
            className="form-item"
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
            rules={[{ required: true, message: 'Please enter the quantity' },
              { type: 'number', message: 'Quantity must be a number' },
              { validator: (_, value) => {
                  if (value !== undefined && (value < 0 || !Number.isInteger(value))) {
                    return Promise.reject(new Error('Quantity must be a non-negative integer'));
                  }
                  return Promise.resolve();
                }
              }
            ]}
            className="form-item"
          >
            <InputNumber
              min={0}
              placeholder="Enter quantity"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: 'Please select the status' }]}
            className="form-item"
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
            className="form-item"
          >
            <Input.TextArea rows={3} placeholder="Enter any comments" style={{ width: '100%' }} />
          </Form.Item>

          <Button type="primary" htmlType="submit" style={{ backgroundColor: '#ff6f61', borderColor: '#ff6f61', marginBottom: '20px' }}>
            {isEditing ? 'Save Changes' : 'Submit'}
          </Button>
        </Form>

        {/* Search Bar */}
        <Input
          placeholder="Search by Material Name"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{
            marginBottom: '20px',
            width: '80%',
            marginLeft: 'auto',
            marginRight: 'auto',
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
        />
      </div>
      <Footer />
    </div>
  );
};

export default RawMaterialRequest;
