# CVKing Testing Strategy

## Overview

This document outlines the comprehensive testing strategy for the CVKing job portal application. The testing approach covers unit testing, integration testing, end-to-end testing, and performance testing to ensure code quality, reliability, and maintainability.

## Testing Pyramid

```
                    E2E Tests
                   (User Workflows)
                        /\
                       /  \
                      /    \
                     /      \
                    /        \
                   /          \
                  /            \
                 /              \
                /                \
               /                  \
              /                    \
             /                      \
            /                        \
           /                          \
          /                            \
         /                              \
        /                                \
       /                                  \
      /                                    \
     /                                      \
    /                                        \
   /                                          \
  /                                            \
 /                                              \
/________________________________________________\
           Integration Tests           Unit Tests
        (API & Database)              (Components)
```

## Testing Frameworks and Tools

### Backend Testing (NestJS)

#### Unit Testing
- **Framework**: Jest
- **Test Runner**: Jest CLI
- **Coverage**: Jest with Istanbul
- **Mocking**: Jest built-in mocking
- **Assertions**: Jest expect

#### Integration Testing
- **Framework**: Jest with Supertest
- **Database**: In-memory SQLite for tests
- **Test Database**: Separate test database instance
- **Fixtures**: Custom fixture system

#### E2E Testing
- **Framework**: Jest with Supertest
- **Database**: Test database with migrations
- **Seeding**: Test data seeding
- **Cleanup**: Automatic cleanup after tests

### Frontend Testing (Next.js)

#### Unit Testing
- **Framework**: Jest
- **Renderer**: React Testing Library
- **Mocking**: Jest built-in mocking
- **Coverage**: Jest with Istanbul

#### Integration Testing
- **Framework**: Jest with React Testing Library
- **API Mocking**: MSW (Mock Service Worker)
- **State Management**: Mock Redux/Context

#### E2E Testing
- **Framework**: Playwright
- **Browser Support**: Chromium, Firefox, WebKit
- **Cross-platform**: Windows, macOS, Linux

## Test Structure and Organization

### Backend Test Structure

```
backend/
├── src/
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.spec.ts
│   │   │   ├── auth.service.spec.ts
│   │   │   └── __tests__/
│   │   │       ├── auth.controller.test.ts
│   │   │       └── auth.service.test.ts
│   │   ├── jobs/
│   │   │   ├── jobs.controller.spec.ts
│   │   │   ├── jobs.service.spec.ts
│   │   │   └── __tests__/
│   │   │       ├── jobs.controller.test.ts
│   │   │       └── jobs.service.test.ts
│   │   └── ...
│   ├── common/
│   │   ├── decorators/
│   │   │   └── roles.decorator.spec.ts
│   │   ├── guards/
│   │   │   └── jwt.guard.spec.ts
│   │   └── middleware/
│   │       └── logging.middleware.spec.ts
│   └── entities/
│       ├── user.entity.spec.ts
│       ├── job.entity.spec.ts
│       └── ...
├── test/
│   ├── app.e2e-spec.ts
│   ├── test-db-connection.js
│   ├── test-entities.js
│   ├── comprehensive-test.js
│   └── fixtures/
│       ├── users.fixture.ts
│       ├── jobs.fixture.ts
│       └── companies.fixture.ts
└── jest.config.js
```

