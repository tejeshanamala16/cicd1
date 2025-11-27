# Social Media Platform

A full-stack social media application built with React, Node.js/Express, and MySQL.

## Features

- **Authentication**: User registration and login with JWT tokens
- **Posts**: Create, read, update, and delete posts
- **Comments**: Add comments to posts
- **Likes**: Like and unlike posts
- **Follow System**: Follow and unfollow users
- **User Profiles**: View and edit user profiles
- **Social Feed**: See posts from all users

## Project Structure

```
social-media-platform/
├── social-media-backend/
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── posts.js
│   │   └── comments.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   ├── database.sql
│   ├── package.json
│   └── .env
└── social-media-frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── Auth.js
    │   │   ├── Feed.js
    │   │   ├── Profile.js
    │   │   └── Navbar.js
    │   ├── context/
    │   │   └── AuthContext.js
    │   ├── styles/
    │   ├── api.js
    │   ├── App.js
    │   ├── index.js
    │   └── index.css
    └── package.json
```

## Setup Instructions

### Backend Setup

1. **Install Dependencies**
   ```bash
   cd social-media-backend
   npm install
   ```

2. **Setup Database**
   - Open MySQL Workbench
   - Create a new connection or use existing one
   - Open the `database.sql` file
   - Execute all SQL statements to create tables and indexes

3. **Configure Environment Variables**
   - Edit `.env` file with your MySQL credentials:
     ```
     DB_HOST=localhost
     DB_USER=root
     DB_PASSWORD=your_password
     DB_NAME=social_media_db
     JWT_SECRET=your_secret_key
     PORT=5000
     ```

4. **Start Backend Server**
   ```bash
   npm run dev
   ```
   The server will run on `http://localhost:5000`

### Frontend Setup

1. **Install Dependencies**
   ```bash
   cd social-media-frontend
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   ```
   The app will open at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users/:userId` - Get user profile
- `PUT /api/users/:userId` - Update user profile
- `POST /api/users/:userId/follow` - Follow user
- `POST /api/users/:userId/unfollow` - Unfollow user

### Posts
- `GET /api/posts` - Get all posts (feed)
- `GET /api/posts/user/:userId` - Get user's posts
- `POST /api/posts` - Create post
- `PUT /api/posts/:postId` - Update post
- `DELETE /api/posts/:postId` - Delete post
- `POST /api/posts/:postId/like` - Like post
- `POST /api/posts/:postId/unlike` - Unlike post

### Comments
- `GET /api/comments/post/:postId` - Get post comments
- `POST /api/comments` - Create comment
- `PUT /api/comments/:commentId` - Update comment
- `DELETE /api/comments/:commentId` - Delete comment

## Technologies Used

### Frontend
- React 18
- React Router DOM
- Axios
- Date-fns
- CSS3

### Backend
- Node.js
- Express.js
- MySQL2
- JWT (JSON Web Tokens)
- Bcryptjs
- CORS

## Future Enhancements

- Real-time notifications
- Direct messaging
- Search functionality
- Image upload
- Trending posts
- User recommendations
- Dark mode
- Mobile app

## License

ISC
