# AASTU Academic Archive

A comprehensive digital document management system for Addis Ababa Science and Technology University (AASTU).

## System Architecture

This project consists of three main components:

1. **Frontend**: Next.js React application with TypeScript
2. **Backend**: Laravel PHP API
3. **Database**: MySQL database with sample data

## Prerequisites

- Node.js (v18 or higher)
- PHP (v8.1 or higher)
- Composer
- MySQL (XAMPP or standalone)
- npm or pnpm

## Database Setup

The database has been pre-configured with the following credentials:
- **Database**: `AASTU_Academic_Archive`
- **Username**: `root`
- **Password**: `cipherlegend#24`
- **Host**: `127.0.0.1`
- **Port**: `3306`

### Sample Users

The system comes with pre-configured users for testing:

| Email | Password | Role | Dashboard |
|-------|----------|------|-----------|
| student@aastu.edu.et | password | Student | /student/dashboard |
| teacher@aastu.edu.et | password | Teacher | /teacher/dashboard |
| depthead@aastu.edu.et | password | Department Head | /department/dashboard |
| dean@aastu.edu.et | password | College Dean | /dean/dashboard |
| admin@aastu.edu.et | password | IT Manager | /admin/dashboard |

## Installation & Setup

### 1. Backend Setup

```bash
cd backend

# Install PHP dependencies
composer install

# Copy environment file (already done)
cp prod.env.example .env

# Generate application key (already done)
php artisan key:generate

# Run database migrations (if needed)
php artisan migrate

# Start the Laravel server
php artisan serve --host=0.0.0.0 --port=8000
```

The backend will be available at: `http://localhost:8000`

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install
# or
pnpm install

# Start the development server
npm run dev
# or
pnpm dev
```

The frontend will be available at: `http://localhost:3000`

## Features Implemented

### Authentication System
- ✅ User registration with role selection
- ✅ User login with role-based redirection
- ✅ JWT token-based authentication
- ✅ Role-based access control

### Role-Based Dashboards
- ✅ Student Dashboard (`/student/dashboard`)
- ✅ Teacher Dashboard (`/teacher/dashboard`)
- ✅ Department Head Dashboard (`/department/dashboard`)
- ✅ College Dean Dashboard (`/dean/dashboard`)
- ✅ IT Manager Dashboard (`/admin/dashboard`)

### Database Integration
- ✅ MySQL database with proper schema
- ✅ Sample departments and categories
- ✅ Sample users for testing
- ✅ Foreign key relationships

### API Endpoints
- ✅ `POST /api/login` - User authentication
- ✅ `POST /api/register` - User registration
- ✅ `POST /api/logout` - User logout
- ✅ `GET /api/departments` - Get departments list
- ✅ `GET /api/user` - Get current user info

## How to Test

1. **Start both servers** (backend on port 8000, frontend on port 3000)
2. **Navigate to** `http://localhost:3000`
3. **Click "Sign In"** to test login functionality
4. **Use any of the sample users** listed above
5. **Or click "Sign Up"** to create a new account
6. **After login/registration**, you'll be redirected to the appropriate dashboard based on your role

## API Communication

The frontend communicates with the Laravel backend through RESTful API endpoints:

- **Base URL**: `http://localhost:8000/api`
- **Authentication**: JWT tokens stored in localStorage
- **CORS**: Configured to allow requests from `http://localhost:3000`

## File Structure

```
aastu_academic_archive/
├── backend/                 # Laravel API
│   ├── app/
│   │   ├── Http/Controllers/
│   │   │   └── Auth/        # Authentication controllers
│   │   └── Models/          # Eloquent models
│   ├── routes/
│   │   └── api.php          # API routes
│   └── config/
│       └── cors.php         # CORS configuration
├── frontend/                # Next.js application
│   ├── app/                 # App router pages
│   ├── lib/
│   │   └── api.ts          # API client utilities
│   └── components/         # React components
└── Database_design/        # Database schema files
```

## Next Steps

The basic authentication and role-based routing system is now connected. Future enhancements can include:

1. Document upload and management
2. Document review workflow
3. User profile management
4. Advanced search and filtering
5. File storage integration
6. Email notifications
7. Audit logging
8. Advanced permissions system

## Troubleshooting

### Database Connection Issues
- Ensure MySQL is running (XAMPP or standalone)
- Verify database credentials in `backend/.env`
- Check if the database `AASTU_Academic_Archive` exists

### CORS Issues
- Ensure the backend is running on port 8000
- Check CORS configuration in `backend/config/cors.php`
- Verify frontend is making requests to the correct API URL

### Authentication Issues
- Clear browser localStorage if tokens are corrupted
- Check browser console for API errors
- Verify the backend is responding to API requests

## Support

For technical support, contact: support@aastu.edu.et
