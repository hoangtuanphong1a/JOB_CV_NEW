# CVKing Performance Optimization Guide

## Overview

This document outlines comprehensive performance optimization strategies for the CVKing job portal application. The optimization covers backend, frontend, database, and infrastructure levels to ensure optimal user experience and system scalability.

## Performance Goals

### Target Metrics
- **Page Load Time**: < 3 seconds for initial page load
- **API Response Time**: < 500ms for 95% of requests
- **Time to Interactive**: < 5 seconds for complex pages
- **First Contentful Paint**: < 1.5 seconds
- **Largest Contentful Paint**: < 2.5 seconds
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

### Monitoring Targets
- **Uptime**: 99.9% availability
- **Error Rate**: < 1% of requests
- **Concurrent Users**: Support 10,000+ concurrent users
- **Database Connections**: Optimize connection pooling

## Backend Performance Optimization

### 1. Database Optimization

#### Connection Pooling
```typescript
// backend/src/app.module.ts
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false, // Never use true in production
      logging: false,
      poolSize: 20, // Optimize based on your needs
      acquireTimeout: 60000,
      timeout: 60000,
      extra: {
        connectionLimit: 20,
        maxIdle: 10,
        idleTimeout: 600000,
      },
    }),
  ],
})
export class AppModule {}
```

#### Query Optimization
```typescript
// backend/src/modules/jobs/jobs.service.ts
@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
  ) {}

  async findJobsWithFilters(filters: JobFiltersDto): Promise<PaginatedResult<Job>> {
    const queryBuilder = this.jobRepository.createQueryBuilder('job')
      .leftJoinAndSelect('job.company', 'company')
      .leftJoinAndSelect('job.category', 'category')
      .leftJoinAndSelect('job.skills', 'skills')
      .leftJoinAndSelect('job.tags', 'tags')
      .where('job.status = :status', { status: 'published' });

    // Apply filters with proper indexing
    if (filters.search) {
      queryBuilder.andWhere(
        new Brackets(qb => {
          qb.where('job.title LIKE :search', { search: `%${filters.search}%` })
            .orWhere('job.description LIKE :search', { search: `%${filters.search}%` })
            .orWhere('job.requirements LIKE :search', { search: `%${filters.search}%` });
        })
      );
    }

    if (filters.location) {
      queryBuilder.andWhere('job.city = :city', { city: filters.location });
    }

    if (filters.jobType) {
      queryBuilder.andWhere('job.jobType = :jobType', { jobType: filters.jobType });
    }

    if (filters.experienceLevel) {
      queryBuilder.andWhere('job.experienceLevel = :experienceLevel', { 
        experienceLevel: filters.experienceLevel 
      });
    }

    // Pagination with cursor-based approach for better performance
    if (filters.cursor) {
      queryBuilder.andWhere('job.id > :cursor', { cursor: filters.cursor });
    }

    queryBuilder
      .orderBy('job.publishedAt', 'DESC')
      .addOrderBy('job.id', 'DESC')
      .limit(filters.limit || 20);

    const [jobs, total] = await queryBuilder.getManyAndCount();

    return {
      data: jobs,
      pagination: {
        page: filters.page || 1,
        limit: filters.limit || 20,
        total,
        totalPages: Math.ceil(total / (filters.limit || 20)),
      },
    };
  }
}
```

#### Database Indexing Strategy
```sql
-- backend/database/migrations/001_create_indexes.sql
-- User table indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_roles ON users_roles(user_id, role_id);

-- Job table indexes
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_company_id ON jobs(company_id);
CREATE INDEX idx_jobs_published_at ON jobs(published_at);
CREATE INDEX idx_jobs_city ON jobs(city);
CREATE INDEX idx_jobs_job_type ON jobs(job_type);
CREATE INDEX idx_jobs_experience_level ON jobs(experience_level);
CREATE INDEX idx_jobs_remote_work ON jobs(remote_work);

-- Application table indexes
CREATE INDEX idx_applications_job_id ON applications(job_id);
CREATE INDEX idx_applications_job_seeker_id ON applications(job_seeker_profile_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_submitted_at ON applications(submitted_at);

-- Message table indexes
CREATE INDEX idx_messages_thread_id ON messages(thread_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);

-- Full-text search indexes
CREATE FULLTEXT INDEX idx_jobs_search ON jobs(title, description, requirements);
CREATE FULLTEXT INDEX idx_companies_search ON companies(name, description);
```

