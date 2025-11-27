# Running Frontend and Backend Services

## 🚀 Services Status

Both services are now running in the background:

### Backend API
- **URL:** http://localhost:5000
- **API Endpoint:** http://localhost:5000/api
- **Status:** Running in background
- **Location:** `social-media-backend/`

### Frontend (React App)
- **URL:** http://localhost:3000
- **Status:** Running in background
- **Location:** `social-media-frontend/`
- **Auto-opens in browser:** Yes

---

## 📋 Service Management

### Check if services are running:

```powershell
# Check ports
netstat -ano | Select-String ":5000|:3000"

# Check Node processes
Get-Process | Where-Object {$_.ProcessName -like "*node*"}
```

### Stop services:

```powershell
# Stop backend (port 5000)
Get-Process | Where-Object {$_.Id -eq (Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue).OwningProcess} | Stop-Process

# Stop frontend (port 3000)
Get-Process | Where-Object {$_.Id -eq (Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue).OwningProcess} | Stop-Process
```

### Restart services manually:

**Backend:**
```powershell
cd social-media-backend
npm start
```

**Frontend:**
```powershell
cd social-media-frontend
npm start
```

---

## 🔧 Configuration

### Backend Environment Variables
Located in: `social-media-backend/.env`
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your-secure-password
DB_NAME=social_media_db
DB_PORT=3306
JWT_SECRET=your-super-secret-key-12345
PORT=5000
```

### Frontend API Configuration
Located in: `social-media-frontend/src/api.js`
- Default API URL: `http://localhost:5000/api`
- Can be overridden with `REACT_APP_API_URL` environment variable

---

## 🧪 Test the Services

### Test Backend API:
```powershell
# Test health
curl http://localhost:5000/api/posts

# Test with PowerShell
Invoke-WebRequest -Uri http://localhost:5000/api/posts
```

### Test Frontend:
- Open browser: http://localhost:3000
- The React app should load automatically

---

## 📝 Notes

- **Backend** runs on port **5000**
- **Frontend** runs on port **3000** (React development server)
- Frontend automatically proxies API requests to backend
- Both services run in **background** mode
- Services will continue running until stopped or system restart

---

## 🐛 Troubleshooting

### Port already in use:
```powershell
# Find process using port 5000
Get-NetTCPConnection -LocalPort 5000 | Select-Object OwningProcess

# Find process using port 3000
Get-NetTCPConnection -LocalPort 3000 | Select-Object OwningProcess

# Kill process (replace PID with actual process ID)
Stop-Process -Id <PID> -Force
```

### Database connection error:
- Ensure MySQL is running
- Check `.env` file credentials
- Verify database `social_media_db` exists

### Frontend not connecting to backend:
- Verify backend is running on port 5000
- Check browser console for CORS errors
- Ensure `REACT_APP_API_URL` is set correctly

