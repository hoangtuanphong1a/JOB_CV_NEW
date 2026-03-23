# CVKing Deployment Guide

## Overview

This guide provides comprehensive instructions for deploying the CVKing job portal application to production environments. The application is designed for containerized deployment using Docker and Docker Compose, with support for CI/CD through Jenkins.

## Prerequisites

### System Requirements
- **Operating System**: Linux (Ubuntu 20.04+, CentOS 7+), macOS, or Windows with WSL2
- **Docker**: Version 20.10+
- **Docker Compose**: Version 2.0+
- **Node.js**: Version 18+ (for local development)
- **Jenkins**: Version 2.300+ (for CI/CD)

### External Dependencies
- **MySQL Database**: Version 8.0+
- **Redis** (Optional): For caching and session storage
- **SMTP Server**: For email notifications
- **Cloud Storage**: AWS S3, Google Cloud Storage, or local storage

## Environment Configuration

### Environment Variables

#### Backend Environment Variables
Create a `.env` file in the `backend/` directory:

```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=cvking_user
DB_PASSWORD=your_secure_password
DB_NAME=cvking_db

# Redis Configuration (Optional)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_REFRESH_EXPIRES_IN=7d

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=CVKing <noreply@cvking.com>

# Application Configuration
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com
API_URL=https://your-api-domain.com

# File Upload Configuration
MAX_FILE_SIZE=5242880  # 5MB
UPLOAD_PATH=./uploads
CLOUD_STORAGE_PROVIDER=local  # local, aws, gcp

# AWS Configuration (if using S3)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-s3-bucket

# Google Cloud Configuration (if using GCS)
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_CLOUD_STORAGE_BUCKET=your-gcs-bucket
GOOGLE_APPLICATION_CREDENTIALS=./path/to/service-account.json

# Monitoring & Logging
LOG_LEVEL=info
ENABLE_REQUEST_LOGGING=true
ENABLE_PERFORMANCE_MONITORING=true
```

#### Frontend Environment Variables
Create a `.env.local` file in the `frontend/` directory:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api/v1
NEXT_PUBLIC_WS_URL=wss://your-api-domain.com

# Authentication
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_LINKEDIN_CLIENT_ID=your_linkedin_client_id

# File Upload
NEXT_PUBLIC_MAX_FILE_SIZE=5242880
NEXT_PUBLIC_ALLOWED_FILE_TYPES=.pdf,.doc,.docx,.jpg,.png

# Analytics (Optional)
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn

# Feature Flags
NEXT_PUBLIC_ENABLE_CHAT=true
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true
NEXT_PUBLIC_ENABLE_BLOG=true
```

## Docker Deployment

### Single-Server Deployment

#### 1. Clone the Repository
```bash
git clone https://github.com/your-organization/cvking.git
cd cvking
```

#### 2. Configure Environment Variables
Copy the example environment files and configure them:

```bash
# Backend configuration
cp backend/.env.example backend/.env
# Edit backend/.env with your configuration

# Frontend configuration
cp frontend/.env.example frontend/.env.local
# Edit frontend/.env.local with your configuration
```

#### 3. Build and Deploy
```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# Verify deployment
docker-compose ps
```

#### 4. Initialize Database
```bash
# Run database migrations
docker-compose exec backend npm run typeorm:run

# Seed initial data
docker-compose exec backend npm run seed
```

### Production Docker Compose Configuration

Create a `docker-compose.prod.yml` file:

```yaml
version: '3.8'

