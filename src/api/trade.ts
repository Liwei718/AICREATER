import { get, post, put, del } from './request';
import type { TradeOrder, TradeExecution, PaginatedResult } from '../types';

export interface TradeOrderQuery {
  page?: number;
  pageSize?: number;
  status?: number;
  orderType?: number;
  contractCode?: string;
  startDate?: string;
  endDate?: string;
}

export interface TradeExecutionQuery {
  page?: number;
  pageSize?: number;
  contractCode?: string;
  tradeDate?: string;
  startDate?: string;
  endDate?: string;
}

export const tradeApi = {
  // ========== 交易指令 ==========
  
  // 获取指令列表
  getOrders: (params: TradeOrderQuery) => 
    get<PaginatedResult<TradeOrder>>('/trade/orders', { params }),
  
  // 获取指令详情
  getOrder: (id: string) => get<TradeOrder>(`/trade/orders/${id}`),
  
  // 创建指令
  createOrder: (data: Partial<TradeOrder>) => 
    post<TradeOrder>('/trade/orders', data),
  
  // 更新指令
  updateOrder: (id: string, data: Partial<TradeOrder>) => 
    put<TradeOrder>(`/trade/orders/${id}`, data),
  
  // 撤销指令
  cancelOrder: (id: string, reason: string) => 
    post<TradeOrder>(`/trade/orders/${id}/cancel`, { reason }),
  
  // 审批指令
  approveOrder: (id: string, approved: boolean, comment?: string) => 
    post<TradeOrder>(`/trade/orders/${id}/approve`, { approved, comment }),
  
  // 获取待审批指令
  getPendingOrders: () => get<TradeOrder[]>('/trade/orders/pending'),
  
  // ========== 成交记录 ==========
  
  // 获取成交列表
  getExecutions: (params: TradeExecutionQuery) => 
    get<PaginatedResult<TradeExecution>>('/trade/executions', { params }),
  
  // 获取成交详情
  getExecution: (id: string) => get<TradeExecution>(`/trade/executions/${id}`),
  
  // 录入成交
  createExecution: (data: Partial<TradeExecution>) => 
    post<TradeExecution>('/trade/executions', data),
  
  // 确认成交
  confirmExecution: (id: string) => 
    post<TradeExecution>(`/trade/executions/${id}/confirm`),
  
  // 导入成交
  importExecutions: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return post<TradeExecution[]>('/trade/executions/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  
  // 获取当日成交汇总
  getTodayExecutionSummary: () => get<{
    totalCount: number;
    totalVolume: number;
    totalAmount: number;
    totalCommission: number;
  }>('/trade/executions/today-summary'),
};
