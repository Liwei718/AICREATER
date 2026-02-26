import { create } from 'zustand';
import type { MarketQuote } from '../types';

interface MarketState {
  quotes: Record<string, MarketQuote>;
  subscribedSymbols: string[];
  isConnected: boolean;
  setQuote: (quote: MarketQuote) => void;
  setQuotes: (quotes: MarketQuote[]) => void;
  subscribe: (symbols: string[]) => void;
  unsubscribe: (symbols: string[]) => void;
  setConnected: (connected: boolean) => void;
  getQuote: (symbol: string) => MarketQuote | undefined;
}

export const useMarketStore = create<MarketState>((set, get) => ({
  quotes: {},
  subscribedSymbols: [],
  isConnected: false,
  
  setQuote: (quote) => {
    set((state) => ({
      quotes: {
        ...state.quotes,
        [`${quote.exchange}.${quote.contractCode}`]: quote,
      },
    }));
  },
  
  setQuotes: (quotes) => {
    const quoteMap: Record<string, MarketQuote> = {};
    quotes.forEach((q) => {
      quoteMap[`${q.exchange}.${q.contractCode}`] = q;
    });
    set({ quotes: quoteMap });
  },
  
  subscribe: (symbols) => {
    set((state) => ({
      subscribedSymbols: [...new Set([...state.subscribedSymbols, ...symbols])],
    }));
  },
  
  unsubscribe: (symbols) => {
    set((state) => ({
      subscribedSymbols: state.subscribedSymbols.filter((s) => !symbols.includes(s)),
    }));
  },
  
  setConnected: (connected) => set({ isConnected: connected }),
  
  getQuote: (symbol) => get().quotes[symbol],
}));
