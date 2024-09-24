import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Button, Table, Select, Modal, message } from 'antd'; // Added Modal and message
import Header from "../Shared/Header";
import Footer from "../Shared/Footer";
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Import the autotable plugin
import './MonthlyEvalution.css';

const { Option } = Select; // Destructuring Option
const { confirm } = Modal; // Destructuring Modal confirm

const MonthlyEvaluation = () => {
  const [formData, setFormData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [form] = Form.useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/monthlyEvaluation/');
      setFormData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const columns = [
    {
      title: 'Month',
      dataIndex: 'month',
      key: 'month',
    },
    {
      title: 'Total Raw Materials',
      dataIndex: 'totalRawMaterials',
      key: 'totalRawMaterials',
    },
    {
      title: 'Total Finished Goods',
      dataIndex: 'totalFinishedGoods',
      key: 'totalFinishedGoods',
    },
    {
      title: 'Total Inventory',
      dataIndex: 'totalInventory',
      key: 'totalInventory',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button type="primary" onClick={() => onEdit(record)}>Edit</Button>
          <Button type="primary" danger style={{ marginLeft: '8px' }} onClick={() => onDelete(record)}>Delete</Button>
        </>
      ),
    },
  ];

  const onFinish = async (values) => {
    const totalInventory = values.totalRawMaterials + values.totalFinishedGoods;
    const recordData = { ...values, totalInventory };

    try {
      const response = await axios.post('http://localhost:4000/api/monthlyEvaluation/create', recordData);
      const newData = { key: response.data.key, ...response.data };
      setFormData([...formData, newData]);
      form.resetFields();
    } catch (error) {
      console.error('Error creating record:', error);
    }
  };

  const onDelete = (key) => {
    confirm({
      title: 'Are you sure you want to delete this record?',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          await axios.delete(`http://localhost:4000/api/monthlyEvaluation/${key._id}`); // Fixed template literal syntax
          const newData = formData.filter(item => item._id !== key._id);
          setFormData(newData);
          message.success('Record deleted successfully');
        } catch (error) {
          console.error('Error deleting record:', error);
          message.error('Failed to delete the record');
        }
      },
      onCancel() {
        console.log('Delete action cancelled');
      },
    });
  };

  const onEdit = (record) => {
    setIsEditing(true);
    setEditingRecord(record);
    form.setFieldsValue(record);
  };

  const saveEdit = async (values) => {
    const totalInventory = values.totalRawMaterials + values.totalFinishedGoods;
    const recordData = { ...values, totalInventory };

    try {
      const response = await axios.put(`http://localhost:4000/api/monthlyEvaluation/${editingRecord._id}`, recordData); // Fixed template literal syntax
      const updatedData = formData.map(item =>
        item._id === editingRecord._id ? { ...item, ...response.data } : item
      );
      setFormData(updatedData);
      setIsEditing(false);
      setEditingRecord(null);
      form.resetFields();
    } catch (error) {
      console.error('Error updating record:', error);
    }
  };

  const handleValuesChange = (changedValues) => {
    if (changedValues.totalRawMaterials || changedValues.totalFinishedGoods) {
      const totalRawMaterials = changedValues.totalRawMaterials || form.getFieldValue('totalRawMaterials') || 0;
      const totalFinishedGoods = changedValues.totalFinishedGoods || form.getFieldValue('totalFinishedGoods') || 0;
      const totalInventory = totalRawMaterials + totalFinishedGoods;
      form.setFieldsValue({ totalInventory });
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Monthly Evaluation Report", 14, 16);
    
    const tableColumn = ["Month", "Total Raw Materials", "Total Finished Goods", "Total Inventory"];
    const tableRows = formData.map(record => [
      record.month,
      record.totalRawMaterials,
      record.totalFinishedGoods,
      record.totalInventory,
    ]);

    doc.autoTable(tableColumn, tableRows, { startY: 20 });
    doc.save("monthly_evaluation_report.pdf");
  };

  // Filtered data based on search query
  const filteredData = formData.filter(item =>
    item.month.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <Header />

      <div className="inventory-evaluation-container">
        <h1 className="form-heading">Monthly Inventory Evaluation</h1>

        <Button
          type="primary"
          onClick={downloadPDF}
          style={{ backgroundColor: '#ff6f61', borderColor: '#ff6f61', marginBottom: '20px' }}
        >
          Download Monthly Evaluation
        </Button>

        <Form
          form={form}
          layout="vertical"
          onFinish={isEditing ? saveEdit : onFinish}
          onValuesChange={handleValuesChange}
          className="inventory-evaluation-form"
        >
          <Form.Item
            label="Month"
            name="month"
            rules={[{ required: true, message: 'Please select a month' }]}
          >
            <Select placeholder="Select month" style={{ width: '100%' }}>
              <Option value="January">January</Option>
              <Option value="February">February</Option>
              <Option value="March">March</Option>
              <Option value="April">April</Option>
              <Option value="May">May</Option>
              <Option value="June">June</Option>
              <Option value="July">July</Option>
              <Option value="August">August</Option>
              <Option value="September">September</Option>
              <Option value="October">October</Option>
              <Option value="November">November</Option>
              <Option value="December">December</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Total Raw Materials"
            name="totalRawMaterials"
            rules={[{ required: true, message: 'Please enter total raw materials' }, { type: 'number', message: 'Total Raw Materials must be a number' }]}
          >
            <InputNumber
              min={0}
              placeholder="Enter total raw materials"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            label="Total Finished Goods"
            name="totalFinishedGoods"
            rules={[{ required: true, message: 'Please enter total finished goods' }, { type: 'number', message: 'Total Finished Goods must be a number' }]}
          >
            <InputNumber
              min={0}
              placeholder="Enter total finished goods"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            label="Total Inventory"
            name="totalInventory"
            rules={[{ required: true, message: 'Please enter total inventory' }]}
          >
            <InputNumber min={0} placeholder="Enter total inventory" disabled style={{ width: '100%' }} />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            style={{ backgroundColor: '#ff6f61', borderColor: '#ff6f61', marginBottom: '20px' }}
          >
            {isEditing ? 'Update' : 'Submit'}
          </Button>
          {isEditing && (
            <Button type="default" onClick={() => {
              setIsEditing(false);
              setEditingRecord(null);
              form.resetFields();
            }} style={{ width: '100%', marginTop: '10px' }}>
              Cancel
            </Button>
          )}
        </Form>

        {/* Search bar for filtering */}
        <Input
          placeholder="Search by Month"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{
            margin: '20px 0',
            width: '100%',
            marginLeft: 'auto',
            marginRight: 'auto',
            borderRadius: '4px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          }}
        />

        <Table
          columns={columns}
          dataSource={filteredData} // Use filtered data
          pagination={{ pageSize: 10 }}
          rowKey="_id"
        />
      </div>

      <Footer />
    </div>
  );
};

export default MonthlyEvaluation;
