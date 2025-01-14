import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { MessagesModule } from './messages/messages.module';
import { EventsModule } from './events/events.module';
import path from 'path';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRoot({
      type: "mysql",
      database: process.env.DATABASE,
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      entities: [__dirname + '**/*.entity{.ts,.js}'],
      // entities: [path.join(__dirname, "./entity/*.{js,ts}")],
      synchronize: false,
      autoLoadEntities: true,
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      signOptions: {
        // 32days
        expiresIn: "768h"
      }
    }),
    UsersModule,
    MessagesModule,
    EventsModule,
    AuthModule
  ],
  providers: [],
})
export class AppModule { }
