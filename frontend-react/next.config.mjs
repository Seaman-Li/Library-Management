/** @type {import('next').NextConfig} */
// next.next.config.mjs
// import config from './next-i18next.config.js';
// const { i18n } = config;
const nextConfig = {
  reactStrictMode: true,
  // i18n,
  async rewrites() {
    return [{
      source: '/api/:path*',
      // destination: 'https://mock.apifox.cn/m1/2398938-0-default/api/:path*'
      destination: 'http://localhost:3005/api/:path*'
    }]
  },
  transpilePackages: [
    'rc-util',
    '@ant-design',
    'kitchen-flow-editor',
    '@ant-design/pro-editor',
    'zustand', 'leva', 'antd',
    'rc-pagination',
    'rc-picker'
  ],
};

export default nextConfig;
