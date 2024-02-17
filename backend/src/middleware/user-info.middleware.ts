import {Injectable, NestMiddleware} from '@nestjs/common';
import {NextFunction, Request, Response} from 'express';
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class UserInfoMiddleware implements NestMiddleware {

    constructor(private jwtService: JwtService) {
    }

    use(req: Request, res: Response, next: NextFunction): void {
        const token = this.jwtService.decode(req.headers['authorization']
            .replace("Bearer", "").trim(), {json: true, complete: true});
        if (token['payload']) {
            req.user = {
                ...token['payload']
            }
        }
        next();
    }
}