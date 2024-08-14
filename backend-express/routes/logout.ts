import express, { Request, Response } from 'express';
var router = express.Router();

// 使用 POST 请求进行登出
router.post('/logout', (req: Request, res: Response) => {
  if (req.session) {
    // 销毁整个会话
    req.session.destroy((err) => {
      if (err) {
        // 如果会话销毁时出现错误，返回 500 状态码
        return res.status(500).json({ success: false, message: '无法登出，请重试' });
      }
      // 清除客户端关联的 cookie
      res.clearCookie('connect.sid'); // 确保与设置会话ID的cookie名称匹配
      // 返回 204 No Content 状态码
      return res.status(204).end();
    });
  } else {
    // 如果会话已不存在，也返回 204
    return res.status(204).end();
  }
});

export default router;
