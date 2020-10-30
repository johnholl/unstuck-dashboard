import React from 'react';
import {Button, Form, TimePicker} from 'antd';
import {ArrowRightOutlined} from '@ant-design/icons';


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

    const onFinish = (values) => {
        console.log(values);
    };

    return(
        <div style={{ padding: 24, minHeight: 360 }}>
            <Form {...layout} name="nest-messages" onFinish={onFinish}>
                {days.map((day) => {
                    return(<Form.Item
                        name={['user', {day}]}
                        label={day}
                    >
                        <TimePicker use12Hours format="h:mm a" onChange={onChange} minuteStep={15} />
                        <ArrowRightOutlined/>
                        <TimePicker use12Hours format="h:mm a" onChange={onChange} minuteStep={15} />
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