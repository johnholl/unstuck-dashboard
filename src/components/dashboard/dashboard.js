import React, {useState, useEffect} from 'react'
import '../../styles/dashboard.css'
import { Layout, Menu, Button, Row } from 'antd';
import { UserOutlined, ClockCircleOutlined, CalendarOutlined, FireOutlined} from '@ant-design/icons';
import {Route, Link} from 'react-router-dom'
import Profile from './profile'
import Bookings from './bookings'
import Services from './services'
import Availability from './availability'
import {auth} from "../../firebase";


const { Header, Content, Footer, Sider } = Layout;



export default function Dashboard(props) {
    let [collapsed, setCollapsed] = useState(false);

    useEffect(() => {props.history.push("/dashboard/bookings")}, []);

    const onCollapse = collapsed => {
        console.log(collapsed);
        setCollapsed({ collapsed });
    };

    const onMenuChange = (value) => {
        console.log(value.key);
        console.log(props);
        props.history.push("/dashboard/" + value.key);
    }

    const signOut = () => {
        auth.signOut();
    }

    return(
        <Layout style={{ background: "blue", minHeight: "calc(100vh - 10px)", overflow:"scroll" }}>
            <Header style={{justify:"end"}}>
                    <Row align="middle" justify="end" style={{padding:20}}>
                        <Button onClick={signOut}>Sign out</Button>
                    </Row>
                </Header>
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
                <Menu theme="light" mode="inline" defaultSelectedKeys={["bookings"]} onClick={onMenuChange}>
                    <Menu.Item key="bookings" icon={<CalendarOutlined />}>
                        bookings
                    </Menu.Item>
                    <Menu.Item key="services" icon={<FireOutlined />}>
                        services
                    </Menu.Item>
                    <Menu.Item key="availability" icon={<ClockCircleOutlined />}>
                        availability
                    </Menu.Item>
                    <Menu.Item key="profile" icon={<UserOutlined />}>
                        profile
                    </Menu.Item>
                </Menu>
            </Sider>
                <Header className="site-layout-sub-header-background" style={{ padding: 0 }} />
                <Content style={{ margin: '24px 16px 0' }}>
                    <Route path="/dashboard/profile" component={Profile} />
                    <Route path="/dashboard/bookings" component={Bookings} />
                    <Route path="/dashboard/services" component={Services} />
                    <Route path="/dashboard/availability" component={Availability} />
                </Content>
            </Layout>
            <Footer style={{ textAlign: 'center' }}>Unstuck ©2020 Created by Unstuck</Footer>

        </Layout>);

}