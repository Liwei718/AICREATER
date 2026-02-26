import { create } from 'zustand';
import type { RiskWarning, RiskMetrics } from '../types';

interface RiskState {
  // 预警列表
  warnings: RiskWarning[];
  unreadCount: number;
  
  // 风险指标
  riskMetrics: RiskMetrics | null;
  
  // 风控规则
  rules: any[];
  
  // Actions
  setWarnings: (warnings: RiskWarning[]) => void;
  addWarning: (warning: RiskWarning) => void;
  updateWarning: (id: string, updates: Partial<RiskWarning>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  setRiskMetrics: (metrics: RiskMetrics) => void;
  setRules: (rules: any[]) => void;
  
  // 计算属性
  getHighPriorityWarnings: () => RiskWarning[];
  getUnhandledWarnings: () => RiskWarning[];
}

export const useRiskStore = create<RiskState>((set, get) => ({
  warnings: [],
  unreadCount: 0,
  riskMetrics: null,
  rules: [],
  
  setWarnings: (warnings) => {
    const unread = warnings.filter((w) => w.status === 0).length;
    set({ warnings, unreadCount: unread });
  },
  
  addWarning: (warning) => {
    set((state) => ({
      warnings: [warning, ...state.warnings],
      unreadCount: state.unreadCount + (warning.status === 0 ? 1 : 0),
    }));
  },
  
  updateWarning: (id, updates) => {
    set((state) => ({
      warnings: state.warnings.map((w) =>
        w.id === id ? { ...w, ...updates } : w
      ),
    }));
  },
  
  markAsRead: (id) => {
    set((state) => ({
      warnings: state.warnings.map((w) =>
        w.id === id ? { ...w, status: 2 } : w
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    }));
  },
  
  markAllAsRead: () => {
    set((state) => ({
      warnings: state.warnings.map((w) =>
        w.status === 0 ? { ...w, status: 2 } : w
      ),
      unreadCount: 0,
    }));
  },
  
  setRiskMetrics: (metrics) => set({ riskMetrics: metrics }),
  setRules: (rules) => set({ rules }),
  
  getHighPriorityWarnings: () => {
    return get().warnings.filter((w) => w.warningLevel >= 2 && w.status === 0);
  },
  
  getUnhandledWarnings: () => {
    return get().warnings.filter((w) => w.status === 0);
  },
}));
