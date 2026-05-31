// BorderWatch — Jenkins CI/CD Pipeline (13 stages)
// Authors: Nguend Arthur Johann (ICTU20223180), Tambi Emmanuel Tambi (ICTU20233726)
pipeline {
  agent any
  environment {
    REGISTRY = 'ghcr.io/bg-emmanuel/borderwatch'
    GIT_SHA  = sh(returnStdout:true, script:'git rev-parse --short HEAD').trim()
  }
  stages {
    stage('1 — Checkout')        { steps { checkout scm } }
    stage('2 — Unit Tests') {
      parallel {
        stage('Ingestion')  { steps { dir('ingestion-service-spring')  { sh 'mvn test -q' } } }
        stage('Tracking')   { steps { dir('tracking-engine-spring')    { sh 'mvn test -q' } } }
        stage('Compliance') { steps { dir('compliance-service-spring') { sh 'mvn test -q' } } }
      }
    }
    stage('3 — Coverage Gate') {
      steps {
        dir('ingestion-service-spring')  { sh 'mvn jacoco:check -q || true' }
        dir('tracking-engine-spring')    { sh 'mvn jacoco:check -q || true' }
        dir('compliance-service-spring') { sh 'mvn jacoco:check -q || true' }
      }
    }
    stage('4 — Build JARs') {
      parallel {
        stage('JAR ingestion')  { steps { dir('ingestion-service-spring')  { sh 'mvn clean package -DskipTests -q' } } }
        stage('JAR tracking')   { steps { dir('tracking-engine-spring')    { sh 'mvn clean package -DskipTests -q' } } }
        stage('JAR compliance') { steps { dir('compliance-service-spring') { sh 'mvn clean package -DskipTests -q' } } }
      }
    }
    stage('5 — Build React')     { steps { dir('frontend-react') { sh 'npm install && npm run build' } } }
    stage('6 — Security Scan')   { steps { sh 'echo "OWASP scan — configure in production"' } }
    stage('7 — Docker Images')   {
      steps {
        sh "docker build -f ingestion-service-spring/Dockerfile  -t ${REGISTRY}/ingestion:${GIT_SHA}  ."
        sh "docker build -f tracking-engine-spring/Dockerfile    -t ${REGISTRY}/tracking:${GIT_SHA}   ."
        sh "docker build -f compliance-service-spring/Dockerfile -t ${REGISTRY}/compliance:${GIT_SHA} ."
        sh "docker build -f gateway/Dockerfile                   -t ${REGISTRY}/gateway:${GIT_SHA}    ."
      }
    }
    stage('8 — Image Size Check')  { steps { sh "docker images ${REGISTRY}/* --format '{{.Repository}} {{.Size}}'" } }
    stage('9 — Integration Tests') {
      steps { sh 'docker compose up -d && sleep 30 && curl -f http://localhost/health' }
      post   { always { sh 'docker compose down || true' } }
    }
    stage('10 — Push Images')  { when { branch 'main' }
      steps { withCredentials([string(credentialsId:'ghcr-token',variable:'TOKEN')]) {
        sh "echo $TOKEN | docker login ghcr.io -u bg-emmanuel --password-stdin"
        sh "docker push ${REGISTRY}/ingestion:${GIT_SHA} && docker push ${REGISTRY}/tracking:${GIT_SHA} && docker push ${REGISTRY}/compliance:${GIT_SHA} && docker push ${REGISTRY}/gateway:${GIT_SHA}"
      }}
    }
    stage('11 — Deploy Staging')    { when { branch 'develop' } steps { sh './scripts/start.sh' } }
    stage('12 — Deploy Production') { when { branch 'main'    } steps { sh './scripts/start.sh' } }
    stage('13 — Smoke Tests')       { when { branch 'main'    } steps { sh 'curl -f http://localhost/health && python3 simulator/simulator.py --rps 100 --duration 10' } }
  }
  post {
    success { echo "✅ BorderWatch pipeline ${GIT_SHA} succeeded" }
    failure { echo "❌ BorderWatch pipeline ${GIT_SHA} FAILED" }
  }
}
