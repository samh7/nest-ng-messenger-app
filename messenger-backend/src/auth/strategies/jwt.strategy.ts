import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
    constructor(private configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req) => req?.cookies?.Authentication

            ]),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_ACCESS_TOKEN_SECRET,
        });
    }

    async validate(payload: any) {
        // console.log(payload)
        return payload;
    }
}