### Frontend Test Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Header/
│   │   │   ├── Header.test.tsx
│   │   │   └── __tests__/
│   │   │       └── Header.integration.test.tsx
│   │   ├── JobList/
│   │   │   ├── JobList.test.tsx
│   │   │   └── __tests__/
│   │   │       └── JobList.integration.test.tsx
│   │   └── ...
│   ├── services/
│   │   ├── authService.test.ts
│   │   ├── jobService.test.ts
│   │   └── ...
│   ├── pages/
│   │   ├── jobs/
│   │   │   └── __tests__/
│   │   │       └── jobs.page.test.tsx
│   │   └── ...
│   └── utils/
│       ├── validators.test.ts
│       ├── formatters.test.ts
│       └── ...
├── __tests__/
│   ├── e2e/
│   │   ├── auth.e2e.test.ts
│   │   ├── job-search.e2e.test.ts
│   │   └── application-flow.e2e.test.ts
│   ├── integration/
│   │   ├── api.integration.test.ts
│   │   └── component.integration.test.ts
│   └── utils/
│       ├── test-helpers.ts
│       └── mock-data.ts
├── playwright.config.ts
└── jest.config.js
```

## Test Categories

### 1. Unit Tests

#### Backend Unit Tests

**Controller Tests**
```typescript
// backend/src/modules/auth/auth.controller.spec.ts
describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
            refreshToken: jest.fn(),
            getProfile: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should register a user', async () => {
      const registerDto = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      };
      const result = { id: 'uuid', email: 'test@example.com' };

      jest.spyOn(service, 'register').mockResolvedValue(result as any);

      expect(await controller.register(registerDto)).toBe(result);
      expect(service.register).toHaveBeenCalledWith(registerDto);
    });
  });
});
```

**Service Tests**
```typescript
// backend/src/modules/jobs/jobs.service.spec.ts
describe('JobsService', () => {
  let service: JobsService;
  let repository: Repository<Job>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        JobsService,
        {
          provide: getRepositoryToken(Job),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<JobsService>(JobsService);
    repository = module.get<Repository<Job>>(getRepositoryToken(Job));
  });

  describe('create', () => {
    it('should create a job', async () => {
      const createJobDto = {
        title: 'Test Job',
        description: 'Test Description',
        companyId: 'company-uuid',
      };
      const result = { id: 'job-uuid', ...createJobDto };

      jest.spyOn(repository, 'save').mockResolvedValue(result as Job);

      expect(await service.create(createJobDto)).toBe(result);
      expect(repository.save).toHaveBeenCalledWith(createJobDto);
    });
  });
});
```

**Entity Tests**
```typescript
// backend/src/entities/user.entity.spec.ts
describe('User Entity', () => {
  let user: User;

  beforeEach(() => {
    user = new User();
    user.id = 'uuid';
    user.email = 'test@example.com';
    user.firstName = 'John';
    user.lastName = 'Doe';
    user.password = 'hashed-password';
  });

  it('should be defined', () => {
    expect(user).toBeDefined();
  });

  it('should have correct properties', () => {
    expect(user.email).toBe('test@example.com');
    expect(user.firstName).toBe('John');
    expect(user.lastName).toBe('Doe');
  });

  it('should generate full name correctly', () => {
    expect(user.getFullName()).toBe('John Doe');
  });
});
```

#### Frontend Unit Tests

**Component Tests**
```typescript
// frontend/src/components/Header/Header.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../contexts/AuthContext';
import Header from './Header';

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {component}
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Header Component', () => {
  it('renders header with logo', () => {
    renderWithProviders(<Header />);
    expect(screen.getByAltText('CVKing Logo')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    renderWithProviders(<Header />);
    expect(screen.getByText('Jobs')).toBeInTheDocument();
    expect(screen.getByText('Companies')).toBeInTheDocument();
    expect(screen.getByText('Blog')).toBeInTheDocument();
  });

  it('toggles mobile menu on button click', () => {
    renderWithProviders(<Header />);
    const menuButton = screen.getByLabelText('Toggle menu');
    const mobileMenu = screen.getByRole('navigation');

    expect(mobileMenu).toHaveClass('hidden');

    fireEvent.click(menuButton);
    expect(mobileMenu).not.toHaveClass('hidden');

    fireEvent.click(menuButton);
    expect(mobileMenu).toHaveClass('hidden');
  });
});
```

**Service Tests**
```typescript
// frontend/src/services/authService.test.ts
import axios from 'axios';
import { authService } from './authService';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should login successfully', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123',
      };
      const mockResponse = {
        data: {
          user: { id: 'uuid', email: 'test@example.com' },
          token: 'jwt-token',
        },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await authService.login(loginData);

      expect(mockedAxios.post).toHaveBeenCalledWith('/auth/login', loginData);
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle login error', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrong-password',
      };

      mockedAxios.post.mockRejectedValue(new Error('Invalid credentials'));

      await expect(authService.login(loginData)).rejects.toThrow('Invalid credentials');
    });
  });
});
```

### 2. Integration Tests

#### Backend Integration Tests

**API Integration Tests**
```typescript
// backend/test/integration/api-integration.test.ts
describe('API Integration Tests', () => {
  let app: INestApplication;
  let httpServer: any;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    httpServer = app.getHttpServer();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Auth Endpoints', () => {
    it('should register a new user', async () => {
      const registerData = {
        email: 'integration@example.com',
        password: 'password123',
        firstName: 'Integration',
        lastName: 'Test',
      };

      const response = await request(httpServer)
        .post('/auth/register')
        .send(registerData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(registerData.email);
      expect(response.body.data.token).toBeDefined();
    });

    it('should login with valid credentials', async () => {
      const loginData = {
        email: 'integration@example.com',
        password: 'password123',
      };

      const response = await request(httpServer)
        .post('/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.token).toBeDefined();
    });
  });

  describe('Jobs Endpoints', () => {
    let authToken: string;

    beforeAll(async () => {
      const loginResponse = await request(httpServer)
        .post('/auth/login')
        .send({
          email: 'integration@example.com',
          password: 'password123',
        });

      authToken = loginResponse.body.data.token;
    });

    it('should create a job', async () => {
      const jobData = {
        title: 'Integration Test Job',
        description: 'Test job description',
        companyId: 'company-uuid',
      };

      const response = await request(httpServer)
        .post('/jobs')
        .set('Authorization', `Bearer ${authToken}`)
        .send(jobData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(jobData.title);
    });
  });
});
```

**Database Integration Tests**
```typescript
// backend/test/integration/database-integration.test.ts
describe('Database Integration Tests', () => {
  let dataSource: DataSource;

  beforeAll(async () => {
    dataSource = new DataSource({
      type: 'sqlite',
      database: ':memory:',
      entities: [User, Job, Company, Application],
      synchronize: true,
      logging: false,
    });

    await dataSource.initialize();
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  describe('User Repository', () => {
    it('should create and find a user', async () => {
      const userRepository = dataSource.getRepository(User);

      const userData = {
        email: 'db-test@example.com',
        password: 'hashed-password',
        firstName: 'DB',
        lastName: 'Test',
      };

      const user = userRepository.create(userData);
      const savedUser = await userRepository.save(user);

      expect(savedUser.id).toBeDefined();
      expect(savedUser.email).toBe(userData.email);

      const foundUser = await userRepository.findOneBy({ id: savedUser.id });
      expect(foundUser).toBeDefined();
      expect(foundUser.email).toBe(userData.email);
    });
  });

  describe('Job-User Relationship', () => {
    it('should create job with user relationship', async () => {
      const userRepository = dataSource.getRepository(User);
      const jobRepository = dataSource.getRepository(Job);

      const user = userRepository.create({
        email: 'relationship-test@example.com',
        password: 'hashed-password',
        firstName: 'Relationship',
        lastName: 'Test',
      });
      const savedUser = await userRepository.save(user);

      const job = jobRepository.create({
        title: 'Relationship Test Job',
        description: 'Test job with user relationship',
        postedBy: savedUser,
      });
      const savedJob = await jobRepository.save(job);

      const foundJob = await jobRepository.findOne({
        where: { id: savedJob.id },
        relations: ['postedBy'],
      });

      expect(foundJob).toBeDefined();
      expect(foundJob.postedBy.id).toBe(savedUser.id);
      expect(foundJob.postedBy.email).toBe(savedUser.email);
    });
  });
});
```

#### Frontend Integration Tests

**Component Integration Tests**
```typescript
// frontend/src/components/JobList/__tests__/JobList.integration.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../../../contexts/AuthContext';
import JobList from '../JobList';
import * as jobService from '../../../services/jobService';

jest.mock('../../../services/jobService');

const mockJobs = [
  {
    id: 'job-1',
    title: 'Test Job 1',
    company: { name: 'Test Company 1' },
    city: 'Hanoi',
    salary: '1000-2000',
  },
  {
    id: 'job-2',
    title: 'Test Job 2',
    company: { name: 'Test Company 2' },
    city: 'Ho Chi Minh',
    salary: '1500-2500',
  },
];

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {component}
      </AuthProvider>
    </QueryClientProvider>
  );
};

describe('JobList Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch and display jobs', async () => {
    (jobService.getJobs as jest.Mock).mockResolvedValue({ data: mockJobs });

    renderWithProviders(<JobList />);

    await waitFor(() => {
      expect(screen.getByText('Test Job 1')).toBeInTheDocument();
      expect(screen.getByText('Test Job 2')).toBeInTheDocument();
      expect(screen.getByText('Test Company 1')).toBeInTheDocument();
      expect(screen.getByText('Test Company 2')).toBeInTheDocument();
    });
  });

  it('should handle loading state', () => {
    (jobService.getJobs as jest.Mock).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({ data: mockJobs }), 100))
    );

    renderWithProviders(<JobList />);

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('should handle error state', async () => {
    (jobService.getJobs as jest.Mock).mockRejectedValue(new Error('API Error'));

    renderWithProviders(<JobList />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load jobs')).toBeInTheDocument();
    });
  });
});
```

**API Integration Tests**
```typescript
// frontend/__tests__/integration/api.integration.test.ts
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { jobService } from '../../src/services/jobService';

