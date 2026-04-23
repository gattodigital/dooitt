# Dooitt - MEAN Stack Task Manager

A modern, secure task management application built with the MEAN stack (MongoDB, Express, Angular, Node.js).

## Features

- ✨ User authentication with JWT tokens
- 🔐 Secure password hashing with bcryptjs
- 📝 Task creation and management
- 👥 User profiles
- 🎨 Modern, responsive UI
- 🔒 Protected API endpoints
- ⏱️ Token expiration and automatic logout

## Security Features

- Strong password requirements (8+ characters, uppercase, lowercase, numbers)
- Password confirmation on sign-up
- JWT token validation on all protected routes
- 1-hour token expiration
- Rate limiting on authentication endpoints
- Input validation and sanitization
- Protection against NoSQL injection

## Prerequisites

- **Node.js**: v20.x or higher
- **npm**: v10.x or higher
- **MongoDB**: v4.4 or higher

## Environment Variables

### Back-End (.env)

Create a `.env` file in the `back-end` directory:

```bash
# Required
MONGODB_URI=mongodb://localhost:27017/dooitt
JWT_SECRET=your-secret-key-here-change-in-production

# Optional
PORT=3000
CORS_ORIGIN=http://localhost:4200
```

**Important**: Never commit your `.env` file. Use a strong, random `JWT_SECRET` in production.

### Front-End

For production builds, set the API URL in `front-end/src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-api-url.com'
};
```

For local development, update `front-end/src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000'
};
```

## Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/gattodigital/dooitt.git
cd dooitt
```

### 2. Install Back-End Dependencies

```bash
cd back-end
npm install
```

### 3. Install Front-End Dependencies

```bash
cd ../front-end
npm install
```

### 4. Set Up Environment Variables

```bash
cd ../back-end
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
```

### 5. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# macOS (with Homebrew)
brew services start mongodb-community

# Ubuntu/Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

### 6. Start the Back-End Server

```bash
cd back-end
npm start
```

The API will be available at `http://localhost:3000`

### 7. Start the Front-End Development Server

```bash
cd front-end
ng serve
```

The application will be available at `http://localhost:4200`

## Building for Production

### Front-End

```bash
cd front-end
npm run build -- --configuration production
```

The build artifacts will be in `front-end/dist/dooitt/`

### Back-End

The back-end doesn't require a build step. Deploy the source code with:

```bash
cd back-end
npm install --production
node server.js
```

## GitHub Pages Deployment

The application automatically deploys to GitHub Pages when you push to the `master` or `main` branch.

### Required GitHub Secrets

Set these in your repository settings (Settings → Secrets → Actions):

- `API_URL`: Your back-end API URL (e.g., `https://api.yourapp.com`)
- `CNAME`: (Optional) Your custom domain for GitHub Pages

## API Endpoints

### Authentication

- `POST /authorization/sign-up` - Create a new account
- `POST /authorization/sign-in` - Sign in to existing account

### Protected Endpoints (Require JWT Token)

- `GET /tasks` - Get all tasks
- `POST /tasks` - Create a new task
- `GET /tasks/:id` - Get task by ID
- `GET /users` - Get all users
- `GET /profile/:id` - Get user profile by ID

### Authentication Header Format

```
Authorization: Bearer <your-jwt-token>
```

## Project Structure

```
dooitt/
├── back-end/              # Node.js/Express API
│   ├── models/            # Mongoose models
│   ├── authorization.js   # Auth routes
│   ├── authMiddleware.js  # JWT validation middleware
│   ├── server.js          # Main server file
│   └── package.json
├── front-end/             # Angular application
│   ├── src/
│   │   ├── app/
│   │   │   ├── sign-in/   # Sign-in component
│   │   │   ├── sign-up/   # Sign-up component
│   │   │   └── ...
│   │   └── environments/  # Environment configs
│   └── package.json
└── .github/workflows/     # CI/CD configuration
```

## Password Requirements

Passwords must meet the following criteria:

- Minimum 8 characters
- At least one uppercase letter (A-Z)
- At least one lowercase letter (a-z)
- At least one number (0-9)

## Rate Limiting

- **Auth endpoints** (`/authorization/*`): 20 requests per 15 minutes per IP
- **API endpoints** (`/tasks`, `/users`, `/profile`): 100 requests per 15 minutes per IP

## Testing

### Running Tests

```bash
# Front-end tests
cd front-end
npm test

# Back-end tests
cd back-end
npm test
```

**Note**: Test suites are currently being developed.

## Known Issues & Roadmap

### Current Limitations

- ⚠️ Angular 6 has known XSS vulnerabilities (upgrade to Angular 18+ planned)
- ⚠️ Tokens stored in localStorage (migration to httpOnly cookies planned)
- ⚠️ No CSRF protection yet
- ⚠️ No account lockout after failed login attempts

### Planned Improvements

- [ ] Upgrade Angular to latest version
- [ ] Implement CSRF protection
- [ ] Add account lockout mechanism
- [ ] Migrate tokens to httpOnly cookies
- [ ] Add comprehensive test suite
- [ ] Add audit logging for security events
- [ ] Add email verification
- [ ] Add password reset functionality
- [ ] Add 2FA support

## Security

### Reporting Vulnerabilities

If you discover a security vulnerability, please email security@gattodigital.com instead of creating a public issue.

### Security Best Practices

1. Always use HTTPS in production
2. Keep `JWT_SECRET` secure and never commit it
3. Regularly update dependencies
4. Use strong, unique passwords
5. Enable rate limiting in production
6. Monitor authentication logs

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

ISC

## Author

Andres Ramirez | Gatto Digital

## Acknowledgments

- Angular CLI for project scaffolding
- MongoDB for database
- JWT for secure authentication
- bcryptjs for password hashing
