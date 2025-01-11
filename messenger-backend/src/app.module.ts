import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DATABASE } from './shared/environment';
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
      database: DATABASE.DB_NAME as string,
      host: DATABASE.DB_HOST as string,
      port: DATABASE.DB_PORT as number,
      username: DATABASE.DB_USERNAME as string,
      password: DATABASE.DB_PASSWORD as string,
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
})
export class AppModule { }
