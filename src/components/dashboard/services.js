import React, {useContext} from 'react';
import {Button, List, Skeleton, Avatar, Divider, Col, Row, Modal} from 'antd';
import {Link} from 'react-router-dom'
import {firestore} from "../../firebase"
import {UserContext} from "../../providers/UserProvider";



export default function Services() {
    let [services, setServices] = React.useState([]);
    let [deleteService, setDeleteService] = React.useState([]);
    let [visible, setVisible] = React.useState(false);
    const user = useContext(UserContext);
    React.useEffect(() => {
        (async function () {
            firestore.collection("users").doc(user.uid).collection("services").get().then(function(serviceSnap) {
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

    const onDelete = () => {
        let sid = deleteService;
        firestore.collection("users").doc(user.uid).collection("services").doc(sid).delete();
        let newServices = services.filter((service) => service.id !== sid);
        setServices(newServices);
        setVisible(false);
    }

    const openModal = (sid) => {
        setDeleteService(sid);
        setVisible(true);

    }

    if(!services) {
        return(<div></div>)
    }

    return(
        <Row justify="center">

            <Modal
                title="Delete service"
                visible={visible}
                footer={[
                    <Button key="cancel" onClick={()=>setVisible(false)}>
                      Cancel
                    </Button>,
                    <Button key="delete" type="danger" onClick={onDelete}>
                      Delete
                    </Button>,
                  ]}
                >
                <p>Are you sure you want to delete this service?</p>
            </Modal>

        <Col span={18}>
        <div style={{ padding: 24, minHeight: 360 }}>
            <List
            itemLayout="vertical"
            dataSource={services}
            renderItem={service => {return(
                <div>
                    <List.Item
                    actions={[<Link to={{
                        pathname:'/editService', service:service}}>edit</Link>, <Button type="link" onClick={() => openModal(service.id)}>delete</Button>]}>
                        <List.Item.Meta 
                        title={service.name}
                        description={service.description}/>
                        <p>{"duration: " + service.duration + " minutes"}</p>
                        <p>{"price: $" + service.price}</p>
                    </List.Item>
                    <Divider/>
                </div>)}}>
            </List>
            <Link to='/newService'>
            <Button>add</Button>
            </Link>
        </div>
        </Col>
        </Row>
    )
}