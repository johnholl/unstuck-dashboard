import React, {useState} from 'react';
import { Calendar, Modal} from 'antd';
import {Route, Link} from 'react-router-dom'
import { withSuccess } from 'antd/lib/modal/confirm';



export default function Bookings() {
    let [modalVis, setModalVis] = useState(false)

    let events = [
        {type:withSuccess, title:'session with Aaron', }
    ]

    function onChange(value, mode) {
        console.log(value.format('YYYY-MM-DD'), mode);
        setModalVis(true);
    }

    function onCancel() {
        setModalVis(false);
    }

    function onOk() {
        console.log("ok");
        setModalVis(false);
    }

    return(
        <div style={{ padding: 24, minHeight: 360 }}>
            <Calendar onSelect={onChange} />
            <Modal title="bookings" visible={modalVis}
             onCancel={onCancel} onOk={onOk}>
                 <p><Link to={{
                            pathname: '/bookingInfo',
                            state: {
                                bookingNumber: 1}
                            }}>booking 1 </Link></p>
                 <p><Link to={{
                            pathname: '/bookingInfo',
                            state: {
                                bookingNumber: 2}
                            }}>booking 2 </Link></p>
                 <p><Link to={{
                            pathname: '/bookingInfo',
                            state: {
                                bookingNumber: 3}
                            }}>booking 3 </Link></p>
             </Modal>
        </div>
    )
}