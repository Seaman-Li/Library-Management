import { Button, Col, Form, Input, Row, Select, Space, Table, Tooltip, TablePaginationConfig, Image, message, Modal } from "antd/lib";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import styles from "./index.module.css"
import { bookDelete, getBookList, getCategories } from "@/api/bookType";
import { BookQueryType, BookType } from "@/type/bookType";
import dayjs from "dayjs";
import Content from "@/components/Content";
import { useTranslation } from "react-i18next";



export default function Book() {
  const { t, i18n } = useTranslation();
  const [form] = Form.useForm();
  const router = useRouter();
  const [data, setData] = useState<BookType []>([]);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState<string[]>([]);
  const [searchParams, setSearchParams] = useState<BookQueryType>({});
  const [pagination, setPagination] = useState<TablePaginationConfig>({
  current:1,
  pageSize:20,
  total:0,
  showSizeChanger:true,
})

  const fetchData = useCallback(async (search: BookQueryType = {}) => {
    const query = {
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...search,
    };
    try {
      const res = await getBookList(query);
      // console.log(res)
      setData(res.data);
      const categoryRes =  await getCategories();
      // console.log(categoryRes,'+',categoryRes.data)
      setCategories(categoryRes.data);
      setPagination(prev => ({ ...prev, total: res.total }));
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  }, [pagination.current, pagination.pageSize]); // 依赖 pagination 的 current 和 pageSize

  // 监听 searchParams 和 pagination 的变化来触发数据重新获取
  useEffect(() => {
    fetchData(searchParams);
    // console.log(categories)
  }, [searchParams, pagination.current, pagination.pageSize, fetchData]);

  const handleSearchReset = () => {
    form.resetFields();
    setSearchParams({});
    setPagination(prev => ({ ...prev, current: 1 })); // 重置到第一页
    // fetchData({}); // 用空的搜索参数调用 fetchData
  };

  const handleSearchFinish = async (values: BookQueryType) => {
    setSearchParams(values);
    setPagination(prev => ({ ...prev, current: 1 })); // 重置到第一页
    // fetchData(values);
  };
  const handleTableChange = (newPagination: TablePaginationConfig) => {
    console.log('Table change initiated');
    setPagination(newPagination);
    // fetchData(searchParams); // 使用当前搜索参数和新的分页信息
  };

  const handleBookEdit =(id: string)=>{
    router.push(`/book/edit/${id}`);
  };
  const handleBookDelete = async(id:string)=>{
    Modal.confirm({
      title: '确认删除这条记录吗？',
      content: '删除操作不可恢复，确认要继续吗？',
      onOk: async () => {
        try {
          await bookDelete(id); // 假设 deleteBook 是调用API删除书籍的函数
          message.success('删除成功');
          fetchData(); // 重新获取最新的数据列表
        } catch (error) {
          console.error('删除失败:', error);
          message.error('删除失败，请重试');
        }
      },
    });
  };

  const handleAddBookInstance = (bookType: BookType) => {
    console.log(bookType);
    Modal.confirm({
      title: '确认添加藏书?',
      content: `您正在添加 "${bookType.name}" 的藏书。库存将增加。`,
      onOk() {
        // return new Promise(async (resolve, reject) => {
        //   try {
        //     // 假设 `updateStockAndAddBookInstance` 是调用 API 的函数
        //     await updateStockAndAddBookInstance(bookType._id);
        //     message.success('成功添加藏书并更新库存!');
        //     resolve();
        //   } catch (error) {
        //     message.error('添加失败: ' + error.message);
        //     reject(error);
        //   }
        // });
      }
    });
  };

  const COLUMNS = [
    {
      title: t('bookName'),
      dataIndex: 'name',
      key: 'name',
      width: 180
    },
    {
      title: t('cover'),
      dataIndex: 'cover',
      key: 'cover',
      width: 100,
      render: (text: string) => {
        return <Image
          width={50}
          src={text}
          alt=""
        />
      }
    },
    {
      title: t('authorName'),
      dataIndex: 'author',
      key: 'author',
      width: 120
    },
    {
      title: t('category'),
      dataIndex: 'category',
      key: 'category',
      width: 120
    },
    {
      title: t('description'),
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      width: 200,
      render: (text: string) => {
        // 当用户将鼠标悬停在描述文本上时，会显示完整的描述内容。placement: Tooltip 的显示位置
        return <Tooltip title={text} placement="topLeft">
          {text}
        </Tooltip>
      }
    },
    {
      title: t('stock'),
      dataIndex: 'stock',
      key: 'stock',
      width: 86
    },
    {
      title: t('numForBorrowing'),
      dataIndex: 'availableCount',
      key: 'availableCount',
      width: 92
    },
    {
      title: t('publishYear'),
      dataIndex: 'publishAt',
      key: 'publishAt',
      width: 90,
      // render: (text: string) => dayjs(text).format('YYYY-MM-DD')
    },
  ];
  const columns = [...COLUMNS,
  {
      title:t('options'), key:"action", render: (_: any, row: BookType )=>{
        return <Space>
            <Button type="link" onClick={()=>handleBookEdit(row._id as string)}>{t('Edit')}</Button>
            <Button type="link" onClick={() => handleAddBookInstance(row)}>{t('Add')}</Button>
            {/* 待开发 */}
            <Button type="link" >{t('Borrow')}</Button>
            <Button type="link" danger onClick={()=>handleBookDelete(row._id as string)}>{t('Delete')}</Button>
        </Space>
    }
  }
  ]


  return (
    <Content 
      title= {t('BookList')}
      operation={
        <Button 
          onClick={()=>{
          router.push("/book/add")
          }}
          type="primary"
        >
          {t('AddBook')}
        </Button>
      }
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
            <Form.Item name="name" label={t('bookName')}>
              <Input placeholder={t('Input')} allowClear/>
            </Form.Item>
          </Col>
          
          <Col span={5}>
            <Form.Item name="author" label={t('authorName')}>
              <Input placeholder={t('Input')} allowClear/>
            </Form.Item>
          </Col>
          
          <Col span={5}>
            <Form.Item name="category" label={t('category')}>
              <Select placeholder={t('Selector')} allowClear showSearch>
                {categories.map((category) => (
                <Select.Option key={category} value={category}>
                {category}
                </Select.Option>
                ))}
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
          pagination={{ ...pagination, showTotal: () => t('totalItems', { count: pagination.total }),
          }}
        />
      </div>
    </Content>
    
  );
}