### 2. API Optimization

#### Response Optimization
```typescript
// backend/src/common/interceptors/response.interceptor.ts
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => ({
        success: true,
        data,
        timestamp: new Date().toISOString(),
      }))
    );
  }
}

// backend/src/common/pipes/select-fields.pipe.ts
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class SelectFieldsPipe implements PipeTransform {
  constructor(private readonly allowedFields: string[]) {}

  transform(value: any) {
    if (!value || typeof value !== 'object') {
      return value;
    }

    const fields = value.fields;
    if (!fields) {
      return value;
    }

    const selectedFields = fields.split(',').map(field => field.trim());
    
    // Validate fields
    const invalidFields = selectedFields.filter(field => 
      !this.allowedFields.includes(field)
    );

    if (invalidFields.length > 0) {
      throw new BadRequestException(`Invalid fields: ${invalidFields.join(', ')}`);
    }

    return {
      ...value,
      selectedFields,
    };
  }
}
```

#### Caching Strategy
```typescript
// backend/src/common/decorators/cache.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const CACHE_TTL = 'cache_ttl';
export const CacheTTL = (ttl: number) => SetMetadata(CACHE_TTL, ttl);

// backend/src/common/interceptors/cache.interceptor.ts
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as Redis from 'redis';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  private redisClient: Redis.Redis;

  constructor() {
    this.redisClient = Redis.createClient({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT),
      password: process.env.REDIS_PASSWORD,
    });
  }

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const key = this.generateCacheKey(request);
    const ttl = this.getCacheTTL(context);

    if (request.method === 'GET' && ttl) {
      const cachedResponse = await this.redisClient.get(key);
      if (cachedResponse) {
        return new Observable(observer => {
          observer.next(JSON.parse(cachedResponse));
          observer.complete();
        });
      }

      return next.handle().pipe(
        tap(response => {
          this.redisClient.setex(key, ttl, JSON.stringify(response));
        })
      );
    }

    return next.handle();
  }

  private generateCacheKey(request: any): string {
    return `${request.method}:${request.url}:${JSON.stringify(request.query)}`;
  }

  private getCacheTTL(context: ExecutionContext): number {
    const handler = context.getHandler();
    return Reflect.getMetadata(CACHE_TTL, handler) || 300; // 5 minutes default
  }
}
```

#### Rate Limiting
```typescript
// backend/src/common/guards/rate-limit.guard.ts
import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import * as Redis from 'redis';

@Injectable()
export class RateLimitGuard implements CanActivate {
  private redisClient: Redis.Redis;
  private readonly windowMs: number = 15 * 60 * 1000; // 15 minutes
  private readonly maxRequests: number = 100; // Max 100 requests per window

  constructor() {
    this.redisClient = Redis.createClient({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT),
      password: process.env.REDIS_PASSWORD,
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const ip = this.getClientIp(request);
    const key = `rate_limit:${ip}`;
    const now = Date.now();

    const result = await this.redisClient.eval(`
      local key = KEYS[1]
      local window = ARGV[1]
      local max = ARGV[2]
      local now = ARGV[3]
      
      redis.call('zremrangebyscore', key, 0, now - window)
      local current = redis.call('zcard', key)
      
      if current < max then
        redis.call('zadd', key, now, now)
        redis.call('expire', key, math.ceil(window / 1000))
        return 1
      else
        return 0
      end
    `, 1, key, this.windowMs, this.maxRequests, now);

    if (result === 0) {
      throw new HttpException(
        {
          success: false,
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Too many requests, please try again later.',
            retryAfter: Math.ceil(this.windowMs / 1000),
          },
        },
        HttpStatus.TOO_MANY_REQUESTS
      );
    }

    return true;
  }

  private getClientIp(request: any): string {
    return request.ip || 
           request.connection.remoteAddress || 
           request.socket.remoteAddress ||
           (request.connection.socket ? request.connection.socket.remoteAddress : null) ||
           'unknown';
  }
}
```

