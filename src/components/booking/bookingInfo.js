import React, { useContext } from 'react';
import { Button, Space, Row, Col, Typography, Divider } from 'antd';
import moment from 'moment';
import { firestore } from '../../firebase';
import { UserContext } from '../../providers/UserProvider';
import logo from '../../basicLogo.png';
// import getTimeString from '../../utils/timeFormat';

export default function BookingInfo(props) {
  const { user } = useContext(UserContext);
  const bookingId = props.location.state.bookingNumber;
  const [booking, setBooking] = React.useState(null);
  const [custName, setCustName] = React.useState("");
  const [service, setService] = React.useState(null);
  const [err, setErr] = React.useState(null);

const {Title, Paragraph, Text} = Typography;

  React.useEffect(() => {
    (async function () {
      try {
        const bk = await firestore.collection('users').doc(user.uid).collection('bookings').doc(bookingId).get();
        setBooking(bk.data());
        setCustName(bk.data().customerName ? bk.data().customerName : bk.data().customer);
        console.log(bk.data());
        const sv = await firestore.collection('users').doc(user.uid).collection('services').doc(bk.data().serviceid).get();
        setService(sv.data());

      } 
      catch(error) {
        console.log('No such document!');
        console.log(error);
        setErr(err);
      }
    })();
  }, []);

  async function onAccept() {
    try {
    await firestore.collection('users').doc(user.uid).collection('bookings').doc(bookingId).update({ status: 'accepted' })
    setBooking({ ...booking, status: 'accepted' });

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
      .then(setBooking({ ...booking, status: 'declined' }))
      .catch((error) => {
        console.log('Unable to update status: ', error);
      });
  };

  if (!booking || !service) {
    return(<div> {err} </div>)
  }

  return (
    <div style={{ padding: 50 }}>
      <Row>
        <Col>
        <img src={logo} width={50} />
        </Col>
      </Row>
      <Row justify="center">
        <Col span={12}>
          <Row align="left">
            <Title>Your booking with {custName}</Title>
          </Row>
        </Col>
      </Row>
      <Row justify="center">
        <Col span={12}>
          <Row align="left">
          <Title level={4}>{service.name + " on " + moment.unix(booking.appointment).format('M/D/YYYY') +
          " priced at $" + service.price + ".00"}</Title>
          </Row>
        </Col>
      </Row>
      <Row justify="center">
        <Col span={12}>
          <Row align="left">
            <Title level={4}>{moment.unix(booking.appointment).format('h:mma') + " - " + moment.unix(booking.appointment + 60*booking.duration).format('h:mma')}</Title>
          </Row>
        </Col>
      </Row>
      <Row justify="center">
        <Col span={12}>
        <Row align="left">
          {booking.status === 'requested' ? (
          <div>
            <Space size="large">
              <Button type="primary" onClick={onAccept}>
                Accept
              </Button>
              <Button type="danger" onClick={onDecline}>
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
            <Row align="left">
            <Title level={4}>{custName + " wrote: "}</Title>
            </Row>
            <Row align="left">
              <Paragraph style={{paddingLeft:30, width:"90%", textAlign:"left"}}>
                <pre>
                {"\"" + booking.description + "\""}
                </pre>
              </Paragraph>
            </Row>
          </Col>
        </Row>
    </div>
  );
}
