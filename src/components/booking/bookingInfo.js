import React, { useContext } from 'react';
import {Link} from 'react-router-dom'
import { Button, Space, Row, Col, Typography, Divider, Modal, Input, Form, InputNumber, Popover } from 'antd';
import { InfoCircleOutlined} from '@ant-design/icons';
import moment from 'moment';
import { firestore, functions } from '../../firebase';
import { UserContext } from '../../providers/UserProvider';
import logo from '../../basicLogo.png';

const acceptBooking = functions.httpsCallable('acceptBooking');

export default function BookingInfo(props) {
  const { user } = useContext(UserContext);
  const bookingId = props.location.state.bookingNumber;
  const [booking, setBooking] = React.useState(null);
  const [custName, setCustName] = React.useState("");
  const [service, setService] = React.useState(null);
  const [declineVisible, setDeclineVisible] = React.useState(false);
  const [acceptVisible, setAcceptVisible] = React.useState(false);
  const [declineMessage, setDeclineMessage] = React.useState("");
  const [invoiceDisabled, setInvoiceDisabled] = React.useState(null);

  const [err, setErr] = React.useState(null);

const {Title, Paragraph, Text} = Typography;
const layout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 16,
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

  React.useEffect(() => {
    (async function () {
      try {
        const bk = await firestore.collection('users').doc(user.uid).collection('bookings').doc(bookingId).get();
        setBooking(bk.data());
        setCustName(bk.data().customerName ? bk.data().customerName : bk.data().customer);
        const sv = await firestore.collection('users').doc(user.uid).collection('services').doc(bk.data().serviceid).get();
        setService(sv.data());
        const tempiv = await firestore.collection('tempinvoices').doc(bookingId).get();
        setInvoiceDisabled(bk.data().status==="declined" || tempiv.exists || bk.data().status==="requested" || sv.data().price===0);

      } 
      catch(error) {
        console.log(error);
        setErr(err);
      }
    })();
  }, []);

  async function onAccept(values) {
    try {
    // await firestore.collection('users').doc(user.uid).collection('bookings').doc(bookingId).update({ status: 'accepted', price:values.price })
    setBooking({ ...booking, status: 'accepted', price:values.price});
    await acceptBooking({bid: bookingId, uid: user.uid})
    }
    catch(error) {
        console.log('Unable to update status: ', error);
      };
  };

  const onDecline = () => {
    firestore
      .collection('users')
      .doc(user.uid)
      .collection('bookings')
      .doc(bookingId)
      .update({ status: 'declined' })
      .then(() => {setBooking({ ...booking, status: 'declined', declineMessage });
            setDeclineVisible(false);}
      )
      .catch((error) => {
        console.log('Unable to update status: ', error);
      });
  };

  if (!booking || !service || invoiceDisabled===null) {
    return(<div></div>)
  }

  return (
    <div style={{ padding: 50 }}>
        <Modal visible={acceptVisible} title="Accept Booking" onCancel={()=>setAcceptVisible(false)} footer={[]}>
        <Form
        {...layout}
        name="nest-messages"
        onFinish={onAccept}
        size={"large"}
        validateMessages={validateMessages}
        initialValues={{
          price: service.price,
          note: ""
        }}>
            <Form.Item
            name={'price'}
            label={<div>Price <Popover content="Adjust the price if necessary, applying any discounts">
            <InfoCircleOutlined size="small" />
          </Popover></div>}
            rules={[
              {
                required: true,
              },
            ]}>
              <InputNumber
                min={0}
                step={5}
                formatter={(value) =>
                  `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>
            <Form.Item labelCol={{}} wrapperCol={{ ...layout.wrapperCol, offset: 4 }}>
              <Row>
                <Button type="primary" htmlType="submit" style={{width:'80%'}}>
                  Send
                </Button>
              </Row>
            </Form.Item>
          </Form>
        </Modal>
        <Modal visible={declineVisible} title="Decline Booking" onCancel={()=>setDeclineVisible(false)}
                footer={[
                  <Button type="primary" key="decline" onClick={onDecline}>
                    Send
                  </Button>,
                  <Button key="cancel" onClick={() => {setDeclineVisible(false)}}>
                  Cancel
                </Button>
                ]}>
                  <Text>Send a message to the customer explaining why you need to decline</Text>
                  <Input.TextArea rows={6} onChange={(val) =>{setDeclineMessage(val.target.value)}}/>
        </Modal>
      <Row>
        <Col>
          <Link to="/dashboard/bookings">
            <img src={logo} width={50} />
          </Link>
        </Col>
      </Row>
      <Row justify="center">
        <Col span={12}>
          <Row>
            <Title>Your booking with {custName}</Title>
          </Row>
        </Col>
      </Row>
      <Row justify="center">
        <Col span={12}>
          <Row>
          <Title level={4}>{service.name + " on " + moment.unix(booking.appointment).format('M/D/YYYY') +
          " priced at $" + service.price + ".00"}</Title>
          </Row>
        </Col>
      </Row>
      <Row justify="center">
        <Col span={12}>
          <Row>
            <Title level={4}>{moment.unix(booking.appointment).format('h:mma') + " - " + moment.unix(booking.appointment + 60*booking.duration).format('h:mma')}</Title>
          </Row>
        </Col>
      </Row>
      <Row justify="center">
        <Col span={12}>
        <Row>
          {booking.status === 'requested' ? (
          <div>
            <Space size="large">
              <Button type="primary" onClick={setAcceptVisible}>
                Accept
              </Button>
              <Button type="danger" onClick={() => setDeclineVisible(true)}>
                Decline
              </Button>
            </Space>
          </div>
        ) : <Title level={4}>status: <Text style={{color:(booking.status==='accepted' ? 'green' : 'red')}}>{booking.status}</Text></Title>
          }
          </Row>
        </Col>
      </Row>
      <Row justify="center">
        <Col span={12}>
          <Divider/>
        </Col>
      </Row>
      <Row justify="center">
          <Col span={12}>
            <Row>
            <Title level={4}>{custName + " wrote: "}</Title>
            </Row>
            <Row>
              <Paragraph style={{paddingLeft:30, width:"90%", textAlign:"left"}}>
                <pre>
                {"\"" + booking.description + "\""}
                </pre>
              </Paragraph>
            </Row>
          </Col>
        </Row>
        <Row justify="center">
        <Col span={12}>
          <Divider/>
        </Col>
      </Row>
    </div>
  );
}
