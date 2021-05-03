import React, { useContext } from 'react';
import { Button, Col, Row, Modal, Typography, Card, Popover} from 'antd';
import { Link } from 'react-router-dom';
import { firestore } from '../../firebase';
import { UserContext } from '../../providers/UserProvider';

const {Title, Text} = Typography;

export default function Services() {
  const [services, setServices] = React.useState([]);
  const [deleteService, setDeleteService] = React.useState('');
  const [visible, setVisible] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);
  const { user } = useContext(UserContext);
  React.useEffect(() => {
    (async function () {
      const serviceSnap = await firestore
        .collection('users')
        .doc(user.uid)
        .collection('services')
        .get();
      const sv = [];
      serviceSnap.forEach((doc) => {
        const id = doc.id;
        if(!(doc.data().archived)){
          sv.push({ ...doc.data(), id });
        }
      });
      setServices(sv);
      setLoaded(true);
    })();
  }, []);

  const onDelete = () => {
    const sid = deleteService;
    firestore
      .collection('users')
      .doc(user.uid)
      .collection('services')
      .doc(sid)
      .set({archived: true}, {merge: true});
    const newServices = services.filter((service) => service.id !== sid);
    setServices(newServices);
    setVisible(false);
  };

  const openModal = (sid) => {
    setDeleteService(sid);
    setVisible(true);
  };

  if (!services || !loaded) {
    return <div></div>;
  }

  return (
    <div style={{ padding: 50, minHeight: 360 }}>
    <Row justify="right" style={{paddingBottom:20}}>
      <Title level={3}>Manage Your Services</Title> 
    </Row>
    <Row justify="left">
        <Col span={12} style={{textAlign:"left"}}>
        <Text style={{fontSize:16, color:"gray"}}>{`Create any number of services to offer to your customers.`}</Text>
        </Col>
      </Row>
    <div style={{width:"50%"}}>
    </div>
    <Row justify="center">
      <Modal
        closable={false}
        title="Delete service"
        visible={visible}
        footer={[
          <Button key="cancel" onClick={() => setVisible(false)}>
            Cancel
          </Button>,
          <Button key="delete" type="danger" onClick={onDelete}>
            Delete
          </Button>,
        ]}
      >
        <p>Are you sure you want to delete this service?</p>
      </Modal>
      </Row>

        <div style={{ padding: 24, minHeight: 360 }}>
          <Row gutter={[16, 16]}>
          {Object.entries(services).map((service) => (
              <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24} type="flex" key={service.id}>
                    <Card title={service[1].name} 
                    style={{backgroundColor:"white", position:"relative", borderColor:"darkgray", textAlign:"left"}} >
                      <Row justify="space-between">
                        <Col span={12}>
                        <Row>
                        <Popover content={<div style={{width:"300px"}}>{service[1].description}</div>} trigger="click"> 
                        <p style={{height:"30px", textOverflow:"ellipsis", overflow:"hidden", whiteSpace:"nowrap"}}>{service[1].description}</p>
                        </Popover>
                        </Row>
                        <Row>
                          <Col span={12}>
                          <p>{service[1].duration + " minutes"}</p>
                          </Col>
                          <Col span={12}>
                          <p>{"$" + service[1].price}</p>
                          </Col>
                        </Row>
                        </Col>
                        <Col>
                        <Row justify="center">
                        <Link to={{pathname: '/editService', service,}}>edit</Link>
                        </Row>
                        <Row justify="end">
                        <Button type="link" onClick={() => openModal(service.id)}>delete</Button>
                        </Row>
                        </Col>
                      </Row>
                        </Card>
              </Col>
            ))}
          </Row>
          <Link to="/newService">
            <Button type="primary">NEW SERVICE</Button>
          </Link>
        </div>
    </div>
  );
}
