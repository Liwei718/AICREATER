// 系统类型定义

// 用户相关
export interface User {
  id: string;
  username: string;
  realName: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
  departmentId?: string;
  status: number;
  lastLoginAt?: string;
  permissions: string[];
}

export interface Role {
  id: string;
  roleCode: string;
  roleName: string;
  description?: string;
  dataScope: number;
  status: number;
}

// 现货头寸
export interface SpotPosition {
  id: string;
  positionNo: string;
  positionType: number; // 1:库存, 2:销售订单, 3:采购订单
  productType: string;
  quantity: number;
  unitCost?: number;
  totalCost?: number;
  warehouse?: string;
  qualityGrade?: string;
  counterparty?: string;
  contractNo?: string;
  deliveryDate?: string;
  pricingType: number; // 1:固定价, 2:点价, 3:均价
  basePrice?: number;
  premium?: number;
  finalPrice?: number;
  pricingStatus: number; // 0:未点价, 1:部分点价, 2:已点价
  pricedQuantity: number;
  status: number;
  hedgeStatus: number; // 0:未保值, 1:部分保值, 2:已保值
  hedgedQuantity: number;
  positionDate: string;
  createdAt: string;
  remark?: string;
}

// 期货持仓
export interface FuturesPosition {
  id: string;
  positionNo: string;
  accountId: string;
  exchange: string;
  contractCode: string;
  productType: string;
  direction: number; // 1:买(多), 2:卖(空)
  totalQuantity: number;
  availableQuantity: number;
  frozenQuantity: number;
  openPrice: number;
  settlementPrice?: number;
  lastPrice?: number;
  positionProfit: number;
  closeProfit: number;
  totalProfit: number;
  marginOccupied: number;
  marginRatio?: number;
  hedgeType: number; // 1:套保, 2:投机
  schemeId?: string;
  status: number;
  openDate: string;
  expireDate?: string;
  deliveryIntent?: boolean;
  deliveryStatus?: number;
  createdAt: string;
}

// 期货账户
export interface FuturesAccount {
  id: string;
  accountNo: string;
  accountName: string;
  brokerName: string;
  exchange: string;
  balance: number;
  available: number;
  marginOccupied: number;
  frozenMargin: number;
  riskRatio: number;
  totalQuota?: number;
  usedQuota?: number;
}

// 套保方案
export interface HedgeScheme {
  id: string;
  schemeNo: string;
  schemeName: string;
  productType: string;
  spotExposure: number;
  hedgeRatio: number;
  targetQuantity: number;
  executedQuantity: number;
  targetContract?: string;
  strategyType?: number; // 1:直接套保, 2:展期套保
  buildStrategy: number; // 1:一次性, 2:分批建仓
  priceRangeLow?: number;
  priceRangeHigh?: number;
  stopLossPrice?: number;
  takeProfitPrice?: number;
  startDate: string;
  endDate: string;
  status: number; // 0:草稿, 1:审批中, 2:已通过, 3:已拒绝, 4:执行中, 5:已完成, 6:已终止
  currentApprover?: string;
  approvedAt?: string;
  actualQuantity?: number;
  avgPrice?: number;
  closeQuantity?: number;
  closeAvgPrice?: number;
  hedgeEffectiveness?: number;
  totalPnl?: number;
  createdAt: string;
  createdBy?: string;
  remark?: string;
}

// 交易指令
export interface TradeOrder {
  id: string;
  orderNo: string;
  orderType: number; // 1:开仓, 2:平仓, 3:移仓
  direction: number; // 1:买入, 2:卖出
  exchange: string;
  contractCode: string;
  productType: string;
  quantity: number;
  orderPriceType: number; // 1:限价, 2:市价, 3:条件单
  limitPrice?: number;
  schemeId?: string;
  accountId?: string;
  positionId?: string;
  status: number; // 0:草稿, 1:待审批, 2:审批通过, 3:审批拒绝, 4:执行中, 5:已完成, 6:已撤销
  requireApproval: boolean;
  approvedBy?: string;
  approvedAt?: string;
  executedQuantity: number;
  avgPrice?: number;
  executedAt?: string;
  executedBy?: string;
  validUntil?: string;
  createdAt: string;
  createdBy?: string;
  remark?: string;
}

// 成交记录
export interface TradeExecution {
  id: string;
  executionNo: string;
  orderId?: string;
  exchange: string;
  contractCode: string;
  direction: number;
  quantity: number;
  price: number;
  amount: number;
  commission: number;
  sourceType: number; // 1:CTP导入, 2:手工录入
  sourceRef?: string;
  tradeDate: string;
  tradeTime: string;
  schemeId?: string;
  accountId?: string;
  status: number;
  confirmed: boolean;
  confirmedBy?: string;
  confirmedAt?: string;
  createdAt: string;
}

// 风险预警
export interface RiskWarning {
  id: string;
  warningNo: string;
  warningType: string; // MARGIN, RISK, PRICE, DELIVERY, QUOTA
  warningLevel: number; // 1:提醒, 2:预警, 3:告警
  title: string;
  content: string;
  relatedType?: string;
  relatedId?: string;
  thresholdValue?: number;
  currentValue?: number;
  status: number; // 0:未处理, 1:处理中, 2:已处理, 3:已忽略
  handledBy?: string;
  handledAt?: string;
  handleResult?: string;
  notified: boolean;
  createdAt: string;
}

// 日盈亏
export interface DailyPnl {
  id: string;
  recordDate: string;
  spotRealizedPnl: number;
  spotUnrealizedPnl: number;
  spotTotalPnl: number;
  futuresRealizedPnl: number;
  futuresUnrealizedPnl: number;
  futuresCommission: number;
  futuresTotalPnl: number;
  combinedPnl: number;
  hedgeRatio?: number;
  hedgeEffectiveness?: number;
  createdAt: string;
}

// 实时行情
export interface MarketQuote {
  id: string;
  exchange: string;
  contractCode: string;
  productType: string;
  open?: number;
  high?: number;
  low?: number;
  last: number;
  prevSettlement?: number;
  settlement?: number;
  change: number;
  changePercent: number;
  volume: number;
  openInterest: number;
  bidPrice?: number;
  bidVolume?: number;
  askPrice?: number;
  askVolume?: number;
  quoteTime: string;
  tradeDate: string;
}

// 通用分页响应
export interface PaginatedResult<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

// API响应
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// 仪表板统计数据
export interface DashboardStats {
  spotExposure: number;
  futuresPosition: number;
  hedgeRatio: number;
  riskRatio: number;
  todayPnl: number;
  totalPnl: number;
  activeSchemes: number;
  pendingApprovals: number;
  activeWarnings: number;
}

// 风险指标
export interface RiskMetrics {
  totalBalance: number;
  totalAvailable: number;
  totalMarginOccupied: number;
  totalRiskRatio: number;
  accountMetrics: {
    accountId: string;
    accountName: string;
    balance: number;
    available: number;
    marginOccupied: number;
    riskRatio: number;
    unrealizedPnl: number;
  }[];
}
