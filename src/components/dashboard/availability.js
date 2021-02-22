import React, { useContext } from 'react';
import { Button, Form, TimePicker, Spin, Row, Col, Popover, Divider, Typography} from 'antd';
import { LoadingOutlined, InfoCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import { firestore } from '../../firebase';
import { UserContext } from '../../providers/UserProvider';
import sleep from '../../utils/timing';
import GoogleAuth from '../../utils/googleAuth';


const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
const {Title} = Typography;

const { RangePicker } = TimePicker;

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 12,
  },
};

const days = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export default function Availability() {
  const [availability, setAvailability] = React.useState(null);
  const [updating, setUpdating] = React.useState(false);
  const [authed, setAuthed] = React.useState(false);

  const { user } = useContext(UserContext);

  React.useEffect(() => {
    (async function () {
      const userDoc = await firestore.collection('users').doc(user.uid).get();
      if (userDoc.exists) {
        setAuthed(userDoc.data().authed);
      }
      else {
        setAuthed(false);
      }
    })();
  }, []);

  React.useEffect(() => {
    (async function () {
      const querySnapshot = await firestore
        .collection('users')
        .doc(user.uid)
        .collection('availability')
        .get();
      const av = [];
      querySnapshot.forEach((doc) => {
        const datkey = doc.id;
        av[datkey] = {
          start: moment(doc.data().start.seconds * 1000),
          end: moment(doc.data().end.seconds * 1000),
        };
      });
      setAvailability(av);
    })();
  }, []);

  async function onFinish() {
    setUpdating(true);
    await sleep(1000);
    Object.entries(days).forEach(([key, value]) => {
      if (value.range !== null) {
        firestore
          .collection('users')
          .doc(user.uid)
          .collection('availability')
          .doc(key)
          .set({ day: key, end: value.range[1]._d, start: value.range[0]._d })
          .then(setUpdating(false)).catch((error) => console.log(error));
      } else {
        firestore
          .collection('users')
          .doc(user.uid)
          .collection('availability')
          .doc(key)
          .delete()
          .then(setUpdating(false)).catch((error) => console.log(error));
      }
    });
  };

  if (!availability) {
    return <div></div>;
  }

  return (
    <div style={{ padding: 50, minHeight: 360 }}>
      <Row justify="right" style={{paddingBottom:20}}>
        <Title level={3}>Connect Google Calendar</Title> 
      </Row>
      <div style={{width:"50%"}}>
        <p style={{textAlign:"left"}}>When you connect your calendar it lets Unstuck create events, invite customers, and check your calendar for event conflicts.</p> 
      </div>
      {authed ?
        <Row align="top" justify="center"><CheckCircleOutlined style={{color:"green", fontSize:30, paddingRight:10}} /><Title level={4}>Calendar Connected</Title></Row>
        :
        <Row style={{justifyContent:"left"}} align="middle">
        <Col span={8} style={{textAlign:"right"}}>
          <p>Connect to Google Calendar{" "}
          <Popover content="Log in to Google so we can automatically create calendar events and check for conflicts.">
                <InfoCircleOutlined size="small" />
          </Popover>{" : "} </p>
        </Col>
        <Col style={{paddingLeft:10}}>
          <GoogleAuth />
        </Col>
      </Row>
    }

      <Divider/>
      <Row justify="right" style={{paddingBottom:20}}>
        <Title level={3}>Weekly Availability</Title> 
      </Row>
      <div style={{width:"50%"}}>
        <p style={{textAlign:"left"}}>{`This will be displayed on your profile page, and we will use this weekly availability to set timeslots for your services. You can change your weekly availability at any time.`}</p> 
      </div>
      <Form {...layout} name="nest-messages" onFinish={onFinish}>
        {days.map((day) => (
          <Form.Item key={day} label={day} style={{ marginBottom: 0 }}>
            <Row>
            <Form.Item
              name={[day, 'range']}
              style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
              initialValue={
                availability[day]
                  ? [availability[day]['start'], availability[day]['end']]
                  : null
              }
            >
              <RangePicker use12Hours format="h:mm a" minuteStep={15} />
            </Form.Item>
            </Row>
          </Form.Item>
        ))}
        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
          <Row>
          <Button type="primary" htmlType="submit" disabled={updating} style={{width:"calc(50% - 8px)"}}>
          {updating ? <Spin indicator={antIcon} style={{ paddingLeft: 10 }} /> : "Save"}
          </Button>
          </Row>
        </Form.Item>
      </Form>
    </div>
  );
}
