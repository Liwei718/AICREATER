import { get, post, put, del } from './request';
import type { HedgeScheme, PaginatedResult } from '../types';

export interface HedgeSchemeQuery {
  page?: number;
  pageSize?: number;
  status?: number;
  productType?: string;
  startDate?: string;
  endDate?: string;
  keyword?: string;
}

export interface ApprovalAction {
  action: 'approve' | 'reject' | 'transfer';
  comment?: string;
  transferTo?: string;
}

export const hedgeApi = {
  // 获取套保方案列表
  getSchemes: (params: HedgeSchemeQuery) => 
    get<PaginatedResult<HedgeScheme>>('/hedge/schemes', { params }),
  
  // 获取套保方案详情
  getScheme: (id: string) => get<HedgeScheme>(`/hedge/schemes/${id}`),
  
  // 创建套保方案
  createScheme: (data: Partial<HedgeScheme>) => 
    post<HedgeScheme>('/hedge/schemes', data),
  
  // 更新套保方案
  updateScheme: (id: string, data: Partial<HedgeScheme>) => 
    put<HedgeScheme>(`/hedge/schemes/${id}`, data),
  
  // 删除套保方案
  deleteScheme: (id: string) => del(`/hedge/schemes/${id}`),
  
  // 提交审批
  submitForApproval: (id: string) => 
    post<HedgeScheme>(`/hedge/schemes/${id}/submit`),
  
  // 审批操作
  approve: (id: string, action: ApprovalAction) => 
    post<HedgeScheme>(`/hedge/schemes/${id}/approve`, action),
  
  // 终止方案
  terminateScheme: (id: string, reason: string) => 
    post<HedgeScheme>(`/hedge/schemes/${id}/terminate`, { reason }),
  
  // 获取方案执行进度
  getSchemeProgress: (id: string) => get<{
    schemeId: string;
    targetQuantity: number;
    executedQuantity: number;
    progress: number;
    positions: any[];
  }>(`/hedge/schemes/${id}/progress`),
  
  // 获取套保效果分析
  getEffectiveness: (id: string) => get<{
    schemeId: string;
    spotPnl: number;
    futuresPnl: number;
    combinedPnl: number;
    hedgeRatio: number;
    effectiveness: number;
    basisImpact: number;
  }>(`/hedge/schemes/${id}/effectiveness`),
  
  // 获取待审批列表
  getPendingApprovals: () => get<HedgeScheme[]>('/hedge/schemes/pending'),
  
  // 获取执行中方案
  getActiveSchemes: () => get<HedgeScheme[]>('/hedge/schemes/active'),
};
