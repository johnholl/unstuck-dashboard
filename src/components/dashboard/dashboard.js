import React, { useState, useContext } from 'react';
import { Route, Link } from 'react-router-dom';
import { Layout, Menu, Button, Modal, Typography, Row, Tooltip, Col, Image, Dropdown, Badge, Divider } from 'antd';
import {
  UserOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  FireOutlined,
  ExportOutlined,
  DollarOutlined,
  RocketOutlined,
  BellOutlined,
} from '@ant-design/icons';
import { purple } from '@ant-design/colors';
import '../../styles/dashboard.css';
import { auth, firestore } from '../../firebase';
import logo from '../../assets/unstuckwhitepng.png';
import { UserContext } from '../../providers/UserProvider';
import Profile from './profile';
import Bookings from './bookings';
import Services from './services';
import Availability from './availability';
import Finances from './finances';
import Share from './share';

const {Text} = Typography;
const { Header, Content, Footer, Sider } = Layout;

export default function Dashboard(props) {
  const [visible, setVisible] = useState(false);
  const { user } = useContext(UserContext);
  const [menu, setMenu] = useState(null);
  const [notificationLen, setNotificationLen] = useState(0);


  React.useEffect(() => {
    (async function () {
      const snap = await firestore
        .collection('users')
        .doc(user.uid)
        .collection('bookings')
        .get();
      const bks = [];
      snap.forEach((doc) => {
        let bs = null;
        if (doc.data().status === 'requested') {
          bs = 'warning';
        } else if (doc.data().status === 'accepted') {
          bs = 'success';
        } else {
          bs = 'error';
        }
        bks.push({ ...doc.data(), id: doc.id, badgeStatus: bs });
      });

      const reqbookings = bks.filter(booking => (booking.status==="requested"));
      setNotificationLen(reqbookings.length);

      const m = (
        <Menu>
          {reqbookings.map(booking => (
            <Menu.Item key={booking.id}>
              <Link
                to={{
                  pathname: '/bookingInfo',
                  state: {
                    bookingNumber: booking.id,
                  },
                }}
                key={booking.id}
              >
                {`(respond) requested booking with ${booking.customerName}`}
              </Link>
            </Menu.Item>))}
        </Menu>
      );
      setMenu(m);
    })();
  }, []);

  const onMenuChange = (value) => {
    props.history.push('/dashboard/' + value.key);
  };

  const signOut = () => {
    auth.signOut();
  };

  const openSignOutModal = () => {
    setVisible(true);
  };

  return (
    <Layout
      style={{
        backgroundColor: purple[3],
        minHeight: 'calc(100vh - 10px)',
      }}
    >
      <Modal
        title="Sign out"
        visible={visible}
        footer={[
          <Button key="cancel" onClick={() => setVisible(false)}>
            Cancel
          </Button>,
          <Button key="signout" type="primary" onClick={signOut}>
            Sign Out
          </Button>,
        ]}
      >
        <p>Are you sure you want to sign out?</p>
      </Modal>
      <Header style={{ backgroundColor:purple[6], height:100 }}>
        <Row justify="space-between" align="middle" style={{paddingTop:0, height:"100%"}}>
          <Link to="/dashboard/bookings">
          <img src={logo} width={200} />
          </Link>
          <Col span={8}>
          <Row justify={"space-between"}>
              <Col span={7}>
              <a target="_self" rel="noreferrer" href={'https://booking.beunstuck.me/profile/' + user.uid}>
                        <Text style={{fontWeight:"bold", fontSize:14, color:"white"}}>Profile</Text>
                    </a>
                </Col>
                <Col span={1}><Divider type="vertical" style={{backgroundColor:"white"}}/></Col>
                <Col span={7}>
                    <a target="_self" rel="noreferrer" href={'https://beunstuck.me/faq'}>
                        <Text style={{fontWeight:"bold", fontSize:14, color:"white"}}>Docs</Text>
                    </a>
                </Col>
                <Col span={1}><Divider type="vertical" style={{backgroundColor:"white"}}/></Col>
                <Col span={7}>
                    <a target="_self" rel="noreferrer" href={'https://beunstuck.me/'}>
                        <Text style={{fontWeight:"bold", fontSize:14, color:"white"}}>beunstuck.me</Text>
                    </a>
                </Col>
          </Row>
          </Col>
          <Col span={8}>
            <Dropdown overlay={menu}>
              <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                <font style={{color:"white", fontWeight:"700", fontSize:24}}><BellOutlined/></font><Badge count={notificationLen} size="small" offset={[-5,-20]}/>
              </a>
            </Dropdown>
            <Text style={{color:"white"}}>{" " + user.email + " " }</Text>
            <Tooltip placement="bottom" title="sign out">
              <Button size="small" onClick={openSignOutModal} icon={<ExportOutlined style={{fontSize:12, color:"white"}}/>} type="text"/>
            </Tooltip>
          </Col>
        </Row>
      </Header>
      <Layout>
        <Sider
          breakpoint="lg"
          collapsedWidth="0"
          style={{backgroundColor:"white", position:"relative", height:"800px"}}
        >
          <Menu
            theme="light"
            mode="inline"
            selectedKeys={[props.location.pathname.split("/").pop()]}
            onClick={onMenuChange}
          >
            <Menu.Item key="bookings" icon={<CalendarOutlined />}>
              <Text strong>bookings</Text>
            </Menu.Item>
            <Menu.Item key="services" icon={<FireOutlined />}>
              <Text strong>services</Text>
            </Menu.Item>
            <Menu.Item key="availability" icon={<ClockCircleOutlined />}>
              <Text strong>availability</Text>
            </Menu.Item>
            <Menu.Item key="profile" icon={<UserOutlined />}>
              <Text strong>profile</Text>
            </Menu.Item>
            <Menu.Item key="share" icon={<RocketOutlined />}>
              <Text strong>share</Text>
            </Menu.Item>
            <Menu.Item key="finances" icon={<DollarOutlined />}>
              <Text strong>finances</Text>
            </Menu.Item>
          </Menu>
            <Image width="100%" 
            src="https://firebasestorage.googleapis.com/v0/b/unstuck-backend.appspot.com/o/undraw_Astronaut_re_8c33.svg?alt=media&token=cef7909c-6a16-4e04-9ece-e0265cfba3c8" 
            style={{position:"absolute", bottom:"0", left:"0"}}/>
        </Sider>
        <Content style={{ margin: '24px 16px 0' }}>
          <Route path="/dashboard/profile" component={Profile} />
          <Route path="/dashboard/bookings" component={Bookings} />
          <Route path="/dashboard/services" component={Services} />
          <Route path="/dashboard/availability" component={Availability} />
          <Route path="/dashboard/finances" component={Finances} />
          <Route path="/dashboard/share" component={Share} />
        </Content>
      </Layout>
      <Footer style={{ textAlign: 'center', backgroundColor:"white" }}>
        Unstuck ©2020 Created by Unstuck
      </Footer>
    </Layout>
  );
}




