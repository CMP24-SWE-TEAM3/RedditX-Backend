pipeline {
    agent any

    stages {
        stage('Pre-Build Setup') {
            steps {
                sh 'pwd'
                pwd 'whoami'
                sh 'cp /home/waleeddevops/api.env ./.env'
                sh 'mv Dockerfile.prod Dockerfile'
            }
        }
        stage('Build') {
            steps {
                sh 'docker-compose up -d --build'
            }
        }
        stage('Post-Build Cleanup') {
            steps {
                sh 'yes y | docker system prune'
            }
        }
    }
}
