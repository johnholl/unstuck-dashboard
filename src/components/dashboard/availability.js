import React from 'react';
import {Button, Form, TimePicker} from 'antd';
import {ArrowRightOutlined} from '@ant-design/icons';
import {firestore} from "../../firebase"
import moment from 'moment';

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
        email: '${label} is not validate email!',
        number: '${label} is not a validate number!',
    },
    number: {
        range: '${label} must be between ${min} and ${max}',
    },
};

function onChange(time, timeString) {
    console.log(time, timeString);
}

let days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function Availability() {

    let [availability, setAvailability] = React.useState(null)

    React.useEffect(() => {
        (async function () {
            firestore.collection("users").doc("lSkuPARE5Z9Eo5byvh3o").collection("availability").get().then(function(querySnapshot) {
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
            if(value.start !== null && value.end !== null) {
                console.log(key);
                console.log(value);
            firestore.doc("users/lSkuPARE5Z9Eo5byvh3o/availability/" + key).set(
                {day: key, end:value.end._d, start:value.start._d})}
                else {
                    firestore.doc("users/lSkuPARE5Z9Eo5byvh3o/availability/" + key).delete();
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
                        name={[day, 'start']}
                        style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
                        initialValue={availability[day] ? availability[day]['start'] : null}
                    >
                        <TimePicker placeholder="start" use12Hours format="h:mm a" onChange={onChange} minuteStep={15} />
                        </Form.Item>
                        <Form.Item
                        name={[day, 'end']}
                        style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
                        initialValue={availability[day] ? availability[day]['end'] : null}
                        >
                        <TimePicker placeholder="end" use12Hours format="h:mm a" onChange={onChange} minuteStep={15} />
                    </Form.Item></Form.Item>)
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