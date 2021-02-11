import React, { useContext, useState } from 'react';
import { Button, Typography, Row, Col } from 'antd';
import {GoogleOutlined} from '@ant-design/icons';
import { UserContext } from '../../providers/UserProvider';
import { auth, googleAuthProvider, firestore} from '../../firebase';

// const layout = {
//     labelCol: {
//       span: 0,
//     },
//     wrapperCol: {
//       span: 24,
//     },
//   };

  const { Title } = Typography;
  
export default function SignUpScreen1(props) {
    const [, setError] = useState(null);
    const { user } = useContext(UserContext);

    async function googleSignUp() {
        try {
            const result = await auth.signInWithPopup(googleAuthProvider);
            const user = result.user;
            console.log("RESULT");
            console.log(result);
            await firestore.collection("users").doc(result.user.uid).set({email: user.email, name: user.displayName}, {merge: true});
            props.history.push('/signup/2');
        } catch(err) {
            setError(err);
        }
    }

      if(user!==null){
          props.history.push('/signup/2');
      }

    return(
        <div>
            <Row justify="center">
                <Col span={8}>
                    <Row justify="center">
                    <Title level={3}>Get Started</Title>
                    </Row>
                    {/* <Form {...layout} onFinish={onFinish} size="large">
                    <Form.Item
                        name={'name'}
                        rules={[
                            {
                            required: true,
                            message: "Please enter your name"
                            },
                        ]}
                        >
                        <Input placeholder={"Your name"}/>
                        </Form.Item>
                        <Form.Item
                        name={'userEmail'}
                        rules={[
                            {
                            required: true,
                            message: "Please input a valid email address"
                            },
                        ]}
                        >
                        <Input placeholder={"email@example.com"}/>
                        </Form.Item>
                        <Form.Item
                        name={'userPassword'}
                        rules={[
                            {
                            required: true,
                            message: "Please input a valid password"
                            },
                        ]}
                        >
                        <Input.Password placeholder={"password"} />
                        </Form.Item>
                        <Form.Item
                        name={'confirmPassword'}
                        dependencies={['userPassword']}
                        hasFeedback
                        rules={[
                            {
                              required: true,
                              message: 'Please confirm your password!',
                            },
                            ({ getFieldValue }) => ({
                              validator(rule, value) {
                                if (!value || getFieldValue('userPassword') === value) {
                                  return Promise.resolve();
                                }
                                return Promise.reject('Passwords do not match');
                              },
                            }),
                          ]}
                        >
                        <Input.Password placeholder={"confirm password"} />
                        </Form.Item>
                        <Row justify="center">
                        <Form.Item>
                        <Button type="primary" htmlType="submit">
                            sign up and get started
                        </Button>
                        </Form.Item>
                        </Row>
                    </Form> */}
                    <Row justify="center" style={{paddingTop:20, paddingBottom:20}}>
                        <Button size="large" type="secondary" style={{width:"50%"}} onClick={googleSignUp}>
                            <GoogleOutlined/> Sign up with Google
                        </Button>
                    </Row>
                    <Row justify="center">
                        <Col span={12}>
                        By continuing, you’re agreeing to our Customer Terms of Service, Privacy Policy, and Cookie Policy.
                        </Col>
                    </Row>
                    {/* <Row justify="center" style={{padding:20}}>
                        <Button type="secondary" style={{width:"50%"}}>
                            Sign up with Facebook
                        </Button>
                    </Row>
                    <Row justify="center" style={{padding:20}}>
                        <Button type="secondary" style={{width:"50%"}}>
                            Sign up with Apple
                        </Button>
                    </Row> */}
                </Col>
            </Row>
      </div>
    )


}