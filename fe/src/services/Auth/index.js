import {instance} from '../../config/axios'
import qs from 'qs'

export const signup = (data) => {
  return instance.post('/auth/signup', data);
};

export const login = (data) => {
  return instance.post('/auth/login', data);
};

export const me = () => {
  return instance.get('/auth/me');
};
