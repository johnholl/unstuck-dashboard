import React, {useContext, useState} from 'react';
import { Typography, Row, Col, Button, Form, Input, InputNumber, Switch, Popover} from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { firestore } from '../../firebase';
import { UserContext } from '../../providers/UserProvider';

const {Title} = Typography;

const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 24,
    },
  };

  const validateMessages = {
    required: 'required!',
    types: {
      email: '${label} is not valid email!',
      number: '${label} is not a valid number!',
    },
    number: {
      range: '${label} must be between ${min} and ${max}',
    },
  };
  
export default function SignUpScreen4(props) {
  const { user } = useContext(UserContext);
  const [serviceInfo, setServiceInfo] = useState(null);
  const [autoAppt, setAutoAppt] = useState(true);
  React.useEffect(() => {
    setServiceInfo({
      name: '',
      price: '',
      duration: '',
      description: '',
      tags: '',
    });
  }, []);

  const next = () =>{
    props.history.push('/dashboard/bookings');
  }

  const onFinish = (values) => {
    firestore
    .collection('users')
    .doc(user.uid)
    .collection('services')
    .add({...values, autoAppt})
    .then(() => props.history.push('/dashboard/bookings'));
  }

  if(user===null){
    return(<div>
      you need to be signed in to access this resource
    </div>)
  }

  if (!serviceInfo) {
    return <div>not loaded</div>;
  }

    return(
      <div>
        <Row justify="center">
          <Col span={8}>
          <Row justify="center">
            <Title level={3}>Create a service</Title>
            <Title level={5}>A service is a type of appointment. Give it a name and description, duration, price, etc. You can add more services later.</Title>
            </Row>
          <Form
        {...layout}
        name="nest-messages"
        onFinish={onFinish}
        size={"large"}
        validateMessages={validateMessages}
        initialValues={{
          name: serviceInfo.name,
          email: serviceInfo.email,
          headline: serviceInfo.headline,
          description: serviceInfo.description,
          website: serviceInfo.website,
          duration: 0,
          autoAppt: true,
          mintime: 1,
          maxtime: 30
        }}
      >
        <Form.Item
          name={'name'}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input placeholder="Name"/>
        </Form.Item>
        <Form.Item name={'description'}>
          <Input.TextArea placeholder="Description" rows={6}/>
        </Form.Item>
        <Form.Item
          label="Price" name="price"
          rules={[
            {
              required: true,
            },
          ]}
        >
              <InputNumber
                placeholder="price"
                min={0}
                step={5}
                formatter={(value) =>
                  `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
              />
        </Form.Item>
        <Form.Item label={
        <div>
        Duration{' '}
        <Popover content="Length of the service in minutes">
          <InfoCircleOutlined size="small" />
        </Popover>
      </div>} name="duration"
                rules={[
                  {
                    required: true,
                  },
                ]}>
            <InputNumber min={0} max={360} step={5} />
        </Form.Item>
        <Form.Item name="mintime" label={
        <div>
        Min Notice{' '}
        <Popover content="Customers must book at least this many days in advance. You can use fractions to denote parts of the day e.g. 0.5 is 12 hours">
          <InfoCircleOutlined size="small" />
        </Popover>
      </div>} rules={[
                  {
                    required: true,
                  },
                ]}>
            <InputNumber min={0} max={360} step={1} />
        </Form.Item>
        <Form.Item name="maxtime" label={
        <div>
        Max Notice{' '}
        <Popover content="Customers can schedule appointments up to this many days in the future.">
          <InfoCircleOutlined size="small" />
        </Popover>
      </div>} rules={[
                  {
                    required: true,
                  },
                ]}>
            <InputNumber min={0} max={365} step={1} />
        </Form.Item>
        <Row align="middle">
          <Col span={8}>
            <Row justify="end" align="middle">
          {"Autoaccept "}
          <Popover content="When a customer books, it will be accepted and a calendar event will automatically be created">
          <div style={{padding:5}}><InfoCircleOutlined size="small" /></div>
        </Popover>{" : "}
        </Row>
          </Col>
          <Col span={8}>
            <Row justify="end">
            <Switch checked={autoAppt} onChange={() => setAutoAppt(!autoAppt)}/>
            </Row>
          </Col>
        </Row>
        <Form.Item labelCol={{}} wrapperCol={{ ...layout.wrapperCol}}>
          <Row style={{paddingTop:40}} justify="center">
          <Button type="primary" htmlType="submit" style={{width:'80%'}}>
            Next
          </Button>
          </Row>
        </Form.Item>
      </Form>
      <Row justify="center" style={{paddingBottom:50}}>
          <Button type="secondary" style={{width:'80%'}} onClick={next}>
            Skip
          </Button>
          </Row>
          </Col>
        </Row>
      </div>
    )
}