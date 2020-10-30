import React, {useState, useEffect} from 'react'
import '../../styles/dashboard.css'
import { Layout, Menu } from 'antd';
import { UserOutlined, ClockCircleOutlined, CalendarOutlined, FireOutlined} from '@ant-design/icons';
import {Route, Link} from 'react-router-dom'
import Profile from './profile'
import Bookings from './bookings'
import Services from './services'
import Availability from './availability'

const { Header, Content, Footer, Sider } = Layout;



export default function Dashboard() {
    let [collapsed, setCollapsed] = useState(false);

    const onCollapse = collapsed => {
        console.log(collapsed);
        setCollapsed({ collapsed });
    };

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
                <div className="logo" />
                <Menu theme="light" mode="inline" defaultSelectedKeys={['1']} >
                    <Menu.Item key="1" icon={<UserOutlined />}>
                        <Link to="/profile" />
                        profile
                    </Menu.Item>
                    <Menu.Item key="2" icon={<CalendarOutlined />}>
                        <Link to="/bookings" />
                        bookings
                    </Menu.Item>
                    <Menu.Item key="3" icon={<FireOutlined />}>
                        <Link to="/services" />
                        services
                    </Menu.Item>
                    <Menu.Item key="4" icon={<ClockCircleOutlined />}>
                        <Link to="/availability" />
                        availability
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout>
                <Header className="site-layout-sub-header-background" style={{ padding: 0 }} />
                <Content style={{ margin: '24px 16px 0' }}>
                    <Route path="/profile" component={Profile} />
                    <Route path="/bookings" component={Bookings} />
                    <Route path="/services" component={Services} />
                    <Route path="/availability" component={Availability} />
                </Content>
                <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
            </Layout>
        </Layout>);

}