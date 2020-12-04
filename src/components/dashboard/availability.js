import React, {useContext} from 'react';
import {Button, Form, TimePicker} from 'antd';
import {ArrowRightOutlined} from '@ant-design/icons';
import {firestore} from "../../firebase"
import moment from 'moment';
import {UserContext} from "../../providers/UserProvider";

const {RangePicker} = TimePicker;


const layout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16,
    },
};

const validateMessages = {
    required: '${label} is required!',
    types: {
        email: '${label} is not valid email!',
        number: '${label} is not a valid number!',
    },
    number: {
        range: '${label} must be between ${min} and ${max}',
    },
};

function onChange(time, timeString) {
    console.log(time, timeString);
}

function onRangeChange(v) {
    console.log("RANGE REPRESENTATION");
    console.log(v);
}

let days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function Availability() {
    let [availability, setAvailability] = React.useState(null)
    const user = useContext(UserContext);
    React.useEffect(() => {
        (async function () {
            firestore.collection("users").doc(user.uid).collection("availability").get().then(function(querySnapshot) {
                let av = []
                querySnapshot.forEach(function(doc) {
                    let datkey = doc.id;
                    console.log(datkey);
                    av[datkey] = {start: moment(doc.data().start.seconds*1000), end: moment(doc.data().end.seconds*1000)}
                });
                setAvailability(av);
            })
            .catch(function(error) {
                console.log("Error getting documents: ", error);
            });

        })();
    }, []);

    const onFinish = (days) => {
        Object.entries(days).forEach(([key, value]) => {
            if(value.range !== null) {
                firestore.collection("users").doc(user.uid).collection("availability").doc(key).set(
                {day: key, end:value.range[1]._d, start:value.range[0]._d})}
                else {
                    firestore.collection("users").doc(user.uid).collection("availability").doc(key).delete();
                }
        });
        
    };

    if(!availability) {
        return(<div></div>)
    }

    return(
        <div style={{ padding: 24, minHeight: 360 }}>
            {console.log(availability)}
            <Form {...layout} name="nest-messages" onFinish={onFinish}>
                {days.map((day) => {
                    return(<Form.Item
                        label={day}
                        style={{ marginBottom: 0 }}>
                        <Form.Item
                        name={[day, 'range']}
                        style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
                        initialValue={availability[day] ? [availability[day]['start'], availability[day]['end']] : null}>
                            <RangePicker use12Hours format="h:mm a" onChange={onRangeChange} minuteStep={15}/>
                        </Form.Item>
                        </Form.Item>)
                })}
                <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}