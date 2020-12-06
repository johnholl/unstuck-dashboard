import React, { useContext } from 'react';
import { Form, Input, InputNumber, Button } from 'antd';
import { firestore } from '../../firebase';
import { UserContext } from '../../providers/UserProvider';

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 8,
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

export default function CreateService(props) {
  const { user } = useContext(UserContext);
  const [serviceInfo, setServiceInfo] = React.useState(null);
  React.useEffect(() => {
    setServiceInfo({
      name: '',
      price: '',
      duration: '',
      description: '',
      tags: '',
    });
  }, []);

  const onFinish = (values) => {
    firestore
      .collection('users')
      .doc(user.uid)
      .collection('services')
      .add(values)
      .then(() => props.history.push('/dashboard/services'));
  };

  if (!serviceInfo) {
    return <div>not loaded</div>;
  }

  return (
    <div style={{ padding: 24, minHeight: 360, justifyContent: 'center' }}>
      <Form
        {...layout}
        name="nest-messages"
        onFinish={onFinish}
        validateMessages={validateMessages}
        initialValues={{
          name: serviceInfo.name,
          email: serviceInfo.email,
          headline: serviceInfo.headline,
          description: serviceInfo.description,
          website: serviceInfo.website,
          duration: 0,
          tags: '',
        }}
      >
        <Form.Item
          name={'name'}
          label="Name of Service"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name={'price'}
          label="Price"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <InputNumber
            min={0}
            step={5}
            formatter={(value) =>
              `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            }
            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
          />
        </Form.Item>
        <Form.Item label="Duration">
          <Form.Item name="duration" noStyle>
            <InputNumber min={0} max={360} step={5} />
          </Form.Item>
          <span className="ant-form-text"> minutes</span>
        </Form.Item>
        <Form.Item name={'description'} label="Description">
          <Input.TextArea />
        </Form.Item>
        <Form.Item name={'tags'} label="Tags">
          <Input />
        </Form.Item>
        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
