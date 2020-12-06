import React, { useContext, useState } from 'react';
import { Calendar, Modal, Badge } from 'antd';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { UserContext } from '../../providers/UserProvider';
import { firestore } from '../../firebase';

export default function Bookings() {
  const { user } = useContext(UserContext);
  const [modalVis, setModalVis] = useState(false);
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
    bookings.map((booking => {console.log(moment.unix(booking.appointment*1000));console.log(value);console.log(moment.unix(booking.appointment).diff(value, 'hours'))}))
    const dbks = bookings.filter(
      (booking) =>
        moment.unix(booking.appointment).diff(value, 'hours') < 24 &&
        moment.unix(booking.appointment).diff(value, 'hours') > 0,
    );
    return (
      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {dbks.map((booking) => (
          <li key={booking.id}>
            <Badge
              status={booking.badgeStatus}
              text={moment.unix(booking.appointment).format('hh:mm A')}
            />
          </li>
        ))}
      </ul>
    );
  }

  if (!bookings) {
    return <div />;
  }

  return (
    <div style={{ padding: 24, minHeight: 360 }}>
      <Calendar onSelect={onChange} dateCellRender={dateCellRender} />
      <Modal
        title="bookings"
        visible={modalVis}
        onCancel={onCancel}
        onOk={onOk}
      >
        {dayBookings.map((booking) => (
          <p key={booking.unix()}>
            <Link
              to={{
                pathname: '/bookingInfo',
                state: {
                  bookingNumber: booking.id,
                },
              }}
            >
              {booking.customer +
                ' at ' +
                moment.unix(booking.appointment).format('h:mm a')}
            </Link>
          </p>
        ))}
      </Modal>
    </div>
  );
}
