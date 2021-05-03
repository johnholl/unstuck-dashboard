import React, { useContext } from 'react';
import { Button, Form, TimePicker, Spin, Row, Col, Popover, Divider, Typography, Select} from 'antd';
import { LoadingOutlined, InfoCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import moment from 'moment-timezone';
import { firestore } from '../../firebase';
import { UserContext } from '../../providers/UserProvider';
import sleep from '../../utils/timing';
import GoogleAuth from '../../utils/googleAuth';


const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
const {Title, Text} = Typography;
const { Option } = Select;

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
  const [timezones, setTimezones] = React.useState(false);
  const [timezone, setTimezone] = React.useState(null);
  const [initialTz, setInitialTz] = React.useState(null);


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
    const tzs = moment.tz.names();
    setTimezones(tzs);
  }, []);

  React.useEffect(() => {
    (async function () {
      const querySnapshot = await firestore
        .collection('users')
        .doc(user.uid)
        .collection('availability')
        .get();
      const av = [];
      const userdoc = (await firestore.collection('users').doc(user.uid).get()).data();
      const tz = userdoc.tz ? userdoc.tz : moment.tz.guess();
      querySnapshot.forEach((doc) => {
        const datkey = doc.id;
        av[datkey] = {
          start: moment.tz(doc.data().start, tz),
          end: moment.tz(doc.data().end, tz),
        };
      });
      setAvailability(av);

      setTimezone(tz);
      setInitialTz(tz);
    })();
  }, []);

  async function onFinish(values) {
    setUpdating(true);
    await sleep(1000);
    Object.entries(values).forEach(([key, value]) => {
      if (value.range !== null) {
        console.log("VALUE", value);
        console.log("ORIGINAL MOMENT", value.range[1].format())
        console.log("CONVERTED MOMENT", value.range[1].tz(timezone, true).format());
        firestore
          .collection('users')
          .doc(user.uid)
          .collection('availability')
          .doc(key)
          .set({ day: key, end: value.range[1].tz(timezone, true).format('YYYY-MM-DDTHH:mm:00'), start: value.range[0].tz(timezone, true).format('YYYY-MM-DDTHH:mm:00') })
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
      firestore.collection('users').doc(user.uid).set({tz: timezone}, {merge: true}).then(()=>{});
    });
  };

  if (!availability || initialTz===null || timezone===null) {
    return <div></div>;
  }

  return (
    <div style={{ padding: 50, minHeight: 360 }}>
      <Row justify="right" style={{paddingBottom:20}}>
        <Title level={3}>Connect Google Calendar</Title> 
      </Row>
      <Row justify="left">
        <Col span={12} style={{textAlign:"left", paddingBottom:30}}>
        <Text style={{fontSize:16, color:"gray", textAlign:"left"}}>When you connect your calendar it lets Unstuck create events, invite customers, and check your calendar for event conflicts.</Text> 
        </Col>
      </Row>
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
      <Row justify="right" style={{paddingBottom:20}} align="middle">
        <Title level={3}>Timezone</Title> 
        </Row>
        <Row justify="left">
        <Col span={12} style={{textAlign:"left", paddingBottom:30}}>
        <Text style={{fontSize:16, color:"gray", textAlign:"left"}}>{`Set your timezone so that there's no ambiguity when your customers book.`}</Text> 
        </Col>
      </Row>
      <Row justify="center">
      <Col span={12}>
      <Select defaultValue={initialTz} onChange={(val)=>
        {setTimezone(val);
        firestore.collection('users').doc(user.uid).set({tz: val}, {merge: true}).then(()=>{});
        }} style={{width:240}}>
        {timezones.map(tz =>
          <Option value={tz} key={tz}>{tz}</Option>
        )}
      </Select>
      </Col>
      </Row>
      <Divider/>
      <Row justify="right" style={{paddingBottom:20}}>
        <Title level={3}>Weekly Availability</Title> 
      </Row>
      <Row justify="left">
        <Col span={12} style={{textAlign:"left", paddingBottom:30}}>
        <Text style={{fontSize:16, color:"gray", textAlign:"left"}}>{`These times will be displayed on your profile page. You can change your weekly availability at any time.`}</Text> 
        </Col>
      </Row>
      <Form {...layout} name="nest-messages" onFinish={onFinish}>
        {days.map((day) => 
          <Form.Item key={day} label={day} style={{ marginBottom: 0 }}>
            <Row>
            <Form.Item
              name={[day, 'range']}
              style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
              initialValue={
                availability[day]
                  ? [moment.tz(availability[day]['start'], timezone), moment.tz(availability[day]['end'], timezone)]
                  : null
              }
            >
              <RangePicker use12Hours format="h:mm a" minuteStep={15}/>
            </Form.Item>
            </Row>
          </Form.Item>)
        }
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
