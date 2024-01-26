import React from 'react'
import { Button, Form, Input } from 'antd';
import './signup.scss'
import { Link } from 'react-router-dom';
import { signup } from '../../services/Auth';

const onFinish = async (values) => {
  const data = await signup(values);
  console.log(data);
};
const onFinishFailed = (errorInfo) => {
  console.log('Failed:', errorInfo);
};

function Signup() {
  const [form] = Form.useForm();

  return (
    <div id='signup'>
      <Form
        form={form}
        name="Signup"
        labelCol={{
          span: 10,
        }}
        wrapperCol={{
          span: 22,
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
        <h3 className='form-title'>Đăng Ký</h3>
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
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: 'Hãy nhập tài khoản email!',
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
          label="Confirm Password"
          name="confirm_password"
          rules={[
            {
              required: true,
              message: 'Hãy nhập lại mật khẩu!',
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
            Signup
          </Button>
        </Form.Item>
        <span>Đã có tài khoản? <Link to="/auth/login">Đăng nhập</Link></span>
      </Form>
    </div>
  )
}

export default Signup
