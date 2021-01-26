import React, {useContext} from 'react';
import { Typography, Row, Col, Button } from 'antd';
import { UserContext } from '../../providers/UserProvider';
import GoogleAuth from '../../utils/googleAuth';

const {Title} = Typography;

  
export default function SignUpScreen2(props) {
  const { user } = useContext(UserContext);
  console.log(user);

  const next = () =>{
    props.history.push('/signup/3');
  }

  if(user===null){
    return(<div>
      you need to be signed in to access this resource
    </div>)
  }


    return(
      <div>
        <Row justify="center">
          <Col span={8}>
            <Row justify="center">
            <Title level={3}>Connect your Google Calendar</Title>
            <Title level={5}>This will let us create events on your behalf, invite customers, and automatically remove
            appointment times that conflict with your calendar events.</Title>
            </Row>
            <Row justify="center">
              <GoogleAuth />
            </Row>
            </Col>
            </Row>
            <Row justify="center">
              <Col span={12}>
            <Row justify="center" style={{paddingTop:20}}>
                <Button type="primary" style={{width:"50%"}} onClick={next}>Next</Button>
            </Row>
            <Row justify="center" style={{paddingTop:20}}>
                <Button type="secondary" style={{width:"50%"}} onClick={next}>Skip</Button>
            </Row>
            </Col>
            </Row>
      </div>
    )
}