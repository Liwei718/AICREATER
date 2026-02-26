import { get } from './request';
import type { DashboardStats, DailyPnl, MarketQuote } from '../types';

export const dashboardApi = {
  // 获取仪表板统计数据
  getStats: () => get<DashboardStats>('/dashboard/stats'),
  
  // 获取盈亏趋势数据
  getPnlTrend: (days: number = 30) => get<{ dates: string[]; spotPnl: number[]; futuresPnl: number[]; combinedPnl: number[] }>(
    `/dashboard/pnl-trend?days=${days}`
  ),
  
  // 获取实时行情
  getMarketQuotes: () => get<MarketQuote[]>('/dashboard/quotes'),
  
  // 获取待办事项
  getTodos: () => get<{ type: string; title: string; count: number }[]>('/dashboard/todos'),
  
  // 获取预警列表（顶部展示用）
  getTopWarnings: (limit: number = 5) => get('/dashboard/warnings', { params: { limit } }),
};
