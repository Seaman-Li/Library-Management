
import express, { Request, Response, NextFunction } from 'express';
import { User } from '../model';

const router = express.Router();

// router.post('/', async (req: Request, res: Response) => {
//     const { name, password } = req.body;
//     try {
//       const user = await User.findOne({ name, password });
//       const data = user?.toJSON();
//       delete data?.password;
  
//       (req.session as any).user = user;
  
//       return res.status(200).json({ data, success: true });
//     } catch (error) {
//       return res.status(500).json({ message: '账号密码错误' });
//     }
//   });

  router.post('/', async (req: Request, res: Response) => {
    const { name, password } = req.body;
    try {
        const user = await User.findOne({ name, password });
        if (!user) {
            return res.status(401).json({ message: '认证失败，用户名或密码错误' });
        }
        const data = user.toJSON();
        delete data.password;
        (req.session as any).user = user;
        console.log('Session ID:', req.sessionID); // 打印 Session ID
        console.log('Session Data:', req.session); // 打印 Session 数据
        return res.status(200).json({ data, success: true });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: '内部服务器错误' });
    }
});

  export default router;