### 3. Application-Level Optimization

#### Lazy Loading
```typescript
// backend/src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { JobsModule } from './modules/jobs/jobs.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    AuthModule,
    JobsModule,
    UsersModule,
    // Lazy load heavy modules
    // HeavyModule.registerAsync({
    //   useFactory: () => ({
    //     // Configuration
    //   }),
    // }),
  ],
})
export class AppModule {}
```

#### Background Processing
```typescript
// backend/src/modules/notifications/notifications.service.ts
import { Injectable } from '@nestjs/common';
import { Job, Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectQueue('notifications') private readonly notificationsQueue: Queue,
  ) {}

  async sendEmailNotification(userId: string, template: string, data: any) {
    await this.notificationsQueue.add('send-email', {
      userId,
      template,
      data,
    }, {
      delay: 1000, // 1 second delay
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
    });
  }

  async processEmailJob(job: Job<any>) {
    const { userId, template, data } = job.data;
    
    // Process email sending
    try {
      // Send email logic here
      console.log(`Sending email to ${userId}`);
    } catch (error) {
      console.error('Email sending failed:', error);
      throw error;
    }
  }
}
```

## Frontend Performance Optimization

### 1. Bundle Optimization

#### Code Splitting
```typescript
// frontend/src/components/JobList/JobList.tsx
import React, { Suspense, lazy } from 'react';
import { useJobs } from '../../hooks/useJobs';
import JobCard from './JobCard';
import JobFilters from './JobFilters';
import LoadingSpinner from '../common/LoadingSpinner';

// Lazy load heavy components
const JobDetailsModal = lazy(() => import('./JobDetailsModal'));
const ApplicationForm = lazy(() => import('./ApplicationForm'));

const JobList: React.FC = () => {
  const { jobs, loading, error, filters, setFilters } = useJobs();

  return (
    <div className="job-list">
      <JobFilters filters={filters} onFiltersChange={setFilters} />
      
      {loading && <LoadingSpinner />}
      {error && <div className="error">Failed to load jobs</div>}
      
      <div className="job-grid">
        {jobs.map(job => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>

      <Suspense fallback={<div>Loading job details...</div>}>
        <JobDetailsModal />
      </Suspense>
    </div>
  );
};

export default JobList;
```

#### Dynamic Imports
```typescript
// frontend/src/pages/dashboard/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const Dashboard: React.FC = () => {
  const router = useRouter();
  const [DashboardComponent, setDashboardComponent] = useState<React.ComponentType<any> | null>(null);

  useEffect(() => {
    const loadDashboard = async () => {
      const { default: DashboardModule } = await import('./DashboardModule');
      setDashboardComponent(() => DashboardModule);
    };

    loadDashboard();
  }, []);

  if (!DashboardComponent) {
    return <div>Loading dashboard...</div>;
  }

  return <DashboardComponent />;
};

export default Dashboard;
```

### 2. Image Optimization

#### Next.js Image Component
```typescript
// frontend/src/components/JobCard/JobCard.tsx
import Image from 'next/image';
import { Job } from '../../types/job';

interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  return (
    <div className="job-card">
      <div className="company-logo">
        <Image
          src={job.company.logo || '/default-logo.png'}
          alt={`${job.company.name} logo`}
          width={64}
          height={64}
          priority={job.isFeatured}
          placeholder="blur"
          blurDataURL="/placeholder.png"
        />
      </div>
      
      <div className="job-info">
        <h3 className="job-title">{job.title}</h3>
        <p className="company-name">{job.company.name}</p>
        <div className="job-meta">
          <span className="location">{job.city}, {job.country}</span>
          <span className="salary">{job.salary}</span>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
```

