import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import * as jwt from 'jsonwebtoken';

const ALLOWED_EVENT_ROLES = ['USER', 'OPERATOR', 'AUDITOR', 'ADMIN'];

const routeRoleMap = [
  { method: 'POST', path: /^\/event\/events/, roles: ['OPERATOR', 'ADMIN'] },
  { method: 'POST', path: /^\/event\/rewards/, roles: ['OPERATOR', 'ADMIN'] },
  { method: 'POST', path: /^\/event\/reward-requests/, roles: ['USER'] },
  { method: 'GET',  path: /^\/event\/reward-requests/, roles: ['OPERATOR', 'ADMIN', 'AUDITOR'] },
  { method: 'PATCH', path: /^\/event\/reward-requests\/[^/]+\/status/, roles: ['OPERATOR', 'ADMIN'] },
];

@Injectable()
export class GatewayService implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (req.url.startsWith('/auth')) {
      return createProxyMiddleware({
        target: process.env.AUTH_URL ?? 'http://auth:3001',
        changeOrigin: true,
        pathRewrite: { '^/auth': '' },
      })(req, res, next);
    }

    if (req.url.startsWith('/event')) {
      const authHeader = req.headers['authorization'];
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: '인증 토큰이 필요합니다.' });
      }
      const token = authHeader.replace('Bearer ', '').trim();
      try {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET ?? 'your_jwt_secret');
        if (!ALLOWED_EVENT_ROLES.includes(decoded.role)) {
          return res.status(403).json({ message: '권한이 없습니다.' });
        }
        (req as any).user = decoded;

        const matched = routeRoleMap.find(
          rule => rule.method === req.method && rule.path.test(req.url)
        );
        if (matched && !matched.roles.includes(decoded.role)) {
          return res.status(403).json({ message: '권한이 없습니다.' });
        }
      } catch (e) {
        return res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
      }
      return createProxyMiddleware({
        target: process.env.EVENT_URL ?? 'http://event:3002',
        changeOrigin: true,
        pathRewrite: { '^/event': '' },
      })(req, res, next);
    }

    next();
  }
}