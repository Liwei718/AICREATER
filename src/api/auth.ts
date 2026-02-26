import { post, get } from './request';
import type { User, ApiResponse } from '../types';

export interface LoginParams {
  username: string;
  password: string;
  captcha?: string;
}

export interface LoginResult {
  token: string;
  user: User;
}

export const authApi = {
  // 登录
  login: (params: LoginParams) => post<LoginResult>('/auth/login', params),
  
  // 登出
  logout: () => post('/auth/logout'),
  
  // 获取当前用户信息
  getCurrentUser: () => get<User>('/auth/current'),
  
  // 刷新token
  refreshToken: () => post<{ token: string }>('/auth/refresh'),
  
  // 修改密码
  changePassword: (oldPassword: string, newPassword: string) => 
    post('/auth/change-password', { oldPassword, newPassword }),
};
