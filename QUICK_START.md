# Quick Start Guide - Social Media Platform

## 🚀 Getting Started in 5 Steps

### Step 1: Setup MySQL Database

1. Open **MySQL Workbench**
2. Connect to your MySQL server
3. Go to **File → Open SQL Script**
4. Select `social-media-backend/database.sql`
5. Click **Execute** (or press Ctrl+Shift+Enter)

✓ Database and all tables created!

---

### Step 2: Configure Backend

1. Open `social-media-backend/.env`
2. Update your MySQL credentials:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=social_media_db
   DB_PORT=3306
   JWT_SECRET=your_super_secret_key_12345
   PORT=5000
   ```

---

### Step 3: Install & Start Backend

```bash
cd social-media-backend
npm install
npm run dev
```

Expected output:
```
✓ Database connected successfully
Server running on port 5000
```

---

### Step 4: Install & Start Frontend

In a new terminal:

```bash
cd social-media-frontend
npm install
npm start
```

The app will automatically open at `http://localhost:3000`

---

### Step 5: Test the Application

1. **Register a new account**
   - Click "Register"
   - Fill in username, email, password, full name
   - Click "Register"

2. **Create a post**
   - Go to "Feed"
   - Type in the text area
   - Click "Post"

3. **View user profile**
   - Click your username in navbar
   - View/edit your profile
   - Follow other users

---

## 📁 Project Structure

```
d:\CICD\
├── social-media-backend/
│   ├── routes/              # API endpoints
│   ├── middleware/          # Auth middleware
│   ├── server.js            # Main server file
│   ├── database.sql         # SQL schema
│   ├── package.json
│   └── .env                 # Config (update this!)
│
└── social-media-frontend/
    ├── src/
    │   ├── components/      # React components
    │   ├── context/         # Auth context
    │   ├── styles/          # CSS files
    │   ├── api.js           # API client
    │   └── App.js           # Main app
    └── package.json
```

---

## 🔑 Key Features

✅ User registration & login (JWT authentication)
✅ Create, edit, delete posts
✅ Like and comment on posts
✅ Follow/unfollow users
✅ User profiles with stats
✅ Social feed
✅ Responsive design

---

## 📝 Default Test Account

After running the app, create your account or use:
- Email: `test@example.com`
- Password: `password123`

---

## 🛠 Common Issues & Solutions

### Issue: "Database connection error"
**Solution:**
- Check MySQL is running
- Verify `.env` credentials match your MySQL setup
- Ensure `social_media_db` exists

### Issue: "Cannot POST /api/auth/register"
**Solution:**
- Backend server might not be running
- Run `npm run dev` in backend folder
- Check if port 5000 is free

### Issue: "Blank page on frontend"
**Solution:**
- Clear browser cache (Ctrl+Shift+Delete)
- Run `npm start` again in frontend folder
- Open http://localhost:3000 in incognito mode

---

## 📚 API Documentation

### Authentication
```bash
# Register
POST /api/auth/register
Body: { username, email, password, full_name }

# Login
POST /api/auth/login
Body: { email, password }
```

### Posts
```bash
# Get all posts
GET /api/posts

# Create post
POST /api/posts
Header: Authorization: Bearer <token>
Body: { content, image_url }

# Like post
POST /api/posts/:postId/like
Header: Authorization: Bearer <token>
```

### Users
```bash
# Get profile
GET /api/users/:userId

# Follow user
POST /api/users/:userId/follow
Header: Authorization: Bearer <token>
```

---

## 🚀 Deployment Ready

The project is ready to be deployed to:
- **Backend**: Heroku, Railway, Azure App Service
- **Frontend**: Vercel, Netlify, GitHub Pages
- **Database**: AWS RDS, Azure Database, DigitalOcean

---

## 📞 Support

For issues:
1. Check the `database.sql` has been executed
2. Verify `.env` credentials
3. Ensure both servers are running on correct ports
4. Check browser console for errors (F12)

Happy coding! 🎉
