import { get, post, put } from './request';
import type { RiskWarning, RiskMetrics } from '../types';

export const riskApi = {
  // ========== 风险监控 ==========
  
  // 获取风险指标
  getRiskMetrics: () => get<RiskMetrics>('/risk/metrics'),
  
  // 获取账户风险详情
  getAccountRisk: (accountId: string) => get<{
    accountId: string;
    riskLevel: 'low' | 'medium' | 'high';
    riskFactors: string[];
    suggestions: string[];
  }>(`/risk/accounts/${accountId}`),
  
  // ========== 风险预警 ==========
  
  // 获取预警列表
  getWarnings: (params?: { status?: number; level?: number; limit?: number }) => 
    get<RiskWarning[]>('/risk/warnings', { params }),
  
  // 获取预警详情
  getWarning: (id: string) => get<RiskWarning>(`/risk/warnings/${id}`),
  
  // 处理预警
  handleWarning: (id: string, action: string, result?: string) => 
    post<RiskWarning>(`/risk/warnings/${id}/handle`, { action, result }),
  
  // 忽略预警
  ignoreWarning: (id: string, reason: string) => 
    post<RiskWarning>(`/risk/warnings/${id}/ignore`, { reason }),
  
  // 获取未读预警数量
  getUnreadWarningCount: () => get<{ count: number }>('/risk/warnings/unread-count'),
  
  // ========== 风控规则 ==========
  
  // 获取风控规则列表
  getRiskRules: () => get<any[]>('/risk/rules'),
  
  // 更新风控规则
  updateRiskRule: (id: string, data: any) => put(`/risk/rules/${id}`, data),
  
  // ========== 合规检查 ==========
  
  // 执行合规检查
  runComplianceCheck: () => post('/risk/compliance/check'),
  
  // 获取合规检查结果
  getComplianceResult: () => get<{
    passed: boolean;
    issues: { type: string; severity: string; message: string }[];
    lastCheckTime: string;
  }>('/risk/compliance/result'),
};
