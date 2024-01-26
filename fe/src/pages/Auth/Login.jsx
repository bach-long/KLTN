import React from 'react'
import { Button, Form, Input } from 'antd';
import './login.scss'
import { Link } from 'react-router-dom';
import { login } from '../../services/Auth';
import { useContext } from 'react';
import { AuthContext } from '../../providers/AuthProvider';

function Login() {
  const [form] = Form.useForm();
  const {setAuthUser} = useContext(AuthContext)

  const onFinish = async (values) => {
    console.log(values)
    const data = await login(values);
    console.log(data);
    localStorage.setItem("accessToken", data.data.token)
    localStorage.setItem('authUser', JSON.stringify(data.data.user))
    setAuthUser(data.data.user)

  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div id='login'>
      <Form
        form={form}
        name="Login"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        style={{
          maxWidth: 600,
          minWidth: 200
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        className='form'
      >
        <h3 className='form-title'>Đăng Nhập</h3>
        <Form.Item
          label="Username"
          name="username"
          rules={[
            {
              required: true,
              message: 'Hãy nhập username!',
            },
          ]}
          style={{
            fontSize: '16px',
            fontWeight: 600
          }}
        >
          <Input style={{fontSize: '16px'}}/>
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: 'Hãy nhập mật khẩu!',
            },
          ]}
          style={{
            fontSize: '16px',
            fontWeight: 600,
          }}
        >
          <Input.Password style={{fontSize: '16px'}}/>
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 4,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit" style={{fontSize: '16px', fontWeight: 600}}>
            Login
          </Button>
        </Form.Item>
        <span>Chưa có tài khoản? <Link to="/auth/signup">Đăng ký tại đây</Link></span>
      </Form>
    </div>
  )
}

export default Login
