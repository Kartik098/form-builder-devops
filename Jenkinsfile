pipeline {
    agent any

    environment {
        NODE_ENV = 'production'
    }

    stages {
        stage('Checkout Code') {
            steps {
                git 'https://github.com/Kartik098/form-builder-devops.git'
            }
        }

        stage('Install Backend Dependencies') {
            steps {
                dir('server') {
                    sh 'npm install'
                }
            }
        }

        stage('Install Frontend Dependencies') {
            steps {
                dir('client') {
                    sh 'npm install'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('client') {
                    sh 'npm run build'
                }
            }
        }

        stage('Run Backend Tests') {
            steps {
                dir('server') {
                    sh 'npm test || echo "Tests failed, but continuing..."'
                }
            }
        }

        stage('Deploy (Optional)') {
            steps {
                echo 'Add deployment steps here'
            }
        }
    }
}
