import React, {useEffect, useContext} from 'react';
import { Form, Input, InputNumber, Button, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { firestore } from "../../firebase"
import {UserContext} from "../../providers/UserProvider";
import GoogleAuth from "../../utils/googleAuth"
import sleep from "../../utils/timing"

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

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
    let [updating, setUpdating] = React.useState(false);
    const user = useContext(UserContext);
    React.useEffect(() => {
        (async function () {
            firestore.collection("users").doc(user.uid).get().then(function(doc) {
                if (doc.exists) {
                    console.log("Document data:", doc.data());
                    setProfileInfo(doc.data());
                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                    setProfileInfo({name:"", email:"", headline:"", description:"", website:"", tags:""})
                }
            }).catch(function(error) {
                console.log("Error getting document:", error);
            });
        })();
    }, []);

    async function onFinish(values) {
        setUpdating(true);
        await sleep(1000);
        firestore.collection("users").doc(user.uid).set(values).then(setUpdating(false)).catch((error) => console.log(error));
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
                    <Button type="primary" htmlType="submit" disabled={updating}>
                        Save
                    </Button>
                    {updating && <Spin indicator={antIcon} style={{paddingLeft:10}} />}
                </Form.Item>
                <GoogleAuth/>
            </Form>
        </div>
    )
}