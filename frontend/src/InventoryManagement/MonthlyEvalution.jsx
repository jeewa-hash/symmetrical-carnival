import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Button, Table, Select, Modal, message } from 'antd';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import backgroundImage from '../image/design.png'; // Adjust the path according to your structure
import moment from 'moment';
import logo from '../image/logo.png';

const { Option } = Select;
const { confirm } = Modal;

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
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button type="primary" onClick={() => onEdit(record)}>Edit</Button>
          <Button type="primary" danger onClick={() => onDelete(record)}>Delete</Button>
        </div>
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

  const onDelete = (record) => {
    confirm({
      title: 'Are you sure you want to delete this record?',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          await axios.delete(`http://localhost:4000/api/monthlyEvaluation/${record._id}`);
          const newData = formData.filter(item => item._id !== record._id);
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
      const response = await axios.put(`http://localhost:4000/api/monthlyEvaluation/${editingRecord._id}`, recordData);
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
  
    const img = new Image();
    img.src = logo; // Ensure 'logo' is defined and accessible
    img.onload = () => {
      // Add the logo to the PDF
      doc.addImage(img, "PNG", 14, 10, 40, 20); // Adjust the position and size as needed
  
      // Set font size for company name
      
      doc.setFontSize(20);
      doc.text("Bear Works Lanka", 60, 20); // Position for company name (adjusted to be in the same row as the logo)
  
      // Set font size for report title
      doc.setFontSize(16);
      doc.text("Monthly Evaluation Report", 14, 40); // Position for report title
  
      // Define table columns and rows
      const tableColumn = ["Month", "Total Raw Materials", "Total Finished Goods", "Total Inventory"];
      const tableRows = formData.map(record => [
        record.month,
        record.totalRawMaterials,
        record.totalFinishedGoods,
        record.totalInventory,
      ]);
  
      // Draw the table starting below the report title
      doc.autoTable(tableColumn, tableRows, { startY: 50 }); // Adjust startY based on the title position
      doc.save("monthly_evaluation_report.pdf");
    };
  };
  

  const filteredData = formData.filter(item =>
    item.month.toLowerCase().includes(searchQuery.toLowerCase())
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
      
      <div className="flex-1 flex justify-center items-center relative">
        <div className="max-w-2xl w-full bg-white bg-opacity-80 backdrop-blur-lg rounded-lg shadow-xl p-10 border border-gray-200 space-y-6 z-10">
          <h1 className="form-heading text-4xl font-bold text-purple-600 mb-4 text-center">Monthly Inventory Valuation</h1>

          <Button
            type="primary"
            onClick={downloadPDF}
            style={{ backgroundColor: '#ff6f61', borderColor: '#ff6f61', marginBottom: '20px' }}
          >
            Download Monthly Evaluation
          </Button>

          <Input
            placeholder="Search by month"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ marginBottom: '20px', width: '100%' }}
          />

          <Form
            form={form}
            layout="vertical"
            onFinish={isEditing ? saveEdit : onFinish}
            onValuesChange={handleValuesChange}
            className="space-y-4"
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
                min={1}
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
              label="Total Finished Goods"
              name="totalFinishedGoods"
              rules={[{ required: true, message: 'Please enter total finished goods' }, { type: 'number', message: 'Total Finished Goods must be a number' }]}
            >
            <InputNumber
                min={1}
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
              }}>
                Cancel
              </Button>
            )}
          </Form>

          <Table
            dataSource={filteredData}
            columns={columns}
            rowKey="_id"
            pagination={{ pageSize: 5 }}
          />
        </div>
      </div>

     
    </div>
  );
};

export default MonthlyEvaluation;
