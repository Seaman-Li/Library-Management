
import { Inter } from "next/font/google";
import { useRouter } from "next/router";
import styles from "./index.module.css"
import Head from "next/head";
import Image from "next/image";
import { Button, Form, Input, message } from "antd/lib";
import request from "@/utils/request";
import classnames from "classnames";
import { UserLoginType } from "@/type";

export default function Login() {
  const router = useRouter();
  const onFinish = async (values: UserLoginType) => {
    try {
      const res = await request.post("/api/login", values);
      console.log("%c [ res ]-17","font-size:13px; background:pink; color:#bf2c9f;",res);
      localStorage.setItem("user", JSON.stringify(res.data));
      message.success("登陆成功");

      router.push("/book");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Head>
        <title>登录</title>
        <meta name="description" content="图书管理系统" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="/icons/iconfont.css" />      
      </Head>
      <main className={styles.main}>
        <header className={styles.header}>
          <span className={classnames("icon iconfont icon-ditu-tushuguan",styles.img)}
          ></span>
          图书管理系统
        </header>
        <div className={styles.form}>
          <Form
            name="basic"
            initialValues={{ name: "", password: "" }}
            layout="vertical"
            autoComplete="off"
            size="large"
            onFinish={onFinish}
          >
            <Form.Item
              name="name"
              label={<span className={styles.label}>账号</span>}
              rules={[{ required: true, message: "请输入用户名" }]}
            >
              <Input placeholder="请输入用户名" />
            </Form.Item>
            <Form.Item
              name="password"
              label={<span className={styles.label}>密码</span>}
              rules={[{ required: true, message: "请输入密码" }]}
            >
              <Input.Password placeholder="请输入密码" />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                className={classnames(styles.btn, styles.loginBtn)}
                size="large"
              >
                登陆
              </Button>
            </Form.Item>
          </Form>
        </div>
      </main>
    </>
  );
}
