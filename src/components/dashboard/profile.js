import React, {useEffect} from 'react';
import { Form, Input, InputNumber, Button } from 'antd';
import { firestore } from "../../firebase"


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
    let [profileInfo, setProfileInfo] = React.useState(null);

    React.useEffect(() => {
        (async function () {
            firestore.collection("users").doc("lSkuPARE5Z9Eo5byvh3o").get().then(function(doc) {
                if (doc.exists) {
                    console.log("Document data:", doc.data());
                    setProfileInfo(doc.data());
                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                }
            }).catch(function(error) {
                console.log("Error getting document:", error);
            });
        })();
    }, []);

    const onFinish = (values) => {
        console.log("what");
        console.log(values);
        firestore.collection("users").doc("lSkuPARE5Z9Eo5byvh3o").set(values)
    };

    if(!profileInfo){
        return(<div>not loaded</div>)
    }

    return(
        <div style={{ padding: 24, minHeight: 360 }}>
            <Form {...layout} name="nest-messages" 
            initialValues={{
                name:profileInfo.name,
                email:profileInfo.email,
                headline:profileInfo.headline,
                description:profileInfo.description,
                website:profileInfo.website,
                tags: ""
                        }}
            onFinish={onFinish} validateMessages={validateMessages}>
                <Form.Item
                    name={'name'}
                    label="Name"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    name={'email'}
                    label="Email"
                    rules={[
                        {
                            type: 'email',
                        },
                    ]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item name={'headline'} label="Headline">
                    <Input.TextArea/>
                </Form.Item>
                <Form.Item name={'description'} label="Description">
                    <Input.TextArea/>
                </Form.Item>
                <Form.Item name={'website'} label="Website">
                    <Input />
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