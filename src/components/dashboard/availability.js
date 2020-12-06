import React, { useContext } from 'react';
import { Button, Form, TimePicker } from 'antd';
import moment from 'moment';
import { firestore } from '../../firebase';
import { UserContext } from '../../providers/UserProvider';

const { RangePicker } = TimePicker;

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
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
  const { user } = useContext(UserContext);
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

  const onFinish = (days) => {
    Object.entries(days).forEach(([key, value]) => {
      if (value.range !== null) {
        firestore
          .collection('users')
          .doc(user.uid)
          .collection('availability')
          .doc(key)
          .set({ day: key, end: value.range[1]._d, start: value.range[0]._d });
      } else {
        firestore
          .collection('users')
          .doc(user.uid)
          .collection('availability')
          .doc(key)
          .delete();
      }
    });
  };

  if (!availability) {
    return <div></div>;
  }

  return (
    <div style={{ padding: 24, minHeight: 360 }}>
      <Form {...layout} name="nest-messages" onFinish={onFinish}>
        {days.map((day) => (
          <Form.Item key={day} label={day} style={{ marginBottom: 0 }}>
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
          </Form.Item>
        ))}
        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
