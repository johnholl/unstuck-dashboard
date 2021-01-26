import React, { useContext } from 'react';
import {Link} from 'react-router-dom'
import { Button, Space, Row, Col, Typography, Divider, Modal, Input } from 'antd';
import {CheckCircleOutlined} from '@ant-design/icons'
import moment from 'moment';
import { firestore } from '../../firebase';
import { UserContext } from '../../providers/UserProvider';
import logo from '../../basicLogo.png';
import InvoiceModal from './invoicemodal';

export default function BookingInfo(props) {
  const { user } = useContext(UserContext);
  const bookingId = props.location.state.bookingNumber;
  const [booking, setBooking] = React.useState(null);
  const [custName, setCustName] = React.useState("");
  const [service, setService] = React.useState(null);
  const [invoiceVisible, setInvoiceVisible] = React.useState(false);
  const [declineVisible, setDeclineVisible] = React.useState(false);
  const [declineMessage, setDeclineMessage] = React.useState("");
  const [invoiceDisabled, setInvoiceDisabled] = React.useState(null);
  const [invoiceSent, setInvoiceSent] = React.useState(null);

  const [err, setErr] = React.useState(null);

const {Title, Paragraph, Text} = Typography;

  React.useEffect(() => {
    (async function () {
      try {
        const bk = await firestore.collection('users').doc(user.uid).collection('bookings').doc(bookingId).get();
        setBooking(bk.data());
        setCustName(bk.data().customerName ? bk.data().customerName : bk.data().customer);
        const sv = await firestore.collection('users').doc(user.uid).collection('services').doc(bk.data().serviceid).get();
        setService(sv.data());
        const tempiv = await firestore.collection('tempinvoices').doc(bookingId).get();
        setInvoiceSent(tempiv.exists);
        setInvoiceDisabled(bk.data().status==="declined" || tempiv.exists || bk.data().status==="requested")

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
    setBooking({ ...booking, status: 'accepted'});

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
    return(<div> {"here"} </div>)
  }

  return (
    <div style={{ padding: 50 }}>
      <InvoiceModal booking={booking} bookingId={bookingId} service={service} visible={invoiceVisible} closeModal={()=>setInvoiceVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setInvoiceVisible(false)}>
            Cancel
          </Button>
        ]}/>
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
              <Button type="primary" onClick={onAccept}>
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
      <Row justify="center">
          <Col span={12}>
            <Row align="middle">
            <Col span={12}>
              {
                invoiceSent ? 
                <Row align="top" justify="center"><CheckCircleOutlined style={{color:"green", fontSize:30, paddingRight:10}} /><Title level={4}>Invoice Sent</Title></Row>
                :
                <Button style={{width:"50%"}}
                type="primary"
                disabled={invoiceDisabled}
                onClick={()=>{setInvoiceVisible(true)}}>Send Invoice</Button>

              }
            </Col>

            </Row>
          </Col>
        </Row>

    </div>
  );
}
