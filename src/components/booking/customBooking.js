import React, { useContext, useState} from 'react';
import {Link} from 'react-router-dom'
import { Form, Input, InputNumber, Button, Row, Col, Typography, Select, DatePicker, Layout, notification, Spin} from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { firestore } from '../../firebase';
import { UserContext } from '../../providers/UserProvider';
import makeid from '../../utils/makeId';
import logo from '../../assets/symbol_only.png';

// const offerBooking = functions.httpsCallable('offerBooking');

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const {Title} = Typography;
const {Option} = Select;
const {Sider, Content} = Layout;

const validateMessages = {
  required: 'required',
  types: {
    email: 'not valid email',
    number: 'not a valid number',
  },
  number: {
    range: '${label} must be between ${min} and ${max}',
  },
};

export default function CustomBooking(props) {
  const { user } = useContext(UserContext);
  const [services, setServices] = useState({});
  const [userInfo, setUserInfo] = useState(true);
  const [customPD, setCustomPD] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [service, setService] = useState("");
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState("");
  const [startTime, setStartTime] = useState("");
  const [finishing, setFinishing] = useState(false);


  React.useEffect(async () => {
    const doc = await firestore.collection('users').doc(user.uid).get();
    setUserInfo(doc.data());
    const serviceSnap = await firestore
    .collection('users')
    .doc(user.uid)
    .collection('services')
    .get();
    const sv = {};
    serviceSnap.forEach((d) => {
        const id = d.id;
        if(!(d.data().archived)){
            sv[id]={ ...d.data(), id }
        }
    });
    setServices(sv);
  }, []);

  const onFinish = async (values) => {
    if((userInfo.chargesEnabled || price===0 || values.price===0)) {
      setFinishing(true);
      console.log(values);
      console.log(makeid(8));
      console.log(props);

      await offerBooking({
          userid:user.uid,
          duration:values.duration ? values.duration : duration,
          price:values.price ? values.price : price,
          customer:values.email,
          customerName:values.name,
          serviceName:services[values.service].name,
          description:services[values.service].description,
          serviceid:values.service,
          appointment:Number(values.starttime.format('X')),
          status:"offered",
          key:makeid(8),
          userInfo,
            });
      setFinishing(false);
      props.history.push("/dashboard/bookings");
      }
    else {
      notification.open({
        message: 'Unable to update',
        description:
          `Your Stripe account isn't complete. You must finish it before you can make a paid service.`,
          duration: 5,
      });
      }
    }

  if (!user || !userInfo) {
    return <div/>;
  }

  return (
    <div style={{ padding: 24}}>
    <Layout
    style={{
      minHeight: 'calc(100vh - 10px)',
    }}
  >
    <Sider style={{ backgroundColor:"white"}} breakpoint="md" width="400">
      <Row>
        <Col>
          <Link to="/dashboard/bookings">
            <img src={logo} width={100} />
          </Link>
        </Col>
      </Row>
      <Row justify="center"><Title level={4} style={{color:"gray"}}>{"Customer Name"}</Title></Row>
      <Row justify="center" style={{minHeight:"50px"}}><Title level={5}>{customerName}</Title></Row>
      <Row justify="center"><Title level={4} style={{color:"gray"}}>{"Customer Email"}</Title></Row>
      <Row justify="center" style={{minHeight:"50px"}}><Title level={5}>{customerEmail}</Title></Row>
      <Row justify="center"><Title level={4} style={{color:"gray"}}>{"Start Time"}</Title></Row>
      <Row justify="center" style={{minHeight:"50px"}}><Title level={5}>{startTime}</Title></Row>
      <Row justify="center"><Title level={4} style={{color:"gray"}}>{"Service"}</Title></Row>
      <Row justify="center" style={{minHeight:"50px"}}><Title level={5}>{service}</Title></Row>
      <Row justify="center"><Title level={4} style={{color:"gray"}}>{"Price"}</Title></Row>
      <Row justify="center" style={{minHeight:"50px"}}><Title level={5}>{"$" + price}</Title></Row>
      <Row justify="center"><Title level={4} style={{color:"gray"}}>{"Duration (minutes)"}</Title></Row>
      <Row justify="center" style={{minHeight:"50px"}}><Title level={5}>{duration}</Title></Row>
    </Sider>
    <Content style={{ backgroundColor:"white"}}>
      <Row justify="center">
        <Col span={12}>
            <Title>Create a Booking</Title>
            <Title level={5}>Send your customer a booking option.</Title>
      <Form
        layout={{}}
        name="nest-messages"
        onFinish={onFinish}
        size={"large"}
        validateMessages={validateMessages}
      >
        <Form.Item
          name={'name'}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input placeholder={"customer's name"} size={"large"} onChange={e=>{setCustomerName(e.target.value)}}/>
        </Form.Item>
        <Form.Item
          name={'email'}
          rules={[
            {
              type: 'email',
              required: true,
            },
          ]}
        >
          <Input placeholder={"customer's email"} size={"large"} onChange={e=>{setCustomerEmail(e.target.value)}}/>
        </Form.Item>
        <Form.Item
            name={'starttime'}
            rules={[
            {
                required: true,
            },
            ]}
            >
            <DatePicker
                style={{width:"100%"}}
                placeholder="start time"
                use12Hours
                showTime={{ format:"h:mm a", minuteStep:15}}
                format="MM-DD-YYYY h:mm a"
                onChange={v=>{setStartTime(v.format("MM-DD-YYYY h:mm a"))}}
                />
        </Form.Item>
        <Form.Item
          name={'service'}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select placeholder={"service"} onChange={v=>{setService(services[v].name);setDuration(services[v].duration);setPrice(services[v].price)}}>
            {Object.entries(services).map(sv => (
                <Option value={sv[0]} key={sv[0]}>{sv[1].name}</Option>
            ))}
          </Select>
        </Form.Item>
        {customPD ?
        <Row justify="space-around">
        <Form.Item name="price"
                  rules={[
                    {
                      required: customPD,
                    },
                  ]}>
              <InputNumber
                placeholder="price"
                min={0}
                step={5}
                onChange={(v)=>{setPrice(v)}}
                formatter={(value) =>
                  `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
              />
        </Form.Item>
        <Form.Item name="duration"
            rules={[
              {
                required: customPD,
              },
            ]}>
            <InputNumber min={5} max={360} step={5}
             placeholder="duration in minutes"
             style={{width:'200px'}}
             onChange={(v)=>{setDuration(v)}} />
        </Form.Item>
        </Row>
        :
        <Button type="dashed" onClick={()=>{
          if(service){setCustomPD(true)}
          else{notification.open({message: 'Select Service',description:'You must select a service before customizing price and duration.',duration: 3});}
        }}>customize price and duration</Button>
        }
        <Form.Item>
          <Row style={{paddingTop:40}} justify="center">
          <Button type="primary" htmlType="submit" style={{width:'80%'}}>
          {finishing ? <Spin indicator={antIcon} style={{ paddingLeft: 10 }} /> : "Create"}
          </Button>
          </Row>
        </Form.Item>
      </Form>
        </Col>
      </Row>
      </Content>
      </Layout>
      </div>
  );
}
