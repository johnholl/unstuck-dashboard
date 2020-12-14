import React, { useContext } from 'react';
import { Form, Input, InputNumber, Button, Switch, Popover } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { firestore } from '../../firebase';
import { UserContext } from '../../providers/UserProvider';

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 8,
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

export default function EditService(props) {
  const { user } = useContext(UserContext);
  const onFinish = (values) => {
    firestore
      .collection('users')
      .doc(user.uid)
      .collection('services')
      .doc(props.location.service.id)
      .set(values)
      .then(() => props.history.push('dashboard/services'));
  };

  return (
    <div style={{ padding: 24, minHeight: 360, justifyContent: 'center' }}>
      <Form
        {...layout}
        name="nest-messages"
        onFinish={onFinish}
        validateMessages={validateMessages}
        initialValues={{
          name: props.location.service.name ? props.location.service.name : '',
          price: props.location.service.price
            ? props.location.service.price
            : '',
          duration: props.location.service.duration
            ? props.location.service.duration
            : '',
          description: props.location.service.description
            ? props.location.service.description
            : '',
          autoAppt: props.location.service.autoAppt ? props.location.service.autoAppt : false,
          mintime: props.location.service.mintime ? props.location.service.mintime : 1,
          maxtime: props.location.service.maxtime ? props.location.service.maxtime : 30,
        }}
      >
        <Form.Item
          name={'name'}
          label="Name of Service"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name={'price'}
          label="Price"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <InputNumber
            min={0}
            step={5}
            formatter={(value) =>
              `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            }
            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
          />
        </Form.Item>
        <Form.Item label="Duration">
          <Form.Item name="duration" noStyle>
            <InputNumber min={0} max={360} step={5} />
          </Form.Item>
          <span className="ant-form-text"> minutes</span>
        </Form.Item>
        <Form.Item label={
        <div>
        Minimum Booking Notice{' '}
        <Popover content="Customers must book at least this far in advance. You can use fractions to denote parts of the day e.g. 0.5 is 12 hours">
          <InfoCircleOutlined size="small" />
        </Popover>
      </div>}>
          <Form.Item name="mintime" noStyle>
            <InputNumber min={0} max={360} step={1} />
          </Form.Item>
          <span className="ant-form-text"> day(s)</span>
        </Form.Item>
        <Form.Item label={
        <div>
        Maximum Booking Notice{' '}
        <Popover content="Customers can schedule appointments up to this far in the future.">
          <InfoCircleOutlined size="small" />
        </Popover>
      </div>}>
          <Form.Item name="maxtime" noStyle>
            <InputNumber min={0} max={365} step={1} />
          </Form.Item>
          <span className="ant-form-text"> day(s)</span>
        </Form.Item>
        <Form.Item name={'description'} label="Description">
          <Input.TextArea />
        </Form.Item>
        <Form.Item name={'autoAppt'} valuePropName={props.location.service.autoAppt ? "checked" : ""} label={
        <div>
        Automatically accept appointments{' '}
        <Popover content="When a customer books, it will be accepted and a calendar event will automatically be created">
          <InfoCircleOutlined size="small" />
        </Popover>
      </div>}>
          <Switch />
        </Form.Item>
        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
