import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service";
import { Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authSevice: AuthService) {
        super({
            usernameField: 'username',
            passwordField: 'password'
        })
    }

    async validate(username: string, password: string) {


        const user = await this.authSevice.validateUser({ username, password })


        if (!user) throw new UnauthorizedException()

        return user
    }
}