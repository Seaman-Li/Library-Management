
import Head from "next/head";
import React, { useState } from 'react';
import type { MenuProps } from 'antd';
import { Layout as AntdLayout, Menu, theme, Dropdown, Space } from 'antd';
import styles from "./index.module.css"
import {DownOutlined, GlobalOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import classnames from "classnames";
import { useTranslation } from 'react-i18next';
import { useCurrentUser } from "@/utils/userHook";
const { Header, Content, Sider, Footer } = AntdLayout;

interface LayoutProps {
    children: React.ReactNode;
    switchLocale: (lang: string) => void; // 接收切换语言的函数
    locale: string; // 当前语言
  }
  
const Layout: React.FC<LayoutProps> = ({ children, switchLocale, locale }) =>{
    const router = useRouter();
    const handleMenuClick:MenuProps["onClick"] =({key})=> {
        router.push(key);
    }
    const user = useCurrentUser();//用户信息hook
    const [collapsed, setCollapsed] = useState(false);
    // console.log('%c [ router ]-', 'font-size:13px; background:pink; color:#bf2c9f;', router);
    
    const activeMenu = router.pathname;
    
    const { t, i18n } = useTranslation(); 
      
    const admin_Menu_ITEMS = [
        {
            key: 'book',
            icon: <span className={classnames("icon iconfont icon-management-books-the-book-query",styles.iconIMG)}></span>,
            label:t('BookManage'),
            children: [
                { label:t('BookList'), key:"/book" },
                { label:t('AddBook'), key:"/book/add"},
                { label:t('PhysicalBookList'), key:"/book/bookInstance" },
            ],
        },
        {
            key: 'borrow',
            icon: <span className={classnames("icon iconfont icon-jieshu",styles.iconIMG)}></span>,
            label:t('BorrowManage'),
            children: [
                { label:t('BorrowRecordManage'), key:"/borrow" },
                { label:t('AddBorrow'), key:"/borrow/add"},
            ],
        },
        {
            key: 'user',
            icon: <span className={classnames("icon iconfont icon-yonghuguanli_huaban",styles.iconIMG)}></span>,
            label:t('UserManage'),
            children: [
                { label:t('UserList'), key:"/user" },
                { label:t('AddUser'), key:"/user/add"},
            ],
        },
    ];

    const user_Menu_ITEMS = [
        {
            key: 'book',
            icon: <span className={classnames("icon iconfont icon-management-books-the-book-query", styles.iconIMG)}></span>,
            label: t('BookManage'),
            children: [
                { label: t('BookList'), key: "/book" },
                { label: t('PhysicalBookList'), key: "/book/bookInstance" },
            ],
        },
    ];

    const menu_ITEMS = user && user.role === 'admin' ? admin_Menu_ITEMS : user_Menu_ITEMS;
      
    const USER_ITEMS: MenuProps['items'] = [
        {
            label: t("userCenter"),
            key: "1",
          },
          {
            label: t("logout"),
            key: "2",
          },
      ];

    const languageItems: MenuProps['items'] = [
    {
        key: 'en',
        label: 'English',
        onClick: () => switchLocale('en'),        
    },
    {
        key: 'zh',
        label: '中文',
        onClick: () => switchLocale('zh'),
    },
    ];

    return (
     <>
            
        <Head>
            <title>图书管理系统</title>
            <meta name="description" content="Generated by create next app" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
            <link rel="stylesheet" href="/icons/iconfont.css" />      
        </Head>

        <AntdLayout>
            <Header className={styles.header}>
                <div className={styles.leftHeader}>
                    <span className={classnames("icon iconfont icon-tushuguan1",styles.logo)}></span>
                    <div className={styles.title}>{t('title')}</div>   
                </div>               
                <div className={styles.rightHeader}>
                    <Space>
                        <Dropdown menu={{items: languageItems}} trigger={['click']}>
                            <a onClick={(e) => e.preventDefault()}>
                                    Language:{locale === 'en' ? "English":"中文"}
                                    <GlobalOutlined className={styles.languageICON}/> {/* 语言切换图标 */}
                            </a>
                        </Dropdown>

                        <Dropdown menu={{ items: USER_ITEMS }}>
                            <a onClick={(e) => e.preventDefault()}>
                                <Space>
                                    {user ? user.nickname : "login"}
                                    <DownOutlined />
                                </Space>
                            </a>
                        </Dropdown>
                    </Space>
                    
                </div>
            </Header>

            <AntdLayout className={styles.sectionInner}>
                <Sider className={styles.sider} collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                    <Menu
                    mode="inline"
                    defaultSelectedKeys={['/book']}
                    defaultOpenKeys={['book']}
                    selectedKeys={[activeMenu]}
                    style={{ height: '100%', borderRight: 0 }}
                    items={menu_ITEMS}
                    onClick={handleMenuClick}
                    theme="light"
                    />
                    <div className={styles.siderTrigger}></div>
                </Sider>
                <AntdLayout className={styles.sectionContent}>
                    <Content className={styles.content}>
                    {children}
                    </Content>

                    <Footer style={{ textAlign: 'center' }}>
                        Book Management System ©{new Date().getFullYear()} Created by Simon
                    </Footer>
                </AntdLayout>
                
            </AntdLayout>
            
        </AntdLayout>

     </>
    )
}

export default Layout;

