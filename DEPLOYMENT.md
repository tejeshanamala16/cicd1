# Deployment Guide - Social Media Platform

This guide covers deploying the Social Media Platform using Docker, Jenkins, Kubernetes, and Ansible.

## 📋 Prerequisites

1. **Docker** installed and running
2. **Kubernetes cluster** (minikube, k3s, or cloud provider)
3. **Jenkins** server with Docker plugin
4. **kubectl** configured to access your cluster
5. **Docker registry** (Docker Hub, AWS ECR, GCR, etc.)

## 🐳 Docker Setup

### Build Backend Image

```bash
cd social-media-backend
docker build -t your-registry.io/social-media-backend:latest .
docker push your-registry.io/social-media-backend:latest
```

### Build Frontend Image

```bash
cd social-media-frontend
docker build --build-arg REACT_APP_API_URL=http://backend-service:5000/api -t your-registry.io/social-media-frontend:latest .
docker push your-registry.io/social-media-frontend:latest
```

## ☸️ Kubernetes Deployment

### 1. Update Configuration

Edit `k8s/secrets.yaml` with your actual secrets:

```yaml
stringData:
  DB_PASSWORD: "your-secure-password"
  JWT_SECRET: "your-super-secret-jwt-key"
```

### 2. Apply Kubernetes Manifests

```bash
# Create namespace
kubectl apply -f k8s/namespace.yaml

# Apply ConfigMap and Secrets
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secrets.yaml

# Deploy MySQL
kubectl apply -f k8s/mysql-deployment.yaml

# Wait for MySQL to be ready
kubectl wait --for=condition=ready pod -l app=mysql -n social-media --timeout=300s

# Initialize database (copy SQL file to MySQL pod)
kubectl cp social-media-backend/database.sql social-media/$(kubectl get pod -l app=mysql -n social-media -o jsonpath='{.items[0].metadata.name}'):/tmp/database.sql
kubectl exec -it -n social-media $(kubectl get pod -l app=mysql -n social-media -o jsonpath='{.items[0].metadata.name}') -- mysql -uroot -p$(kubectl get secret social-media-secrets -n social-media -o jsonpath='{.data.DB_PASSWORD}' | base64 -d) social_media_db < /tmp/database.sql

# Deploy Backend and Frontend
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml

# Apply Ingress (optional)
kubectl apply -f k8s/ingress.yaml
```

### 3. Verify Deployment

```bash
# Check pods
kubectl get pods -n social-media

# Check services
kubectl get svc -n social-media

# Check deployments
kubectl get deployments -n social-media

# View logs
kubectl logs -f deployment/backend -n social-media
kubectl logs -f deployment/frontend -n social-media
```

## 🔄 Jenkins CI/CD Pipeline

### 1. Configure Jenkins

1. Install required plugins:
   - Docker Pipeline
   - Kubernetes CLI
   - Ansible

2. Add credentials:
   - Docker registry credentials (ID: `docker-registry`)
   - Kubernetes kubeconfig (ID: `kubeconfig`)

3. Update `Jenkinsfile`:
   - Set `DOCKER_REGISTRY` to your registry
   - Update `KUBERNETES_NAMESPACE` if needed
   - Configure email notifications

### 2. Create Jenkins Pipeline

1. Go to Jenkins → New Item
2. Select "Pipeline"
3. In Pipeline section:
   - Definition: Pipeline script from SCM
   - SCM: Git
   - Repository URL: Your Git repository
   - Script Path: `Jenkinsfile`

### 3. Run Pipeline

The pipeline will:
1. Checkout code
2. Build Docker images
3. Run tests
4. Security scan
5. Deploy to Kubernetes
6. Run Ansible playbook (optional)

## 🤖 Ansible Deployment

### 1. Install Ansible

```bash
# On your local machine or CI/CD server
pip3 install -r ansible/requirements.txt

# Or use the playbook
ansible-playbook ansible/install-ansible.yml
```

