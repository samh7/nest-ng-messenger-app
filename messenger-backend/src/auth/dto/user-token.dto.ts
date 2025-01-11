import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
export class UserTokenUserDto {
    @IsNotEmpty()
    user: User

    @IsString()
    @IsNotEmpty()
    token: string;
}
