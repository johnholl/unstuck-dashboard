import React, {useEffect} from 'react';
import { Form, Input, InputNumber, Button } from 'antd';
import { firestore } from "../../firebase"

const layout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 8,
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



export default function CreateService() {

    let [serviceInfo, setServiceInfo] = React.useState(null);

    const onFinish = (values) => {
        console.log("what");
        console.log(values);
        firestore.collection("users").doc("lSkuPARE5Z9Eo5byvh3o").collection("services").add(values)
    };

    return(
        <div style={{ padding: 24, minHeight: 360, justifyContent:'center'}}>
            <Form {...layout} name="nest-messages" 
            onFinish={onFinish} validateMessages={validateMessages}>
                <Form.Item
                    name={'name'}
                    label="Name of Service"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    name={'price'}
                    label="Price"
                    rules={[
                        {
                            required: true
                        },
                    ]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    name={'duration'}
                    label="Duration"
                    rules={[
                        {
                            required: true
                        },
                    ]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item name={'description'} label="Description">
                    <Input.TextArea/>
                </Form.Item>
                <Form.Item name={'tags'} label="Tags">
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