#### Image Optimization Service
```typescript
// frontend/src/utils/imageOptimizer.ts
export const optimizeImage = (url: string, width?: number, height?: number): string => {
  if (!url) return '/placeholder.png';
  
  const baseUrl = process.env.NEXT_PUBLIC_CLOUDINARY_URL || '';
  const transformations = [
    'f_auto', // Format auto
    'q_auto', // Quality auto
  ];

  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  if (width && height) transformations.push('c_fill');

  return `${baseUrl}/${transformations.join(',')}/${url}`;
};

export const getResponsiveImages = (baseUrl: string) => ({
  mobile: optimizeImage(baseUrl, 320, 180),
  tablet: optimizeImage(baseUrl, 768, 432),
  desktop: optimizeImage(baseUrl, 1200, 675),
});
```

### 3. State Management Optimization

#### React Query Optimization
```typescript
// frontend/src/hooks/useJobs.ts
import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { jobService } from '../services/jobService';
import { JobFilters } from '../types/job';

export const useJobs = (filters?: JobFilters) => {
  return useQuery({
    queryKey: ['jobs', filters],
    queryFn: () => jobService.getJobs(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

export const useInfiniteJobs = (filters?: JobFilters) => {
  return useInfiniteQuery({
    queryKey: ['jobs', 'infinite', filters],
    queryFn: ({ pageParam = 1 }) => 
      jobService.getJobs({ ...filters, page: pageParam }),
    getNextPageParam: (lastPage, pages) => {
      if (pages.length < lastPage.pagination.totalPages) {
        return pages.length + 1;
      }
      return undefined;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes for infinite queries
  });
};

export const useJobApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: jobService.applyForJob,
    onSuccess: () => {
      // Invalidate and refetch job applications
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
    onError: (error) => {
      console.error('Application failed:', error);
    },
  });
};
```

#### Virtualization for Long Lists
```typescript
// frontend/src/components/VirtualizedJobList/VirtualizedJobList.tsx
import React from 'react';
import { FixedSizeList as List } from 'react-window';
import JobCard from '../JobCard/JobCard';
import { Job } from '../../types/job';

interface VirtualizedJobListProps {
  jobs: Job[];
  height: number;
  itemHeight: number;
}

const VirtualizedJobList: React.FC<VirtualizedJobListProps> = ({ jobs, height, itemHeight }) => {
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => (
    <div style={style}>
      <JobCard job={jobs[index]} />
    </div>
  );

  return (
    <List
      height={height}
      itemCount={jobs.length}
      itemSize={itemHeight}
      width="100%"
    >
      {Row}
    </List>
  );
};

export default VirtualizedJobList;
```

### 4. Performance Monitoring

#### Performance Metrics Collection
```typescript
// frontend/src/utils/performance.ts
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  startTimer(name: string) {
    performance.mark(`${name}-start`);
  }

  endTimer(name: string) {
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);
    
    const measure = performance.getEntriesByName(name)[0];
    this.recordMetric(name, measure.duration);
    
    // Send to analytics
    this.sendToAnalytics(name, measure.duration);
  }

  private recordMetric(name: string, value: number) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)!.push(value);
  }

  private sendToAnalytics(name: string, value: number) {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'timing_complete', {
        name: name,
        value: Math.round(value),
        event_category: 'Performance',
      });
    }
  }

  getMetrics() {
    return Object.fromEntries(this.metrics);
  }
}

// Usage in components
export const usePerformanceMonitor = (componentName: string) => {
  const monitor = PerformanceMonitor.getInstance();

  React.useEffect(() => {
    monitor.startTimer(componentName);
    return () => {
      monitor.endTimer(componentName);
    };
  }, [componentName, monitor]);
};
```

