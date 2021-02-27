import React, { useContext } from 'react';
import { Form, Input, Button, Spin, Popover, Row, Col, Typography, Divider, Radio, message, Upload, Avatar, Modal, Switch } from 'antd';
import { LoadingOutlined, InfoCircleOutlined, UploadOutlined} from '@ant-design/icons';
import { firestore, storage } from '../../firebase';
import { UserContext } from '../../providers/UserProvider';
import sleep from '../../utils/timing';
import makeid from '../../utils/makeId';


const {Paragraph, Title} = Typography;

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const layout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 12,
  },
};

const validateMessages = {
  required: '${label} is required!',
  types: {
    email: '${label} is not valid email!',
    number: '${label} is not a valid number!',
  },
  number: {
    range: '${label} must be between ${min} and ${max}',
  },
};


export default function Profile() {
  const [profileInfo, setProfileInfo] = React.useState(null);
  const [updating, setUpdating] = React.useState(false);
  const [photo, setPhoto] = React.useState(false);
  const [isAnonymous, setIsAnonymous] = React.useState(null);
  const [photoLoading, setPhotoLoading] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const { user } = useContext(UserContext);

    const customUpload = async ({ onError, onSuccess, file }) => {
      const metadata = {
          contentType: 'image/jpeg'
      }
      const storageRef = storage.ref();
      const imageName = makeid(); //a unique name for the image
      const imgFile = storageRef.child(`${user.uid}/${imageName}`);
      try {
        const image = await imgFile.put(file, metadata);
        const url = await image.ref.getDownloadURL();
        setPhoto(url);
        setPhotoLoading(false);
        await firestore.collection("users").doc(user.uid).set({photo: url}, {merge: true});
        setIsAnonymous(false);
        onSuccess(null, image);
      } catch(e) {
        onError(e);
      }
    };

    const beforeUpload = file => {
      const isImage = file.type.indexOf('image/') === 0;
      if (!isImage) {
        message.error('You can only upload image file!');
      }
      
      const isLt20M = file.size / 1024 / 1024 < 20;
      if (!isLt20M) {
        message.error('Image must smaller than 20MB!');
      }
      return isImage && isLt20M;
    };

    const onChange = (info) => {
      if (info.file.status === 'uploading') {
        setPhotoLoading(true);
        return;
      }
      if (info.file.status === 'done') {
        setPhotoLoading(false);
      };
      }

    const onDelete = async () => {
      await firestore.collection("users").doc(user.uid).set({photo: false}, {merge: true});
      setPhoto('https://firebasestorage.googleapis.com/v0/b/unstuck-backend.appspot.com/o/anonymous.png?alt=media&token=19287e5e-1de0-4a40-9b68-f80e7b4b0f1a')
      setIsAnonymous(true);
    }


  React.useEffect(() => {
    (async function () {
      const doc = await firestore.collection('users').doc(user.uid).get();
      if (doc.exists) {
        setProfileInfo(doc.data());
        if(doc.data().photo){
          setIsAnonymous(false);
          setPhoto(doc.data().photo);
        }
        else {
          setIsAnonymous(true);
          setPhoto('https://firebasestorage.googleapis.com/v0/b/unstuck-backend.appspot.com/o/anonymous.png?alt=media&token=19287e5e-1de0-4a40-9b68-f80e7b4b0f1a');
        }
      } else {
        console.log('No such document!');
        setProfileInfo({
          name: '',
          email: '',
          headline: '',
          description: '',
          website: '',
          videolink: '',
          cancellation:'',
          publicprofile: true,
          displayname: '',
        });
      }
    })();
  }, []);

    async function onFinish(values) {
      setUpdating(true)
      await sleep(1000);
      firestore.collection("users").doc(user.uid).set({...values}, {merge: true}).then(setUpdating(false)).catch((error) => console.log(error));  
      setUpdating(false);

    };


  if (!profileInfo) {
    return <div></div>
  }
  return (
    <div style={{ padding: 50, minHeight: 360 }}>
      <Modal
        title="Remove Photo"
        visible={visible}
        footer={[
          <Button key="cancel" onClick={() => setVisible(false)}>
            Cancel
          </Button>,
          <Button key="deletephoto" type="primary" onClick={onDelete}>
            Remove Photo
          </Button>,
        ]}
      >
        <p>Are you sure you want to remove your profile photo?</p>
      </Modal>
      <Row justify="right" style={{paddingBottom:20}}>
        <Title level={3}>Profile Photo</Title> 
      </Row>
      <Row justify="center">
      <Avatar size={175} src={photo} alt="No Photo"/>
      </Row>
      <Row justify="center" style={{paddingTop:20}}>
        <Col>
          {
            !isAnonymous ?
            <Button type="danger" disabled={isAnonymous} onClick={()=>setVisible(true)}>REMOVE</Button>
            :
            <Upload onChange={onChange} beforeUpload={beforeUpload} customRequest={customUpload} itemRender={()=>{<div/>}}><Button icon={<UploadOutlined />}>{!photoLoading ? "UPLOAD" : <Spin indicator={antIcon} style={{ paddingLeft: 10 }} />}</Button></Upload>
          }
        </Col>
      </Row>
      <Divider/>
      <Row justify="right" style={{paddingBottom:20}}>
        <Title level={3}>Profile Information</Title> 
      </Row>
      <Form
        size="large"
        {...layout}
        name="nest-messages"
        initialValues={{
          name: profileInfo.name ? profileInfo.name : "",
          email: profileInfo.email ? profileInfo.email : "",
          headline: profileInfo.headline ? profileInfo.headline : "",
          description: profileInfo.description ? profileInfo.description : "",
          website: profileInfo.website ? profileInfo.website : "",
          videolink: profileInfo.videolink ? profileInfo.videolink : "",
          cancellation: profileInfo.cancellation ? profileInfo.cancellation : "",
          publicprofile: profileInfo.publicprofile ? profileInfo.publicprofile : true,
          displayName: profileInfo.displayName ? profileInfo.displayName : '',
        }}
        onFinish={onFinish}
        validateMessages={validateMessages}
      >
        <Form.Item
          name={'publicprofile'}
          label={
            <div>
            Public Profile{' '}
            <Popover content="Select to make your profile page visible on Unstuck.">
              <InfoCircleOutlined size="small" />
            </Popover>
          </div>
            }>
          <Switch size={"large"} style={{width: 100}} defaultChecked/>
        </Form.Item>
        <Form.Item
          name={'name'}
          label="Name"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name={'displayName'}
          label="Display Name"
        >
          <Input />
        </Form.Item>
        <Form.Item
          name={'email'}
          label="Email"
          rules={[
            {
              type: 'email',
            },
          ]}
        >
          <Input disabled />
        </Form.Item>
        <Form.Item
          name={'headline'}
          label={
            <div>
              Headline{' '}
              <Popover content="This will be displayed at the top of your profile page">
                <InfoCircleOutlined size="small" />
              </Popover>
            </div>
          }
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          name={'description'}
          label={
            <div>
              Description{' '}
              <Popover content="Give some more information about yourself, experience, and services">
                <InfoCircleOutlined size="small" />
              </Popover>
            </div>
          }
        >
          <Input.TextArea rows={6} />
        </Form.Item>
        <Form.Item
          name={'cancellation'}
          label={
            <div>
              Cancellation Policy{' '}
              <Popover content={
                <div style={{width:400}}>
                <Row><Paragraph>{"Cancellation options"}</Paragraph></Row>
                <Row><Paragraph>{"FLEXIBLE: Free cancellation until 1 hour before the appointment start time(time shown in the confirmation email). After that, the customer is not eligible for a refund."}</Paragraph></Row>
                <Row><Paragraph>{"MODERATE: Free cancellation until 24 hours before the appointment start time (time shown in the confirmation email). After that, the customer is not eligible for a refund."}</Paragraph></Row>
                <Row><Paragraph>{"STRICT: If the customer cancels at any point, they are not eligible for a refund."}</Paragraph></Row>
                </div>
                }>
                <InfoCircleOutlined size="small" />
              </Popover>
            </div>
          }
        >
          <Radio.Group buttonStyle="solid">
            <Radio.Button value="flexible">Flexible</Radio.Button>
            <Radio.Button value="moderate">Moderate</Radio.Button>
            <Radio.Button value="strict">Strict</Radio.Button>
          </Radio.Group>
          </Form.Item>
        <Form.Item name={'website'} label="Website">
          <Input />
        </Form.Item>
        <Form.Item
          name={'videolink'}
          label={
            <div>
              Youtube video{' '}
              <Popover content="Upload a youtube video introducing yourself, put the link here, and we'll embed it in your profile page">
                <InfoCircleOutlined size="small" />
              </Popover>
            </div>
          }
        >
          <Input />
        </Form.Item>
        <Form.Item wrapperCol={{}}>
          <Button type="primary" htmlType="submit" disabled={updating} style={{width:"20%"}}>
          {updating ? <Spin indicator={antIcon} style={{ paddingLeft: 10 }} /> : "Save"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
