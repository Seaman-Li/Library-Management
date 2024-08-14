import { Button, Col, Form, Input, Row, Select, Space, Table, Tooltip, TablePaginationConfig, Image, message, Modal, Alert } from "antd/lib";
import { Inter } from "next/font/google";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import styles from "./index.module.css"
import { bookDelete, } from "@/api/bookType";
import dayjs from "dayjs";
import Content from "@/components/Content";
import { getBookInstancesList } from "@/api/bookInstance";
import { BookInstanceQuery } from "@/type/bookInstance";
import { useTranslation } from "react-i18next";

export default function BookInstance() {
  const [form] = Form.useForm();
  const router = useRouter();
  const [data, setData] = useState([]);
  const {t} = useTranslation();
  const [total, setTotal] = useState(0);
  const [searchParams, setSearchParams] = useState<BookInstanceQuery>({});
  const [pagination, setPagination] = useState<TablePaginationConfig>({
  current:1,
  pageSize:20,
  total:0,
  showSizeChanger:true,
})

  const fetchData = useCallback(async (search: BookInstanceQuery = {}) => {
    const query = {
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...search,
    };
    try {
      const res = await getBookInstancesList(query);
      setData(res.data);
      setPagination(prev => ({ ...prev, total: res.total }));
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  }, [pagination.current, pagination.pageSize]); // 依赖 pagination 的 current 和 pageSize

  // 监听 searchParams 和 pagination 的变化来触发数据重新获取
useEffect(() => {
  fetchData(searchParams);
}, [searchParams, pagination.current, pagination.pageSize, fetchData]);

const handleSearchReset = () => {
  form.resetFields();
  setSearchParams({});
  setPagination(prev => ({ ...prev, current: 1 })); // 重置到第一页
};

const handleSearchFinish = async (values: BookInstanceQuery) => {
  setSearchParams(values);
  setPagination(prev => ({ ...prev, current: 1 })); // 重置到第一页
};
const handleTableChange = (newPagination: TablePaginationConfig) => {
  console.log('Table change initiated');
  setPagination(newPagination);
};

  const handleBookEdit =(id: string)=>{
    router.push(`/book/bookInstance/edit/${id}`);
  };

  // 待开发
  const handleBookDelete = async(id:string)=>{
    Modal.confirm({
      title: '确认删除这条记录吗？',
      content: '删除操作不可恢复，确认要继续吗？',
      onOk: async () => {
        // try {
        //   await bookDelete(id); // 假设 deleteBook 是调用API删除书籍的函数
        //   message.success('删除成功');
        //   fetchData(); // 重新获取最新的数据列表
        // } catch (error) {
        //   console.error('删除失败:', error);
        //   message.error('删除失败，请重试');
        // }
      },
    });
  };

  const COLUMNS = [
    {
      title:'id',
      dataIndex:'_id',
      key:'_id',
      width:250
    },
    {
      title: t('bookName'),
      dataIndex: 'bookTypeID',
      key: 'name',
      width: 220,
      render: (bookTypeID: { _id: string, name: string }) => bookTypeID.name
    },
    {
      title: t('borrowStatus'),
      dataIndex: 'isBorrowed',
      key: 'isBorrowed',
      width: 145,
      render: (isBorrowed: boolean) => {
        if (isBorrowed) {
          return <Alert message={t('borrowed')} type="error"  className={styles.alert}/>;
        } else {
          return <Alert message={t('notBorrowed')} type="success"  className={styles.alert}/>;
        }
      }
    },
    {
      title: t('createDate'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 130,
      render: (text: string) => dayjs(text).format('YYYY-MM-DD')
    },
  ];
  const columns = [...COLUMNS,
  {
      title:t('options'), key:"action", render: (_: any, row: any )=>{
        return <Space>
            <Button type="link" onClick={()=>handleBookEdit(row._id)}>{t('Edit')}</Button>
            <Button type="link" danger onClick={()=>handleBookDelete(row._id)}>{t('Delete')}</Button>
        </Space>
    }
  }
  ]

  return (
    <Content 
      title={t('PhysicalBookList')}
    >
      {/* 搜索栏 */}
      <Form
      name="search"
      form={form}
      // layout="inline"
      onFinish={handleSearchFinish}
      initialValues={{
          name:'',
          author:'',
          category:'',
      }}
      >
        <Row gutter={24}>
          <Col span={5}>
            <Form.Item name="_id" label="id">
              <Input placeholder={t('Input')} allowClear/>
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item name="bookName" label={t('bookName')}>
              <Input placeholder={t('Input')} allowClear/>
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item name="isBorrowed" label={t('borrowStatus')}>
              <Select placeholder={t('Selector')} allowClear showSearch>
                <Select.Option value={true}>{t('borrowed')}</Select.Option>
                <Select.Option value={false}>{t('notBorrowed')}</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          
          <Col span={9}>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit" className={styles.button}>
                  {t('search')}
                </Button>
                <Button onClick={handleSearchReset} className={styles.button}>
                  {t('clear')}
                </Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      {/* 显示图书数据 */}
      <div className={styles.tableWrap}>
        <Table
          dataSource={data}
          columns={columns}
          scroll={{ x: 1000, y:500 }}
          onChange={handleTableChange}
          pagination={{ ...pagination, showTotal: () => t('totalItems', { count: pagination.total }) }}
        />
      </div>
    </Content>
    
  );
}
