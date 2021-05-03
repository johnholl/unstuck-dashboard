import React, { useContext } from 'react';
import { Input, Row, Col, Typography, Divider} from 'antd';
import { UserContext } from '../../providers/UserProvider';
import {bookingUrl} from '../../constants';


const {Paragraph, Title, Text} = Typography;

export default function Share() {
  const [buttonText, setButtonText] = React.useState("book an appointment");
  const { user } = useContext(UserContext);

  return (
    <div style={{ padding: 50, minHeight: 360 }}>
      <Row justify="right" style={{paddingBottom:20}}>
        <Title level={3}>Share your services</Title> 
      </Row>
      <Row justify="left">
        <Col span={12} style={{textAlign:"left"}}>
        <Text style={{fontSize:16, color:"gray"}}>Share your expertise with customers by embedding your booking button on social media or including your profile page link on your YT videos.</Text>
        </Col>
      </Row>
      <Divider/>
      <Row justify="right" style={{paddingBottom:20}}>
      <Title level={3}>Embeddable button</Title> 
      </Row>
      <Row justify="center" align="top">
        <Col xl={12} sm={24}>
        <Row justify="center">
            <Col span={24}>
              <Title level={4}>Set button text{" "}</Title>
            </Col>
          </Row>
          <Row justify="center">
            <Col span={20}>
              <Input defaultValue={buttonText} onChange={(val)=>{setButtonText(val.target.value)}}/>
            </Col>
          </Row>
          <Row justify="center">
            <Col span={24} style={{paddingTop:50}}>
              <span target="_top" style={{backgroundColor: "#722ed1", color: "white", height: "45px", textTransform: "uppercase", fontFamily: " helvetica neue, helvetica, arial, sans-serif", letterSpacing: '1px', lineHeight: "38px", padding: "3px", borderRadius: "3px", fontWeight: "500", fontSize: "14px", cursor: "pointer", display: "inline-block"}} rel="nofollow noopener noreferrer">{buttonText}</span>
            </Col>
          </Row>
        </Col>
        <Col xl={12} sm={24}>
          <Row justify="center">
            <Col span={24}>
              <Title level={4}>Copy HTML{" "}</Title>
            </Col>
          </Row>
          <Paragraph>
            <pre>
              {`<p><a target="_top" style=" background-color: #722ed1; color: white; height: 40px; text-transform: uppercase; font-family: 'helvetica neue', helvetica, arial, sans-serif; letter-spacing: 1px; line-height: 38px; padding: 0 28px; border-radius: 3px; font-weight: 500; font-size: 14px; cursor: pointer; display: inline-block; " href="https://booking.beunstuck.me/booking/${user.uid}/serviceSelect/" rel="nofollow noopener noreferrer">${buttonText}</a></p>`}
            </pre>
          </Paragraph>
        </Col>
      </Row>
      <Divider/>
      <Row justify="right" style={{paddingBottom:20}}>
        <Title level={3}>Useful Links</Title> 
      </Row>
        <Row gutter={[16]} justify="start">
                <p style={{textAlign:"right", fontWeight:'700'}}>profile page: </p>
                <div style={{paddingLeft:10}}><a href={`${bookingUrl}/booking/${user.uid}/serviceSelect/`}>{`https://booking.beunstuck.me/profile/${user.uid}/`}</a></div>
        </Row>
        <Row gutter={[16]} justify="start">
            <p style={{fontWeight:'700'}}>service page: </p>
            <div style={{paddingLeft:10}}><a href={`${bookingUrl}/booking/${user.uid}/serviceSelect/`}>{`${bookingUrl}/booking/${user.uid}/serviceSelect/`}</a></div>
        </Row>
    </div>
  );
}
