import React, {useEffect} from 'react';
import { Form, Input, InputNumber, Button } from 'antd';
import { firestore } from "../../firebase";
import {Redirect} from 'react-router-dom';

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



export default function EditService(props) {
    console.log(props);
    const onFinish = (values) => {
        console.log("what");
        console.log(values);
        firestore.collection("users").doc("lSkuPARE5Z9Eo5byvh3o").collection("services").doc(props.location.service.id).set(values).then(
            () => props.history.push("/dashboard/services")
        )
        
    };

    return(
        <div style={{ padding: 24, minHeight: 360, justifyContent:'center'}}>
            <Form {...layout} name="nest-messages" 
            onFinish={onFinish} validateMessages={validateMessages}
            initialValues={{
                name:props.location.service.name ? props.location.service.name : "",
                price:props.location.service.price ? props.location.service.price : "",
                duration:props.location.service.duration ? props.location.service.duration : "",
                description:props.location.service.description ? props.location.service.description : "",
                tags: props.location.service.tags ? props.location.service.tags : "",
                        }}>
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