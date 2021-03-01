import React, { useContext } from 'react';
import { Button, Typography, Row, Col } from 'antd';
import {GoogleOutlined} from '@ant-design/icons';
import { auth, googleAuthProvider } from '../../firebase';
import { UserContext } from '../../providers/UserProvider';
import logo from '../../unstuck.png';

const {Title} = Typography;


export default function LoginScreen(props) {
  const { user } = useContext(UserContext);
  console.log("YAYAYAYA");


  async function googleSignUp() {
    try {
        await auth.signInWithPopup(googleAuthProvider);
        props.history.push('/dashboard/bookings');
    } catch(err) {
        console.log(err);

    }
}

    if(user!==null){
        props.history.push('/dashboard/bookings');
    }


  return (
    <div style={{ minHeight: 'calc(100vh - 10px)' }}>
            <Row justify="center" align="middle" style={{paddingTop:50}}>
            <img src={logo} width={300} />
            </Row>
            <Row justify="center" style={{paddingTop:50}}>
                <Col span={12} style={{backgroundColor:"white", minHeight: 'calc(100vh - 10px)'}}>
                <Row justify="center">
        <Title level={2}>Sign in</Title>
        </Row>
                  <Row justify="center" style={{paddingTop:20, paddingBottom:20}}>
                        <Button size="large" type="secondary" style={{width:"50%"}} onClick={googleSignUp}>
                            <GoogleOutlined/> Sign in with Google
                        </Button>
                    </Row>
                    <Row justify="center">
                        <font>{"Don't have an account? Sign up "}<a href="https://dashboard.beunstuck.me/signup/1"><u>{"here"}</u></a></font>
                    </Row>
                </Col> 
        </Row>
    </div>
  );
}
