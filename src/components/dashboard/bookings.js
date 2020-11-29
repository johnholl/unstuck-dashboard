import React, {useContext, useState} from 'react';
import { Calendar, Modal, Badge} from 'antd';
import {Route, Link} from 'react-router-dom'
import { withSuccess } from 'antd/lib/modal/confirm';
import {UserContext} from "../../providers/UserProvider";
import { firestore } from "../../firebase"
import moment from 'moment';


export default function Bookings() {
    const user = useContext(UserContext);
    let [modalVis, setModalVis] = useState(false)
    let [bookings, setBookings] = useState(null);
    let [dayBookings, setDayBookings] = useState([]);

    React.useEffect(() => {
        (async function () {
            firestore.collection("users").doc(user.uid).collection("bookings").get().then(function(snap) {
                let bks = []
                snap.forEach(function(doc) {
                    console.log(doc)
                    console.log(doc.data())
                    let bs = null;
                    if(doc.data().status==='requested'){
                        bs = 'warning'
                    } else if(doc.data().status==='accepted'){
                        bs = 'success'
                    } else {
                        bs = 'error'
                    }
                    bks.push({...doc.data(), id:doc.id, badgeStatus: bs});
                })
                setBookings(bks);
            }).catch(function(error) {
                console.log("Error getting document:", error);
            });
        })();
    }, []);

    function onChange(value, mode) {
        console.log(value.format('YYYY-MM-DD HH'), mode);
        value.set({hour:0,minute:0,second:0,millisecond:0})
        bookings.map(booking => {console.log(moment.unix(booking.appointment).diff(value, 'hours'))});
        let dbks = bookings.filter(booking => moment.unix(booking.appointment).diff(value, 'hours')<24 && moment.unix(booking.appointment).diff(value, 'hours')>0 )
        setDayBookings(dbks);
        setModalVis(true);
    }

    function onCancel() {
        setModalVis(false);
    }

    function onOk() {
        console.log("ok");
        setModalVis(false);
    }

    function dateCellRender(value) {
        value.set({hour:0,minute:0,second:0,millisecond:0})
        let dbks = bookings.filter(booking => moment.unix(booking.appointment).diff(value, 'hours')<24 && moment.unix(booking.appointment).diff(value, 'hours')>0 )
        return (
          <ul style={{listStyle:"none", margin: 0, padding: 0}}>
            {dbks.map(booking => (
                
              <li key={booking.id}>
                <Badge status={booking.badgeStatus} text={moment.unix(booking.appointment).format("hh:mm A")} />
              </li>
            ))}
          </ul>
        );
      }

    if(!bookings){
        return(<div/>)
    }

    return(
        <div style={{ padding: 24, minHeight: 360 }}>
            <Calendar onSelect={onChange} dateCellRender={dateCellRender}/>
            <Modal title="bookings" visible={modalVis}
             onCancel={onCancel} onOk={onOk}>
                 {dayBookings.map(booking => {
                     return(
                        <p><Link to={{
                            pathname: '/bookingInfo',
                            state: {
                                bookingNumber: booking.id}
                            }}>{booking.customer + " " + booking.appointment}</Link></p>  
                     )
                 })}
             </Modal>
        </div>
    )
}