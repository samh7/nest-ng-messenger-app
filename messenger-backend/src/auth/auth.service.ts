import { Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from 'src/users/dto/create-user.dto';




@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,

        private jwtSerice: JwtService,

        private userService: UsersService,
    ) { }


    async validateUser(createAuthDto: LoginDto) {

        const loginUser = await this.userService.login(createAuthDto)


        return loginUser
    }


}