services:
  # Database
  mysql:
    image: mysql:8.0
    container_name: cvking-mysql
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASSWORD}
      MYSQL_DATABASE: ${DB_NAME}
      MYSQL_USER: ${DB_USER}
      MYSQL_PASSWORD: ${DB_PASSWORD}
    volumes:
      - mysql_data:/var/lib/mysql
      - ./database/init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "3306:3306"
    networks:
      - cvking-network
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      timeout: 20s
      retries: 10

  # Backend API
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: cvking-backend
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - DB_HOST=mysql
      - DB_PORT=3306
      - DB_USER=${DB_USER}
      - DB_PASSWORD=${DB_PASSWORD}
      - DB_NAME=${DB_NAME}
      - JWT_SECRET=${JWT_SECRET}
      - JWT_EXPIRES_IN=${JWT_EXPIRES_IN}
      - JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET}
      - JWT_REFRESH_EXPIRES_IN=${JWT_REFRESH_EXPIRES_IN}
      - SMTP_HOST=${SMTP_HOST}
      - SMTP_PORT=${SMTP_PORT}
      - SMTP_USER=${SMTP_USER}
      - SMTP_PASS=${SMTP_PASS}
      - SMTP_FROM=${SMTP_FROM}
      - PORT=3000
      - FRONTEND_URL=${FRONTEND_URL}
      - API_URL=${API_URL}
    volumes:
      - ./backend/uploads:/app/uploads
    ports:
      - "3000:3000"
    networks:
      - cvking-network
    depends_on:
      mysql:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  # Frontend
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      args:
        - NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
        - NEXT_PUBLIC_WS_URL=${NEXT_PUBLIC_WS_URL}
        - NEXT_PUBLIC_GOOGLE_CLIENT_ID=${NEXT_PUBLIC_GOOGLE_CLIENT_ID}
        - NEXT_PUBLIC_LINKEDIN_CLIENT_ID=${NEXT_PUBLIC_LINKEDIN_CLIENT_ID}
    container_name: cvking-frontend
    restart: unless-stopped
    environment:
      - NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
      - NEXT_PUBLIC_WS_URL=${NEXT_PUBLIC_WS_URL}
      - NEXT_PUBLIC_GOOGLE_CLIENT_ID=${NEXT_PUBLIC_GOOGLE_CLIENT_ID}
      - NEXT_PUBLIC_LINKEDIN_CLIENT_ID=${NEXT_PUBLIC_LINKEDIN_CLIENT_ID}
    ports:
      - "80:3000"
      - "443:3001"
    networks:
      - cvking-network
    depends_on:
      - backend
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  # Nginx Reverse Proxy (Optional)
  nginx:
    image: nginx:alpine
    container_name: cvking-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
      - ./frontend/dist:/usr/share/nginx/html
    networks:
      - cvking-network
    depends_on:
      - frontend

volumes:
  mysql_data:
    driver: local

networks:
  cvking-network:
    driver: bridge
```

## Kubernetes Deployment

### 1. Create Kubernetes Manifests

#### Database Deployment
```yaml
# k8s/mysql-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: cvking-mysql
  labels:
    app: cvking-mysql
spec:
  replicas: 1
  selector:
    matchLabels:
      app: cvking-mysql
  template:
    metadata:
      labels:
        app: cvking-mysql
    spec:
      containers:
      - name: mysql
        image: mysql:8.0
        env:
        - name: MYSQL_ROOT_PASSWORD
          valueFrom:
            secretKeyRef:
              name: cvking-secrets
              key: mysql-root-password
        - name: MYSQL_DATABASE
          valueFrom:
            secretKeyRef:
              name: cvking-secrets
              key: mysql-database
        - name: MYSQL_USER
          valueFrom:
            secretKeyRef:
              name: cvking-secrets
              key: mysql-user
        - name: MYSQL_PASSWORD
          valueFrom:
            secretKeyRef:
              name: cvking-secrets
              key: mysql-password
        ports:
        - containerPort: 3306
        volumeMounts:
        - name: mysql-storage
          mountPath: /var/lib/mysql
        livenessProbe:
          exec:
            command: ["mysqladmin", "ping", "-h", "localhost"]
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          exec:
            command: ["mysqladmin", "ping", "-h", "localhost"]
          initialDelaySeconds: 5
          periodSeconds: 5
      volumes:
      - name: mysql-storage
        persistentVolumeClaim:
          claimName: mysql-pvc
---
apiVersion: v1
kind: Service
metadata:
  name: cvking-mysql-service
spec:
  selector:
    app: cvking-mysql
  ports:
  - protocol: TCP
    port: 3306
    targetPort: 3306
  type: ClusterIP
```

#### Backend Deployment
```yaml
# k8s/backend-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: cvking-backend
  labels:
    app: cvking-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: cvking-backend
  template:
    metadata:
      labels:
        app: cvking-backend
    spec:
      containers:
      - name: backend
        image: your-registry/cvking-backend:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: DB_HOST
          value: "cvking-mysql-service"
        - name: DB_PORT
          value: "3306"
        - name: DB_USER
          valueFrom:
            secretKeyRef:
              name: cvking-secrets
              key: mysql-user
        - name: DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: cvking-secrets
              key: mysql-password
        - name: DB_NAME
          valueFrom:
            secretKeyRef:
              name: cvking-secrets
              key: mysql-database
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: cvking-secrets
              key: jwt-secret
        - name: JWT_EXPIRES_IN
          value: "15m"
        - name: JWT_REFRESH_SECRET
          valueFrom:
            secretKeyRef:
              name: cvking-secrets
              key: jwt-refresh-secret
        - name: JWT_REFRESH_EXPIRES_IN
          value: "7d"
        - name: PORT
          value: "3000"
        - name: FRONTEND_URL
          value: "https://your-frontend-domain.com"
        - name: API_URL
          value: "https://your-api-domain.com"
        volumeMounts:
        - name: uploads
          mountPath: /app/uploads
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
      volumes:
      - name: uploads
        persistentVolumeClaim:
          claimName: uploads-pvc
