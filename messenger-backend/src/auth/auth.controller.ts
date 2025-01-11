import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, HttpException, HttpStatus, Res, NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from "express"
import { LocalGuard } from './guards/local.guard';
import { JwtAuthGuard } from './guards/jwt.guard';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Http2ServerResponse } from 'http2';
import { User } from 'src/users/entities/user.entity';
import { UserTokenUserDto } from './dto/user-token.dto';
import { UpdateUserDto } from './dto/update-user-login.dto';
import { JwtService } from '@nestjs/jwt';
import { isErrored } from 'stream';
import { plainToClass } from 'class-transformer';


@Controller('auth')
export class AuthController {

  constructor(
    // private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private jwtService: JwtService
  ) { }



  @Post("login")
  @UseGuards(LocalGuard)
  login(
    @Res({ passthrough: true }) res: any,
    @Req() req: Request
  ) {

    const user = req.user as User;

    if (!user) {
      throw new NotFoundException("User Not Found");
    }

    const payload = {
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      deletedAt: user.deletedAt,
      id: user.id,
      updatedAt: user.updatedAt
    };


    const token = this.jwtService.sign(payload);

    res.cookie('Authentication', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 3600000,
    });

    return user;
  }




  @UseGuards(JwtAuthGuard)
  @Get("status")
  status(@Req() req: Request) {
    return req.user
  }




  @Post("signup")
  async signup(@Body() createUserDto: CreateUserDto) {

    const createdUser = await this.usersService.create(createUserDto)

    return createdUser
  }
}