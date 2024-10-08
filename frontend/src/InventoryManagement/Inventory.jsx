import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Button, Table, Modal, Select } from 'antd';
import axios from 'axios';

import backgroundImage from '../image/design.png'; // Adjust the path accordingly

const { Option } = Select;

const Inventory = () => {
  const [formData, setFormData] = useState({
    materialName: '',
    quantity: 0,
    unitPrice: 0,
    totalValue: 0,
    unitMeasurement: 'meter', // Default unit
  });

  const [inventoryList, setInventoryList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [form] = Form.useForm(); // Create a form instance

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/rawMaterial');
      setInventoryList(response.data);
    } catch (error) {
      console.error('Error fetching materials:', error);
    }
  };

  const handleFormChange = (changedValues, allValues) => {
    const totalValue = allValues.quantity * allValues.unitPrice || 0;
    setFormData({ ...allValues, totalValue });
  };

  const handleSubmit = async () => {
    try {
      if (isEditing) {
        // Update existing inventory item
        await axios.put(`http://localhost:4000/api/rawMaterial/${inventoryList[editingIndex]._id}`, formData);
        const updatedList = [...inventoryList];
        updatedList[editingIndex] = { ...formData, _id: inventoryList[editingIndex]._id };
        setInventoryList(updatedList);
        setIsEditing(false);
      } else {
        // Add new inventory item
        const response = await axios.post('http://localhost:4000/api/rawMaterial', formData);
        setInventoryList([...inventoryList, response.data]);
      }
      resetForm(); // Clear the form after submission
    } catch (error) {
      console.error('Error submitting material:', error);
    }
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setFormData(inventoryList[index]);
    setIsEditing(true);
    form.setFieldsValue(inventoryList[index]); // Set form values for editing
  };

  const handleDelete = (index) => {
    // Show confirmation modal
    Modal.confirm({
      title: 'Are you sure you want to delete this material?',
      content: 'This action cannot be undone.',
      onOk: async () => {
        try {
          await axios.delete(`http://localhost:4000/api/rawMaterial/${inventoryList[index]._id}`);
          setInventoryList(inventoryList.filter((_, i) => i !== index));
        } catch (error) {
          console.error('Error deleting material:', error);
        }
      },
    });
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredList = inventoryList.filter((item) =>
    item.materialName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      materialName: '',
      quantity: 0,
      unitPrice: 0,
      totalValue: 0,
      unitMeasurement: 'meter',
    });
    form.resetFields(); // Reset the form fields using form instance
  };

  const columns = [
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
      title: 'Unit Price',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
    },
    {
      title: 'Total Value',
      dataIndex: 'totalValue',
      key: 'totalValue',
    },
    {
      title: 'Unit Measurement',
      dataIndex: 'unitMeasurement',
      key: 'unitMeasurement',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, __, index) => (
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '150px' }}>
          <Button type="primary" onClick={() => handleEdit(index)}>
            Edit
          </Button>
          <Button type="primary" danger onClick={() => handleDelete(index)}>
            Delete
          </Button>
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
      

      <div className="flex-1 flex justify-center items-center relative">
        <div className="max-w-2xl w-full bg-pink-100 bg-opacity-80 backdrop-blur-lg rounded-lg shadow-xl p-10 border border-gray-200 space-y-6 z-10">
          <h2 className="text-4xl font-bold text-purple-600 mb-4 text-center">
            Raw Materials
          </h2>

          <Form
            form={form} // Attach the form instance
            layout="vertical"
            onValuesChange={handleFormChange}
            onFinish={handleSubmit}
            className="space-y-4"
          >
            <Form.Item
              label="Material Name"
              name="materialName"
              rules={[
                { required: true, message: 'Please input the material name!' },
                { pattern: /^[A-Za-z\s]+$/, message: 'Material Name can only contain letters and spaces!' },
              ]}
            >
              <Input
                placeholder="Enter Material Name"
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
              rules={[
                { required: true, message: 'Please input the quantity!' },
                { type: 'number', min: 1, message: 'Quantity must be a positive number!' },
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
              label="Unit Price"
              name="unitPrice"
              rules={[
                { required: true, message: 'Please input the unit price!' },
                { type: 'number', min: 0, message: 'Unit Price cannot be negative!' },
              ]}
            >
              <InputNumber
                min={0}
                step={0.01}
                placeholder="Enter Unit Price"
                style={{ width: '100%' }}
                className="w-full h-10 border border-gray-300 p-1 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                onKeyPress={(e) => {
                  if (!/[0-9.]/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
            </Form.Item>

            <Form.Item
              label="Unit Measurement"
              name="unitMeasurement"
              rules={[{ required: true, message: 'Please select a unit of measurement!' }]}
            >
              <Select
                placeholder="Select Unit"
                className="w-full h-10"
                onChange={(value) => setFormData({ ...formData, unitMeasurement: value })}
              >
                <Option value="meter">Meter</Option>
                <Option value="cm">Centimeter</Option>
                <Option value="yard">Yard</Option>
                <Option value="kilogram">Kilogram</Option>
                <Option value="piece">Piece</Option>
              </Select>
            </Form.Item>

            <Form.Item label="Total Value">
              <InputNumber
                name="totalValue"
                value={formData.totalValue}
                disabled
                style={{ width: '100%' }}
                className="w-full h-10 border border-gray-300 p-1 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </Form.Item>

            <div className="flex justify-center">
              <Button
                type="primary"
                htmlType="submit"
                style={{ backgroundColor: '#ff6f61', borderColor: '#ff6f61' }}
                className="bg-purple-600 text-white rounded-lg px-4 py-2 hover:bg-purple-700"
              >
                {isEditing ? 'Update Material' : 'Add Material'}
              </Button>
            </div>
          </Form>

          <Input
            placeholder="Search by Material Name"
            onChange={handleSearch}
            className="w-full h-10 border border-gray-300 p-1 rounded-lg mt-4"
          />

          <Table
            dataSource={filteredList}
            columns={columns}
            rowKey="_id"
            className="mt-4"
            pagination={{ pageSize: 5 }}
            bordered
            scroll={{ x: true }} // Enable horizontal scrolling for the table
          />
        </div>
      </div>

      
    </div>
  );
};

export default Inventory;