## Database Performance Optimization

### 1. Query Optimization

#### N+1 Query Problem Solution
```typescript
// backend/src/modules/jobs/jobs.service.ts
@Injectable()
export class JobsService {
  async findJobWithDetails(jobId: string): Promise<Job> {
    return this.jobRepository.findOne({
      where: { id: jobId },
      relations: [
        'company',
        'company.owner',
        'category',
        'skills',
        'tags',
        'applications',
        'applications.jobSeekerProfile',
        'applications.jobSeekerProfile.user',
      ],
      select: {
        company: {
          id: true,
          name: true,
          logo: true,
          industry: true,
          owner: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        category: {
          id: true,
          name: true,
        },
        skills: {
          id: true,
          name: true,
        },
        tags: {
          id: true,
          name: true,
        },
      },
    });
  }
}
```

#### Database Sharding Strategy
```typescript
// backend/src/database/sharding.service.ts
@Injectable()
export class ShardingService {
  private readonly shards: Map<string, DataSource> = new Map();

  constructor() {
    this.initializeShards();
  }

  private initializeShards() {
    const shardConfigs = [
      { name: 'shard1', host: 'db-shard1.example.com' },
      { name: 'shard2', host: 'db-shard2.example.com' },
      { name: 'shard3', host: 'db-shard3.example.com' },
    ];

    shardConfigs.forEach(config => {
      const dataSource = new DataSource({
        type: 'mysql',
        host: config.host,
        // ... other config
      });
      this.shards.set(config.name, dataSource);
    });
  }

  getShard(userId: string): DataSource {
    const shardIndex = this.hashUserId(userId) % this.shards.size;
    const shardName = `shard${shardIndex + 1}`;
    return this.shards.get(shardName)!;
  }

  private hashUserId(userId: string): number {
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      const char = userId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }
}
```

### 2. Caching Strategy

#### Multi-Level Caching
```typescript
// backend/src/common/services/cache.service.ts
@Injectable()
export class CacheService {
  private readonly memoryCache = new Map<string, { data: any; ttl: number }>();
  private readonly redisClient: Redis.Redis;

  constructor() {
    this.redisClient = Redis.createClient({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT),
    });
  }

  async get<T>(key: string): Promise<T | null> {
    // Check memory cache first
    const memoryEntry = this.memoryCache.get(key);
    if (memoryEntry && memoryEntry.ttl > Date.now()) {
      return memoryEntry.data;
    }

    // Check Redis cache
    const redisEntry = await this.redisClient.get(key);
    if (redisEntry) {
      const data = JSON.parse(redisEntry);
      // Refresh memory cache
      this.memoryCache.set(key, {
        data,
        ttl: Date.now() + 60000, // 1 minute
      });
      return data;
    }

    return null;
  }

  async set<T>(key: string, data: T, ttl: number): Promise<void> {
    const serializedData = JSON.stringify(data);
    
    // Set in Redis
    await this.redisClient.setex(key, Math.floor(ttl / 1000), serializedData);
    
    // Set in memory cache
    this.memoryCache.set(key, {
      data,
      ttl: Date.now() + Math.min(ttl, 300000), // Max 5 minutes in memory
    });
  }

  async invalidate(pattern: string): Promise<void> {
    // Clear memory cache
    for (const key of this.memoryCache.keys()) {
      if (key.includes(pattern)) {
        this.memoryCache.delete(key);
      }
    }

    // Clear Redis cache
    const keys = await this.redisClient.keys(`*${pattern}*`);
    if (keys.length > 0) {
      await this.redisClient.del(...keys);
    }
  }
}
```

## Infrastructure Optimization

### 1. CDN Configuration

