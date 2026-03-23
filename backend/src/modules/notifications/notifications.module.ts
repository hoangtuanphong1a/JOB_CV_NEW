import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { NotificationsGateway } from './notifications.gateway';
import { EmailService } from './email.service';
import { Notification } from '../common/entities/notification.entity';
import { User } from '../common/entities/user.entity';
import { Role } from '../common/entities/role.entity';
import { UserRole } from '../common/entities/user-role.entity';
import { UsersService } from '../users/users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification, User, Role, UserRole]),
    ConfigModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
    NotificationsGateway,
    EmailService,
    UsersService,
  ],
  exports: [NotificationsService, NotificationsGateway, EmailService],
})
export class NotificationsModule {}
