// API Service for Storme Backend
const API_BASE_URL = 'http://localhost:4000';

// Types for API responses
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
    role: string;
  };
}

export interface RegisterResponse {
  message: string;
  user: {
    id: number;
    username: string;
    role: string;
  };
}

export interface UploadResponse {
  fileId: number;
  name: string;
  cids: string[];
  isPrivate: boolean;
}

export interface ApiFile {
  id: number;
  name: string;
  cids: string[];
  owner: string;
  is_private: boolean;
  timestamp: number;
}

export interface SmartContractFile {
  name: string;
  cids: string[];
  owner: string;
  timestamp: number;
}

export interface DatabaseFile {
  id: number;
  filename: string;
  cid1: string;
  cid2: string;
  cid3: string;
  owner_id: number;
  is_private: boolean;
  created_at: string;
  updated_at: string;
}

// Token management
export const TokenManager = {
  getToken: (): string | null => {
    return localStorage.getItem('storme_token');
  },
  
  setToken: (token: string): void => {
    localStorage.setItem('storme_token', token);
  },
  
  removeToken: (): void => {
    localStorage.removeItem('storme_token');
  },
  
  getAuthHeaders: (): Record<string, string> => {
    const token = TokenManager.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
};

// Base API class
class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...TokenManager.getAuthHeaders(),
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Authentication APIs
  async login(username: string, password: string): Promise<LoginResponse> {
    return this.request<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  async register(username: string, password: string): Promise<RegisterResponse> {
    return this.request<RegisterResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  // User APIs
  async getCurrentUser() {
    return this.request<{ id: number; username: string; role: string }>('/me');
  }

  // File APIs
  async uploadFile(file: File, isPrivate: boolean = false): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('isPrivate', isPrivate.toString());

    const token = TokenManager.getToken();
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  async getAllFiles(): Promise<ApiFile[]> {
    return this.request<ApiFile[]>('/');
  }

  async getSmartContractFiles(): Promise<SmartContractFile[]> {
    return this.request<SmartContractFile[]>('/files');
  }

  async updateFileVisibility(fileId: number, isPrivate: boolean) {
    return this.request<{
      message: string;
      file: DatabaseFile;
    }>(`/files/${fileId}/visibility`, {
      method: 'PUT',
      body: JSON.stringify({ isPrivate }),
    });
  }

  async deleteFile(fileId: number) {
    return this.request<{ message: string }>(`/files/${fileId}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService(); 