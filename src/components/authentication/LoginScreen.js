import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';
import { auth } from '../../firebase';

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
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
      .then(() => props.history.push('/'))
      .catch((error) => {
        setError('Error signing in with password and email!');
        console.error('Error signing in with password and email', error);
      });
  };

  return (
    <div className="mt-8">
      <h1 className="text-3xl mb-2 text-center font-bold">Sign In</h1>
      <div className="border border-blue-400 mx-auto w-11/12 md:w-2/4 rounded py-8 px-4 md:px-8">
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
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
