// 格式化工具函数

/**
 * 格式化金额
 */
export const formatMoney = (value: number | undefined, decimals: number = 2): string => {
  if (value === undefined || value === null) return '-';
  return new Intl.NumberFormat('zh-CN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

/**
 * 格式化数量（吨）
 */
export const formatQuantity = (value: number | undefined, decimals: number = 4): string => {
  if (value === undefined || value === null) return '-';
  return new Intl.NumberFormat('zh-CN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

/**
 * 格式化价格
 */
export const formatPrice = (value: number | undefined, decimals: number = 0): string => {
  if (value === undefined || value === null) return '-';
  return new Intl.NumberFormat('zh-CN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

/**
 * 格式化百分比
 */
export const formatPercent = (value: number | undefined, decimals: number = 2): string => {
  if (value === undefined || value === null) return '-';
  return `${new Intl.NumberFormat('zh-CN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)}%`;
};

/**
 * 格式化日期
 */
export const formatDate = (value: string | Date | undefined): string => {
  if (!value) return '-';
  const date = typeof value === 'string' ? new Date(value) : value;
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

/**
 * 格式化日期时间
 */
export const formatDateTime = (value: string | Date | undefined): string => {
  if (!value) return '-';
  const date = typeof value === 'string' ? new Date(value) : value;
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * 格式化涨跌（带颜色标识）
 */
export const formatChange = (value: number | undefined): { text: string; color: string } => {
  if (value === undefined || value === null) return { text: '-', color: '' };
  const text = value > 0 ? `+${value}` : `${value}`;
  const color = value > 0 ? '#f5222d' : value < 0 ? '#52c41a' : '';
  return { text, color };
};

/**
 * 格式化涨跌百分比
 */
export const formatChangePercent = (value: number | undefined): { text: string; color: string } => {
  if (value === undefined || value === null) return { text: '-', color: '' };
  const text = `${value > 0 ? '+' : ''}${formatPercent(value, 2)}`;
  const color = value > 0 ? '#f5222d' : value < 0 ? '#52c41a' : '';
  return { text, color };
};
