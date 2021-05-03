import React, { useContext, useState } from 'react';
import { Calendar, Modal, Button, Typography, Row, Col, Popover, Avatar, Divider } from 'antd';
import {
  PlusOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { UserContext } from '../../providers/UserProvider';
import { firestore } from '../../firebase';

const {Text, Title} = Typography;

const txtColors = {"accepted": "green", "declined": "red", "requested": "orange"}

export default function Bookings() {
  const { user } = useContext(UserContext);
  const [modalVis, setModalVis] = useState(false);
  const [selectedDate, setSelectedDate] = useState(moment());
  const [bookings, setBookings] = useState(null);
  const [dayBookings, setDayBookings] = useState([]);

  React.useEffect(() => {
    (async function () {
      const snap = await firestore
        .collection('users')
        .doc(user.uid)
        .collection('bookings')
        .get();
      const bks = [];
      snap.forEach((doc) => {
        let bs = null;
        if (doc.data().status === 'requested') {
          bs = 'warning';
        } else if (doc.data().status === 'accepted') {
          bs = 'success';
        } else {
          bs = 'error';
        }
        bks.push({ ...doc.data(), id: doc.id, badgeStatus: bs });
      });
      setBookings(bks);
    })();
  }, []);

  function onChange(value) {
    value.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
    const dbks = bookings.filter(
      (booking) =>
        moment.unix(booking.appointment).diff(value, 'hours') < 24 &&
        moment.unix(booking.appointment).diff(value, 'hours') > 0,
    );
    setDayBookings(dbks);
    setSelectedDate(value);
    if(dbks.length>0){
      setModalVis(true);
    }

  }

  function onCancel() {
    setModalVis(false);
  }

  function onOk() {
    setModalVis(false);
  }

  function dateCellRender(value) {
    value.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
    const dbks = bookings.filter(
      (booking) =>
        moment.unix(booking.appointment).diff(value, 'hours') < 24 &&
        moment.unix(booking.appointment).diff(value, 'hours') > 0,
    );

    const spillover = dbks.length > 2;
    return (
      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {dbks.slice(0, 2).map((booking) => (
          <li key={booking.id}>
            <Row justify="center">
            <Text style={{color: txtColors[booking.status], fontWeight:"bold"}}>{moment.unix(booking.appointment).format('h:mma')}</Text>
            </Row>
          </li>
        ))}
        {spillover && <Text strong={true}>{"more"}</Text>}
      </ul>
    );
  }

  if (!bookings) {
    return <div />
  }

  return (
    <div style={{ padding: 50, minHeight: 360 }}>
      <Row style={{paddingBottom:20}} justify="start" align="middle">
        <Title level={3}>Booking Calendar</Title>
      </Row>
      <Row justify="left">
        <Col span={12} style={{textAlign:"left", paddingBottom:30}}>
        <Text style={{fontSize:16, color:"gray"}}>{`View past and future bookings.`}</Text>
        </Col>
      </Row>
      <Row>
      <Col span={11}>
      <Row gutter={[24, 24]}>
        <Col span={12}>
        <Row justify="start"><Avatar style={{backgroundColor:'green', verticalAlign:'middle'}} size="small"/> <div style={{paddingLeft:10}}>{"Accepted"}</div></Row>
        </Col>
        <Col span={12}>
        <Row justify="start"><Avatar style={{backgroundColor:'orange', verticalAlign:'middle'}} size="small"/> <div style={{paddingLeft:10}}>{"Requested"}</div></Row>
        </Col>
      </Row>
      <Row gutter={[24, 24]} justify="start">
        <Col span={12}>
        <Row justify="start"><Avatar style={{backgroundColor:'red', verticalAlign:'middle'}} size="small"/> <div style={{paddingLeft:10}}>{"Declined"}</div></Row>
        </Col>
        <Col span={12}>
        <Row justify="start"><Avatar style={{backgroundColor:'black', verticalAlign:'middle'}} size="small"/> <div style={{paddingLeft:10}}>{"Offered"}</div></Row>
        </Col>
      </Row>
      </Col>
      <Col span={2}><Divider type="vertical" style={{height:60, borderColor:"black"}}/></Col>
      <Col span={11}>
        <Popover content="Create a new booking."> 
          <Link to="/newBooking">
            <Text style={{fontSize:20, paddingRight:10}}>Offer Booking</Text><Button shape="circle" icon={<PlusOutlined style={{fontSize:24}}/>} type="primary" size="large" />
          </Link>
        </Popover>
      </Col>
      </Row>
      <Calendar onSelect={onChange} dateCellRender={dateCellRender} />
      <Modal
        title={selectedDate.format("MM/DD/YYYY")}
        visible={modalVis}
        onCancel={onCancel}
        onOk={onOk}
        key={selectedDate}
      >
        {dayBookings.map((booking) => (
          <p key={booking.id}>
            <Link
              to={{
                pathname: '/bookingInfo',
                state: {
                  bookingNumber: booking.id,
                },
              }}
              key={booking.id}
            >
              <Button key={booking.id}>
              {moment.unix(booking.appointment).format('h:mma') + " with " + (booking.customerName ? booking.customerName : booking.customer)}
              </Button>
            </Link>
          </p>
        ))}
      </Modal>
    </div>
  );
}
