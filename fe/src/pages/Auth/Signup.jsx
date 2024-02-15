import {useState} from 'react'
import { Button, Form, Input } from 'antd';
import './signup.scss'
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../../services/Auth';
import SpinLoading from '../../components/Loading/SpinLoading';

function Signup() {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const data = await signup(values);
      console.log(data);
      navigate('/auth/login');
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div id='signup'>
      <Form
        disabled={loading ? true : false}
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
          { loading ? <SpinLoading/> :
          <Button type="primary" htmlType="submit" style={{fontSize: '16px', fontWeight: 600}}>
            Signup
          </Button>
          }
        </Form.Item>
        <span>Đã có tài khoản? <Link to="/auth/login">Đăng nhập</Link></span>
      </Form>
    </div>
  )
}

export default Signup
