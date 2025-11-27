pipeline {
    agent any
    
    environment {
        DOCKER_REGISTRY = 'your-registry.io'
        DOCKER_IMAGE_BACKEND = "${DOCKER_REGISTRY}/social-media-backend"
        DOCKER_IMAGE_FRONTEND = "${DOCKER_REGISTRY}/social-media-frontend"
        KUBERNETES_NAMESPACE = 'social-media'
        KUBECONFIG = credentials('kubeconfig')
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Build Backend') {
            steps {
                dir('social-media-backend') {
                    script {
                        def backendImage = docker.build("${DOCKER_IMAGE_BACKEND}:${env.BUILD_NUMBER}")
                        backendImage.push("${env.BUILD_NUMBER}")
                        backendImage.push("latest")
                    }
                }
            }
        }
        
        stage('Build Frontend') {
            steps {
                dir('social-media-frontend') {
                    script {
                        def frontendImage = docker.build(
                            "${DOCKER_IMAGE_FRONTEND}:${env.BUILD_NUMBER}",
                            "--build-arg REACT_APP_API_URL=${env.REACT_APP_API_URL ?: 'http://backend-service:5000/api'}"
                        )
                        frontendImage.push("${env.BUILD_NUMBER}")
                        frontendImage.push("latest")
                    }
                }
            }
        }
        
        stage('Test Backend') {
            steps {
                dir('social-media-backend') {
                    sh 'npm install'
                    sh 'npm test || true' // Add tests when available
                }
            }
        }
        
        stage('Test Frontend') {
            steps {
                dir('social-media-frontend') {
                    sh 'npm install'
                    sh 'npm test -- --watchAll=false || true' // Add tests when available
                }
            }
        }
        
        stage('Security Scan') {
            steps {
                script {
                    sh '''
                        # Scan backend image
                        docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
                            aquasec/trivy image ${DOCKER_IMAGE_BACKEND}:${BUILD_NUMBER} || true
                        
                        # Scan frontend image
                        docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
                            aquasec/trivy image ${DOCKER_IMAGE_FRONTEND}:${BUILD_NUMBER} || true
                    '''
                }
            }
        }
        
        stage('Deploy to Kubernetes') {
            steps {
                script {
                    withCredentials([file(credentialsId: 'kubeconfig', variable: 'KUBECONFIG')]) {
                        sh '''
                            export KUBECONFIG=${KUBECONFIG}
                            
                            # Update image tags in deployment files
                            sed -i "s|image:.*social-media-backend.*|image: ${DOCKER_IMAGE_BACKEND}:${BUILD_NUMBER}|g" k8s/backend-deployment.yaml
                            sed -i "s|image:.*social-media-frontend.*|image: ${DOCKER_IMAGE_FRONTEND}:${BUILD_NUMBER}|g" k8s/frontend-deployment.yaml
                            
                            # Apply Kubernetes manifests
                            kubectl apply -f k8s/namespace.yaml
                            kubectl apply -f k8s/configmap.yaml
                            kubectl apply -f k8s/secrets.yaml
                            kubectl apply -f k8s/mysql-deployment.yaml
                            kubectl apply -f k8s/backend-deployment.yaml
                            kubectl apply -f k8s/frontend-deployment.yaml
                            
                            # Wait for deployments
                            kubectl rollout status deployment/backend -n ${KUBERNETES_NAMESPACE} --timeout=300s
                            kubectl rollout status deployment/frontend -n ${KUBERNETES_NAMESPACE} --timeout=300s
                        '''
                    }
                }
            }
        }
        
        stage('Ansible Deployment') {
            when {
                anyOf {
                    branch 'main'
                    branch 'master'
                }
            }
            steps {
                script {
                    sh '''
                        # Install Ansible if not present
                        pip3 install ansible || true
                        
                        # Run Ansible playbook
                        ansible-playbook -i ansible/inventory.ini ansible/deploy.yml \
                            -e "build_number=${BUILD_NUMBER}" \
                            -e "docker_registry=${DOCKER_REGISTRY}" \
                            --become
                    '''
                }
            }
        }
    }
    
    post {
        success {
            echo 'Pipeline succeeded!'
            emailext (
                subject: "SUCCESS: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'",
                body: "Build successful. Check console output at ${env.BUILD_URL}",
                to: "${env.CHANGE_AUTHOR_EMAIL}"
            )
        }
        failure {
            echo 'Pipeline failed!'
            emailext (
                subject: "FAILED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'",
                body: "Build failed. Check console output at ${env.BUILD_URL}",
                to: "${env.CHANGE_AUTHOR_EMAIL}"
            )
        }
        always {
            cleanWs()
        }
    }
}

