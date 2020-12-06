import React, { useContext } from 'react';
import { Button, List, Divider, Col, Row, Modal } from 'antd';
import { Link } from 'react-router-dom';
import { firestore } from '../../firebase';
import { UserContext } from '../../providers/UserProvider';

export default function Services() {
  const [services, setServices] = React.useState([]);
  const [deleteService, setDeleteService] = React.useState('');
  const [visible, setVisible] = React.useState(false);
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
        sv.push({ ...doc.data(), id });
      });
      setServices(sv);
    })();
  }, []);

  const onDelete = () => {
    const sid = deleteService;
    firestore
      .collection('users')
      .doc(user.uid)
      .collection('services')
      .doc(sid)
      .delete();
    const newServices = services.filter((service) => service.id !== sid);
    setServices(newServices);
    setVisible(false);
  };

  const openModal = (sid) => {
    setDeleteService(sid);
    setVisible(true);
  };

  if (!services) {
    return <div></div>;
  }

  return (
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
          <List
            itemLayout="vertical"
            dataSource={services}
            renderItem={(service) => (
              <div>
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
                  <p>{'duration: ' + service.duration + ' minutes'}</p>
                  <p>{'price: $' + service.price}</p>
                </List.Item>
                <Divider />
              </div>
            )}
          ></List>
          <Link to="/newService">
            <Button>add</Button>
          </Link>
        </div>
      </Col>
    </Row>
  );
}
