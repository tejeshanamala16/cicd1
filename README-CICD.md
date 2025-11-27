# CI/CD Setup for Social Media Platform

This repository contains a complete CI/CD setup for deploying the Social Media Platform using Jenkins, Docker, Kubernetes, and Ansible.

## 📁 Project Structure

```
.
├── social-media-backend/      # Node.js backend application
│   ├── Dockerfile
│   └── .dockerignore
├── social-media-frontend/     # React frontend application
│   ├── Dockerfile
│   ├── nginx.conf
│   └── .dockerignore
├── k8s/                       # Kubernetes manifests
│   ├── namespace.yaml
│   ├── configmap.yaml
│   ├── secrets.yaml
│   ├── mysql-deployment.yaml
│   ├── backend-deployment.yaml
│   ├── frontend-deployment.yaml
│   └── ingress.yaml
├── ansible/                   # Ansible playbooks
│   ├── deploy.yml
│   ├── install-ansible.yml
│   ├── inventory.ini
│   ├── ansible.cfg
│   └── requirements.txt
├── Jenkinsfile                # Jenkins CI/CD pipeline
├── docker-compose.yml         # Local development setup
├── install-ansible.sh         # Ansible installation (Linux/Mac)
├── install-ansible.ps1        # Ansible installation (Windows)
└── DEPLOYMENT.md              # Detailed deployment guide
```

## 🚀 Quick Start

### 1. Install Ansible

**Linux/Mac:**
```bash
chmod +x install-ansible.sh
./install-ansible.sh
```

**Windows:**
```powershell
.\install-ansible.ps1
```

**Or manually:**
```bash
pip3 install -r ansible/requirements.txt
```

### 2. Configure Kubernetes Inventory

Edit `ansible/inventory.ini` with your cluster details:
```ini
[kubernetes-master]
master1 ansible_host=your-k8s-master-ip ansible_user=ubuntu

[kubernetes-nodes]
node1 ansible_host=your-k8s-node-ip ansible_user=ubuntu
```

### 3. Update Secrets

Edit `k8s/secrets.yaml` with your actual secrets:
```yaml
stringData:
  DB_PASSWORD: "your-secure-password"
  JWT_SECRET: "your-super-secret-jwt-key"
```

### 4. Deploy with Ansible

```bash
ansible-playbook -i ansible/inventory.ini ansible/deploy.yml \
  -e "db_password=your-password" \
  -e "jwt_secret=your-secret" \
  -e "docker_registry=your-registry.io" \
  -e "build_number=latest"
```

## 🐳 Docker Commands

### Build Images

```bash
# Backend
cd social-media-backend
docker build -t your-registry.io/social-media-backend:latest .

# Frontend
cd social-media-frontend
docker build --build-arg REACT_APP_API_URL=http://backend-service:5000/api \
  -t your-registry.io/social-media-frontend:latest .
```

### Local Development with Docker Compose

```bash
docker-compose up -d
```

Access:
- Frontend: http://localhost
- Backend API: http://localhost:5000/api

## ☸️ Kubernetes Deployment

### Manual Deployment

```bash
# Apply all manifests
kubectl apply -f k8s/

# Check status
kubectl get all -n social-media

# View logs
kubectl logs -f deployment/backend -n social-media
```

### Using Ansible

```bash
ansible-playbook -i ansible/inventory.ini ansible/deploy.yml
```

## 🔄 Jenkins Pipeline

### Setup

1. Install Jenkins plugins:
   - Docker Pipeline
   - Kubernetes CLI
   - Ansible

2. Configure credentials:
   - Docker registry (ID: `docker-registry`)
   - Kubernetes kubeconfig (ID: `kubeconfig`)

3. Create pipeline job:
   - Source: Git repository
   - Script path: `Jenkinsfile`

### Pipeline Stages

1. **Checkout** - Clone repository
2. **Build Backend** - Build and push Docker image
3. **Build Frontend** - Build and push Docker image
4. **Test** - Run unit tests
5. **Security Scan** - Scan Docker images
6. **Deploy to Kubernetes** - Apply manifests
7. **Ansible Deployment** - Run Ansible playbook

## 📋 Configuration Files

### Environment Variables

**Backend:**
- `DB_HOST` - MySQL host
- `DB_PORT` - MySQL port (default: 3306)
- `DB_NAME` - Database name
- `DB_USER` - Database user
- `DB_PASSWORD` - Database password
- `JWT_SECRET` - JWT secret key
- `PORT` - Backend port (default: 5000)

**Frontend:**
- `REACT_APP_API_URL` - Backend API URL

### Kubernetes Resources

- **Namespace**: `social-media`
- **MySQL**: 1 replica, 10Gi storage
- **Backend**: 3 replicas
- **Frontend**: 2 replicas

## 🔐 Security Notes

1. **Secrets**: Never commit real secrets to Git. Use:
   - Kubernetes Secrets
   - Sealed Secrets
   - External secret management (Vault, AWS Secrets Manager)

2. **Image Registry**: Update `DOCKER_REGISTRY` in Jenkinsfile

3. **TLS**: Configure ingress with TLS certificates

4. **Network Policies**: Implement Kubernetes network policies

## 🐛 Troubleshooting

### Ansible Issues

```bash
# Test connection
ansible all -i ansible/inventory.ini -m ping

# Check Ansible version
ansible --version
```

### Kubernetes Issues

```bash
# Check pod status
kubectl get pods -n social-media

# Describe pod
kubectl describe pod <pod-name> -n social-media

# View logs
kubectl logs <pod-name> -n social-media
```

### Docker Issues

```bash
# Check Docker images
docker images | grep social-media

# Test image locally
docker run -p 5000:5000 your-registry.io/social-media-backend:latest
```

## 📚 Documentation

- [DEPLOYMENT.md](DEPLOYMENT.md) - Detailed deployment guide
- [QUICK_START.md](QUICK_START.md) - Quick start for development

## 🛠️ Tools Used

- **Docker** - Containerization
- **Jenkins** - CI/CD pipeline
- **Kubernetes** - Container orchestration
- **Ansible** - Infrastructure automation
- **Nginx** - Web server for frontend
- **MySQL** - Database

## 📝 License

ISC

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md)

