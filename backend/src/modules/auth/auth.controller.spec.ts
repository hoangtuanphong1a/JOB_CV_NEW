import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../common/entities/user.entity';
import { Role } from '../common/entities/role.entity';
import { UserRole } from '../common/entities/user-role.entity';
import { AuthModule } from './auth.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  const mockUserRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockRoleRepository = {
    findOne: jest.fn(),
  };

  const mockUserRoleRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    })
      .overrideProvider(getRepositoryToken(User))
      .useValue(mockUserRepository)
      .overrideProvider(getRepositoryToken(Role))
      .useValue(mockRoleRepository)
      .overrideProvider(getRepositoryToken(UserRole))
      .useValue(mockUserRoleRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/register (POST) - should register a user', () => {
    const registerDto = {
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
    };

    return request(app.getHttpServer())
      .post('/auth/register')
      .send(registerDto)
      .expect(201);
  });

  it('/auth/login (POST) - should login a user', () => {
    const loginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    return request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
