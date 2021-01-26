import React, { useContext } from 'react';
import { Button, Typography, Row, Col } from 'antd';
import {GoogleOutlined} from '@ant-design/icons';
import { auth, googleAuthProvider } from '../../firebase';
import { UserContext } from '../../providers/UserProvider';

const {Title} = Typography;


export default function SignIn(props) {
  const { user } = useContext(UserContext);


  async function googleSignUp() {
    try {
        await auth.signInWithPopup(googleAuthProvider);
        props.history.push('/dashboard');
    } catch(err) {
        console.log(err);

    }
}

  if(user!==null){
      return(
          <div>{`You're already signed in!`}</div>
      )
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 10px)' }}>
            <Row justify="center" style={{paddingTop:50}}>
                <Col span={12} style={{backgroundColor:"#f9f0ff", minHeight: 'calc(100vh - 10px)'}}>
                <Row justify="center">
        <Title level={2}>Sign in</Title>
      </Row>
                  <Row justify="center" style={{paddingTop:20, paddingBottom:20}}>
                        <Button size="large" type="secondary" style={{width:"50%"}} onClick={googleSignUp}>
                            <GoogleOutlined/> Sign in with Google
                        </Button>
                    </Row>
                </Col> 
            </Row>
    </div>
  );
}
