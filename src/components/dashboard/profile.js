import React, { useContext } from 'react';
import { Form, Input, Button, Spin, Popover, Row, Col, Typography } from 'antd';
import { LoadingOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { firestore } from '../../firebase';
import { UserContext } from '../../providers/UserProvider';
import GoogleAuth from '../../utils/googleAuth';
import sleep from '../../utils/timing';


const {Paragraph} = Typography;

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const layout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 12,
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
  const [profileInfo, setProfileInfo] = React.useState(null);
  const [updating, setUpdating] = React.useState(false);
  const [buttonText, setButtonText] = React.useState("book an appointment");
  const { user } = useContext(UserContext);
  React.useEffect(() => {
    (async function () {
      const doc = await firestore.collection('users').doc(user.uid).get();
      if (doc.exists) {
        console.log('Document data:', doc.data());
        setProfileInfo(doc.data());
      } else {
        console.log('No such document!');
        setProfileInfo({
          name: '',
          email: '',
          headline: '',
          description: '',
          website: '',
          videolink: '',
        });
      }
    })();
  }, []);

    async function onFinish(values) {
        setUpdating(true);
        await sleep(1000);
        firestore.collection("users").doc(user.uid).set(values, {merge: true}).then(setUpdating(false)).catch((error) => console.log(error));
    };
  if (!profileInfo) {
    return <div></div>
  }

  return (
    <div style={{ padding: 24, minHeight: 360 }}>
      <Form
        {...layout}
        name="nest-messages"
        initialValues={{
          name: profileInfo.name,
          email: profileInfo.email,
          headline: profileInfo.headline,
          description: profileInfo.description,
          website: profileInfo.website,
          videolink: profileInfo.videolink,
        }}
        onFinish={onFinish}
        validateMessages={validateMessages}
      >
        <Form.Item
          name={'name'}
          label="Name"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
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
          <Input />
        </Form.Item>
        <Form.Item
          name={'headline'}
          label={
            <div>
              Headline{' '}
              <Popover content="This will be displayed at the top of your profile page">
                <InfoCircleOutlined size="small" />
              </Popover>
            </div>
          }
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          name={'description'}
          label={
            <div>
              Description{' '}
              <Popover content="Give some more information about yourself, experience, and services">
                <InfoCircleOutlined size="small" />
              </Popover>
            </div>
          }
        >
          <Input.TextArea rows={6} />
        </Form.Item>
        <Form.Item name={'website'} label="Website">
          <Input />
        </Form.Item>
        <Form.Item
          name={'videolink'}
          label={
            <div>
              Youtube video{' '}
              <Popover content="Upload a youtube video introducing yourself, put the link here, and we'll embed it in your profile page">
                <InfoCircleOutlined size="small" />
              </Popover>
            </div>
          }
        >
          <Input />
        </Form.Item>
        <Form.Item wrapperCol={{}}>
          <Button type="primary" htmlType="submit" disabled={updating}>
          {updating ? <Spin indicator={antIcon} style={{ paddingLeft: 10 }} /> : "Save"}
          </Button>
        </Form.Item>
      </Form>
      <Row style={{alignItems:"center", justifyContent:"left", textAlign:"right"}}>
        <Col span={6} style={{textAlign:"right"}}>
          <p>Connect to Google Calendar{" "}
          <Popover content="In order for Unstuck to automatically create calendar events you'll need to authenticate through Google.">
                <InfoCircleOutlined size="small" />
          </Popover>{" :"} </p>
        </Col>
        <Col>
          <GoogleAuth />
        </Col>
      </Row>
      <Row style={{alignItems:"center"}}>
        <Col span={12}>
          <Row style={{alignItems:"center", justifyContent:"left", textAlign:"right"}}>
            <Col span={12}>
          <p>Set button text:{" "}</p>
          </Col>
          <Col span={10}>
          <Input defaultValue={buttonText} onChange={(val)=>{console.log(val);setButtonText(val.target.value)}}/>
          </Col>
          </Row>
        </Col>
        <Col span={12}>
          <Paragraph>
            <pre>
              {`<p><a target="_top" style=" background-color: #722ed1; color: white; height: 40px; text-transform: uppercase; font-family: 'Square Market', 'helvetica neue', helvetica, arial, sans-serif; letter-spacing: 1px; line-height: 38px; padding: 0 28px; border-radius: 3px; font-weight: 500; font-size: 14px; cursor: pointer; display: inline-block; " href="https://unstuck.booking.johnholler.com/serviceSelect/${user.uid}" rel="nofollow noopener noreferrer">${buttonText}</a></p>`}
            </pre>
          </Paragraph>
          <p>
            <a target="_top" style={{backgroundColor: "#722ed1", color: "white", height: "40px", textTransform: "uppercase", fontFamily: "Square Market, helvetica neue, helvetica, arial, sans-serif", letterSpacing: '1px', lineHeight: "38px", padding: "3px", borderRadius: "3px", fontWeight: "500", fontSize: "14px", cursor: "pointer", display: "inline-block"}} href={"https://unstuck.booking.johnholler.com/serviceSelect/"+user.uid} rel="nofollow noopener noreferrer">{buttonText}</a>
          </p>
        </Col>
      </Row>



    </div>
  );
}
