const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export const api = {
  baseUrl: API_BASE_URL,
  
  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem('accessToken');
    
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
    };
    
    // Only set Content-Type if not already set (for FormData)
    if (!headers['Content-Type'] && !(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const config: RequestInit = {
      ...options,
      headers,
    };
    
    try {
      const response = await fetch(url, config);
      return response;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  },
  
  async post(endpoint: string, data: any, options?: RequestInit) {
    const isFormData = data instanceof FormData;
    const body = isFormData ? data : JSON.stringify(data);
    
    const response = await this.request(endpoint, {
      method: 'POST',
      body,
      ...options,
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(error.message || 'Request failed');
    }
    
    return response.json();
  },
  
  async get(endpoint: string) {
    const response = await this.request(endpoint, {
      method: 'GET',
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(error.message || 'Request failed');
    }
    
    return response.json();
  },
  
  async put(endpoint: string, data: any) {
    const response = await this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(error.message || 'Request failed');
    }
    
    return response.json();
  },
  
  async delete(endpoint: string) {
    const response = await this.request(endpoint, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(error.message || 'Request failed');
    }
    
    // DELETE requests might not return a body
    try {
      return await response.json();
    } catch {
      return {};
    }
  }
};

export default api;
