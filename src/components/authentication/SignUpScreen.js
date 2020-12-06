import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Form, Input, InputNumber, Button } from 'antd';
import {auth} from "../../firebase";


const layout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16,
    },
};

export default function SignUp(props) {
  const [error, setError] = useState(null);

  const onFinish = (values) => {
    auth.createUserWithEmailAndPassword(values.userEmail, values.userPassword).then(
      () => props.history.push("/")
    ).catch(error => {
        setError("Error signing up with password and email!");
        console.error("Error signing in with password and email", error);
      });
};

  return (
    <div>
      <h1>Sign Up</h1>
      <div className="border border-blue-400 mx-auto w-11/12 md:w-2/4 rounded py-8 px-4 md:px-8">
        {error !== null && (
          <div>
            {error}
          </div>
        )}
        <Form {...layout}
        onFinish={onFinish}>
            <Form.Item
                name={'displayName'}
                label="Name"
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Input onChange={event => onChangeHandler(event)}/>
            </Form.Item>
            <Form.Item
                name={'userEmail'}
                label="Email"
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Input onChange={event => onChangeHandler(event)}/>
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
                <Input onChange={event => onChangeHandler(event)}/>
            </Form.Item>
          
            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
        <p>or</p>
        <Button>
          Sign In with Google
        </Button>
        <p>
          Already have an account?{" "}
          <Link to="/" className="text-blue-500 hover:text-blue-600">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
};
