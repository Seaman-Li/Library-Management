import React, { useEffect, useState } from 'react';
import {
  Button,
  Form,
  Input,
  Select,
  message
} from 'antd';
import { BookInstance, BookType } from '@/type';
import router from 'next/router';
import styles from './index.module.css'
import Content from '../Content';
import { updateBookInstance } from '@/api/bookInstance';
import { useTranslation } from 'react-i18next';


export default function BookForm({ title }: { title: string }){
    const {t} = useTranslation();
    const [id, setId] = useState<string>();
    const [form] = Form.useForm();
    const handleFinish = async (values: BookInstance) =>{
      const submitData:BookInstance = {
        ...values,
      };
      await updateBookInstance(id as string,submitData)
      message.success("修改成功");
      router.push("/book/bookInstance");
    };

    useEffect(() => {
      const path = window.location.pathname;
      const id = path.split('/')[4]; 
      setId(id as string);
    }, [])


    return (
        <Content title={title}>
          {/* bookInstance修改表单 */}
          <Form
            form={form}
            className={styles.form}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            layout="horizontal"
            // style={{ maxWidth: 600 }}
            onFinish={handleFinish}
          >
            <Form.Item label={t('borrowStatus')} name="isBorrowed">
              <Select>
                <Select.Option value={true}>{t('borrowed')}</Select.Option>
                <Select.Option value={false}>{t('notBorrowed')}</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="" colon={false}>
              <Button size='large' type='primary' htmlType='submit' className={styles.btn}>{t('submit')}</Button>
            </Form.Item>
            
          </Form>
        </Content>
      );
}





