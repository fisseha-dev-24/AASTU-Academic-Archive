const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: string;
  department: string;
  college?: string;
  studentId?: string;
  termsAccepted?: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  user?: any;
  token?: string;
  redirect_url?: string;
  errors?: any;
}

export interface User {
  id: number
  name: string
  email: string
  role: string
  student_id?: string
  department_id?: number
  created_at?: string
  updated_at?: string
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(url, config);

      // Check if we're being redirected to login
      if (response.status === 401 || response.status === 403) {
        // Clear invalid token
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_info');
        // Redirect to login
        window.location.href = '/login';
        throw new Error('Authentication failed');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'An error occurred');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async login(credentials: LoginData): Promise<ApiResponse> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: RegisterData): Promise<ApiResponse> {
    console.log("Sending registration request:", userData)
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout(): Promise<ApiResponse> {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  async getDepartments(): Promise<ApiResponse> {
    return this.request('/departments', {
      method: 'GET',
    });
  }

  async getUser(): Promise<ApiResponse> {
    return this.request('/user', {
      method: 'GET',
    });
  }

  async refreshToken(): Promise<ApiResponse> {
    return this.request('/auth/refresh', {
      method: 'POST',
    });
  }

  // Student dashboard APIs
  async getStudentDashboard(): Promise<ApiResponse> {
    return this.request('/student/dashboard', {
      method: 'GET',
    });
  }

  async getStudentStats(): Promise<ApiResponse> {
    return this.request('/student/stats', {
      method: 'GET',
    });
  }

  async getStudentRecentActivity(): Promise<ApiResponse> {
    return this.request('/student/recent-activity', {
      method: 'GET',
    });
  }

  async getRecentlyAddedDocuments(): Promise<ApiResponse> {
    return this.request('/student/recent-documents', {
      method: 'GET',
    });
  }

  async getRecentlyViewedDocuments(): Promise<ApiResponse> {
    return this.request('/student/recently-viewed-documents', {
      method: 'GET',
    });
  }

  // Get my documents (bookmarked and accessed)
  async getMyDocuments(): Promise<ApiResponse> {
    return this.request('/student/my-documents', {
      method: 'GET',
    });
  }

  // Get downloaded documents
  async getDownloadedDocuments(): Promise<ApiResponse> {
    return this.request('/student/downloaded-documents', {
      method: 'GET',
    });
  }

  // Get study resources
  async getStudyResources(): Promise<ApiResponse> {
    return this.request('/student/study-resources', {
      method: 'GET',
    });
  }

  // Remove from downloads
  async removeFromDownloads(documentId: number): Promise<ApiResponse> {
    return this.request(`/student/downloaded-documents/${documentId}`, {
      method: 'DELETE',
    });
  }

  // Join study group
  async joinStudyGroup(groupId: number): Promise<ApiResponse> {
    return this.request(`/student/study-groups/${groupId}/join`, {
      method: 'POST',
    });
  }

  // Get notification settings
  async getNotificationSettings(): Promise<ApiResponse> {
    return this.request('/user/notification-settings', {
      method: 'GET',
    });
  }

  // Update notification settings
  async updateNotificationSettings(settings: any): Promise<ApiResponse> {
    return this.request('/user/notification-settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }

  // Get privacy settings
  async getPrivacySettings(): Promise<ApiResponse> {
    return this.request('/user/privacy-settings', {
      method: 'GET',
    });
  }

  // Update privacy settings
  async updatePrivacySettings(settings: any): Promise<ApiResponse> {
    return this.request('/user/privacy-settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }

  // Update profile
  async updateProfile(profileData: any): Promise<ApiResponse> {
    return this.request('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // Change password
  async changePassword(passwordData: any): Promise<ApiResponse> {
    return this.request('/user/change-password', {
      method: 'POST',
      body: JSON.stringify(passwordData),
    });
  }

  // Export user data
  async exportUserData(): Promise<ApiResponse> {
    return this.request('/user/export-data', {
      method: 'GET',
    });
  }

  // Get user stats
  async getUserStats(): Promise<ApiResponse> {
    return this.request('/user/stats', {
      method: 'GET',
    });
  }

  // Get user activity
  async getUserActivity(): Promise<ApiResponse> {
    return this.request('/user/activity', {
      method: 'GET',
    });
  }

  // Get user achievements
  async getUserAchievements(): Promise<ApiResponse> {
    return this.request('/user/achievements', {
      method: 'GET',
    });
  }

  // Get FAQs
  async getFAQs(): Promise<ApiResponse> {
    return this.request('/help/faqs', {
      method: 'GET',
    });
  }

  // Get help articles
  async getHelpArticles(): Promise<ApiResponse> {
    return this.request('/help/articles', {
      method: 'GET',
    });
  }

  // Get support tickets
  async getSupportTickets(): Promise<ApiResponse> {
    return this.request('/help/support-tickets', {
      method: 'GET',
    });
  }

  // Create support ticket
  async createSupportTicket(ticketData: any): Promise<ApiResponse> {
    return this.request('/help/support-tickets', {
      method: 'POST',
      body: JSON.stringify(ticketData),
    });
  }

  // Mark FAQ helpful
  async markFAQHelpful(faqId: number): Promise<ApiResponse> {
    return this.request(`/help/faqs/${faqId}/helpful`, {
      method: 'POST',
    });
  }

  // Mark article helpful
  async markArticleHelpful(articleId: number): Promise<ApiResponse> {
    return this.request(`/help/articles/${articleId}/helpful`, {
      method: 'POST',
    });
  }

  async getDepartmentDocuments(): Promise<ApiResponse> {
    return this.request('/student/department-documents', {
      method: 'GET',
    });
  }

  // Tracking APIs
  async trackDocumentView(documentId: number): Promise<ApiResponse> {
    return this.request('/track/view', {
      method: 'POST',
      body: JSON.stringify({ document_id: documentId }),
    });
  }

  async trackDocumentDownload(documentId: number): Promise<ApiResponse> {
    return this.request('/track/download', {
      method: 'POST',
      body: JSON.stringify({ document_id: documentId }),
    });
  }

  // Document download and preview APIs
  async downloadDocument(documentId: number): Promise<void> {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('Authentication required');
    }

    // Get user role to determine the correct endpoint
    const userInfo = localStorage.getItem('user_info');
    let userRole = 'student'; // default
    if (userInfo) {
      try {
        const userData = JSON.parse(userInfo);
        userRole = userData.role || 'student';
      } catch (error) {
        console.warn('Failed to parse user info:', error);
      }
    }

    // Use the correct endpoint based on user role
    let url;
    switch (userRole) {
      case 'teacher':
        url = `${this.baseURL}/teacher/documents/${documentId}/download`;
        break;
      case 'department_head':
        url = `${this.baseURL}/department/documents/${documentId}/download`;
        break;
      case 'college_dean':
        url = `${this.baseURL}/dean/documents/${documentId}/download`;
        break;
      case 'student':
      default:
        url = `${this.baseURL}/documents/${documentId}/download`;
        break;
    }
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Download failed');
    }

    // Get filename from response headers
    const contentDisposition = response.headers.get('content-disposition');
    let filename = `document-${documentId}`;
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/);
      if (filenameMatch) {
        filename = filenameMatch[1];
      }
    }

    // Create blob and download
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);

    // Track the download (don't let tracking errors interfere with download)
    try {
      await this.trackDocumentDownload(documentId);
    } catch (error) {
      console.warn('Failed to track download:', error);
    }
  }

  async previewDocument(documentId: number): Promise<void> {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('Authentication required');
    }

    // Get user role to determine the correct endpoint
    const userInfo = localStorage.getItem('user_info');
    let userRole = 'student'; // default
    if (userInfo) {
      try {
        const userData = JSON.parse(userInfo);
        userRole = userData.role || 'student';
      } catch (error) {
        console.warn('Failed to parse user info:', error);
      }
    }

    // Use the correct endpoint based on user role
    let url;
    switch (userRole) {
      case 'teacher':
        url = `${this.baseURL}/teacher/documents/${documentId}/preview`;
        break;
      case 'department_head':
        url = `${this.baseURL}/department/documents/${documentId}/preview`;
        break;
      case 'college_dean':
        url = `${this.baseURL}/dean/documents/${documentId}/preview`;
        break;
      case 'student':
      default:
        url = `${this.baseURL}/documents/${documentId}/preview`;
        break;
    }
    
    // Track the view first (don't let tracking errors interfere with preview)
    try {
      await this.trackDocumentView(documentId);
    } catch (error) {
      console.warn('Failed to track view:', error);
    }
    
    // Make authenticated request to get the file
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': '*/*',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to preview document');
    }

    // Get the file blob
    const blob = await response.blob();
    
    // Create object URL and open in new tab
    const objectUrl = window.URL.createObjectURL(blob);
    const newWindow = window.open(objectUrl, '_blank');
    
    // Clean up the object URL after a delay
    setTimeout(() => {
      window.URL.revokeObjectURL(objectUrl);
    }, 1000);
  }

  async trackSearch(searchTerm: string, filters?: any): Promise<ApiResponse> {
    return this.request('/track/search', {
      method: 'POST',
      body: JSON.stringify({ search_term: searchTerm, filters }),
    });
  }

  // Browse routes
  async getFilterOptions(): Promise<ApiResponse> {
    return this.request('/student/filter-options', {
      method: 'GET',
    });
  }

  async searchDocuments(params?: any): Promise<ApiResponse> {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    console.log('API Client - searchDocuments called with params:', params);
    console.log('API Client - queryString:', queryString);
    console.log('API Client - full URL:', `${this.baseURL}/student/search-documents${queryString ? `?${queryString}` : ''}`);
    
    try {
      const response = await this.request(`/student/search-documents${queryString ? `?${queryString}` : ''}`, {
        method: 'GET',
      });
      console.log('API Client - searchDocuments response:', response);
      return response;
    } catch (error) {
      console.error('API Client - searchDocuments error:', error);
      throw error;
    }
  }

  // Exam materials APIs
  async getExamMaterials(params?: any): Promise<ApiResponse> {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    return this.request(`/student/exam-materials${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
    });
  }


  // Video library APIs
  async getVideos(params?: any): Promise<ApiResponse> {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    return this.request(`/student/videos${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
    });
  }

  async incrementVideoViews(videoId: number): Promise<ApiResponse> {
    return this.request(`/student/videos/${videoId}/view`, {
      method: 'POST',
    });
  }

  // Study groups APIs
  async getStudyGroups(params?: any): Promise<ApiResponse> {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    return this.request(`/student/study-groups${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
    });
  }

  // Calendar APIs
  async getCalendarEvents(): Promise<ApiResponse> {
    return this.request('/student/calendar-events', {
      method: 'GET',
    });
  }

  // Suggestions APIs
  async getSuggestions(): Promise<ApiResponse> {
    return this.request('/student/suggestions', {
      method: 'GET',
    });
  }

  // Profile APIs
  async getStudentProfile(): Promise<ApiResponse> {
    return this.request('/student/profile', {
      method: 'GET',
    });
  }

  async updateStudentProfile(profileData: any): Promise<ApiResponse> {
    return this.request('/student/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // Teacher dashboard APIs
  async getTeacherStats(): Promise<ApiResponse> {
    return this.request('/teacher/stats', {
      method: 'GET',
    });
  }

  async getTeacherDocuments(): Promise<ApiResponse> {
    return this.request('/teacher/documents', {
      method: 'GET',
    });
  }

  async getTeacherPendingApproval(): Promise<ApiResponse> {
    return this.request('/teacher/pending-approval', {
      method: 'GET',
    });
  }

  // Teacher upload APIs
  async uploadDocument(formData: FormData): Promise<ApiResponse> {
    const url = `${this.baseURL}/teacher/upload-document`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: formData,
      });

      const data = await response.json();

      // Handle both 200 and 201 status codes as success
      if (response.status >= 200 && response.status < 300) {
        return data;
      } else {
        throw new Error(data.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload request failed:', error);
      throw error;
    }
  }

  async getTeacherCategories(): Promise<ApiResponse> {
    return this.request('/teacher/categories', {
      method: 'GET',
    });
  }

  async getTeacherDepartments(): Promise<ApiResponse> {
    return this.request('/teacher/departments', {
      method: 'GET',
    });
  }

  // Teacher document management APIs
  async updateDocument(documentId: number, data: any): Promise<ApiResponse> {
    return this.request(`/teacher/documents/${documentId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteDocument(documentId: number): Promise<ApiResponse> {
    return this.request(`/teacher/documents/${documentId}`, {
      method: 'DELETE',
    });
  }

  async previewTeacherDocument(documentId: number): Promise<void> {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const url = `${this.baseURL}/teacher/documents/${documentId}/preview`;
    
    // Make authenticated request to get the file
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': '*/*',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to preview document (${response.status})`);
    }

    // Get the file blob
    const blob = await response.blob();
    
    // Create object URL and open in new tab
    const objectUrl = window.URL.createObjectURL(blob);
    const newWindow = window.open(objectUrl, '_blank');
    
    // Clean up the object URL after a delay
    setTimeout(() => {
      window.URL.revokeObjectURL(objectUrl);
    }, 1000);
  }

  async downloadTeacherDocument(documentId: number): Promise<void> {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const url = `${this.baseURL}/teacher/documents/${documentId}/download`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Download failed (${response.status})`);
    }

    // Get filename from response headers
    const contentDisposition = response.headers.get('content-disposition');
    let filename = `document-${documentId}`;
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/);
      if (filenameMatch) {
        filename = filenameMatch[1];
      }
    }

    // Create blob and download
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  }

  // Teacher analytics APIs
  async getTeacherAnalytics(): Promise<ApiResponse> {
    return this.request('/teacher/analytics', {
      method: 'GET',
    });
  }

  // Teacher dashboard API
  async getTeacherDashboard(): Promise<ApiResponse> {
    return this.request('/teacher/dashboard', {
      method: 'GET',
    });
  }

  // Teacher video upload APIs
  async uploadVideo(videoData: any): Promise<ApiResponse> {
    return this.request('/teacher/upload-video', {
      method: 'POST',
      body: JSON.stringify(videoData),
    });
  }

  async getTeacherVideos(): Promise<ApiResponse> {
    return this.request('/teacher/videos', {
      method: 'GET',
    });
  }

  // Teacher reviews APIs
  async getTeacherReviews(): Promise<ApiResponse> {
    return this.request('/teacher/reviews', {
      method: 'GET',
    });
  }

  // Teacher schedule APIs
  async getTeacherSchedule(): Promise<ApiResponse> {
    return this.request('/teacher/schedule', {
      method: 'GET',
    });
  }

  async addScheduleItem(data: any): Promise<ApiResponse> {
    return this.request('/teacher/schedule', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async addDeadline(data: any): Promise<ApiResponse> {
    return this.request('/teacher/deadline', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async addOfficeHour(data: any): Promise<ApiResponse> {
    return this.request('/teacher/office-hour', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Teacher student feedback APIs
  async getTeacherStudentFeedback(): Promise<ApiResponse> {
    return this.request('/teacher/student-feedback', {
      method: 'GET',
    });
  }

  // Department Head dashboard APIs
  async getDepartmentStats(): Promise<ApiResponse> {
    return this.request('/department/stats', {
      method: 'GET',
    });
  }

  // Department Head document approval APIs
  async getPendingDocuments(params?: any): Promise<ApiResponse> {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    return this.request(`/department/pending-documents${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
    });
  }

  async reviewDocument(documentId: number, data: any): Promise<ApiResponse> {
    return this.request(`/department/review-document/${documentId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async bulkReviewDocuments(data: any): Promise<ApiResponse> {
    return this.request('/department/bulk-review-documents', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Department Head faculty management APIs
  async getDepartmentFaculty(): Promise<ApiResponse> {
    return this.request('/department/faculty', {
      method: 'GET',
    });
  }

  async getDepartmentCourses(): Promise<ApiResponse> {
    return this.request('/department/courses', {
      method: 'GET',
    });
  }

  // Department Head analytics APIs
  async getDepartmentAnalytics(): Promise<ApiResponse> {
    return this.request('/department/analytics', {
      method: 'GET',
    });
  }

  // Department Head reports APIs
  async getDepartmentReports(params?: any): Promise<ApiResponse> {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    return this.request(`/department/reports${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
    });
  }

  // College Dean APIs
  async getDeanStats(): Promise<ApiResponse> {
    return this.request('/dean/stats', {
      method: 'GET',
    });
  }

  async getDeanDashboard(): Promise<ApiResponse> {
    return this.request('/dean/dashboard', {
      method: 'GET',
    });
  }

  async getDeanDocuments(params?: any): Promise<ApiResponse> {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    return this.request(`/dean/documents${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
    });
  }

  async getDeanDepartmentAnalytics(): Promise<ApiResponse> {
    return this.request('/dean/analytics', {
      method: 'GET',
    });
  }

  async getFacultyMembers(): Promise<ApiResponse> {
    return this.request('/dean/faculty', {
      method: 'GET',
    });
  }

  async getDeanFacultyManagement(): Promise<ApiResponse> {
    return this.request('/dean/faculty', {
      method: 'GET',
    });
  }

  async getDeanInstitutionalReports(params?: any): Promise<ApiResponse> {
    // Use the analytics endpoint instead of non-existent institutional-reports
    return this.request('/dean/analytics', {
      method: 'GET',
    });
  }

  async getDeanRecentActivities(): Promise<ApiResponse> {
    // Use the stats endpoint instead of non-existent recent-activities
    return this.request('/dean/stats', {
      method: 'GET',
    });
  }

  async previewDeanDocument(documentId: number): Promise<void> {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const url = `${this.baseURL}/dean/documents/${documentId}/preview`;
    
    // Make authenticated request to get the file
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': '*/*',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to preview document');
    }

    // Get the file blob
    const blob = await response.blob();
    
    // Create object URL and open in new tab
    const objectUrl = window.URL.createObjectURL(blob);
    const newWindow = window.open(objectUrl, '_blank');
    
    // Clean up the object URL after a delay
    setTimeout(() => {
      window.URL.revokeObjectURL(objectUrl);
    }, 1000);
  }

  async downloadDeanDocument(documentId: number): Promise<void> {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const url = `${this.baseURL}/dean/documents/${documentId}/download`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Download failed');
    }

    // Get filename from response headers
    const contentDisposition = response.headers.get('content-disposition');
    let filename = `document-${documentId}`;
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/);
      if (filenameMatch) {
        filename = filenameMatch[1];
      }
    }

    // Create blob and download
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  }

  // Admin APIs
  async getAdminStats(): Promise<ApiResponse> {
    return this.request('/admin/stats', {
      method: 'GET',
    });
  }

  // Bookmark APIs
  async getBookmarks(): Promise<ApiResponse> {
    return this.request('/student/bookmarks', {
      method: 'GET',
    });
  }

  async addBookmark(documentId: number): Promise<ApiResponse> {
    return this.request('/student/bookmarks', {
      method: 'POST',
      body: JSON.stringify({ document_id: documentId }),
    });
  }

  async removeBookmark(bookmarkId: number): Promise<ApiResponse> {
    return this.request(`/student/bookmarks/${bookmarkId}`, {
      method: 'DELETE',
    });
  }

  // History APIs
  async getHistory(): Promise<ApiResponse> {
    return this.request('/student/history', {
      method: 'GET',
    });
  }

  // Profile APIs
  async getTeacherProfile(): Promise<ApiResponse> {
    return this.request('/teacher/profile', {
      method: 'GET',
    });
  }

  async updateTeacherProfile(profileData: any): Promise<ApiResponse> {
    return this.request('/teacher/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async getDepartmentProfile(): Promise<ApiResponse> {
    return this.request('/department/profile', {
      method: 'GET',
    });
  }

  async updateDepartmentProfile(profileData: any): Promise<ApiResponse> {
    return this.request('/department/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // Export APIs
  async exportData(type: string, filters?: any): Promise<Blob> {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const queryString = filters ? new URLSearchParams(filters).toString() : '';
    const url = `${this.baseURL}/export/${type}${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Export failed');
    }

    return response.blob();
  }

  // Real-time APIs
  async getWebSocketToken(): Promise<ApiResponse> {
    return this.request('/websocket/token', {
      method: 'GET',
    });
  }

  // Advanced Search APIs
  async advancedSearch(params: any): Promise<ApiResponse> {
    return this.request('/search/advanced', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  // Bulk Operations APIs
  async bulkUpdateDocuments(documentIds: number[], updates: any): Promise<ApiResponse> {
    return this.request('/documents/bulk-update', {
      method: 'PUT',
      body: JSON.stringify({ document_ids: documentIds, updates }),
    });
  }

  async bulkDeleteDocuments(documentIds: number[]): Promise<ApiResponse> {
    return this.request('/documents/bulk-delete', {
      method: 'DELETE',
      body: JSON.stringify({ document_ids: documentIds }),
    });
  }

  async getAdminUserManagement(): Promise<ApiResponse> {
    return this.request('/admin/user-management', {
      method: 'GET',
    });
  }

  async getAdminSystemMonitoring(): Promise<ApiResponse> {
    return this.request('/admin/system', {
      method: 'GET',
    });
  }

  async getAdminAuditLogs(params?: any): Promise<ApiResponse> {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    return this.request(`/admin/audit-logs${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
    });
  }

  async getAdminSystemHealth(): Promise<ApiResponse> {
    return this.request('/admin/system-health', {
      method: 'GET',
    });
  }

  async updateUserStatus(userId: number, status: string): Promise<ApiResponse> {
    return this.request('/admin/user/update-status', {
      method: 'POST',
      body: JSON.stringify({ user_id: userId, status: status })
    })
  }

  async getSystemMaintenance(): Promise<ApiResponse> {
    return this.request('/admin/maintenance', { method: 'GET' })
  }

  async performSystemCleanup(): Promise<ApiResponse> {
    return this.request('/admin/cleanup', { 
      method: 'POST',
      body: JSON.stringify({})
    })
  }

  // Admin import APIs
  async importStudents(file: File): Promise<ApiResponse> {
    const formData = new FormData();
    formData.append('file', file);
    
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${this.baseURL}/admin/import/students`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Import failed');
    }

    return data;
  }


  // Admin backup APIs
  async getAdminBackups(): Promise<ApiResponse> {
    return this.request('/admin/backups', {
      method: 'GET',
    });
  }

  async createBackup(type: 'full' | 'incremental' | 'differential' = 'full'): Promise<ApiResponse> {
    return this.request('/admin/backups', {
      method: 'POST',
      body: JSON.stringify({ type }),
    });
  }

  async downloadBackup(filename: string): Promise<void> {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const url = `${this.baseURL}/admin/backups/${filename}/download`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Download failed');
    }

    // Get filename from response headers
    const contentDisposition = response.headers.get('content-disposition');
    let downloadFilename = filename;
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/);
      if (filenameMatch) {
        downloadFilename = filenameMatch[1];
      }
    }

    // Create blob and download
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = downloadFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  }

  async deleteBackup(filename: string): Promise<ApiResponse> {
    return this.request(`/admin/backups/${filename}`, {
      method: 'DELETE',
    });
  }

  async getBackupSettings(): Promise<ApiResponse> {
    return this.request('/admin/backup-settings', {
      method: 'GET',
    });
  }

  // Document management (for department head)
  async getDocuments(params?: any): Promise<ApiResponse> {
    let url = '/department/documents';
    if (params) {
      const searchParams = new URLSearchParams();
      if (params.search) searchParams.append('search', params.search);
      if (params.status) searchParams.append('status', params.status);
      if (searchParams.toString()) {
        url += '?' + searchParams.toString();
      }
    }
    
    return this.request(url, {
      method: 'GET',
    });
  }

  async updateDocumentStatus(documentId: number, status: string): Promise<ApiResponse> {
    return this.request(`/department/documents/${documentId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // User management (for admin)
  async getUsers(): Promise<ApiResponse> {
    return this.request('/admin/users', {
      method: 'GET',
    });
  }

  async deleteUser(userId: number): Promise<ApiResponse> {
    return this.request(`/admin/users/${userId}`, {
      method: 'DELETE',
    });
  }

  // System monitoring (for admin)
  async getSystemMetrics(): Promise<ApiResponse> {
    return this.request('/admin/system-metrics', {
      method: 'GET',
    });
  }

  async resolveSystemAlert(alertId: number): Promise<ApiResponse> {
    return this.request(`/admin/system/alerts/${alertId}/resolve`, {
      method: 'PUT',
    });
  }

  async deleteDepartmentDocument(documentId: number): Promise<ApiResponse> {
    return this.request(`/department/documents/${documentId}`, {
      method: 'DELETE',
    });
  }

  async previewDepartmentDocument(documentId: number): Promise<void> {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const url = `${this.baseURL}/department/documents/${documentId}/preview`;
    
    // Make authenticated request to get the file
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': '*/*',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to preview document');
    }

    // Get the file blob
    const blob = await response.blob();
    
    // Create object URL and open in new tab
    const objectUrl = window.URL.createObjectURL(blob);
    const newWindow = window.open(objectUrl, '_blank');
    
    // Clean up the object URL after a delay
    setTimeout(() => {
      window.URL.revokeObjectURL(objectUrl);
    }, 1000);
  }

  async downloadDepartmentDocument(documentId: number): Promise<void> {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const url = `${this.baseURL}/department/documents/${documentId}/download`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Download failed');
    }

    // Get filename from response headers
    const contentDisposition = response.headers.get('content-disposition');
    let filename = `document-${documentId}`;
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/);
      if (filenameMatch) {
        filename = filenameMatch[1];
      }
    }

    // Create blob and download
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  }

  // Department comment APIs
  async addDocumentComment(documentId: number, comment: string, type: string = 'general'): Promise<ApiResponse> {
    return this.request(`/department/documents/${documentId}/comment`, {
      method: 'POST',
      body: JSON.stringify({ comment, type }),
    });
  }

  async getDocumentComments(documentId: number): Promise<ApiResponse> {
    return this.request(`/department/documents/${documentId}/comments`, {
      method: 'GET',
    });
  }

  // Teacher comment APIs
  async getTeacherComments(): Promise<ApiResponse> {
    return this.request('/teacher/comments', {
      method: 'GET',
    });
  }

  async markCommentAsRead(commentId: number): Promise<ApiResponse> {
    return this.request(`/teacher/comments/${commentId}/read`, {
      method: 'PUT',
    });
  }


}

export const apiClient = new ApiClient(API_BASE_URL);

// Helper functions for authentication
export const setAuthToken = (token: string) => {
  localStorage.setItem('auth_token', token);
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

export const removeAuthToken = () => {
  localStorage.removeItem('auth_token')
  localStorage.removeItem('user_info')
}

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};
