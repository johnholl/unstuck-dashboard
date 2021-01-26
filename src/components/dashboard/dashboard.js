import React, { useState, useContext } from 'react';
import { Route, Link } from 'react-router-dom';
import { Layout, Menu, Button, Modal, Typography, Row, Tooltip, Col, Image } from 'antd';
import {
  UserOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  FireOutlined,
  ExportOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import { purple } from '@ant-design/colors';
import '../../styles/dashboard.css';
import { auth } from '../../firebase';
import logo from '../../assets/unstuckwhitepng.png';
import { UserContext } from '../../providers/UserProvider';
import Profile from './profile';
import Bookings from './bookings';
import Services from './services';
import Availability from './availability';
import Finances from './finances';

const {Text} = Typography;
const { Header, Content, Footer, Sider } = Layout;

export default function Dashboard(props) {
  const [visible, setVisible] = useState(false);
  const { user } = useContext(UserContext);


  console.log(props);
  console.log(props.location.pathname.split("/").pop());

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
          <Col>
            <Text style={{color:"white"}}>{user.email + " " }</Text>
            <Tooltip placement="bottom" title="sign out">
              <Button onClick={openSignOutModal} icon={<ExportOutlined/>} ghost={true}/>
            </Tooltip>
          </Col>
        </Row>
      </Header>
      <Layout>
        <Sider
          breakpoint="lg"
          collapsedWidth="0"
          onBreakpoint={(broken) => {
            console.log(broken);
          }}
          onCollapse={(collapsed, type) => {
            console.log(collapsed, type);
          }}
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
        </Content>
      </Layout>
      <Footer style={{ textAlign: 'center', backgroundColor:"white" }}>
        Unstuck ©2020 Created by Unstuck
      </Footer>
    </Layout>
  );
}




