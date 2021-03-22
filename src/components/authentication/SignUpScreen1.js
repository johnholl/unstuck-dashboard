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
            await firestore.collection("users").doc(result.user.uid).set({email: user.email, name: user.displayName, publicprofile: true}, {merge: true});
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
                        <Button size="large" type="secondary" onClick={googleSignUp}>
                            <GoogleOutlined/> Sign up with Google
                        </Button>
                    </Row>
                    <Row justify="center">
                        By continuing, you’re agreeing to our <a href="https://beunstuck.me/privacy-policy-2/">Customer Terms of Service</a>
                         &nbsp; and
                         <a href="https://beunstuck.me/%E2%80%8Dterms-of-use/">Privacy Policy</a>.
                    </Row>
                </Col>
            </Row>
      </div>
    )


}