---
apiVersion: v1
kind: Service
metadata:
  name: cvking-backend-service
spec:
  selector:
    app: cvking-backend
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
  type: ClusterIP
```

#### Frontend Deployment
```yaml
# k8s/frontend-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: cvking-frontend
  labels:
    app: cvking-frontend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: cvking-frontend
  template:
    metadata:
      labels:
        app: cvking-frontend
    spec:
      containers:
      - name: frontend
        image: your-registry/cvking-frontend:latest
        ports:
        - containerPort: 3000
        env:
        - name: NEXT_PUBLIC_API_URL
          value: "https://your-api-domain.com/api/v1"
        - name: NEXT_PUBLIC_WS_URL
          value: "wss://your-api-domain.com"
        - name: NEXT_PUBLIC_GOOGLE_CLIENT_ID
          valueFrom:
            secretKeyRef:
              name: cvking-secrets
              key: google-client-id
        - name: NEXT_PUBLIC_LINKEDIN_CLIENT_ID
          valueFrom:
            secretKeyRef:
              name: cvking-secrets
              key: linkedin-client-id
        livenessProbe:
          httpGet:
            path: /
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: cvking-frontend-service
spec:
  selector:
    app: cvking-frontend
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
  type: ClusterIP
```

#### Ingress Configuration
```yaml
# k8s/ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: cvking-ingress
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/rewrite-target: /
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/rate-limit: "100"
    nginx.ingress.kubernetes.io/rate-limit-window: "1m"
spec:
  tls:
  - hosts:
    - your-api-domain.com
    - your-frontend-domain.com
    secretName: cvking-tls
  rules:
  - host: your-api-domain.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: cvking-backend-service
            port:
              number: 80
  - host: your-frontend-domain.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: cvking-frontend-service
            port:
              number: 80
```

### 2. Create Kubernetes Secrets
```bash
kubectl create secret generic cvking-secrets \
  --from-literal=mysql-root-password="your_root_password" \
  --from-literal=mysql-database="cvking_db" \
  --from-literal=mysql-user="cvking_user" \
  --from-literal=mysql-password="your_mysql_password" \
  --from-literal=jwt-secret="your_jwt_secret" \
  --from-literal=jwt-refresh-secret="your_refresh_secret" \
  --from-literal=google-client-id="your_google_client_id" \
  --from-literal=linkedin-client-id="your_linkedin_client_id"
```

### 3. Deploy to Kubernetes
```bash
# Apply all manifests
kubectl apply -f k8s/

# Verify deployment
kubectl get pods
kubectl get services
kubectl get ingress
```

## CI/CD with Jenkins

### Jenkins Pipeline Configuration

Create a `Jenkinsfile` in the project root:

```groovy
pipeline {
    agent any
    
    environment {
        DOCKER_REGISTRY = 'your-registry.com'
        IMAGE_NAME = 'cvking'
        TAG = "${BUILD_NUMBER}"
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Build Backend') {
            steps {
                dir('backend') {
                    sh 'npm install'
                    sh 'npm run build'
                    sh 'docker build -t ${DOCKER_REGISTRY}/${IMAGE_NAME}-backend:${TAG} .'
                }
            }
        }
        
        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                    sh 'npm run build'
                    sh 'docker build -t ${DOCKER_REGISTRY}/${IMAGE_NAME}-frontend:${TAG} .'
                }
            }
        }
        
        stage('Test') {
            parallel {
                stage('Backend Tests') {
                    steps {
                        dir('backend') {
                            sh 'npm test'
                            sh 'npm run test:e2e'
                        }
                    }
                }
                stage('Frontend Tests') {
                    steps {
                        dir('frontend') {
                            sh 'npm test'
                            sh 'npm run build'
                        }
                    }
                }
            }
        }
        
        stage('Push Images') {
            steps {
                script {
                    docker.withRegistry("https://${DOCKER_REGISTRY}", 'docker-registry-credentials') {
                        sh "docker push ${DOCKER_REGISTRY}/${IMAGE_NAME}-backend:${TAG}"
                        sh "docker push ${DOCKER_REGISTRY}/${IMAGE_NAME}-frontend:${TAG}"
                    }
                }
            }
        }
        
        stage('Deploy to Staging') {
            when {
                branch 'develop'
            }
            steps {
                sh "kubectl apply -f k8s/ -n staging"
                sh "kubectl set image deployment/cvking-backend cvking-backend=${DOCKER_REGISTRY}/${IMAGE_NAME}-backend:${TAG} -n staging"
                sh "kubectl set image deployment/cvking-frontend cvking-frontend=${DOCKER_REGISTRY}/${IMAGE_NAME}-frontend:${TAG} -n staging"
            }
        }
        
        stage('Deploy to Production') {
            when {
                branch 'main'
            }
            steps {
                input message: 'Deploy to production?', ok: 'Deploy'
                sh "kubectl apply -f k8s/ -n production"
                sh "kubectl set image deployment/cvking-backend cvking-backend=${DOCKER_REGISTRY}/${IMAGE_NAME}-backend:${TAG} -n production"
                sh "kubectl set image deployment/cvking-frontend cvking-frontend=${DOCKER_REGISTRY}/${IMAGE_NAME}-frontend:${TAG} -n production"
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
        success {
            script {
                slackSend channel: '#deployments',
                         color: 'good',
                         message: "Deployment successful: ${env.JOB_NAME} - ${env.BUILD_NUMBER}"
            }
        }
        failure {
            script {
                slackSend channel: '#deployments',
                         color: 'danger',
                         message: "Deployment failed: ${env.JOB_NAME} - ${env.BUILD_NUMBER}"
            }
        }
    }
}
```

### Jenkins Setup

1. **Install Required Plugins**:
   - Docker Pipeline
   - Kubernetes
   - Slack Notification
   - Pipeline

2. **Configure Credentials**:
   - Docker registry credentials
   - Kubernetes cluster credentials
   - Slack webhook URL

3. **Create Jenkins Job**:
   - New Item → Pipeline
   - Configure SCM to point to your repository
   - Set pipeline definition to "Pipeline script from SCM"
   - Specify the path to your `Jenkinsfile`

## Monitoring and Logging

### Health Checks

#### Backend Health Endpoint
```http
GET /health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 3600,
  "database": "connected",
  "version": "1.0.0"
}
```

#### Frontend Health Check
```http
GET /
```

### Monitoring Setup

#### Prometheus Metrics
Add to your application:

```typescript
// backend/src/metrics.ts
import { register, collectDefaultMetrics } from 'prom-client';