#### Static Asset Optimization
```nginx
# nginx.conf
server {
    listen 80;
    server_name cvking.com www.cvking.com;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json;

    # Static asset caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Vary "Accept-Encoding";
    }

    # HTML files - shorter cache
    location ~* \.html$ {
        expires 1h;
        add_header Cache-Control "public, must-revalidate";
    }

    # API endpoints
    location /api/ {
        proxy_pass http://backend:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 2. Load Balancing

#### Docker Compose with Load Balancer
```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  # Load balancer
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
    depends_on:
      - backend1
      - backend2
      - backend3

  # Backend instances
  backend1:
    build: ./backend
    environment:
      - NODE_ENV=production
      - PORT=3000
      - DB_HOST=mysql
      - REDIS_HOST=redis
    depends_on:
      - mysql
      - redis

  backend2:
    build: ./backend
    environment:
      - NODE_ENV=production
      - PORT=3000
      - DB_HOST=mysql
      - REDIS_HOST=redis
    depends_on:
      - mysql
      - redis

  backend3:
    build: ./backend
    environment:
      - NODE_ENV=production
      - PORT=3000
      - DB_HOST=mysql
      - REDIS_HOST=redis
    depends_on:
      - mysql
      - redis

  # Database
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASSWORD}
      MYSQL_DATABASE: ${DB_NAME}
      MYSQL_USER: ${DB_USER}
      MYSQL_PASSWORD: ${DB_PASSWORD}
    volumes:
      - mysql_data:/var/lib/mysql

  # Redis
  redis:
    image: redis:alpine
    volumes:
      - redis_data:/data

volumes:
  mysql_data:
  redis_data:
```

### 3. Monitoring and Alerting

#### Prometheus Configuration
```yaml
# prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - "alert_rules.yml"

scrape_configs:
  - job_name: 'cvking-backend'
    static_configs:
      - targets: ['backend:3000']
    metrics_path: '/metrics'
    scrape_interval: 5s

  - job_name: 'cvking-frontend'
    static_configs:
      - targets: ['frontend:3000']

alerting:
  alertmanagers:
    - static_configs:
        - targets:
          - alertmanager:9093

# alert_rules.yml
groups:
  - name: cvking_alerts
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.1
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
          description: "Error rate is {{ $value }} errors per second"

      - alert: HighResponseTime
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 0.5
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High response time detected"
          description: "95th percentile response time is {{ $value }} seconds"

      - alert: DatabaseConnectionPoolExhausted
        expr: mysql_connection_pool_active_connections / mysql_connection_pool_max_connections > 0.9
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "Database connection pool nearly exhausted"
          description: "Connection pool usage is {{ $value | humanizePercentage }}"
```

## Performance Testing

### 1. Load Testing

#### Artillery Configuration
```yaml
# load-test.yml
config:
  target: 'http://localhost:3000'
  phases:
    - duration: 60
      arrivalRate: 10
      name: "Warm up"
    - duration: 120
      arrivalRate: 50
      name: "Ramp up load"
    - duration: 300
      arrivalRate: 100
      name: "Sustained load"
    - duration: 60
      arrivalRate: 200
      name: "Peak load"

scenarios:
  - name: "Job Search Flow"
    weight: 70
    flow:
      - get:
          url: "/jobs"
          expect:
            - statusCode: 200
      - get:
          url: "/jobs/1"
          expect:
            - statusCode: 200
      - post:
          url: "/applications"
          json:
            jobId: 1
            coverLetter: "I am interested in this position"
          expect:
            - statusCode: 201

  - name: "User Authentication Flow"
    weight: 30
    flow:
      - post:
          url: "/auth/login"
          json:
            email: "test@example.com"
            password: "password123"
          expect:
            - statusCode: 200
      - get:
          url: "/auth/profile"
          headers:
            Authorization: "Bearer {{ token }}"
          expect:
            - statusCode: 200
