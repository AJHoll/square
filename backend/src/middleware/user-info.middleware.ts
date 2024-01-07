import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class UserInfoMiddleware implements NestMiddleware {

  constructor() {
  }

  use(req: Request, res: Response, next: NextFunction): void {
    const token = req.headers['authorization'];
    if (token !== null && token !== 'null' && token !== 'Bearer null') {
      const base64Url: string = token.split(".")[1];
      const base64: string = base64Url.replace("-", "+").replace("_", "/");
      req.user = JSON.parse(decodeURIComponent(escape(atob(base64))));
    }
    next();
  }
}