import axios from 'axios';
import { auth } from '../services/firebase';
import { CDN_URL} from '@env';

const api = axios.create({
baseURL: CDN_URL,
});

api.interceptors.request.use(async config => {
  if (auth.currentUser) {
    const token = await auth.currentUser.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;