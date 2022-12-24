pipeline {
    agent any

    stages {
        stage('Pre-Build Setup') {
            steps {
                sh 'whoami'
                sh 'pwd'
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
        stage('E2E Test') {
            agent {
                docker {
                    image 'cypress/base:latest'
                }
            }
            steps {
                sh 'pwd'
            }
        }
    }
}
