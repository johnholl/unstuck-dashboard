import React, { useState } from 'react';
import { Route } from 'react-router-dom';
import { Layout, Menu, Button, Modal, Typography } from 'antd';
import {
  UserOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  FireOutlined,
} from '@ant-design/icons';
import { purple } from '@ant-design/colors';
import '../../styles/dashboard.css';
import { auth } from '../../firebase';
import Profile from './profile';
import Bookings from './bookings';
import Services from './services';
import Availability from './availability';

const {Text} = Typography;
const { Header, Content, Footer, Sider } = Layout;

export default function Dashboard(props) {
  const [visible, setVisible] = useState(false);

  console.log(props);

  // useEffect(() => {
  //   props.history.push('/dashboard/bookings');
  // }, []);

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
      <Header style={{display:"flex", alignItems:"center", justifyContent:"end", backgroundColor:purple[6]}}>
          <Button onClick={openSignOutModal}>Sign out</Button>
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
          style={{backgroundColor:"white"}}
        >
          <Menu
            theme="light"
            mode="inline"
            defaultSelectedKeys={[props.location.pathname.split("/").pop()]}
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
          </Menu>
        </Sider>
        <Header
          className="site-layout-sub-header-background"
          style={{ padding: 0 }}
        />
        <Content style={{ margin: '24px 16px 0' }}>
          <Route path="/dashboard/profile" component={Profile} />
          <Route path="/dashboard/bookings" component={Bookings} />
          <Route path="/dashboard/services" component={Services} />
          <Route path="/dashboard/availability" component={Availability} />
        </Content>
      </Layout>
      <Footer style={{ textAlign: 'center', backgroundColor:"white" }}>
        Unstuck ©2020 Created by Unstuck
      </Footer>
    </Layout>
  );
}
