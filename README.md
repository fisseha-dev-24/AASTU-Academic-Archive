# 🎓 AASTU Academic Archive System

A comprehensive academic document management system for Addis Ababa Science and Technology University (AASTU), built with modern web technologies.

## 🌟 Features

### 👥 Multi-Role System
- **Students**: Browse, search, and download approved documents
- **Teachers**: Upload, manage, and track their documents
- **Department Heads**: Review and approve documents from their department
- **Deans**: Oversee department activities and access analytics
- **IT Managers**: System administration and maintenance

### 📚 Document Management
- ✅ **Upload & Storage**: Secure file upload with validation
- ✅ **Preview & Download**: In-browser preview and secure downloads
- ✅ **Search & Filter**: Advanced search with multiple filters
- ✅ **Approval Workflow**: Department head approval system
- ✅ **Version Control**: Document versioning and history
- ✅ **Audit Logging**: Complete activity tracking

### 🔐 Security & Authentication
- ✅ **JWT Authentication**: Secure token-based authentication
- ✅ **Role-Based Access**: Granular permissions per user role
- ✅ **File Security**: Protected file access with authorization
- ✅ **Input Validation**: Comprehensive input sanitization
- ✅ **CORS Protection**: Secure cross-origin requests

## 🛠️ Technology Stack

### Backend
- **Framework**: Laravel 12 (PHP 8.4)
- **Database**: MySQL 8.0
- **Authentication**: Laravel Sanctum
- **File Storage**: Laravel Storage (Local/Cloud)
- **API**: RESTful API with JSON responses

### Frontend
- **Framework**: Next.js 14 (React 18)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + Shadcn/ui
- **State Management**: React Context + Hooks
- **Notifications**: Sonner Toast

### Development Tools
- **Package Manager**: npm (Frontend) / Composer (Backend)
- **Version Control**: Git
- **Code Quality**: ESLint, Prettier
- **Database**: MySQL with migrations

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PHP 8.4+
- MySQL 8.0+
- Composer
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/fisseha-dev-24/AASTU-Academic-Archive.git
   cd AASTU-Academic-Archive
   ```

2. **Backend Setup**
   ```bash
   cd backend
   composer install
   cp .env.example .env
   php artisan key:generate
   php artisan migrate
   php artisan db:seed
   php artisan storage:link
   php artisan serve --host=0.0.0.0 --port=8000
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000/api

### Environment Configuration

#### Backend (.env)
```env
APP_NAME="AASTU Academic Archive"
APP_ENV=local
APP_KEY=your-app-key
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=aastu_archive
DB_USERNAME=your_username
DB_PASSWORD=your_password

SANCTUM_STATEFUL_DOMAINS=localhost:3000,127.0.0.1:3000
SESSION_DOMAIN=localhost
```

## 📁 Project Structure

```
AASTU-Academic-Archive/
├── backend/                 # Laravel API Backend
│   ├── app/
│   │   ├── Http/Controllers/
│   │   ├── Models/
│   │   └── Middleware/
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   ├── routes/
│   └── storage/
├── frontend/               # Next.js Frontend
│   ├── app/
│   │   ├── student/        # Student pages
│   │   ├── teacher/        # Teacher pages
│   │   ├── department/     # Department head pages
│   │   └── dean/          # Dean pages
│   ├── components/
│   ├── lib/
│   └── contexts/
└── README.md
```

## 🔧 API Documentation

### Authentication
```bash
POST /api/login
POST /api/register
POST /api/logout
```

### Student Endpoints
```bash
GET /api/student/search-documents
GET /api/student/exam-materials
GET /api/student/videos
GET /api/student/suggestions
GET /api/student/stats
```

### Teacher Endpoints
```bash
GET /api/teacher/documents
POST /api/teacher/upload-document
GET /api/teacher/stats
```

### Department Head Endpoints
```bash
GET /api/department/pending-documents
POST /api/department/review-document/{id}
GET /api/department/stats
```

### Document Endpoints
```bash
GET /api/documents/{id}/preview
GET /api/documents/{id}/download
```

## 👥 User Roles & Permissions

### Student
- Browse approved documents
- Search and filter documents
- Download documents
- View personal profile
- Access exam materials and videos

### Teacher
- Upload documents
- Manage own documents
- View document analytics
- Access student feedback
- Manage schedule and office hours

### Department Head
- Review pending documents
- Approve/reject documents
- View department analytics
- Manage faculty members
- Generate reports

### Dean
- Oversee all departments
- Access institutional analytics
- View faculty management
- Generate institutional reports

## 🔒 Security Features

- **Authentication**: JWT tokens with Sanctum
- **Authorization**: Role-based access control
- **File Security**: Protected file access
- **Input Validation**: Comprehensive validation
- **Audit Logging**: Complete activity tracking
- **CORS Protection**: Secure cross-origin requests

## 📊 Database Schema

### Core Tables
- `users` - User accounts and roles
- `departments` - University departments
- `documents` - Document metadata
- `document_reviews` - Approval workflow
- `audit_logs` - Activity tracking

### Supporting Tables
- `schedules` - Teacher schedules
- `feedback` - Student feedback
- `deadlines` - Academic deadlines
- `office_hours` - Teacher office hours

## 🧪 Testing

### Backend Testing
```bash
cd backend
php artisan test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 🚀 Deployment

### Production Setup
1. Configure production environment variables
2. Set up production database
3. Configure file storage (AWS S3 recommended)
4. Set up SSL certificates
5. Configure web server (Nginx/Apache)

### Docker Deployment
```bash
docker-compose up -d
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Authors

- **Fisseha Akele** - *Initial work* - [fisseha-dev-24](https://github.com/fisseha-dev-24)

## 🙏 Acknowledgments

- Addis Ababa Science and Technology University
- Laravel Framework Team
- Next.js Team
- Tailwind CSS Team
- All contributors and supporters

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Contact: [Your Contact Information]
- Documentation: [Link to Documentation]

---

**Built with ❤️ for AASTU Academic Community**