collectDefaultMetrics();

export const httpRequestDuration = new register.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status']
});

export const httpRequestTotal = new register.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status']
});
```

#### Grafana Dashboards
Create dashboards for:
- Application performance metrics
- Database connection health
- API response times
- Error rates
- User activity

### Log Management

#### Structured Logging
```typescript
// backend/src/logger.ts
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

export default logger;
```

## Security Considerations

### SSL/TLS Configuration
- Use Let's Encrypt for SSL certificates
- Configure HSTS headers
- Enable TLS 1.2+ only
- Use strong cipher suites

### Security Headers
```nginx
# nginx.conf
add_header X-Frame-Options DENY;
add_header X-Content-Type-Options nosniff;
add_header X-XSS-Protection "1; mode=block";
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";
add_header Content-Security-Policy "default-src 'self'";
```

### Database Security
- Use strong passwords
- Enable SSL for database connections
- Regular security updates
- Backup encryption

### Application Security
- Input validation and sanitization
- Rate limiting
- CORS configuration
- Secure session management

## Troubleshooting

### Common Issues

#### Database Connection Issues
```bash
# Check database connectivity
docker-compose exec backend ping mysql

# Check database logs
docker-compose logs mysql

# Verify database credentials
docker-compose exec backend env | grep DB_
```

#### Application Startup Issues
```bash
# Check application logs
docker-compose logs backend

# Verify environment variables
docker-compose exec backend env

# Check health endpoint
curl http://localhost:3000/health
```

#### Frontend Build Issues
```bash
# Check build logs
docker-compose logs frontend

# Verify environment variables
docker-compose exec frontend env

# Test application
curl http://localhost:80
```

### Performance Issues

#### Database Performance
- Monitor slow queries
- Add appropriate indexes
- Optimize query patterns
- Consider read replicas

#### Application Performance
- Monitor memory usage
- Check for memory leaks
- Optimize API responses
- Implement caching

#### Frontend Performance
- Enable gzip compression
- Optimize images
- Implement lazy loading
- Monitor bundle size

## Backup and Recovery

### Database Backup
```bash
# Create backup
docker-compose exec mysql mysqldump -u root -p cvking_db > backup.sql

# Restore backup
docker-compose exec mysql mysql -u root -p cvking_db < backup.sql
```

### Application Backup
- Backup Docker volumes
- Store configuration files in version control
- Document deployment procedures

### Disaster Recovery
- Regular backup testing
- Multi-region deployment
- Automated recovery procedures
- Monitoring and alerting

This deployment guide provides comprehensive instructions for deploying CVKing to various environments, from single-server setups to Kubernetes clusters with CI/CD pipelines.