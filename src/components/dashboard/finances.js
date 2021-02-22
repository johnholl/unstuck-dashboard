import React, {useContext, useState} from 'react';
import {Button, Typography, Row, Divider, Col} from 'antd';
import {CheckCircleOutlined} from '@ant-design/icons';
import {functions, firestore} from '../../firebase';
import { UserContext } from '../../providers/UserProvider';


const {Title, Text} = Typography;
const createStripeAccount = functions.httpsCallable('createStripeAccount');


export default function Finances() {

    const { user } = useContext(UserContext);
    const [stripeId, setStripeId] = useState(null)
    const [chargesEnabled, setChargesEnabled] = useState(false);
    const [loaded, setLoaded] = useState(false)

    React.useEffect(() => {
        (async function () {
            const userSnap = (await firestore.collection('users').doc(user.uid).get()).data(); 
            setChargesEnabled(userSnap.chargesEnabled);
            setStripeId(userSnap.stripeId);
            setLoaded(true);
        })();
      }, []);
      
      
    async function goToStripe() {
        let result = "";
        if(stripeId) {
            result = await createStripeAccount({uid: user.uid, stripeId});
        }
        else {
            result = await createStripeAccount({uid: user.uid});
        }
        window.location.href= result.data.accountLinks.url;
    }

    if(!loaded){
        return(<div/>)
    }

    
    return(
        <div style={{ padding: 50, minHeight: 360 }}>
            <Row justify="right" style={{paddingBottom:20}}>
                <Title level={3}>Stripe Account</Title> 
            </Row>
            {!stripeId &&
                <div style={{width:"50%"}}>
                <p style={{textAlign:"left"}}>{"Follow the Stripe onboarding process to add automatic payment collection and invoicing to your Unstuck account."} </p> 
                </div>}
            {!stripeId && <Button onClick={goToStripe}>Connect</Button>}
            {stripeId && !chargesEnabled && <Button onClick={goToStripe}>Finish Connecting</Button>}
            {chargesEnabled && <Row align="top" justify="center"><CheckCircleOutlined style={{color:"green", fontSize:30, paddingRight:10}} /><Title level={4}>Payment Connected</Title></Row>}
            {/* {stripeId 
            ? 
                    
                : 
                } */}
            
            <Divider/>

            <Row justify="right" style={{paddingBottom:20}}>
                <Title level={3}>Invoices</Title> 
            </Row>
            <Row justify="center">
            {stripeId &&<Col>
                <Row justify="center"><Text style={{fontSize:18, color:"gray"}}>Visit Stripe to view your invoice history</Text></Row>
                <Row justify="center">
                <a target="_self" rel="noreferrer" href={`https://dashboard.stripe.com/`}><Text style={{color:"blue", fontSize:18}}>{`Stripe`}</Text></a></Row>
                </Col>}
            </Row>

        </div>
    )


}