```

### 2. Performance Budget

#### Lighthouse Configuration
```json
{
  "ci": {
    "collect": {
      "url": ["http://localhost:3000", "http://localhost:3000/jobs", "http://localhost:3000/auth/login"],
      "startServerCommand": "npm run start",
      "startServerReadyPattern": "Server is running"
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", {"minScore": 0.9}],
        "categories:accessibility": ["error", {"minScore": 0.9}],
        "categories:best-practices": ["error", {"minScore": 0.9}],
        "categories:seo": ["error", {"minScore": 0.9}],
        "categories:pwa": ["warn", {"minScore": 0.8}],
        
        "first-contentful-paint": ["error", {"maxNumericValue": 1500}],
        "largest-contentful-paint": ["error", {"maxNumericValue": 2500}],
        "cumulative-layout-shift": ["error", {"maxNumericValue": 0.1}],
        "total-blocking-time": ["error", {"maxNumericValue": 300}],
        
        "unused-javascript": ["warn", {"maxNumericValue": 50000}],
        "unused-css-rules": ["warn", {"maxNumericValue": 20000}],
        "render-blocking-resources": ["warn", {"maxNumericValue": 1000}],
        "unminified-css": ["error", {"maxNumericValue": 0}],
        "unminified-javascript": ["error", {"maxNumericValue": 0}]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

## Continuous Performance Monitoring

### 1. Real User Monitoring (RUM)

#### Performance Observer Integration
```typescript
// frontend/src/utils/rum.ts
export class RUM {
  private static instance: RUM;

  static getInstance(): RUM {
    if (!RUM.instance) {
      RUM.instance = new RUM();
    }
    return RUM.instance;
  }

  init() {
    // Core Web Vitals
    this.observeLCP();
    this.observeFID();
    this.observeCLS();
    this.observeFCP();
    this.observeTTFB();

    // Custom metrics
    this.observeRouteChanges();
    this.observeResourceLoading();
  }

  private observeLCP() {
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      
      this.sendMetric('lcp', lastEntry.startTime);
    }).observe({ entryTypes: ['largest-contentful-paint'] });
  }

  private observeFID() {
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry: any) => {
        this.sendMetric('fid', entry.processingStart - entry.startTime);
      });
    }).observe({ entryTypes: ['first-input'] });
  }

  private observeCLS() {
    let clsValue = 0;
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      this.sendMetric('cls', clsValue);
    }).observe({ entryTypes: ['layout-shift'] });
  }

  private observeFCP() {
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry) => {
        this.sendMetric('fcp', entry.startTime);
      });
    }).observe({ entryTypes: ['paint'] });
  }

  private observeTTFB() {
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry) => {
        this.sendMetric('ttfb', entry.responseStart - entry.requestStart);
      });
    }).observe({ entryTypes: ['navigation'] });
  }

  private sendMetric(name: string, value: number) {
    // Send to analytics service
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', name, {
        event_category: 'Web Vitals',
        value: Math.round(value),
      });
    }

    // Send to custom endpoint
    fetch('/api/metrics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        value,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      }),
    }).catch(console.error);
  }
}
```

### 2. Performance Regression Detection

#### GitHub Actions Performance Testing
```yaml
# .github/workflows/performance.yml
name: Performance Testing

on:
  pull_request:
    branches: [ main ]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build application
        run: npm run build
      
      - name: Start server
        run: npm start &
        env:
          NODE_ENV: production
      
      - name: Wait for server
        run: sleep 10
      
      - name: Run Lighthouse CI
        run: npx @lhci/cli@0.12.x autorun
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
      
      - name: Upload Lighthouse results
        uses: actions/upload-artifact@v3
        with:
          name: lighthouse-results
          path: .lighthouseci/

  load-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Run load tests
        run: |
          npm install -g artillery
          artillery run load-test.yml
```

This comprehensive performance optimization guide ensures that CVKing maintains optimal performance across all layers of the application, providing users with a fast and responsive experience while maintaining system scalability and reliability.