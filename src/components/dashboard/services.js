import React from 'react';
import {Button, List, Skeleton, Avatar} from 'antd';
import {Link} from 'react-router-dom'
import {firestore} from "../../firebase"



export default function Services() {
    let [services, setServices] = React.useState([]);
    let fakedata = [{name: 'hello'}, {name: 'world'}]

    React.useEffect(() => {
        (async function () {
            firestore.collection("users").doc("lSkuPARE5Z9Eo5byvh3o").collection("services").get().then(function(serviceSnap) {
                let sv = []
                serviceSnap.forEach(function(doc) {
                    let id = doc.id;
                    let name = doc.data().name;
                    let price = doc.data().price;
                    let duration = doc.data().duration;
                    sv.push({...doc.data(), id:id})
                });
                setServices(sv);
            }).catch(function(error) {
                console.log("Error getting document:", error);
            });
        })();
    }, []);

    if(!services) {
        return(<div></div>)
    }

    return(
        <div style={{ padding: 24, minHeight: 360 }}>
            <List
            itemLayout="horizontal"
            dataSource={services}
            renderItem={service => {return(
                <List.Item
                  actions={[<Link to={{
                      pathname:'/editService', service:service}}><Button>edit</Button></Link>]}>
                      {service.name}
                </List.Item>)}}>
            </List>
            <Link to='/newService'>
            <Button>add</Button>
            </Link>
        </div>
    )
}