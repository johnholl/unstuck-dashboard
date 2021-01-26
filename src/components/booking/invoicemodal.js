import React from 'react';
import {Modal, Form, Input, InputNumber, Row, Button, Popover, notification} from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { firestore, functions } from '../../firebase';


const layout = {
    labelCol: {
      span: 4,
    },
    wrapperCol: {
      span: 16,
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

  const captureFinalPayment = functions.httpsCallable('captureFinalPayment');


export default function InvoiceModal(props) {
    const booking = props.booking;
    const service = props.service;

    async function onFinish(values) {
      try {
      await captureFinalPayment({paymentIntent: booking.paymentIntent, price: service.price}, {})
      console.log("past capture");
      await firestore.collection('tempinvoices').doc(props.bookingId).set({user: booking.userid, service: booking.serviceid, customer: booking.customer, ...values})
      notification.open({
        message: 'Invoice sent',
        description:
          'Your invoice has been sent. You will receive an email when payment has been processed.',
          duration: 5,
      });
    }
    catch(error) {
      notification.open({
        message: 'Erorr processing invoice',
        description:
          'Try again in a few minutes',
      });}
      props.closeModal();
      
  };
    
    

    return(
        <Modal visible={props.visible} footer={props.footer} title={"Send Invoice"}
          onCancel={props.closeModal}>
            <Form
        {...layout}
        name="nest-messages"
        onFinish={onFinish}
        size={"large"}
        validateMessages={validateMessages}
        initialValues={{
          price: service.price,
          note: ""
        }}
      >
        <Form.Item
          name={'price'}
          label={<div>Price <Popover content="Adjust the price if necessary, applying any discount or additional fees (up to two times booking price)">
          <InfoCircleOutlined size="small" />
        </Popover></div>}
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
        <Form.Item name={'note'} label="Note">
          <Input.TextArea rows={6}/>
        </Form.Item>
        <Form.Item labelCol={{}} wrapperCol={{ ...layout.wrapperCol, offset: 4 }}>
          <Row>
          <Button type="primary" htmlType="submit" style={{width:'80%'}}>
            Send
          </Button>
          </Row>
        </Form.Item>
      </Form>
        </Modal>
    )



}