const server = setupServer(
  rest.get('/api/v1/jobs', (req, res, ctx) => {
    return res(
      ctx.json({
        success: true,
        data: {
          jobs: [
            {
              id: 'job-1',
              title: 'Test Job',
              company: { name: 'Test Company' },
            },
          ],
          pagination: { page: 1, limit: 10, total: 1 },
        },
      })
    );
  }),
  rest.post('/api/v1/jobs', (req, res, ctx) => {
    return res(
      ctx.json({
        success: true,
        data: {
          id: 'job-1',
          title: 'New Job',
          company: { name: 'New Company' },
        },
      })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('API Integration', () => {
  it('should fetch jobs from API', async () => {
    const result = await jobService.getJobs();

    expect(result.success).toBe(true);
    expect(result.data.jobs).toHaveLength(1);
    expect(result.data.jobs[0].title).toBe('Test Job');
  });

  it('should create job via API', async () => {
    const jobData = {
      title: 'New Job',
      description: 'Job description',
      companyId: 'company-1',
    };

    const result = await jobService.createJob(jobData);

    expect(result.success).toBe(true);
    expect(result.data.title).toBe('New Job');
  });
});
```

### 3. End-to-End Tests

#### Backend E2E Tests

**Full Application Flow Tests**
```typescript
// backend/test/app.e2e-spec.ts
describe('Application E2E', () => {
  let app: INestApplication;
  let httpServer: any;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    httpServer = app.getHttpServer();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Complete User Journey', () => {
    let userToken: string;
    let companyId: string;
    let jobId: string;
    let applicationId: string;

    it('should complete full user journey', async () => {
      // 1. Register user
      const registerResponse = await request(httpServer)
        .post('/auth/register')
        .send({
          email: 'journey@example.com',
          password: 'password123',
          firstName: 'Journey',
          lastName: 'User',
        });

      expect(registerResponse.status).toBe(201);
      userToken = registerResponse.body.data.token;

      // 2. Create company
      const companyResponse = await request(httpServer)
        .post('/companies')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'Journey Company',
          description: 'Test company for journey',
          industry: 'Technology',
        });

      expect(companyResponse.status).toBe(201);
      companyId = companyResponse.body.data.id;

      // 3. Create job
      const jobResponse = await request(httpServer)
        .post('/jobs')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          title: 'Journey Test Job',
          description: 'Test job for journey',
          companyId: companyId,
          salaryType: 'range',
          minSalary: 1000,
          maxSalary: 2000,
        });

      expect(jobResponse.status).toBe(201);
      jobId = jobResponse.body.data.id;

      // 4. Apply for job
      const applicationResponse = await request(httpServer)
        .post('/applications')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          jobId: jobId,
          coverLetter: 'I am interested in this position',
        });

      expect(applicationResponse.status).toBe(201);
      applicationId = applicationResponse.body.data.id;

      // 5. Verify application
      const applicationCheck = await request(httpServer)
        .get(`/applications/${applicationId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(applicationCheck.status).toBe(200);
      expect(applicationCheck.body.data.job.id).toBe(jobId);
      expect(applicationCheck.body.data.status).toBe('submitted');
    });
  });
});
```

#### Frontend E2E Tests

**User Workflow Tests**
```typescript
// frontend/__tests__/e2e/job-search.e2e.test.ts
import { test, expect } from '@playwright/test';

test.describe('Job Search Workflow', () => {
  test.beforeEach(async ({ page }) => {
    // Mock API responses
    await page.route('/api/v1/jobs', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            jobs: [
              {
                id: 'job-1',
                title: 'Frontend Developer',
                company: { name: 'Tech Corp' },
                city: 'Hanoi',
                salary: '1000-2000',
              },
              {
                id: 'job-2',
                title: 'Backend Developer',
                company: { name: 'Tech Corp' },
                city: 'Ho Chi Minh',
                salary: '1500-2500',
              },
            ],
            pagination: { page: 1, limit: 10, total: 2 },
          },
        }),
      });
    });
  });

  test('should search and filter jobs', async ({ page }) => {
    await page.goto('/jobs');

    // Verify jobs are loaded
    await expect(page.locator('[data-testid="job-list"]')).toBeVisible();
    await expect(page.locator('[data-testid="job-card"]')).toHaveCount(2);

    // Test search functionality
    await page.fill('[data-testid="search-input"]', 'Frontend');
    await page.click('[data-testid="search-button"]');

    await expect(page.locator('[data-testid="job-card"]')).toHaveCount(1);
    await expect(page.locator('[data-testid="job-title"]')).toContainText('Frontend Developer');

    // Test location filter
    await page.selectOption('[data-testid="location-filter"]', 'Hanoi');
    await expect(page.locator('[data-testid="job-card"]')).toHaveCount(1);
    await expect(page.locator('[data-testid="job-location"]')).toContainText('Hanoi');
  });

  test('should view job details', async ({ page }) => {
    await page.goto('/jobs');

    // Click on first job
    await page.click('[data-testid="job-card"]').first();

    // Verify job details page
    await expect(page.locator('[data-testid="job-title"]')).toBeVisible();
    await expect(page.locator('[data-testid="job-description"]')).toBeVisible();
    await expect(page.locator('[data-testid="apply-button"]')).toBeVisible();
  });

  test('should apply for job', async ({ page }) => {
    // Mock application API
    await page.route('/api/v1/applications', async route => {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            id: 'application-1',
            status: 'submitted',
          },
        }),
      });
    });

    await page.goto('/jobs/job-1');

    // Click apply button
    await page.click('[data-testid="apply-button"]');

    // Fill application form
    await page.fill('[data-testid="cover-letter"]', 'I am interested in this position');
    await page.click('[data-testid="submit-application"]');

    // Verify success message
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="success-message"]')).toContainText('Application submitted successfully');
  });
});
```

**Authentication Flow Tests**
```typescript
// frontend/__tests__/e2e/auth.e2e.test.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should register and login user', async ({ page }) => {
    // Mock registration API
    await page.route('/api/v1/auth/register', async route => {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            user: {
              id: 'user-1',
              email: 'test@example.com',
              firstName: 'Test',
              lastName: 'User',
            },
            token: 'mock-jwt-token',
          },
        }),
      });
    });

    // Mock login API
    await page.route('/api/v1/auth/login', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            user: {
              id: 'user-1',
              email: 'test@example.com',
              firstName: 'Test',
              lastName: 'User',
            },
            token: 'mock-jwt-token',
          },
        }),
      });
    });

    // Go to register page
    await page.goto('/auth/register');

    // Fill registration form
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.fill('[data-testid="first-name-input"]', 'Test');
    await page.fill('[data-testid="last-name-input"]', 'User');
    await page.click('[data-testid="register-button"]');

    // Verify registration success
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();

    // Go to login page
    await page.goto('/auth/login');

    // Fill login form
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.click('[data-testid="login-button"]');

    // Verify login success and redirect
    await expect(page).toHaveURL('/');
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
  });

  test('should handle login errors', async ({ page }) => {
    await page.route('/api/v1/auth/login', async route => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          error: {
            code: 'INVALID_CREDENTIALS',
            message: 'Invalid email or password',
          },
        }),
      });
    });

    await page.goto('/auth/login');

    await page.fill('[data-testid="email-input"]', 'wrong@example.com');
    await page.fill('[data-testid="password-input"]', 'wrongpassword');
    await page.click('[data-testid="login-button"]');

    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="error-message"]')).toContainText('Invalid email or password');
  });
});
```

## Test Data Management

### Fixtures and Factories

#### Backend Fixtures
```typescript
// backend/test/fixtures/users.fixture.ts
import { User } from '../../src/modules/users/entities/user.entity';

export const createTestUser = (overrides: Partial<User> = {}): User => {
  return {
    id: 'user-uuid',
    email: 'test@example.com',
    password: '$2b$10$hashed-password',
    firstName: 'Test',
    lastName: 'User',
    phone: '+1234567890',
    gender: 'male',
    dateOfBirth: new Date('1990-01-01'),
    avatar: null,
    status: 'active',
    emailVerifiedAt: null,
    lastLoginAt: null,
    isActive: true,
    statusReason: null,
    googleId: null,
    linkedInId: null,
    avatarUrl: null,
    preferredLocale: 'en',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
};

export const createTestJobSeeker = (overrides: Partial<any> = {}) => {
  return {
    id: 'job-seeker-uuid',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    gender: 'male',
    dateOfBirth: new Date('1990-01-01'),
    address: '123 Test Street',
    education: 'Bachelor Degree',
    experience: '5 years',
    skills: ['JavaScript', 'TypeScript'],
    resumeUrl: 'resume-url',
    profileCompleted: true,
    ...overrides,
  };
};
```

#### Frontend Mock Data
```typescript
// frontend/__tests__/utils/mock-data.ts
export const mockUser = {
  id: 'user-1',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  roles: [{ name: 'job_seeker' }],
};

export const mockJobs = [
  {
    id: 'job-1',
    title: 'Frontend Developer',
    description: 'Job description',
    company: {
      id: 'company-1',
      name: 'Tech Corp',
      logo: 'logo-url',
    },
    city: 'Hanoi',
    salary: '1000-2000',
    experienceLevel: 'mid_level',
  },
  {
    id: 'job-2',
    title: 'Backend Developer',
    description: 'Job description',
    company: {
      id: 'company-2',
      name: 'Tech Corp',
      logo: 'logo-url',
    },
    city: 'Ho Chi Minh',
    salary: '1500-2500',
    experienceLevel: 'senior_level',
  },
];

export const mockApplications = [
  {
    id: 'application-1',
    job: mockJobs[0],
    status: 'submitted',
    submittedAt: '2024-01-01T00:00:00Z',
  },
];
```

### Test Database Management

#### Database Seeding
```typescript
// backend/test/seeds/test-seeds.ts
import { DataSource } from 'typeorm';
import { User } from '../../src/modules/users/entities/user.entity';
import { Job } from '../../src/modules/jobs/entities/job.entity';
import { Company } from '../../src/modules/companies/entities/company.entity';

export class TestSeeder {
  constructor(private dataSource: DataSource) {}

  async seed() {
    await this.seedUsers();
    await this.seedCompanies();
    await this.seedJobs();
  }

  private async seedUsers() {
    const userRepository = this.dataSource.getRepository(User);

    const users = [
      {
        email: 'admin@example.com',
        password: '$2b$10$hashed-password',
        firstName: 'Admin',
        lastName: 'User',
        roles: [{ name: 'admin' }],
      },
      {
        email: 'employer@example.com',
        password: '$2b$10$hashed-password',
        firstName: 'Employer',
        lastName: 'User',
        roles: [{ name: 'employer' }],
      },
      {
        email: 'jobseeker@example.com',
        password: '$2b$10$hashed-password',
        firstName: 'Job',
        lastName: 'Seeker',
        roles: [{ name: 'job_seeker' }],
      },
    ];

    for (const userData of users) {
      const user = userRepository.create(userData);
      await userRepository.save(user);
    }
  }

  private async seedCompanies() {
    const companyRepository = this.dataSource.getRepository(Company);

    const companies = [
      {
        name: 'Tech Corp',
        description: 'Technology company',
        industry: 'Technology',
        email: 'contact@techcorp.com',
        website: 'https://techcorp.com',
      },
    ];

    for (const companyData of companies) {
      const company = companyRepository.create(companyData);
      await companyRepository.save(company);
    }
  }

  private async seedJobs() {
    const jobRepository = this.dataSource.getRepository(Job);

    const jobs = [
      {
        title: 'Frontend Developer',
        description: 'Frontend development job',
        requirements: 'React, TypeScript',
        benefits: 'Health insurance',
        jobType: 'full_time',
        experienceLevel: 'mid_level',
        salaryType: 'range',
        minSalary: 1000,
        maxSalary: 2000,
        currency: 'USD',
        city: 'Hanoi',
        country: 'Vietnam',
        remoteWork: true,
      },
    ];

    for (const jobData of jobs) {
      const job = jobRepository.create(jobData);
      await jobRepository.save(job);
    }
  }
}
```

## Test Configuration

### Jest Configuration

#### Backend Jest Config
```javascript
// backend/jest.config.js
module.exports = {
  preset: '@nestjs/jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/test'],
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/*.(test|spec).+(ts|tsx|js)',
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.spec.ts',
    '!src/**/*.test.ts',
    '!src/main.ts',
    '!src/**/*.entity.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
  testTimeout: 10000,
};
```

#### Frontend Jest Config
```javascript
// frontend/jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src', '<rootDir>/__tests__'],
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/*.(test|spec).+(ts|tsx|js)',
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@services/(.*)$': '<rootDir>/src/services/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.ts'],
  testTimeout: 5000,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main.tsx',
    '!src/**/*.stories.{ts,tsx}',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
};
```

### Playwright Configuration
```typescript
// frontend/playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './__tests__/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

## Continuous Integration

### GitHub Actions Workflow
```yaml
# .github/workflows/test.yml
name: Test

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  backend-test:
    runs-on: ubuntu-latest
    
    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_ROOT_PASSWORD: root
          MYSQL_DATABASE: cvking_test
          MYSQL_USER: cvking
          MYSQL_PASSWORD: cvking
        ports:
          - 3306:3306
        options: --health-cmd="mysqladmin ping" --health-interval=10s --health-timeout=5s --health-retries=3

    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run linting
      run: npm run lint
    
    - name: Run unit tests
      run: npm run test
      env:
        DB_HOST: localhost
        DB_PORT: 3306
        DB_USER: cvking
        DB_PASSWORD: cvking
        DB_NAME: cvking_test
        JWT_SECRET: test-secret
        JWT_REFRESH_SECRET: test-refresh-secret
    
    - name: Run integration tests
      run: npm run test:e2e
      env:
        DB_HOST: localhost
        DB_PORT: 3306
        DB_USER: cvking
        DB_PASSWORD: cvking
        DB_NAME: cvking_test
        JWT_SECRET: test-secret
        JWT_REFRESH_SECRET: test-refresh-secret
    
    - name: Upload coverage reports
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/lcov.info
        flags: backend

  frontend-test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run linting
      run: npm run lint
    
    - name: Run unit tests
      run: npm run test:coverage
    
    - name: Run integration tests
      run: npm run test:integration
    
    - name: Upload coverage reports
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/lcov.info
        flags: frontend

  e2e-test:
    runs-on: ubuntu-latest
    needs: [backend-test, frontend-test]
    
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Install Playwright
      run: npx playwright install --with-deps
    
    - name: Run E2E tests
      run: npm run test:e2e
```

## Test Coverage and Quality

### Coverage Thresholds
```javascript
// jest.config.js
module.exports = {
  // ... other config
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    './src/modules/auth/': {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
    './src/modules/jobs/': {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85,
    },
  },
};
```

### Code Quality Tools
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **Husky**: Git hooks for pre-commit checks
- **Lint-staged**: Run linting on staged files
- **SonarQube**: Code quality analysis (optional)

### Performance Testing
```typescript
// backend/test/performance/load-test.ts
import { performance } from 'perf_hooks';
import { request } from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';

describe('Performance Tests', () => {
  let app: any;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('API Response Times', () => {
    it('should handle job listing under 500ms', async () => {
      const startTime = performance.now();

      const response = await request(app.getHttpServer())
        .get('/jobs')
        .expect(200);

      const endTime = performance.now();
      const responseTime = endTime - startTime;

      expect(responseTime).toBeLessThan(500);
      expect(response.body.success).toBe(true);
    });

    it('should handle user registration under 1000ms', async () => {
      const startTime = performance.now();

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: `perf-test-${Date.now()}@example.com`,
          password: 'password123',
          firstName: 'Perf',
          lastName: 'Test',
        })
        .expect(201);

      const endTime = performance.now();
      const responseTime = endTime - startTime;

      expect(responseTime).toBeLessThan(1000);
      expect(response.body.success).toBe(true);
    });
  });
});
```

This comprehensive testing strategy ensures that CVKing maintains high code quality, reliability, and performance across all layers of the application.