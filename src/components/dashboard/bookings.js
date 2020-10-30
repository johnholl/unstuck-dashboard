import React from 'react';
import { Calendar } from 'antd';



export default function Bookings() {
    function onPanelChange(value, mode) {
        console.log(value.format('YYYY-MM-DD'), mode);
    }

    return(
        <div style={{ padding: 24, minHeight: 360 }}>
            <Calendar onPanelChange={onPanelChange} />
        </div>
    )
}