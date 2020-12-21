import React, { useState } from 'react';
import { Form, Input, Button, Typography, Row } from 'antd';
import { auth } from '../../firebase';

const {Title} = Typography;

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 8,
  },
};

export default function SignIn(props) {
  const [, setEmail] = useState('');
  const [, setPassword] = useState('');
  const [error, setError] = useState(null);

  const onChangeHandler = (event) => {
    const { name, value } = event.currentTarget;

    if (name === 'userEmail') {
      setEmail(value);
    } else if (name === 'userPassword') {
      setPassword(value);
    }
  };

  const onFinish = (values) => {
    console.log('we signing in right here');
    auth
      .signInWithEmailAndPassword(values.userEmail, values.userPassword)
      .then(() => props.history.push('/dashboard'))
      .catch((error) => {
        setError('Error signing in with password and email!');
        console.error('Error signing in with password and email', error);
      });
  };

  return (
    <div style={{backgroundColor:"#f9f0ff", minHeight: 'calc(100vh - 10px)' }}>
      <Row justify="center" style={{paddingTop:50}}>
        <Title level={2}>Sign in</Title>
      </Row>
        {error !== null && (
          <div className="py-4 bg-red-600 w-full text-white text-center mb-3">
            {error}
          </div>
        )}
        <Form {...layout} onFinish={onFinish}>
          <Form.Item
            name={'userEmail'}
            label="Email"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input onChange={(event) => onChangeHandler(event)} />
          </Form.Item>
          <Form.Item
            name={'userPassword'}
            label="Password"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input.Password onChange={(event) => onChangeHandler(event)} />
          </Form.Item>

          <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
            <Button type="primary" htmlType="submit">
              Sign in
            </Button>
          </Form.Item>
        </Form>
    </div>
  );
}
