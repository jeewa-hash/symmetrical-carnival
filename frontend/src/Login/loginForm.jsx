import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';

import backgroundImage from '../image/BR.png'; // Update the path to your image

const LoginForm = () => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setIsLoading(true);
    try {
      const url = isLogin ? '/api/auth/login' : '/api/auth/register';
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      if (response.ok) {
        message.success(isLogin ? 'Login successful' : 'Registration successful');
        form.resetFields();

        // Conditional navigation based on the email
        if (isLogin) {
          if (values.email === 'naveeshabjayah@gmail.com') {
            navigate('/inventoryui');
          } else if (values.email === 'senithrockz@gmail.com') {
            navigate('/finishgoods');
          }else if (values.email === 'jkumarasekara@gmail.com') {
            navigate('/financeui');
          }else if (values.email === 'osheratashmi@gmail.com') {
            navigate('/orderandproductionui');
          }else if (values.email === 'yashirasarasi04@gmail.com') {
            navigate('/supplierui');
          }else if (values.email === 'gangulr30@gmail.com') {
            navigate('/hrui');
          } else if (values.email === 'dinupadulnith2002@gmail.com') {
            navigate('/salesui');
          }else if (values.email === 'sathirapramudith@gmail.com') {
            navigate('/deliveryui');
          } else {
            message.error('User not authorized for this section.');
          }
        }
      } else {
        message.error(data.message || 'Action failed');
      }
    } catch (error) {
      message.error('An error occurred: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh', // Ensures the background covers the full height
      }}
    >
   
      <div className="flex-1 flex justify-center items-center">
        <div className="max-w-md w-full bg-white shadow-md rounded-lg p-8">
          <h1 className="text-2xl font-bold text-center mb-6">{isLogin ? 'Login' : 'Register'}</h1>
          <Form form={form} layout="vertical" onFinish={onFinish} className="space-y-4">
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Please enter a valid email' },
              ]}
            >
              <Input type="email" placeholder="Enter your email" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: 'Please enter your password' }]}
            >
              <Input.Password placeholder="Enter your password" />
            </Form.Item>

            <div className="flex justify-center">
              <Button type="primary" htmlType="submit" loading={isLoading} style={{ backgroundColor: '#ff6f61', borderColor: '#ff6f61' }}>
                {isLogin ? 'Login' : 'Register'}
              </Button>
            </div>

            <div className="flex justify-center mt-4">
              <Button type="link" onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? 'Don’t have an account? Register here' : 'Already have an account? Login here'}
              </Button>
            </div>
          </Form>
        </div>
      </div>
      
    </div>
  );
};

export default LoginForm;
