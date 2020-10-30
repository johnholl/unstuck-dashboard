import React from 'react';
import { Form, Input, InputNumber, Button } from 'antd';

const layout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16,
    },
};

const validateMessages = {
    required: '${label} is required!',
    types: {
        email: '${label} is not valid email!',
        number: '${label} is not a valid number!',
    },
    number: {
        range: '${label} must be between ${min} and ${max}',
    },
};

export default function Profile() {

    const onFinish = (values) => {
        console.log(values);
    };

    return(
        <div style={{ padding: 24, minHeight: 360 }}>
            <Form {...layout} name="nest-messages" onFinish={onFinish} validateMessages={validateMessages}>
                <Form.Item
                    name={['user', 'name']}
                    label="Name"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name={['user', 'email']}
                    label="Email"
                    rules={[
                        {
                            type: 'email',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item name={['user', 'header']} label="Headline">
                    <Input.TextArea />
                </Form.Item>
                <Form.Item name={['user', 'description']} label="Description">
                    <Input.TextArea />
                </Form.Item>
                <Form.Item name={['user', 'website']} label="Website">
                    <Input />
                </Form.Item>
                <Form.Item name={['user', 'tags']} label="Tags">
                    <Input />
                </Form.Item>
                <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}