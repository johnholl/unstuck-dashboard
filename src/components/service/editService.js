import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Form,
  Input,
  InputNumber,
  Button,
  Switch,
  Popover,
  Row,
  Col,
  Typography,
  notification,
} from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { firestore } from '../../firebase';
import { UserContext } from '../../providers/UserProvider';
import logo from '../../basicLogo.png';

const { Title } = Typography;

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 8,
  },
};

const validateMessages = {
  required: 'required',
  types: {
    email: 'not valid email',
    number: 'not a valid number!',
  },
  number: {
    range: 'must be between ${min} and ${max}',
  },
};

export default function EditService(props) {
  const { user } = useContext(UserContext);
  const service = props.location.service[1];
  console.log('SERVICE', service);
  const [autoAppt, setAutoAppt] = useState(service.autoAppt);
  const [userInfo, setUserInfo] = useState(true);

  React.useEffect(() => {
    firestore
      .collection('users')
      .doc(user.uid)
      .get()
      .then((doc) => {
        setUserInfo(doc.data());
      });
  }, []);

  const onFinish = (values) => {
    if ((userInfo.chargesEnabled && values.price > 0) || values.price === 0) {
      firestore
        .collection('users')
        .doc(user.uid)
        .collection('services')
        .doc(service.id)
        .set({ ...values, autoAppt })
        .then(() => props.history.push('dashboard/services'));
    } else {
      notification.open({
        message: 'Unable to update',
        description: `Your Stripe account isn't complete. You must finish it before you can make a paid service.`,
        duration: 5,
      });
    }
  };

  return (
    <div style={{ padding: 24, minHeight: 360, justifyContent: 'center' }}>
      <Row>
        <Col>
          <Link to="/dashboard/bookings">
            <img src={logo} width={100} />
          </Link>
        </Col>
      </Row>
      <Row justify="left">
        <Col span={12} offset={8}>
          <Row align="left">
            <Title>Edit Service</Title>
          </Row>
        </Col>
      </Row>
      <Form
        {...layout}
        name="nest-messages"
        size="large"
        onFinish={onFinish}
        validateMessages={validateMessages}
        initialValues={{
          name: service.name ? service.name : '',
          price: service.price ? service.price : 0,
          duration: service.duration ? service.duration : 5,
          description: service.description ? service.description : '',
          mintime: service.mintime ? service.mintime : 1,
          maxtime: service.maxtime ? service.maxtime : 30,
        }}
      >
        <Form.Item
          name={'name'}
          label="Service Name"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item name={'description'} label="Description">
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          label="Price"
          name="price"
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
        <Form.Item
          label={
            <div>
              Duration{' '}
              <Popover content="Length of the service in minutes">
                <InfoCircleOutlined size="small" />
              </Popover>
            </div>
          }
          name="duration"
          rules={[{ required: true }]}
        >
          <InputNumber min={5} max={360} step={5} />
        </Form.Item>
        <Form.Item
          name="mintime"
          label={
            <div>
              Min Booking Notice{' '}
              <Popover content="Customers must book at least this many days in advance. You can use fractions to denote parts of the day e.g. 0.5 is 12 hours">
                <InfoCircleOutlined size="small" />
              </Popover>
            </div>
          }
          rules={[
            {
              required: true,
            },
          ]}
        >
          <InputNumber min={0} max={365} step={1} />
        </Form.Item>
        <Form.Item
          name="maxtime"
          label={
            <div>
              Max Booking Notice{' '}
              <Popover content="Customers can schedule appointments up to this many days in the future.">
                <InfoCircleOutlined size="small" />
              </Popover>
            </div>
          }
          rules={[
            {
              required: true,
            },
          ]}
        >
          <InputNumber min={0} max={365} step={1} />
        </Form.Item>
        <Row align="middle">
          <Col span={8}>
            <Row justify="end" align="middle">
              {'Automatically accept appointments '}
              <Popover content="When a customer books, it will be accepted and a calendar event will automatically be created">
                <div style={{ padding: 5 }}>
                  <InfoCircleOutlined size="small" />
                </div>
              </Popover>
              {' : '}
            </Row>
          </Col>
          <Col span={8}>
            <Row justify="center">
              <Switch
                checked={autoAppt}
                onChange={() => setAutoAppt(!autoAppt)}
              />
            </Row>
          </Col>
        </Row>
        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
          <Row style={{ paddingTop: 40 }}>
            <Button type="primary" htmlType="submit" style={{ width: '80%' }}>
              Update
            </Button>
          </Row>
        </Form.Item>
      </Form>
    </div>
  );
}