### 2. Configure Inventory

Edit `ansible/inventory.ini` with your Kubernetes cluster details:

```ini
[kubernetes-master]
master1 ansible_host=your-k8s-master-ip ansible_user=ubuntu

[kubernetes-nodes]
node1 ansible_host=your-k8s-node-ip ansible_user=ubuntu
```

### 3. Run Ansible Playbook

```bash
# Set variables
export db_password="your-secure-password"
export jwt_secret="your-jwt-secret"
export docker_registry="your-registry.io"
export build_number="latest"

# Run deployment
ansible-playbook -i ansible/inventory.ini ansible/deploy.yml \
  -e "db_password=${db_password}" \
  -e "jwt_secret=${jwt_secret}" \
  -e "docker_registry=${docker_registry}" \
  -e "build_number=${build_number}" \
  --become
```

## 🔧 Environment Variables

### Backend
- `DB_HOST`: MySQL host (default: mysql-service)
- `DB_PORT`: MySQL port (default: 3306)
- `DB_NAME`: Database name (default: social_media_db)
- `DB_USER`: Database user (default: root)
- `DB_PASSWORD`: Database password
- `JWT_SECRET`: JWT secret key
- `PORT`: Backend port (default: 5000)

### Frontend
- `REACT_APP_API_URL`: Backend API URL

## 📊 Monitoring

### Check Pod Status

```bash
kubectl get pods -n social-media -w
```

### View Logs

```bash
# Backend logs
kubectl logs -f deployment/backend -n social-media

# Frontend logs
kubectl logs -f deployment/frontend -n social-media

# MySQL logs
kubectl logs -f deployment/mysql -n social-media
```

### Scale Deployments

```bash
# Scale backend
kubectl scale deployment backend --replicas=5 -n social-media

# Scale frontend
kubectl scale deployment frontend --replicas=3 -n social-media
```

## 🔐 Security Best Practices

1. **Secrets Management**: Use sealed-secrets or external secret management (AWS Secrets Manager, HashiCorp Vault)
2. **Image Scanning**: Enable Trivy or similar in CI/CD pipeline
3. **Network Policies**: Implement Kubernetes network policies
4. **RBAC**: Configure proper role-based access control
5. **TLS**: Enable TLS for ingress
6. **Resource Limits**: Set appropriate CPU and memory limits

## 🐛 Troubleshooting

### Pods not starting

```bash
# Check pod events
kubectl describe pod <pod-name> -n social-media

# Check logs
kubectl logs <pod-name> -n social-media
```

### Database connection issues

```bash
# Test MySQL connection
kubectl exec -it deployment/mysql -n social-media -- mysql -uroot -p

# Check MySQL service
kubectl get svc mysql-service -n social-media
```

### Image pull errors

```bash
# Check image pull secrets
kubectl get secrets -n social-media

# Verify registry credentials
docker login your-registry.io
```

## 📚 Additional Resources

- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Jenkins Pipeline Documentation](https://www.jenkins.io/doc/book/pipeline/)
- [Ansible Documentation](https://docs.ansible.com/)
- [Docker Documentation](https://docs.docker.com/)

## 🚀 Quick Start

For a quick deployment:

```bash
# 1. Build and push images
cd social-media-backend && docker build -t your-registry.io/social-media-backend:latest . && docker push your-registry.io/social-media-backend:latest
cd ../social-media-frontend && docker build --build-arg REACT_APP_API_URL=http://backend-service:5000/api -t your-registry.io/social-media-frontend:latest . && docker push your-registry.io/social-media-frontend:latest

# 2. Update secrets
# Edit k8s/secrets.yaml with your values

# 3. Deploy to Kubernetes
kubectl apply -f k8s/

# 4. Wait for deployment
kubectl wait --for=condition=available deployment --all -n social-media --timeout=300s

# 5. Get service URL
kubectl get svc frontend-service -n social-media
```

Happy deploying! 🎉

