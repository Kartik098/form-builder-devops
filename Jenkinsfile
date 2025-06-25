pipeline {
  agent any
  stages {
    stage('Build') {
      steps {
        echo 'Building containers...'
        sh 'docker-compose build'
      }
    }
    stage('Test') {
      steps {
        echo 'Running tests...'
        sh 'docker-compose run --rm server npm test'  // or similar
      }
    }
    stage('Deploy') {
      steps {
        echo 'Deploying app...'
        sh 'docker-compose up -d'
      }
    }
  }
}
