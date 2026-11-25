pipeline {
    agent any

    environment {
        DOCKERHUB_CREDS = credentials('dockerhub-creds')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Lint & Syntax Check') {
            steps {
                sh '''
                    docker run --rm -v "$PWD":/app -w /app python:3.11-slim \
                        python -m py_compile server/main.py server/dbconfig.py server/models/db_models.py server/models/models.py alert-service/main.py

                    docker run --rm -v "$PWD/client":/app -w /app node:20-alpine \
                        sh -c "npm ci && npm run lint"
                '''
            }
        }

        stage('Build & Push Docker Images') {
            steps {
                sh '''
                    echo "$DOCKERHUB_CREDS_PSW" | docker login -u "$DOCKERHUB_CREDS_USR" --password-stdin

                    docker build -t "$DOCKERHUB_CREDS_USR/inventory-server:${BUILD_NUMBER}" -t "$DOCKERHUB_CREDS_USR/inventory-server:latest" ./server
                    docker build -t "$DOCKERHUB_CREDS_USR/inventory-alert:${BUILD_NUMBER}" -t "$DOCKERHUB_CREDS_USR/inventory-alert:latest" ./alert-service
                    docker build -t "$DOCKERHUB_CREDS_USR/inventory-client:${BUILD_NUMBER}" -t "$DOCKERHUB_CREDS_USR/inventory-client:latest" ./client

                    docker push "$DOCKERHUB_CREDS_USR/inventory-server:${BUILD_NUMBER}"
                    docker push "$DOCKERHUB_CREDS_USR/inventory-server:latest"
                    docker push "$DOCKERHUB_CREDS_USR/inventory-alert:${BUILD_NUMBER}"
                    docker push "$DOCKERHUB_CREDS_USR/inventory-alert:latest"
                    docker push "$DOCKERHUB_CREDS_USR/inventory-client:${BUILD_NUMBER}"
                    docker push "$DOCKERHUB_CREDS_USR/inventory-client:latest"
                '''
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                withCredentials([file(credentialsId: 'inventory-env', variable: 'ENV_FILE')]) {
                    sh '''
                        set -a
                        . "$ENV_FILE"
                        set +a
                        export DOCKERHUB_USER="$DOCKERHUB_CREDS_USR"

                        for f in k8s/*.yaml; do envsubst < "$f"; done | kubectl apply -f -

                        kubectl rollout restart deployment/server deployment/alert-service deployment/client
                        kubectl rollout status deployment/server --timeout=120s
                        kubectl rollout status deployment/alert-service --timeout=120s
                        kubectl rollout status deployment/client --timeout=120s
                    '''
                }
            }
        }
    }

    post {
        always {
            sh 'docker logout || true'
        }
        success {
            echo "Deployment #${BUILD_NUMBER} completed successfully."
        }
        failure {
            echo "Pipeline failed on build #${BUILD_NUMBER}."
        }
    }
}
