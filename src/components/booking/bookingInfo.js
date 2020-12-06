import React, { useContext } from 'react';
import { Button, Space } from 'antd';
import moment from 'moment';
import { firestore } from '../../firebase';
import { UserContext } from '../../providers/UserProvider';

export default function BookingInfo(props) {
  const { user } = useContext(UserContext);
  const bookingId = props.location.state.bookingNumber;
  const [booking, setBooking] = React.useState(null);

  React.useEffect(() => {
    (async function () {
      const doc = await firestore
        .collection('users')
        .doc(user.uid)
        .collection('bookings')
        .doc(bookingId)
        .get();
      if (doc.exists) {
        setBooking(doc.data());
      } else {
        // doc.data() will be undefined in this case
        console.log('No such document!');
      }
    })();
  }, []);

  const onAccept = () => {
    firestore
      .collection('users')
      .doc(user.uid)
      .collection('bookings')
      .doc(bookingId)
      .update({ status: 'accepted' })
      .then(setBooking({ ...booking, status: 'accepted' }))
      .catch((error) => {
        console.log('Unable to update status: ', error);
      });
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

  if (!booking) {
    return <div />;
  }

  return (
    <div style={{ padding: 50 }}>
      <p>{booking.customer}</p>
      <p>{moment.unix(booking.appointment).format('MM/DD/YYYY hh:mm A')}</p>
      <p>{'status: ' + booking.status}</p>
      {booking.status === 'requested' && (
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
      )}
    </div>
  );
}
