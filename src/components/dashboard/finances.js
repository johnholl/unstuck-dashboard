import React, {useContext, useState} from 'react';
import {Button, Typography, Row, Divider} from 'antd';
import {CheckCircleOutlined} from '@ant-design/icons';
import {functions, firestore} from '../../firebase';
import { UserContext } from '../../providers/UserProvider';


const {Title} = Typography;
const createStripeAccount = functions.httpsCallable('createStripeAccount');


export default function Finances() {

    const { user } = useContext(UserContext);
    const [stripeId, setStripeId] = useState(null)
    const [loaded, setLoaded] = useState(false)

    React.useEffect(() => {
        (async function () {
            console.log(user);
            const userSnap = (await firestore.collection('users').doc(user.uid).get()).data(); 
            console.log(userSnap);
            setStripeId(userSnap.stripeId);
            setLoaded(true);
        })();
      }, []);
      
      
    async function makeAccount() {
        const result = await createStripeAccount();
        console.log(result);
        console.log(result.data.accountLinks.url)
        // window.location.href= result.data.accountLinks.url;
    }

    if(!loaded){
        return(<div/>)
    }

    
    return(
        <div style={{ padding: 50, minHeight: 360 }}>
            <Row justify="right" style={{paddingBottom:20}}>
                <Title level={3}>Stripe Account</Title> 
            </Row>
            {stripeId 
            ? 
                    <Row align="top" justify="center"><CheckCircleOutlined style={{color:"green", fontSize:30, paddingRight:10}} /><Title level={4}>Payment Connected</Title></Row>
                : 
                <Button onClick={makeAccount}>Connect Stripe</Button>
                }
            
            <Divider/>

            <Row justify="right" style={{paddingBottom:20}}>
                <Title level={3}>Invoices</Title> 
            </Row>

        </div>
    )


}