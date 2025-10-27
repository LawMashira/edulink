# Backend Integration Guide

This document explains how to integrate the React frontend with the NestJS backend.

## API Configuration

The application is configured to connect to your NestJS backend API.

### Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:3000
```

### API Endpoints

The frontend is configured to use the following endpoints:

#### Authentication Endpoints

- **POST** `/auth/signup` - User registration
  - Body: `{ name, email, password, role, ... }`
  - Returns: `{ user, accessToken, refreshToken }`

- **POST** `/auth/login` - User login
  - Body: `{ email, password }`
  - Returns: `{ user, accessToken, refreshToken }`

- **POST** `/auth/logout` - User logout
  - Headers: `Authorization: Bearer <accessToken>`
  - Body: `{ refreshToken }`

- **POST** `/auth/refresh` - Refresh access token
  - Body: `{ refreshToken }`

- **GET** `/auth/profile` - Get current user profile
  - Headers: `Authorization: Bearer <accessToken>`

## Implementation Details

### AuthContext Integration

The `AuthContext` has been updated to:

1. **Login**: Calls `/auth/login` endpoint
2. **SignUp**: Calls `/auth/signup` endpoint
3. **Logout**: Calls `/auth/logout` endpoint
4. **Token Storage**: Stores access tokens and refresh tokens in localStorage

### SignUp Component

Update the SignUp component to use the new signUp function:

```typescript
import { useAuth } from '../../context/AuthContext';

const SignUp: React.FC = () => {
  const { signUp } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await signUp(formData);
    if (success) {
      navigate('/dashboard');
    } else {
      // Handle error
    }
  };
  
  // ... rest of component
};
```

## Data Flow

1. User fills out login/signup form
2. Frontend sends request to NestJS backend
3. Backend validates and returns user data + tokens
4. Frontend stores tokens in localStorage
5. All subsequent requests include `Authorization` header with Bearer token

## Testing

### 1. Start the NestJS Backend

```bash
cd your-backend-directory
npm run start:dev
```

### 2. Start the React Frontend

```bash
npm start
```

### 3. Test Registration

Go to `/signup` and register a new user with role 'school_admin' or 'vendor'.

### 4. Test Login

Go to `/login` and login with the credentials you just created.

## Troubleshooting

### CORS Issues

If you encounter CORS errors, make sure your NestJS backend has CORS enabled:

```typescript
// main.ts
app.enableCors({
  origin: 'http://localhost:3001', // React app URL
  credentials: true,
});
```

### Token Expiry

The frontend automatically stores refresh tokens. Implement token refresh logic in your AuthContext to automatically refresh expired tokens.

### Network Errors

Make sure:
1. Backend server is running on the configured port (default: 3000)
2. `REACT_APP_API_URL` environment variable is set correctly
3. No firewall is blocking the connection

## Next Steps

1. Implement token refresh mechanism
2. Add request interceptors for automatic token refresh
3. Implement protected route checks with backend verification
4. Add error handling for network failures
5. Implement retry logic for failed requests
