import { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Table, Badge, List, Typography, Space, theme } from 'antd';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  WarningOutlined,
  BellOutlined,
  CheckCircleOutlined,
  DashboardOutlined,
} from '@ant-design/icons';
import { useMarketStore, usePositionStore, useRiskStore } from '../../stores';
import { dashboardApi } from '../../api';
import type { DashboardStats, MarketQuote } from '../../types';
import { formatMoney, formatQuantity, formatPercent, formatPrice, formatChange } from '../../utils/format';
import { SCHEME_STATUS, WARNING_LEVELS } from '../../utils/constants';

const { Title, Text } = Typography;

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { quotes } = useMarketStore();
  const { accounts } = usePositionStore();
  const { warnings } = useRiskStore();
  const { token } = theme.useToken();

  useEffect(() => {
    loadDashboardData();
    // 模拟行情数据
    const mockQuotes: MarketQuote[] = [
      {
        id: '1',
        exchange: 'SHFE',
        contractCode: 'CU2503',
        productType: 'CU',
        last: 68520,
        change: 320,
        changePercent: 0.47,
        volume: 125632,
        openInterest: 215630,
        quoteTime: new Date().toISOString(),
        tradeDate: new Date().toISOString().split('T')[0],
      },
      {
        id: '2',
        exchange: 'SHFE',
        contractCode: 'CU2504',
        productType: 'CU',
        last: 68650,
        change: 310,
        changePercent: 0.45,
        volume: 98521,
        openInterest: 180234,
        quoteTime: new Date().toISOString(),
        tradeDate: new Date().toISOString().split('T')[0],
      },
      {
        id: '3',
        exchange: 'SHFE',
        contractCode: 'CU2505',
        productType: 'CU',
        last: 68780,
        change: 295,
        changePercent: 0.43,
        volume: 65421,
        openInterest: 145832,
        quoteTime: new Date().toISOString(),
        tradeDate: new Date().toISOString().split('T')[0],
      },
    ];
    useMarketStore.getState().setQuotes(mockQuotes);
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // 模拟数据
      setStats({
        spotExposure: 1250,
        futuresPosition: -800,
        hedgeRatio: 64,
        riskRatio: 45.2,
        todayPnl: 4.6,
        totalPnl: 89.5,
        activeSchemes: 3,
        pendingApprovals: 2,
        activeWarnings: 1,
      });
    } finally {
      setLoading(false);
    }
  };

  // 指标卡片配置
  const statCards = [
    {
      title: '现货敞口',
      value: stats?.spotExposure || 0,
      suffix: '吨',
      prefix: '',
      change: -3.2,
      color: token.colorPrimary,
    },
    {
      title: '期货持仓',
      value: stats?.futuresPosition || 0,
      suffix: '吨',
      prefix: '',
      change: 5.0,
      color: token.colorSuccess,
    },
    {
      title: '套保比率',
      value: stats?.hedgeRatio || 0,
      suffix: '%',
      prefix: '',
      change: -2.1,
      color: token.colorWarning,
    },
    {
      title: '风险度',
      value: stats?.riskRatio || 0,
      suffix: '%',
      prefix: '',
      change: 0,
      color: stats && stats.riskRatio > 80 ? token.colorError : token.colorSuccess,
    },
  ];

  // 预警列
  const warningColumns = [
    {
      title: '级别',
      dataIndex: 'warningLevel',
      width: 80,
      render: (level: number) => {
        const config = WARNING_LEVELS.find((w) => w.value === level);
        return <Badge color={config?.color} text={config?.label} />;
      },
    },
    {
      title: '类型',
      dataIndex: 'warningType',
      width: 100,
    },
    {
      title: '内容',
      dataIndex: 'content',
      ellipsis: true,
    },
    {
      title: '时间',
      dataIndex: 'createdAt',
      width: 150,
    },
  ];

  // 模拟预警数据
  const mockWarnings = [
    {
      id: '1',
      warningNo: 'W001',
      warningLevel: 2,
      warningType: '风险度',
      content: '账户A风险度达到65%，请关注',
      createdAt: '2026-02-24 10:23:00',
    },
    {
      id: '2',
      warningNo: 'W002',
      warningLevel: 1,
      warningType: '交割提醒',
      content: 'CU2503合约即将进入交割月',
      createdAt: '2026-02-24 09:15:00',
    },
  ];

  // 待办事项
  const todos = [
    { icon: <BellOutlined />, title: '方案HS2024001待审批', time: '2分钟前' },
    { icon: <CheckCircleOutlined />, title: '指令TO2024028待执行', time: '10分钟前' },
    { icon: <DashboardOutlined />, title: '今日需点价订单: 3笔', time: '1小时前' },
  ];

  return (
    <div>
      <Row gutter={[24, 24]}>
        {/* 统计指标卡片 */}
        {statCards.map((card, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card loading={loading}>
              <Statistic
                title={card.title}
                value={card.value}
                precision={card.suffix === '%' ? 1 : card.suffix === '吨' ? 0 : 2}
                suffix={card.suffix}
                prefix={card.prefix}
                valueStyle={{ color: card.color }}
              />
              <div style={{ marginTop: 8 }}>
                <Text type={card.change > 0 ? 'danger' : card.change < 0 ? 'success' : 'secondary'}>
                  {card.change > 0 ? <ArrowUpOutlined /> : card.change < 0 ? <ArrowDownOutlined /> : null}
                  {Math.abs(card.change)}%
                </Text>
                <Text type="secondary" style={{ marginLeft: 8 }}>较昨日</Text>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        {/* 盈亏走势图（简化版） */}
        <Col xs={24} lg={12}>
          <Card title="期现盈亏走势" extra={<a href="#/report/daily">查看更多</a>}>
            <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Space direction="vertical" align="center">
                <Text type="secondary">盈亏趋势图表区域</Text>
                <Text>今日盈亏: <Text type="success">+4.6万</Text></Text>
                <Text>本月盈亏: <Text type="success">+89.5万</Text></Text>
                <Text>套保有效性: <Text strong>82.3%</Text></Text>
              </Space>
            </div>
          </Card>
        </Col>

        {/* 套保方案执行进度 */}
        <Col xs={24} lg={12}>
          <Card title="套保方案执行进度" extra={<a href="#/hedge/schemes">查看更多</a>}>
            <List
              dataSource={[
                { name: 'Q1铜套保', progress: 80, status: 4 },
                { name: '3月销售套保', progress: 60, status: 4 },
                { name: '库存保值', progress: 100, status: 5 },
              ]}
              renderItem={(item) => (
                <List.Item>
                  <div style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <Text>{item.name}</Text>
                      <Badge {...SCHEME_STATUS.find((s) => s.value === item.status)} />
                    </div>
                    <div style={{ background: '#f0f0f0', borderRadius: 4, height: 8 }}>
                      <div
                        style={{
                          width: `${item.progress}%`,
                          background: item.progress === 100 ? '#52c41a' : '#1677ff',
                          height: '100%',
                          borderRadius: 4,
                          transition: 'width 0.3s',
                        }}
                      />
                    </div>
                    <Text type="secondary" style={{ fontSize: 12 }}>{item.progress}%</Text>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        {/* 风险预警 */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <WarningOutlined style={{ color: token.colorWarning }} />
                <span>风险预警</span>
              </Space>
            }
            extra={<a href="#/risk/warnings">查看全部</a>}
          >
            <Table
              columns={warningColumns}
              dataSource={mockWarnings}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>

        {/* 待办事项 */}
        <Col xs={24} lg={12}>
          <Card title="待办事项" extra={<a href="#">查看全部</a>}>
            <List
              dataSource={todos}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={item.icon}
                    title={item.title}
                    description={item.time}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* 实时行情 */}
      <Row style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title="铜期货实时行情">
            <Row gutter={24}>
              {Object.values(quotes).map((quote) => {
                const changeInfo = formatChange(quote.change);
                return (
                  <Col xs={24} sm={8} key={quote.contractCode}>
                    <Card size="small" style={{ marginBottom: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text strong style={{ fontSize: 16 }}>{quote.contractCode}</Text>
                        <Text style={{ fontSize: 18, color: changeInfo.color }}>
                          {formatPrice(quote.last)}
                        </Text>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                        <Text type="secondary">成交量: {quote.volume?.toLocaleString()}</Text>
                        <Text style={{ color: changeInfo.color }}>
                          {changeInfo.text} ({quote.changePercent}%)
                        </Text>
                      </div>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
