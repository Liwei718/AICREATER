import { get, post, put, del } from './request';
import type { SpotPosition, FuturesPosition, FuturesAccount, PaginatedResult } from '../types';

export interface SpotPositionQuery {
  page?: number;
  pageSize?: number;
  positionType?: number;
  productType?: string;
  status?: number;
  startDate?: string;
  endDate?: string;
  keyword?: string;
}

export interface FuturesPositionQuery {
  page?: number;
  pageSize?: number;
  contractCode?: string;
  direction?: number;
  status?: number;
  accountId?: string;
}

export const positionApi = {
  // ========== 现货头寸 ==========
  
  // 获取现货头寸列表
  getSpotPositions: (params: SpotPositionQuery) => 
    get<PaginatedResult<SpotPosition>>('/positions/spot', { params }),
  
  // 获取现货头寸详情
  getSpotPosition: (id: string) => get<SpotPosition>(`/positions/spot/${id}`),
  
  // 创建现货头寸
  createSpotPosition: (data: Partial<SpotPosition>) => 
    post<SpotPosition>('/positions/spot', data),
  
  // 更新现货头寸
  updateSpotPosition: (id: string, data: Partial<SpotPosition>) => 
    put<SpotPosition>(`/positions/spot/${id}`, data),
  
  // 删除现货头寸
  deleteSpotPosition: (id: string) => del(`/positions/spot/${id}`),
  
  // 获取现货敞口汇总
  getSpotExposureSummary: () => get<{
    totalInventory: number;
    totalSalesOrders: number;
    totalPurchaseOrders: number;
    netExposure: number;
    hedgedQuantity: number;
    unhedgedQuantity: number;
  }>('/positions/spot/summary'),
  
  // ========== 期货头寸 ==========
  
  // 获取期货头寸列表
  getFuturesPositions: (params: FuturesPositionQuery) => 
    get<PaginatedResult<FuturesPosition>>('/positions/futures', { params }),
  
  // 获取期货头寸详情
  getFuturesPosition: (id: string) => get<FuturesPosition>(`/positions/futures/${id}`),
  
  // 录入期货头寸
  createFuturesPosition: (data: Partial<FuturesPosition>) => 
    post<FuturesPosition>('/positions/futures', data),
  
  // 更新期货头寸
  updateFuturesPosition: (id: string, data: Partial<FuturesPosition>) => 
    put<FuturesPosition>(`/positions/futures/${id}`, data),
  
  // 获取期货头寸汇总
  getFuturesPositionSummary: () => get<{
    totalLong: number;
    totalShort: number;
    netPosition: number;
    totalMargin: number;
    totalProfit: number;
  }>('/positions/futures/summary'),
  
  // ========== 账户管理 ==========
  
  // 获取期货账户列表
  getAccounts: () => get<FuturesAccount[]>('/positions/accounts'),
  
  // 获取账户详情
  getAccount: (id: string) => get<FuturesAccount>(`/positions/accounts/${id}`),
  
  // 同步账户资金
  syncAccountBalance: (id: string) => post<FuturesAccount>(`/positions/accounts/${id}/sync`),
};
