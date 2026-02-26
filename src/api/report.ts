import { get, post } from './request';
import type { DailyPnl, PaginatedResult } from '../types';

export interface PnlQuery {
  page?: number;
  pageSize?: number;
  startDate: string;
  endDate: string;
  groupBy?: 'day' | 'week' | 'month';
}

export const reportApi = {
  // ========== 盈亏报表 ==========
  
  // 获取日盈亏列表
  getDailyPnl: (params: PnlQuery) => 
    get<PaginatedResult<DailyPnl>>('/reports/daily-pnl', { params }),
  
  // 获取盈亏汇总
  getPnlSummary: (params: { startDate: string; endDate: string }) => 
    get<{
      totalSpotPnl: number;
      totalFuturesPnl: number;
      totalCombinedPnl: number;
      avgHedgeRatio: number;
      avgEffectiveness: number;
    }>('/reports/pnl-summary', { params }),
  
  // 获取盈亏趋势
  getPnlTrend: (params: { startDate: string; endDate: string }) => 
    get<{
      dates: string[];
      spotPnl: number[];
      futuresPnl: number[];
      combinedPnl: number[];
    }>('/reports/pnl-trend', { params }),
  
  // ========== 套保效果分析 ==========
  
  // 获取套保效果报告
  getHedgeEffectiveness: (params: { startDate: string; endDate: string }) => 
    get<{
      hedgeRatio: number;
      effectiveness: number;
      spotVolatility: number;
      hedgedVolatility: number;
      riskReduction: number;
    }>('/reports/hedge-effectiveness', { params }),
  
  // 获取分方案盈亏
  getSchemePnl: (params: { startDate: string; endDate: string }) => 
    get<{
      schemeId: string;
      schemeName: string;
      spotPnl: number;
      futuresPnl: number;
      combinedPnl: number;
    }[]>('/reports/scheme-pnl', { params }),
  
  // ========== 报表导出 ==========
  
  // 导出日报
  exportDailyReport: (date: string) => 
    post('/reports/export/daily', { date }, { responseType: 'blob' }),
  
  // 导出月报
  exportMonthlyReport: (year: number, month: number) => 
    post('/reports/export/monthly', { year, month }, { responseType: 'blob' }),
  
  // 导出自定义报表
  exportCustomReport: (params: { startDate: string; endDate: string; type: string }) => 
    post('/reports/export/custom', params, { responseType: 'blob' }),
};
