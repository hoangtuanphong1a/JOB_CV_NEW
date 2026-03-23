import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ScheduleModule } from '@nestjs/schedule';
import { MulterModule } from '@nestjs/platform-express';
import { join } from 'path';
import { diskStorage } from 'multer';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { JobsModule } from './modules/jobs/jobs.module';
import { JobseekerModule } from './modules/jobseeker/jobseeker.module';
import { ApplicationsModule } from './modules/applications/applications.module';
import { CvModule } from './modules/cv/cv.module';
import { UsersModule } from './modules/users/users.module';
import { SavedJobsModule } from './modules/saved-jobs/saved-jobs.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { MessagingModule } from './modules/messaging/messaging.module';
import { BlogModule } from './modules/blog/blog.module';
import { JobCategoriesModule } from './modules/job-categories/job-categories.module';
import { UploadModule } from './modules/upload/upload.module';
import { SkillsModule } from './modules/skills/skills.module';
import { AdminModule } from './modules/admin/admin.module';
import { EmployerModule } from './modules/employer/employer.module';
import { HRModule } from './modules/hr/hr.module';
import { HRCompanyRelationshipModule } from './modules/hr-company-relationship/hr-company-relationship.module';
import { User } from './modules/common/entities/user.entity';
import { Role } from './modules/common/entities/role.entity';
import { UserRole } from './modules/common/entities/user-role.entity';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { RolesGuard } from './modules/common/guards/roles.guard';

@Module({
  imports: [
    // Configuration module
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Database configuration
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [join(__dirname, '**', '*.entity{.ts,.js}')],
      synchronize: false, // Disabled for production stability
      logging: process.env.NODE_ENV === 'development',

      // Connection pooling configuration
      extra: {
        connectionLimit: 10,
        acquireTimeout: 60000,
        timeout: 60000,
        connectTimeout: 60000,
        // Handle connection drops
        reconnect: true,
        // Keep alive
        keepAliveInitialDelay: 0,
        enableKeepAlive: true,
      },

      // Connection retry configuration
      retryAttempts: 3,
      retryDelay: 3000,

      // Enable multiple statements
      multipleStatements: false,

      // Handle timezone
      timezone: 'Z',
    }),

    // JWT configuration
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'your-secret-key',
    }),

    // Passport configuration
    PassportModule.register({ defaultStrategy: 'jwt' }),

    // Schedule configuration for cron jobs
    ScheduleModule.forRoot(),

    // File upload configuration
    MulterModule.register({
      dest: process.env.UPLOAD_DEST || 'uploads',
      storage: diskStorage({
        destination: (req, file, cb) => {
          cb(null, process.env.UPLOAD_DEST || 'uploads');
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(
            null,
            file.fieldname +
              '-' +
              uniqueSuffix +
              '.' +
              file.mimetype.split('/')[1],
          );
        },
      }),
      limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880'), // 5MB
      },
    }),

    // TypeORM repositories for AppService
    TypeOrmModule.forFeature([User, Role, UserRole]),

    // Application modules
    AuthModule,
    CompaniesModule,
    JobsModule,
    JobCategoriesModule,
    UploadModule,
    SkillsModule,
    JobseekerModule,
    ApplicationsModule,
    CvModule,
    UsersModule,
    SavedJobsModule,
    SubscriptionsModule,
    NotificationsModule,
    MessagingModule,
    BlogModule,
    AdminModule,
    EmployerModule,
    HRModule,
    HRCompanyRelationshipModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
