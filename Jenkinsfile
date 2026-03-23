pipeline {
    agent any

    environment {
        BACKEND_IMAGE_NAME = "cv-king-backend-1"
        FRONTEND_IMAGE_NAME = "cv-king-frontend-1"
        SERVER_HOST = "ec2-15-135-224-224.ap-southeast-2.compute.amazonaws.com"
        SERVER_USER = "ubuntu"

        // MySQL Configuration
        MYSQL_ROOT_PASSWORD = "TokExscZiEiqyXnCgCkFmxXGobgmQqTM"
        MYSQL_DATABASE = "railway"
        MYSQL_USER = "root"
        MYSQL_PASSWORD = "TokExscZiEiqyXnCgCkFmxXGobgmQqTM"

        // JWT Configuration
        JWT_SECRET = "cv-king-super-secret-jwt-key-2024-secure"
        JWT_EXPIRES_IN = "24h"

        // Docker Registry
        DOCKER_REGISTRY = "docker.io/hoangtuanphong"
    }

    stages {
        /* === STAGE 1: CHECKOUT CODE === */
        stage('Checkout') {
            steps {
                echo "📦 Đang lấy source code từ GitHub..."
                checkout([$class: 'GitSCM',
                    branches: [[name: '*/main']],
                    userRemoteConfigs: [[
                        url: 'https://github.com/hoangtuanphong1a/JOB_CV_NEW.git',
                        credentialsId: 'github-pat'
                    ]]
                ])
            }
        }

        /* === STAGE 2: BUILD DOCKER IMAGES === */
        stage('Docker Build & Push') {
            steps {
                echo "🐳 Bắt đầu build Docker images..."
                withCredentials([usernamePassword(credentialsId: 'dockerhub-cred',
                    usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh '''
                    set -e
                    REGISTRY=docker.io/$DOCKER_USER

                    echo "🚧 Build backend..."
                    docker build --no-cache --build-arg CACHE_BUST=${BUILD_NUMBER} -f backend/Dockerfile -t ${REGISTRY}/${BACKEND_IMAGE_NAME}:latest ./backend

                    echo "🚧 Build frontend..."
                    docker build -f frontend/Dockerfile -t ${REGISTRY}/${FRONTEND_IMAGE_NAME}:latest ./frontend

                    echo "🔑 Đăng nhập Docker Hub..."
                    echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin

                    echo "⬆️ Push frontend image..."
                    docker push ${REGISTRY}/${FRONTEND_IMAGE_NAME}:latest

                    echo "⬆️ Push backend image..."
                    docker push ${REGISTRY}/${BACKEND_IMAGE_NAME}:latest

                    echo "✅ Docker build & push hoàn tất."
                    '''
                }
            }
        }

        /* === STAGE 3: TEST SSH CONNECTION === */
        stage('Test Server Connection') {
            steps {
                echo "🔗 Kiểm tra kết nối SSH tới server..."
                sshagent (credentials: ['server-ssh-key']) {
                    sh 'ssh -o StrictHostKeyChecking=no -v $SERVER_USER@$SERVER_HOST "echo Kết nối SSH thành công ✅"'
                }
            }
        }

        /* === STAGE 4: DEPLOY SERVER === */
        stage('Deploy Server') {
            steps {
                echo "🚀 Bắt đầu deploy lên server..."
                withCredentials([
                    usernamePassword(credentialsId: 'dockerhub-cred',
                        usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS'),
                    string(credentialsId: 'db-conn', variable: 'DB_CONN'),
                    file(credentialsId: 'docker-compose-file', variable: 'DOCKER_COMPOSE_FILE')
                ]) {
                  sshagent (credentials: ['server-ssh-key']) {
                    sh '''
                    set -e

                    # Verify credentials are available
                    echo "🔐 Docker credentials check:"
                    echo "USER: $DOCKER_USER"
                    echo "PASS length: ${#DOCKER_PASS}"

                    echo "=== [1/6] Tạo thư mục ~/project trên server ==="
                    ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_HOST "mkdir -p ~/project && chmod 755 ~/project"

                    echo "=== [2/6] Copy docker-compose.yml lên server ==="
                    scp -o StrictHostKeyChecking=no $DOCKER_COMPOSE_FILE $SERVER_USER@$SERVER_HOST:~/project/docker-compose.yml

                    echo "=== [3/6] Bắt đầu deploy trên server ==="
                    ssh -T -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_HOST <<REMOTE_EOF
                    set -ex
                    cd ~/project

                    # Export environment variables for remote shell
                    export DOCKER_USER="$DOCKER_USER"
                    export DOCKER_PASS="$DOCKER_PASS"
                    export DB_CONN="$DB_CONN"
                    export BACKEND_IMAGE_NAME="$BACKEND_IMAGE_NAME"
                    export FRONTEND_IMAGE_NAME="$FRONTEND_IMAGE_NAME"
                    export MYSQL_ROOT_PASSWORD="$MYSQL_ROOT_PASSWORD"
                    export MYSQL_DATABASE="$MYSQL_DATABASE"
                    export MYSQL_USER="$MYSQL_USER"
                    export MYSQL_PASSWORD="$MYSQL_PASSWORD"
                    export JWT_SECRET="$JWT_SECRET"

                    echo "➡️ Tạo file .env"
                    cat > .env <<EOF
DB_CONNECTION_STRING=\$DB_CONN
DOCKER_REGISTRY=docker.io/\$DOCKER_USER
BACKEND_IMAGE_NAME=\$BACKEND_IMAGE_NAME
FRONTEND_IMAGE_NAME=\$FRONTEND_IMAGE_NAME
MYSQL_ROOT_PASSWORD=\$MYSQL_ROOT_PASSWORD
MYSQL_DATABASE=\$MYSQL_DATABASE
MYSQL_USER=\$MYSQL_USER
MYSQL_PASSWORD=\$MYSQL_PASSWORD
JWT_SECRET=\$JWT_SECRET
EOF

                    echo "🔑 Docker login"
                    mkdir -p ~/.docker
                    echo "\$DOCKER_PASS" | docker login -u "\$DOCKER_USER" --password-stdin docker.io

                    # Alternative: Create auth config manually if login fails
                    if [ \$? -ne 0 ]; then
                      echo "⚠️ Docker login failed, trying manual auth config..."
                      AUTH_TOKEN=\$(echo -n "\$DOCKER_USER:\$DOCKER_PASS" | base64 -w 0)
                      cat > ~/.docker/config.json <<EOF
{
  "auths": {
    "https://index.docker.io/v1/": {
      "auth": "\$AUTH_TOKEN"
    }
  }
}
EOF
                    fi

                    echo "🧹 Dừng và xoá container cũ"
                    docker compose --env-file .env down --timeout 60 --volumes --remove-orphans || true
                    docker container prune -f || true

                    echo "⬇️ Kéo image mới nhất"
                    docker compose --env-file .env pull

                    echo "▶️ Khởi động lại toàn bộ services"
                    docker compose --env-file .env up -d

                    echo "⏳ Đợi health checks..."
                    sleep 30

                    echo "📊 Kiểm tra trạng thái services"
                    docker ps

                    echo "🧽 Dọn dẹp image không còn dùng"
                    docker image prune -f

                    echo "✅ Deploy thành công!"
REMOTE_EOF
                    '''
                  }
                }
            }
        }
    }

    post {
        success {
            echo "🎉 Pipeline hoàn tất thành công!"
            echo "📱 FRONTEND: http://${SERVER_HOST}:3000"
            echo "🔧 BACKEND HEALTH: http://${SERVER_HOST}:3001/health"
            echo "📚 SWAGGER DOCS: http://${SERVER_HOST}:3001/api"
        }
        failure {
            echo "❌ Pipeline thất bại, vui lòng kiểm tra log ở stage bị lỗi."
        }
    }
}
