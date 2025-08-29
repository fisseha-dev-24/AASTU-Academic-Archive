# Session Management System

## Overview
The AASTU Archive System now includes a robust session management system that prevents automatic logout and supports multiple user logins.

## Features

### 🔐 Persistent Sessions
- **No Automatic Logout**: Users stay logged in until they explicitly log out
- **Token Validation**: Automatic verification of token validity on app load
- **Session Recovery**: Restores user session from localStorage on page refresh

### 👥 Multiple User Support
- **8 Test Accounts**: Pre-configured accounts for all user roles
- **Easy Switching**: Quick login with pre-filled credentials
- **Role-Based Access**: Automatic redirection based on user role

## Test Accounts

### Students
1. **Fisseha Akele** (fisseha.akele@aastustudent.edu.et)
   - Student ID: ETS0675/14
   - Department: Computer Science and Engineering

2. **Yohannes Tesfaye** (yohannes.tesfaye@aastustudent.edu.et)
   - Student ID: ETS0676/14
   - Department: Civil Engineering

### Teachers
1. **Firaol Nigusse** (firaol.nigusse@aastustudent.edu.et)
   - Department: Computer Science and Engineering

2. **Tigist Haile** (tigist.haile@aastu.edu.et)
   - Department: Civil Engineering

3. **Gelead Worku** (gelead@gmail.com)
   - Department: Computer Science and Engineering

### Department Heads
1. **Burka Labsi** (burka.labsi@aastustudent.edu.et)
   - Department: Computer Science and Engineering

2. **Abebe Kebede** (abebe.kebede@aastu.edu.et)
   - Department: Computer Science

### College Dean
1. **Henok Tademe** (henoktademe@gmail.com)
   - Department: Electrical Engineering

## How to Use

### Account Switcher
1. Visit `/accounts` to see all available test accounts
2. Click "Copy Details" to copy account information
3. Click "Login" to auto-fill the login form
4. All accounts use password: `test@123`

### Session Management
- **Login**: Automatically saves session to localStorage
- **Logout**: Clears all session data and redirects to login
- **Token Expiry**: Automatically detects expired tokens and logs out user
- **Page Refresh**: Session persists across browser refreshes

## Technical Implementation

### Frontend Components
- `AuthContext`: Manages authentication state globally
- `ProtectedRoute`: Handles route protection and role-based access
- `LogoutButton`: Consistent logout functionality across the app
- `AccountSwitcher`: Easy account switching for development

### Backend Endpoints
- `POST /api/login`: User authentication
- `GET /api/test-auth`: Token validation
- `GET /api/user/profile`: User profile data
- `POST /api/logout`: Session termination

### Security Features
- **Token-based Authentication**: Using Laravel Sanctum
- **Role-based Access Control**: Automatic redirection based on user role
- **Session Validation**: Regular token verification
- **Secure Storage**: Tokens stored in localStorage with validation

## Usage Examples

### Using the Auth Context
```typescript
import { useAuth } from "@/contexts/AuthContext"

function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth()
  
  if (!isAuthenticated) {
    return <div>Please log in</div>
  }
  
  return (
    <div>
      <p>Welcome, {user?.name}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

### Protected Routes
```typescript
import ProtectedRoute from "@/components/ProtectedRoute"

function TeacherDashboard() {
  return (
    <ProtectedRoute allowedRoles={['teacher']}>
      <div>Teacher Dashboard Content</div>
    </ProtectedRoute>
  )
}
```

### Logout Button
```typescript
import LogoutButton from "@/components/LogoutButton"

function Header() {
  return (
    <header>
      <LogoutButton variant="outline" size="sm" />
    </header>
  )
}
```

## Benefits

1. **Better User Experience**: No more unexpected logouts
2. **Development Efficiency**: Easy switching between test accounts
3. **Security**: Proper token validation and session management
4. **Scalability**: Ready for production use with proper security measures
5. **Consistency**: Unified authentication across all pages

## Next Steps

- [ ] Add session timeout configuration
- [ ] Implement remember me functionality
- [ ] Add multi-factor authentication
- [ ] Create user profile management
- [ ] Add session analytics
