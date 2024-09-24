import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Button, Table, Modal } from 'antd'; // Import Modal
import axios from 'axios';
import Header from '../Shared/Header';
import Footer from '../Shared/Footer';
import './Inventory.css'; // You can add custom styles here if needed.

const Inventory = () => {
  const [formData, setFormData] = useState({
    materialName: '',
    quantity: 0,
    unitPrice: 0,
    totalValue: 0,
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
      title: 'Actions',
      key: 'actions',
      render: (_, __, index) => (
        <>
          <Button type="primary" onClick={() => handleEdit(index)}>
            Edit
          </Button>
          <Button type="primary" danger style={{ marginLeft: '8px' }} onClick={() => handleDelete(index)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <Header />
      <div className="inventory-container">
        <h1 className="form-heading">Raw Materials</h1>
        <Form
          form={form} // Attach the form instance
          layout="vertical"
          onValuesChange={handleFormChange}
          onFinish={handleSubmit}
          className="inventory-form"
        >
          <Form.Item
            label="Material Name"
            name="materialName"
            rules={[{ required: true, message: 'Please input the material name!' },
            {
              pattern: /^[A-Za-z\s]+$/,
              message: 'Material Name can only contain letters and spaces!',
            },
            ]}
          >
            <Input
              placeholder="Enter Material Name"
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
            rules={[{ required: true, message: 'Please input the quantity!' }, { type: 'number', min: 1, message: 'Quantity must be a positive number!' }]}
          >
            <InputNumber
              min={1}
              placeholder="Enter Quantity"
              style={{ width: '100%' }}
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
            rules={[{ required: true, message: 'Please input the unit price!' }, { type: 'number', min: 0, message: 'Unit Price cannot be negative!' }]}
          >
            <InputNumber
              min={0}
              step={0.01}
              placeholder="Enter Unit Price"
              style={{ width: '100%' }}
              onKeyPress={(e) => {
                if (!/[0-9.]/.test(e.key)) {
                  e.preventDefault();
                }
              }}
            />
          </Form.Item>

          <Form.Item label="Total Value">
            <InputNumber name="totalValue" value={formData.totalValue} disabled style={{ width: '100%' }} />
          </Form.Item>

          <Button type="primary" htmlType="submit" style={{ backgroundColor: '#ff6f61', borderColor: '#ff6f61', marginBottom: '20px' }}>
            {isEditing ? 'Update' : 'Submit'}
          </Button>
        </Form>

        <div className="table-container">
          <Input
            placeholder="Search by Material Name"
            value={searchQuery}
            onChange={handleSearch}
            style={{ marginBottom: '1rem' }}
          />
          <Table
            columns={columns}
            dataSource={filteredList}
            rowKey={(record) => record._id} // Assuming each material has an _id field
            pagination={{ pageSize: 5 }}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Inventory;
