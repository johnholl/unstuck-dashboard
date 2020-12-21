import React, { useContext, useState } from 'react';
import { Calendar, Modal, Button, Typography, Row } from 'antd';
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
    console.log("DBKS");
    console.log(dbks);
    setDayBookings(dbks);
    setSelectedDate(value);
    setModalVis(true);

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
            <Text style={{color: txtColors[booking.status]}}>{moment.unix(booking.appointment).format('h:mma')}</Text>
          </li>
        ))}
        {spillover && <Text>{". . ."}</Text>}
      </ul>
    );
  }

  if (!bookings) {
    return <div />;
  }

  return (
    <div style={{ padding: 24, minHeight: 360 }}>
      <Row justify="right" style={{paddingBottom:20}}>
        <Title level={3}>Booking Calendar</Title> 
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
