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
    console.log('API Client - Token available:', !!token);
    if (token) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${token}`,
      };
    }

    console.log('API Client - Making request to:', url);
    console.log('API Client - Request config:', config);

    try {
      const response = await fetch(url, config);
      console.log('API Client - Response status:', response.status);
      console.log('API Client - Response headers:', response.headers);

      const data = await response.json();
      console.log('API Client - Response data:', data);

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
    return this.request('/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: RegisterData): Promise<ApiResponse> {
    console.log("Sending registration request:", userData)
    return this.request('/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout(): Promise<ApiResponse> {
    return this.request('/logout', {
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

  // Student dashboard APIs
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

    const url = `${this.baseURL}/documents/${documentId}/download`;
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

    // Track the download
    await this.trackDocumentDownload(documentId);
  }

  async previewDocument(documentId: number): Promise<void> {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const url = `${this.baseURL}/documents/${documentId}/preview`;
    
    // Track the view first
    await this.trackDocumentView(documentId);
    
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

  // Suggestions APIs
  async getSuggestions(): Promise<ApiResponse> {
    return this.request('/student/suggestions', {
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
    const token = localStorage.getItem('auth_token');
    const url = `${this.baseURL}/teacher/upload-document`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type for FormData
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Upload failed');
      }

      return data;
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

  // Teacher analytics APIs
  async getTeacherAnalytics(): Promise<ApiResponse> {
    return this.request('/teacher/analytics', {
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

  async getDeanDepartmentAnalytics(): Promise<ApiResponse> {
    return this.request('/dean/department-analytics', {
      method: 'GET',
    });
  }

  async getDeanFacultyManagement(): Promise<ApiResponse> {
    return this.request('/dean/faculty-management', {
      method: 'GET',
    });
  }

  async getDeanInstitutionalReports(params?: any): Promise<ApiResponse> {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    return this.request(`/dean/institutional-reports${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
    });
  }

  async getDeanRecentActivities(): Promise<ApiResponse> {
    return this.request('/dean/recent-activities', {
      method: 'GET',
    });
  }

  // Admin APIs
  async getAdminStats(): Promise<ApiResponse> {
    return this.request('/admin/stats', {
      method: 'GET',
    });
  }

  async getAdminUserManagement(): Promise<ApiResponse> {
    return this.request('/admin/user-management', {
      method: 'GET',
    });
  }

  async getAdminSystemMonitoring(): Promise<ApiResponse> {
    return this.request('/admin/system-monitoring', {
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
