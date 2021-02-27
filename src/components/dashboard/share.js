import React, { useContext } from 'react';
import { Input, Row, Col, Typography, Divider} from 'antd';
import { UserContext } from '../../providers/UserProvider';
import {bookingUrl} from '../../constants';


const {Paragraph, Title} = Typography;

export default function Share() {
  const [buttonText, setButtonText] = React.useState("book an appointment");
  const { user } = useContext(UserContext);

  return (
    <div style={{ padding: 50, minHeight: 360 }}>
      <Row justify="right" style={{paddingBottom:20}}>
      <Title level={3}>Embeddable button</Title> 
      </Row>
      <Row justify="center" align="top">
        <Col xl={12} sm={24}>
        <Row justify="center">
            <Col span={20}>
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
        <Row gutter={[16]}>
            <Col span={8}>
                <p style={{textAlign:"right", fontWeight:'700'}}>Link to your profile page: </p>
            </Col>
            <Col span={8}>
                <a href={`${bookingUrl}/booking/${user.uid}/serviceSelect/`}>{`https://booking.beunstuck.me/profile/${user.uid}/`}</a>
            </Col>
        </Row>
        <Row gutter={[16]}>
            <Col span={8}>
            <p style={{textAlign:"right", fontWeight:'700'}}>Link to your service page: </p>
            </Col>
            <Col span={8}>
                <a href={`${bookingUrl}/booking/${user.uid}/serviceSelect/`}>{`${bookingUrl}/booking/${user.uid}/serviceSelect/`}</a>
            </Col>
        </Row>
    </div>
  );
}
