# How to Access Your Social Media Platform

## 🌐 Frontend (Web Application)

**Direct Access:**
- **URL:** http://localhost
- **Port:** 80
- **Status:** ✅ Already exposed via LoadBalancer

Simply open your browser and go to: **http://localhost**

---

## 🔌 Backend API Access

The backend is currently only accessible within the cluster. To access it from your local machine, use port-forwarding:

### Option 1: Port Forward (Recommended for Testing)

```powershell
# Port forward backend service
kubectl port-forward -n social-media svc/backend-service 5000:5000
```

Then access the API at: **http://localhost:5000/api**

### Option 2: Direct Pod Port Forward

```powershell
# Get backend pod name
$pod = kubectl get pod -l app=backend -n social-media -o jsonpath='{.items[0].metadata.name}'

# Port forward
kubectl port-forward -n social-media $pod 5000:5000
```

---

## 📋 Quick Access Commands

### Open Frontend in Browser
```powershell
Start-Process "http://localhost"
```

### Port Forward Backend (in separate terminal)
```powershell
kubectl port-forward -n social-media svc/backend-service 5000:5000
```

### Check Service Status
```powershell
kubectl get svc -n social-media
```

### View Pod Logs
```powershell
# Frontend logs
kubectl logs -f deployment/frontend -n social-media

# Backend logs
kubectl logs -f deployment/backend -n social-media
```

---

## 🔍 Verify Services Are Running

```powershell
# Check all pods
kubectl get pods -n social-media

# Check services
kubectl get svc -n social-media

# Test frontend endpoint
curl http://localhost

# Test backend (after port-forward)
curl http://localhost:5000/api/posts
```

---

## 🌍 Network Access

- **Frontend:** http://localhost (Port 80)
- **Backend API:** http://localhost:5000/api (requires port-forward)
- **MySQL:** Only accessible within cluster (Port 3306)

---

## 🐛 Troubleshooting

If http://localhost doesn't work:

1. **Check if service is running:**
   ```powershell
   kubectl get svc frontend-service -n social-media
   ```

2. **Check pod status:**
   ```powershell
   kubectl get pods -l app=frontend -n social-media
   ```

3. **View frontend logs:**
   ```powershell
   kubectl logs -f deployment/frontend -n social-media
   ```

4. **Restart frontend if needed:**
   ```powershell
   kubectl rollout restart deployment/frontend -n social-media
   ```

