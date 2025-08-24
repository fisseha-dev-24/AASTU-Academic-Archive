import os

def create_directory_structure():
    """Create the complete directory structure for AASTU Archive System"""
    
    directories = [
        # Core app structure
        "app",
        "app/(auth)",
        "app/(auth)/login",
        "app/(auth)/signup", 
        "app/(dashboard)",
        "app/(dashboard)/student",
        "app/(dashboard)/teacher",
        "app/(dashboard)/department-head",
        "app/(dashboard)/college-dean",
        "app/(dashboard)/admin",
        
        # Components
        "components",
        "components/ui",
        "components/layout",
        "components/dashboard",
        "components/auth",
        "components/common",
        
        # Specific feature components
        "components/student",
        "components/teacher", 
        "components/department-head",
        "components/college-dean",
        "components/admin",
        
        # Utilities and hooks
        "lib",
        "hooks",
        "types",
        "utils",
        
        # Static assets
        "public",
        "public/images",
        "public/icons",
        
        # Styles
        "styles"
    ]
    
    files = [
        # Root configuration files
        "next.config.mjs",
        "tailwind.config.js", 
        "tsconfig.json",
        "package.json",
        
        # App router files
        "app/layout.tsx",
        "app/page.tsx",
        "app/globals.css",
        
        # Auth pages
        "app/(auth)/login/page.tsx",
        "app/(auth)/signup/page.tsx",
        "app/(auth)/layout.tsx",
        
        # Dashboard pages
        "app/(dashboard)/student/page.tsx",
        "app/(dashboard)/teacher/page.tsx", 
        "app/(dashboard)/department-head/page.tsx",
        "app/(dashboard)/college-dean/page.tsx",
        "app/(dashboard)/admin/page.tsx",
        "app/(dashboard)/layout.tsx",
        
        # Layout components
        "components/layout/Header.tsx",
        "components/layout/Footer.tsx",
        "components/layout/Sidebar.tsx",
        "components/layout/DashboardLayout.tsx",
        
        # Auth components
        "components/auth/LoginForm.tsx",
        "components/auth/SignupForm.tsx",
        
        # Common components
        "components/common/SearchBar.tsx",
        "components/common/DocumentCard.tsx",
        "components/common/UserAvatar.tsx",
        "components/common/LoadingSpinner.tsx",
        
        # Dashboard specific components
        "components/student/BrowseDocuments.tsx",
        "components/student/Suggestions.tsx",
        "components/student/ExamSection.tsx",
        "components/student/VideoSection.tsx",
        
        "components/teacher/UploadDocument.tsx",
        "components/teacher/MyDocuments.tsx", 
        "components/teacher/PendingApproval.tsx",
        "components/teacher/Analytics.tsx",
        
        "components/department-head/Overview.tsx",
        "components/department-head/DocumentApproval.tsx",
        "components/department-head/TeachersList.tsx",
        "components/department-head/DepartmentAnalytics.tsx",
        
        "components/college-dean/Overview.tsx",
        "components/college-dean/DocumentsTree.tsx",
        "components/college-dean/TeachersTree.tsx",
        
        "components/admin/ManageUsers.tsx",
        "components/admin/AuditLogs.tsx",
        "components/admin/SystemSettings.tsx",
        
        # Types and utilities
        "types/index.ts",
        "types/user.ts",
        "types/document.ts",
        "lib/utils.ts",
        "lib/api.ts",
        "hooks/useAuth.ts",
        "hooks/useDocuments.ts"
    ]
    
    print("Creating AASTU Archive System directory structure...")
    
    # Create directories
    for directory in directories:
        os.makedirs(directory, exist_ok=True)
        print(f"✓ Created directory: {directory}")
    
    # Create files
    for file_path in files:
        directory = os.path.dirname(file_path)
        if directory:
            os.makedirs(directory, exist_ok=True)
        
        # Create empty file if it doesn't exist
        if not os.path.exists(file_path):
            with open(file_path, 'w') as f:
                f.write("")
            print(f"✓ Created file: {file_path}")
    
    print("\n🎉 Directory structure created successfully!")
    print("\nNext steps:")
    print("1. Navigate to your project directory")
    print("2. Run: npm install")
    print("3. Start development: npm run dev")

if __name__ == "__main__":
    create_directory_structure()
