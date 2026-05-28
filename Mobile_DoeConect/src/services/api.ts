import axios from 'axios';
import { setupInterceptors } from '@/services/interceptors';

export const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

setupInterceptors(api);
