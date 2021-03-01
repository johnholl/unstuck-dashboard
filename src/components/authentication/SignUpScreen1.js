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
            await firestore.collection("users").doc(result.user.uid).set({email: user.email, name: user.displayName}, {merge: true});
            props.history.push('/signup/2');
        } catch(err) {
            setError(err);
        }
    }

      if(user!==null){
          props.history.push('/dashboard/bookings');
      }

    return(
        <div>
            <Row justify="center">
                <Col span={12}>
                    <Row justify="center">
                    <Title level={3}>Get Started</Title>
                    </Row>
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