import { useState, useEffect } from 'react';
import {
  Card, Row, Col, Statistic, Progress, Table, Alert, Button, Typography,
  theme,
} from 'antd';
import { WarningOutlined } from '@ant-design/icons';
import type { RiskMetrics, RiskWarning } from '../../types';
import { formatMoney } from '../../utils/format';

const { Title } = Typography;

export default function RiskMonitor() {
  const [metrics, setMetrics] = useState<RiskMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  theme.useToken();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // 模拟数据
      const mockMetrics: RiskMetrics = {
        totalBalance: 5230000,
        totalAvailable: 2890000,
        totalMarginOccupied: 2058000,
        totalRiskRatio: 39.3,
        accountMetrics: [
          {
            accountId: '1',
            accountName: '中信期货主账户',
            balance: 5230000,
            available: 2890000,
            marginOccupied: 2058000,
            riskRatio: 39.3,
            unrealizedPnl: 155000,
          },
        ],
      };
      setMetrics(mockMetrics);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (ratio: number) => {
    if (ratio < 60) return '#52c41a';
    if (ratio < 80) return '#faad14';
    return '#f5222d';
  };

  const getRiskLevel = (ratio: number) => {
    if (ratio < 60) return '低风险';
    if (ratio < 80) return '中风险';
    return '高风险';
  };

  const accountColumns = [
    {
      title: '账户',
      dataIndex: 'accountName',
    },
    {
      title: '权益',
      dataIndex: 'balance',
      align: 'right' as const,
      render: (val: number) => formatMoney(val),
    },
    {
      title: '可用资金',
      dataIndex: 'available',
      align: 'right' as const,
      render: (val: number) => formatMoney(val),
    },
    {
      title: '占用保证金',
      dataIndex: 'marginOccupied',
      align: 'right' as const,
      render: (val: number) => formatMoney(val),
    },
    {
      title: '浮动盈亏',
      dataIndex: 'unrealizedPnl',
      align: 'right' as const,
      render: (val: number) => (
        <span style={{ color: val >= 0 ? '#52c41a' : '#f5222d' }}>
          {val >= 0 ? '+' : ''}{formatMoney(val)}
        </span>
      ),
    },
    {
      title: '风险度',
      dataIndex: 'riskRatio',
      render: (val: number) => (
        <Progress
          percent={Math.min(val, 100)}
          size="small"
          strokeColor={getRiskColor(val)}
          format={(p) => `${p?.toFixed(1)}%`}
        />
      ),
    },
  ];

  const warnings: RiskWarning[] = [
    {
      id: '1',
      warningNo: 'W001',
      warningType: 'RISK',
      warningLevel: 2,
      title: '风险度预警',
      content: '账户风险度达到65%，请关注',
      currentValue: 65,
      thresholdValue: 60,
      status: 0,
      notified: true,
      createdAt: '2026-02-24 10:23:00',
    },
  ];

  return (
    <div>
      {/* 总体风险指标 */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={6}>
          <Card loading={loading}>
            <div style={{ textAlign: 'center' }}>
              <Title level={4}>总体风险度</Title>
              <Progress
                type="dashboard"
                percent={Math.min(metrics?.totalRiskRatio || 0, 100)}
                strokeColor={getRiskColor(metrics?.totalRiskRatio || 0)}
                format={(p) => (
                  <div>
                    <div style={{ fontSize: 32, fontWeight: 'bold' }}>{p?.toFixed(1)}%</div>
                    <div style={{ fontSize: 14, color: getRiskColor(metrics?.totalRiskRatio || 0) }}>
                      {getRiskLevel(metrics?.totalRiskRatio || 0)}
                    </div>
                  </div>
                )}
              />
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={18}>
          <Row gutter={[24, 24]}>
            <Col span={8}>
              <Card loading={loading}>
                <Statistic
                  title="总权益"
                  value={metrics?.totalBalance || 0}
                  formatter={(v) => formatMoney(Number(v))}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card loading={loading}>
                <Statistic
                  title="可用资金"
                  value={metrics?.totalAvailable || 0}
                  formatter={(v) => formatMoney(Number(v))}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card loading={loading}>
                <Statistic
                  title="占用保证金"
                  value={metrics?.totalMarginOccupied || 0}
                  formatter={(v) => formatMoney(Number(v))}
                />
              </Card>
            </Col>
          </Row>
          <Card title="账户风险明细" loading={loading} style={{ marginTop: 24 }}>
            <Table
              columns={accountColumns}
              dataSource={metrics?.accountMetrics || []}
              rowKey="accountId"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>

      {/* 风险预警 */}
      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title={<><WarningOutlined /> 当前预警</>}>
            {warnings.map((item) => (
              <Alert
                key={item.id}
                message={item.title}
                description={item.content}
                type={item.warningLevel === 3 ? 'error' : item.warningLevel === 2 ? 'warning' : 'info'}
                showIcon
                action={
                  <Button size="small" type="primary">
                    处理
                  </Button>
                }
                style={{ marginBottom: 8 }}
              />
            ))}
          </Card>
        </Col>
      </Row>

      {/* 风控规则 */}
      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title="风控规则配置">
            <Row gutter={16}>
              <Col span={8}>
                <Card size="small" title="风险度阈值">
                  <div>提醒: 60%</div>
                  <div>预警: 80%</div>
                  <div>告警: 90%</div>
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small" title="保证金阈值">
                  <div>提醒: ¥100万</div>
                  <div>预警: ¥50万</div>
                  <div>告警: ¥20万</div>
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small" title="其他规则">
                  <div>交割月前15天提醒</div>
                  <div>集中度限制: 30%</div>
                  <div>单日亏损限制: ¥10万</div>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
