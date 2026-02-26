// 常量定义

// 头寸类型
export const POSITION_TYPES = [
  { value: 1, label: '库存', color: 'blue' },
  { value: 2, label: '销售订单', color: 'green' },
  { value: 3, label: '采购订单', color: 'orange' },
];

// 定价方式
export const PRICING_TYPES = [
  { value: 1, label: '固定价' },
  { value: 2, label: '点价' },
  { value: 3, label: '均价' },
];

// 点价状态
export const PRICING_STATUS = [
  { value: 0, label: '未点价', color: 'default' },
  { value: 1, label: '部分点价', color: 'warning' },
  { value: 2, label: '已点价', color: 'success' },
];

// 保值状态
export const HEDGE_STATUS = [
  { value: 0, label: '未保值', color: 'default' },
  { value: 1, label: '部分保值', color: 'warning' },
  { value: 2, label: '已保值', color: 'success' },
];

// 买卖方向
export const DIRECTIONS = [
  { value: 1, label: '买入', color: '#f5222d' },
  { value: 2, label: '卖出', color: '#52c41a' },
];

// 套保方案状态
export const SCHEME_STATUS = [
  { value: 0, label: '草稿', color: 'default' },
  { value: 1, label: '审批中', color: 'processing' },
  { value: 2, label: '已通过', color: 'success' },
  { value: 3, label: '已拒绝', color: 'error' },
  { value: 4, label: '执行中', color: 'blue' },
  { value: 5, label: '已完成', color: 'success' },
  { value: 6, label: '已终止', color: 'error' },
];

// 交易指令状态
export const ORDER_STATUS = [
  { value: 0, label: '草稿', color: 'default' },
  { value: 1, label: '待审批', color: 'warning' },
  { value: 2, label: '审批通过', color: 'success' },
  { value: 3, label: '审批拒绝', color: 'error' },
  { value: 4, label: '执行中', color: 'processing' },
  { value: 5, label: '已完成', color: 'success' },
  { value: 6, label: '已撤销', color: 'error' },
];

// 交易类型
export const ORDER_TYPES = [
  { value: 1, label: '开仓' },
  { value: 2, label: '平仓' },
  { value: 3, label: '移仓' },
];

// 价格类型
export const PRICE_TYPES = [
  { value: 1, label: '限价' },
  { value: 2, label: '市价' },
  { value: 3, label: '条件单' },
];

// 风险预警级别
export const WARNING_LEVELS = [
  { value: 1, label: '提醒', color: 'green' },
  { value: 2, label: '预警', color: 'orange' },
  { value: 3, label: '告警', color: 'red' },
];

// 风险预警类型
export const WARNING_TYPES = [
  { value: 'MARGIN', label: '保证金' },
  { value: 'RISK', label: '风险度' },
  { value: 'PRICE', label: '价格' },
  { value: 'DELIVERY', label: '交割' },
  { value: 'QUOTA', label: '额度' },
];

// 预警状态
export const WARNING_STATUS = [
  { value: 0, label: '未处理', color: 'red' },
  { value: 1, label: '处理中', color: 'orange' },
  { value: 2, label: '已处理', color: 'green' },
  { value: 3, label: '已忽略', color: 'default' },
];

// 合约列表（铜）
export const COPPER_CONTRACTS = [
  'CU2503',
  'CU2504',
  'CU2505',
  'CU2506',
  'CU2507',
  'CU2508',
  'CU2509',
  'CU2510',
  'CU2511',
  'CU2512',
];

// 品种列表
export const PRODUCT_TYPES = [
  { value: 'CU', label: '铜', unit: '吨' },
];

// 交易所列表
export const EXCHANGES = [
  { value: 'SHFE', label: '上海期货交易所' },
];

// 期货公司列表
export const BROKERS = [
  { value: '中信期货', label: '中信期货' },
  { value: '永安期货', label: '永安期货' },
  { value: '国泰君安', label: '国泰君安期货' },
  { value: '海通期货', label: '海通期货' },
  { value: '华泰期货', label: '华泰期货' },
];
