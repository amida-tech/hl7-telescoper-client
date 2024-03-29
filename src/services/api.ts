import axios from 'axios';
import { HL7File, HL7Message } from '../types';
import { stores } from '../stores';
import { USER_STORE } from '../stores/userStore';

// TODO config for url
const baseURL = 'http://localhost:4040';
const api = axios.create({
  baseURL,
});

api.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if (error.response.status === 401) {
    stores[USER_STORE].logout();
    alert("Oops! Your session has expired. Please sign in to continue");
  }
  return error;
});

export const telescoperApi = {
  api,
  setToken(token?: string) {
    let newVal;
    if (token) {
      newVal = `Bearer ${token}`;
    } else {
      newVal = '';
    }
    this.api.defaults.headers.common['Authorization'] = newVal;
  },
  async signUp(email: string, username: string, password: string): Promise<{ username: string }> {
    const response = await this.api.post('/api/users/', { email, username, password });
    return response.data;
  },
  async login(username: string, password: string): Promise<{ token: string }> {
    const response = await this.api.post('/api/users/login', { username, password });
    return response.data;
  },
  async getFiles(): Promise<HL7File[]> {
    const response = await this.api.get('/api/hl7/files');
    return response.data;
  },
  async getFile(fileId: string): Promise<HL7File> {
    const response = await this.api.get(`/api/hl7/files/${fileId}`);
    return response.data;
  },
  async uploadFile(file: File): Promise<void> {
    const data = new FormData();
    data.append('hl7-file', file);
    await this.api.post('/api/hl7/upload', data);
  },
  async getMessage(fileId: string, messageIndexWithinFile: number): Promise<HL7Message> {
    const response = await this.api.get(`/api/hl7/files/${fileId}/messages/${messageIndexWithinFile}`);
    return response.data;
  },
};
