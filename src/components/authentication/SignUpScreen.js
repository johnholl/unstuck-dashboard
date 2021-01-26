import React from 'react';
import {Row, Col} from 'antd';
import {Route} from 'react-router-dom';
import logo from '../../unstuck.png';
import SignUpScreen1 from './SignUpScreen1';
import SignUpScreen2 from './SignUpScreen2';
import SignUpScreen3 from './SignUpScreen3';
import SignUpScreen4 from './SignUpScreen4';

  
export default function SignUpScreen() {
    return(
    <div>
            <Row justify="center" align="middle" style={{paddingTop:50}}>
            <img src={logo} width={300} />
            </Row>
            <Row justify="center" style={{paddingTop:50}}>
                <Col span={24}>
                <Route path="/signup/1" component={SignUpScreen1} />
                <Route path="/signup/2" component={SignUpScreen2} />  
                <Route path="/signup/3" component={SignUpScreen3} />  
                <Route path="/signup/4" component={SignUpScreen4} />  

                </Col> 
            </Row>
    </div>
    )


}