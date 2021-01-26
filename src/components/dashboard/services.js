import React, { useContext } from 'react';
import { Button, List, Divider, Col, Row, Modal, Typography,   ConfigProvider} from 'antd';
import { Link } from 'react-router-dom';
import { firestore } from '../../firebase';
import { UserContext } from '../../providers/UserProvider';

const {Title} = Typography;

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

  const renderEmpty = () => (
    <div style={{ textAlign: 'center' }}>
      <p>No Services</p>
    </div>
  );

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
    <Row justify="center">
      <Modal
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

      <Col span={18}>
        <div style={{ padding: 24, minHeight: 360 }}>
          <ConfigProvider renderEmpty={renderEmpty}>
          <List
            itemLayout="vertical"
            dataSource={services}
            renderItem={(service) => (
              <Row justify="center">
              <div style={{width:400}}>
                <List.Item
                  actions={[
                    <Link
                      key="link"
                      to={{
                        pathname: '/editService',
                        service,
                      }}
                    >
                      edit
                    </Link>,
                    <Button
                      key="button"
                      type="link"
                      onClick={() => openModal(service.id)}
                    >
                      delete
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    title={service.name}
                    description={service.description}
                  />
                  <Title level={5}>{service.duration + ' minutes'}</Title>
                  <Title level={5} >{'$' + service.price}</Title>
                </List.Item>
                <Divider />
              </div>
              </Row>
            )}
          ></List>
          </ConfigProvider>
          <Link to="/newService">
            <Button type="primary">CREATE A NEW SERVICE</Button>
          </Link>
        </div>
      </Col>
    </Row>
    </div>
  );
}
