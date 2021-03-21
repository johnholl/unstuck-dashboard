import React, {useContext} from 'react';
import { Typography, Row, Col, Button, TimePicker, Form, Select, Divider } from 'antd';
import moment from 'moment-timezone';
import { firestore } from '../../firebase';
import { UserContext } from '../../providers/UserProvider';

const {Title} = Typography;
const { Option } = Select;


const { RangePicker } = TimePicker;

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 24,
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

  
export default function SignUpScreen3(props) {
  const { user } = useContext(UserContext);


  const next = () =>{
    props.history.push('/signup/4');
  }

  async function onFinish(days) {
    await Promise.all(Object.entries(days).map(async ([key, value]) => {
      if (value.range) {
        await firestore
          .collection('users')
          .doc(user.uid)
          .collection('availability')
          .doc(key)
          .set({ day: key, end: value.range[1].format('YYYY-MM-DDTHH:mm:00'), start: value.range[0].format('YYYY-MM-DDTHH:mm:00') })
      }
    }));
    props.history.push('/signup/4')

  };

  if(user===null){
    return(<div>
      you need to be signed in to access this resource
    </div>)
  }


    return(
      <div>
        <Row justify="center">
          <Col span={12}>
            <Row justify="center">
              <Title level={3}>Set Your Availability</Title>
              <Title level={5}>{`We'll use these times to create your appointment slots. You can make changes later.`}</Title>
            </Row>
          </Col>
        </Row>
        <Row justify="center">
          <Col span={12}>
            <Row align="middle" style={{padding:40}}>
              <Col span={8}>
                <font style={{align:"right"}}>Timezone</font> 
              </Col>
              <Col span={16}>
                <Select defaultValue={moment.tz.guess()} onChange={(val)=>
                  {
                  firestore.collection('users').doc(user.uid).set({tz: val}, {merge: true}).then(()=>{});
                  }} style={{width:240}}>
                  {moment.tz.names().map(tz =>
                    <Option value={tz} key={tz}>{tz}</Option>
                  )}
                </Select>
              </Col>
            </Row>
            <Divider/>
          <Form {...layout} name="nest-messages" onFinish={onFinish}>
            {days.map((day) => (
          <Form.Item key={day} label={day} style={{ marginBottom: 0 }} colon={false}>
            <Row>
            <Form.Item
              name={[day, 'range']}
              style={{ display: 'inline-block', width: 'calc(100% - 8px)' }}
            >
              <RangePicker use12Hours format="h:mm a" minuteStep={15} />
            </Form.Item>
            </Row>
          </Form.Item>
        ))}
        <Form.Item wrapperCol={{ ...layout.wrapperCol}}>
          <Row justify="center">
          <Button type="primary" htmlType="submit" style={{width:"50%"}}>
            Next
          </Button>
          </Row>
        </Form.Item>
      </Form>
      <Row justify="center" style={{paddingBottom:50}}>
          <Button type="secondary" style={{width:'50%'}} onClick={next}>
            Skip
          </Button>
          </Row>
                </Col>
            </Row>

      </div>
    )
}