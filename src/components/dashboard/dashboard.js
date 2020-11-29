import React, {useState, useEffect} from 'react'
import '../../styles/dashboard.css'
import { Layout, Menu, Button } from 'antd';
import { UserOutlined, ClockCircleOutlined, CalendarOutlined, FireOutlined} from '@ant-design/icons';
import {Route, Link} from 'react-router-dom'
import Profile from './profile'
import Bookings from './bookings'
import Services from './services'
import Availability from './availability'
import {auth} from "../../firebase";


const { Header, Content, Footer, Sider } = Layout;



export default function Dashboard() {
    let [collapsed, setCollapsed] = useState(false);

    const onCollapse = collapsed => {
        console.log(collapsed);
        setCollapsed({ collapsed });
    };

    const signOut = () => {
        auth.signOut();
    }

    return(
        <Layout>
            <Sider
                breakpoint="lg"
                collapsedWidth="0"
                onBreakpoint={broken => {
                    console.log(broken);
                }}
                onCollapse={(collapsed, type) => {
                    console.log(collapsed, type);
                }}
            >
                <Button onClick={signOut}>Sign out</Button>
                <div className="logo" />
                <Menu theme="light" mode="inline" >
                    <Menu.Item key="1" icon={<UserOutlined />}>
                        <Link to="/dashboard/profile" />
                        profile
                    </Menu.Item>
                    <Menu.Item key="2" icon={<CalendarOutlined />}>
                        <Link to="/dashboard/bookings" />
                        bookings
                    </Menu.Item>
                    <Menu.Item key="3" icon={<FireOutlined />}>
                        <Link to="/dashboard/services" />
                        services
                    </Menu.Item>
                    <Menu.Item key="4" icon={<ClockCircleOutlined />}>
                        <Link to="/dashboard/availability" />
                        availability
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout>
                <Header className="site-layout-sub-header-background" style={{ padding: 0 }} />
                <Content style={{ margin: '24px 16px 0' }}>
                    <Route path="/dashboard/profile" component={Profile} />
                    <Route path="/dashboard/bookings" component={Bookings} />
                    <Route path="/dashboard/services" component={Services} />
                    <Route path="/dashboard/availability" component={Availability} />
                </Content>
                <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
            </Layout>
        </Layout>);

}