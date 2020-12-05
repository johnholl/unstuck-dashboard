import React, { useContext } from 'react';
import { Form, Input, Button, Spin, Popover } from 'antd';
import { LoadingOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { firestore } from '../../firebase';
import { UserContext } from '../../providers/UserProvider';
import GoogleAuth from '../../utils/googleAuth';
import sleep from '../../utils/timing';

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
  const { user } = useContext(UserContext);
  React.useEffect(() => {
    (async function () {
      const doc = await firestore.collection('users').doc(user.uid).get();
      if (doc.exists) {
        console.log('Document data:', doc.data());
        setProfileInfo(doc.data());
      } else {
        // doc.data() will be undefined in this case
        console.log('No such document!');
        setProfileInfo({
          name: '',
          email: '',
          headline: '',
          description: '',
          website: '',
          videolink: '',
        });
      }
    })();
  }, []);

  async function onFinish(values) {
    setUpdating(true);
    await sleep(1000);
    firestore
      .collection('users')
      .doc(user.uid)
      .update(values)
      .then(setUpdating(false))
      .catch((error) => console.log(error));
  }

  if (!profileInfo) {
    return <div></div>;
  }

  return (
    <div style={{ padding: 24, minHeight: 360 }}>
      <Form
        {...layout}
        name="nest-messages"
        initialValues={{
          name: profileInfo.name,
          email: profileInfo.email,
          headline: profileInfo.headline,
          description: profileInfo.description,
          website: profileInfo.website,
          videolink: profileInfo.videolink,
        }}
        onFinish={onFinish}
        validateMessages={validateMessages}
      >
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
          name={'email'}
          label="Email"
          rules={[
            {
              type: 'email',
            },
          ]}
        >
          <Input />
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
        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
          <Button type="primary" htmlType="submit" disabled={updating}>
            Save
          </Button>
          {updating && <Spin indicator={antIcon} style={{ paddingLeft: 10 }} />}
        </Form.Item>
      </Form>
      <GoogleAuth />
    </div>
  );
}
