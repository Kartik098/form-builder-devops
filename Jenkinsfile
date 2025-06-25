pipeline {
    agent any

    stages {
        stage('Clone') {
            steps {
                echo 'Cloning Repository...'
                // Jenkins already checks out code automatically in this case
            }
        }
        stage('Install Dependencies') {
            steps {
                dir('server') {
                    sh 'npm install'
                }
                dir('client') {
                    sh 'npm install'
                }
            }
        }
        stage('Build Client') {
            steps {
                dir('client') {
                    sh 'npm run build'
                }
            }
        }
        stage('Start Server') {
            steps {
                dir('server') {
                    sh 'npm start &'
                }
            }
        }
    }
}
