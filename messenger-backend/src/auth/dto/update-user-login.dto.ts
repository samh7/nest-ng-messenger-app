import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { IsEmpty, IsEnum, IsNotEmpty, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';



export class UpdateUserDto extends PartialType(CreateUserDto) {
}
