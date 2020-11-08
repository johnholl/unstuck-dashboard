import React from 'react';



export default function bookingInfo(props) {

    return(
        <div>
            <p>information about booking number {props.location.state.bookingNumber}.</p>
        </div>
    )

}