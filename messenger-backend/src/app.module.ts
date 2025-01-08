import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DATABASE } from './shared/environment';
import { UsersModule } from './users/users.module';
import { MessagesModule } from './messages/messages.module';
import { EventsModule } from './events/events.module';
import path from 'path';

@Module({
  imports: [
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
    UsersModule,
    MessagesModule,
    EventsModule,
  ],
})
export class AppModule { }
