import React, { useEffect, useState } from 'react';
import {
  Button,
  DatePicker,
  Form,
  Input,
  Select,
  Image,
  message,
  Space
} from 'antd';
import { BookTypeAdd, getBookTypeById, updateBookType } from '@/api/bookType';
import { BookType } from '@/type';
import router from 'next/router';
import styles from './index.module.css'
import dayjs from 'dayjs';
import Content from '../Content';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

const { TextArea } = Input;

export default function BookForm({ title }: { title: string }){
    const [preview, setPreview] = useState("");
    const [id, setId] = useState<string>();
    const [form] = Form.useForm();
    const isEdit = Boolean(id);//有id传入是编辑，没有是图书添加
    const [book,setBook] = useState<BookType>();
    const {t} = useTranslation();
    
    const fetchBookDetails = async (bookId: string) => {
      try {
        console.log("Fetching book details for ID:", bookId);
        const data = await getBookTypeById(bookId);  // 获取书籍信息
        console.log(data);
        setBook(data);
        console.log(book);
        if (data) {
          form.setFieldsValue({
            ...data,
            cover: data.cover as string,
            publishAt: data.publishAt ? moment(`${data.publishAt}`, 'YYYY') : null  // 确保 publishAt 是日期对象
          });
        } else {
          console.log("No data returned for book ID:", bookId);
        }
      } catch (error) {
        console.error("Failed to fetch book details:", error);
      }
    };
    
    useEffect(() => {
      const path = window.location.pathname;
      const id = path.split('/')[3]; 
      setId(id as string);
      if (id) {
        fetchBookDetails(id);
      }
    }, []);
    

  const handleFinish = async (values:BookType) => {
    const submitData:BookType = {
      ...values,
      publishAt: values.publishAt ? dayjs(values.publishAt).year() : undefined,      
    };
    try {
      if (isEdit) {
        await updateBookType(id as string, submitData);
        message.success('书籍更新成功');
      } else {
        await BookTypeAdd(submitData);
        message.success('书籍添加成功');
      }
      router.push('/book');
    } catch (error) {
      message.error('操作失败');
    }
  };
    return (
        <Content title={title}>
          {/* 书籍添加/修改 表单 */}
          <Form
            form={form}
            className={styles.form}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            layout="horizontal"
            // style={{ maxWidth: 600 }}
            onFinish={handleFinish}
          >
            {/* 书名输入框 */}
            <Form.Item 
                label= {t('bookName')}
                name="name" 
                rules={[
                    {
                      required: true, message:"请输入名称"
                    },
                ]}
            >
              <Input placeholder={t('Input')}/>
            </Form.Item>

            {/* 作者输入框 */}
            <Form.Item 
                label={t('authorName')}
                name="author" 
                rules={[
                    {
                        required: true, message:"请输入作者"
                    },
                ]}
            >
              <Input placeholder={t('Input')}/>
            </Form.Item>

            {/* 书籍分类选择器 */}
            <Form.Item 
                label={t('category')} 
                name="category" 
                rules={[
                    {
                        required: true, message:"请输入分类"
                    },
                ]}
            >
             <Input placeholder={t('Input')}/>
            </Form.Item>

            {/* 书籍封面输入框 */}
            <Form.Item label={t('cover')} name="cover" >
              <Input.Group compact>
                <Input 
                    id="cover"
                    placeholder={t('Input')} 
                    style={{width:"calc(100% - 90px)"}}
                    value={form.getFieldValue('cover')}
                    onChange={(e)=>{
                        // console.log('%c [ e ]-', 'font-size:13px; background:pink; color:#bf2c9f;', e);
                        form.setFieldValue("cover", e.target.value);                    
                    }}
                />
                <Button 
                    type='primary'
                    onClick={(e)=>{
                        setPreview(form.getFieldValue("cover"));
                    }}
                >
                    {t('preview')}
                </Button>
              </Input.Group>
            </Form.Item>
            {preview && (
              <Image src={preview} width={100} height={100}  alt='img loading fail'></Image>
            )}

            <Form.Item label={t('publishYear')} name="publishAt">
              {/* <Input placeholder='请输入'/> */}
              <DatePicker picker="year" placeholder={t('YearSelector')} format="YYYY" />
            </Form.Item>
            {/* <Form.Item label="库存" name="stock">
              <Input placeholder='请输入'/>
            </Form.Item> */}
            <Form.Item label={t('description')} name="description">
              <TextArea rows={4} placeholder={t('Input')}/>
            </Form.Item>
            <Form.Item label="" colon={false}>
              <Button size='large' type='primary' htmlType='submit' className={styles.btn}>{t('submit')}</Button>
            </Form.Item>
            
          </Form>
        </Content>
      );
}

