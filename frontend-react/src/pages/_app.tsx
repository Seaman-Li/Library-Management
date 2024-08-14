import  Layout  from "@/components/Layout";
import "@/styles/globals.css";
import { ConfigProvider, Spin } from "antd/lib";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import zhCN from "antd/locale/zh_CN";
import enUS from 'antd/lib/locale/en_US';
// import "dayjs/locale/zh-cn";
import i18n from '../../i18n'

function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const [load, setLoad] = useState(false);
  const [locale, setLocale] = useState(enUS);
  const [language, setLanguage] = useState('en');

  const switchLocale = (lang: string) => {
    if (lang === 'zh') {
      setLocale(zhCN);
    } else {
      setLocale(enUS);
    }
    i18n.changeLanguage(lang);
    setLanguage(lang);
  };
  useEffect(() => {
    setLoad(true);
  }, );
  // console.log('%c [ router ]-', 'font-size:13px; background:pink; color:#bf2c9f;', router);
  
  return (
    <>
       {load ? (
          <ConfigProvider locale={locale}>
          {router.pathname === "/login" ? (
            <Component {...pageProps} />
          ) : (
            <Layout locale={language} switchLocale={switchLocale}>
              <Component {...pageProps} />
            </Layout>
          )}
          </ConfigProvider>
        
      ) : (
        <Spin tip="Loading..." size="large"  spinning={true}/>
      )}
      {/* <ConfigProvider locale={locale}>
        <Layout locale={language} switchLocale={switchLocale}>
          <Component {...pageProps} />
        </Layout>
      </ConfigProvider> */}
    </>
  )

}
export default App;

  // router.pathname === '/login'? (
  //   <Component {...pageProps} />
  // ) : (
  //   <Layout> 
  //     <Component {...pageProps} />
  //   </Layout>);
    
  //   <Layout>
  //       <Component {...pageProps} />
  //   </Layout>