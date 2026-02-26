import { create } from 'zustand';
import type { SpotPosition, FuturesPosition, FuturesAccount } from '../types';

interface PositionState {
  // 现货头寸
  spotPositions: SpotPosition[];
  spotTotal: number;
  spotLoading: boolean;
  
  // 期货头寸
  futuresPositions: FuturesPosition[];
  futuresTotal: number;
  futuresLoading: boolean;
  
  // 账户信息
  accounts: FuturesAccount[];
  
  // 汇总数据
  netExposure: number;
  hedgeRatio: number;
  
  // Actions
  setSpotPositions: (positions: SpotPosition[], total: number) => void;
  setFuturesPositions: (positions: FuturesPosition[], total: number) => void;
  setAccounts: (accounts: FuturesAccount[]) => void;
  setSpotLoading: (loading: boolean) => void;
  setFuturesLoading: (loading: boolean) => void;
  updateHedgeRatio: () => void;
  
  // 计算属性
  getTotalSpotExposure: () => number;
  getTotalFuturesPosition: () => number;
  getAccountById: (id: string) => FuturesAccount | undefined;
}

export const usePositionStore = create<PositionState>((set, get) => ({
  spotPositions: [],
  spotTotal: 0,
  spotLoading: false,
  
  futuresPositions: [],
  futuresTotal: 0,
  futuresLoading: false,
  
  accounts: [],
  
  netExposure: 0,
  hedgeRatio: 0,
  
  setSpotPositions: (positions, total) => {
    set({ spotPositions: positions, spotTotal: total });
    get().updateHedgeRatio();
  },
  
  setFuturesPositions: (positions, total) => {
    set({ futuresPositions: positions, futuresTotal: total });
    get().updateHedgeRatio();
  },
  
  setAccounts: (accounts) => set({ accounts }),
  
  setSpotLoading: (loading) => set({ spotLoading: loading }),
  setFuturesLoading: (loading) => set({ futuresLoading: loading }),
  
  updateHedgeRatio: () => {
    const state = get();
    const spotExposure = state.spotPositions
      .filter((p) => p.status === 1)
      .reduce((sum, p) => sum + p.quantity, 0);
    
    const futuresPosition = state.futuresPositions
      .filter((p) => p.status === 1)
      .reduce((sum, p) => sum + p.totalQuantity * (p.direction === 1 ? 1 : -1), 0);
    
    const ratio = spotExposure > 0 ? Math.abs(futuresPosition / spotExposure) * 100 : 0;
    
    set({
      netExposure: spotExposure + futuresPosition,
      hedgeRatio: Math.min(ratio, 100),
    });
  },
  
  getTotalSpotExposure: () => {
    return get().spotPositions
      .filter((p) => p.status === 1)
      .reduce((sum, p) => sum + p.quantity, 0);
  },
  
  getTotalFuturesPosition: () => {
    return get().futuresPositions
      .filter((p) => p.status === 1)
      .reduce((sum, p) => sum + p.totalQuantity * (p.direction === 1 ? 1 : -1), 0);
  },
  
  getAccountById: (id) => get().accounts.find((a) => a.id === id),
}));
