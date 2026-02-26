import { useState } from 'react';
import {
  Card, DatePicker, Row, Col, Statistic, Table, Tag, Space, message, Button,
} from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { formatMoney, formatPercent } from '../../utils/format';

const { RangePicker } = DatePicker;

export default function PerformanceReport() {
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([dayjs().subtract(90, 'day'), dayjs()]);
  const [loading] = useState(false);

  // 模拟套保效果数据
  const effectivenessData = {
    hedgeRatio: 82.5,
    effectiveness: 85.3,
    spotVolatility: 12.5,
    hedgedVolatility: 4.2,
    riskReduction: 66.4,
    basisImpact: -125000,
  };

  // 模拟分方案盈亏
  const schemePnlData = [
    {
      id: '1',
      schemeNo: 'HS2024001',
      schemeName: 'Q1铜套保',
      spotPnl: -125000,
      futuresPnl: 145000,
      combinedPnl: 20000,
      hedgeRatio: 80,
      effectiveness: 88.2,
    },
    {
      id: '2',
      schemeNo: 'HS2024002',
      schemeName: '3月销售套保',
      spotPnl: -85000,
      futuresPnl: 92000,
      combinedPnl: 7000,
      hedgeRatio: 100,
      effectiveness: 91.5,
    },
    {
      id: '3',
      schemeNo: 'HS2024003',
      schemeName: '库存保值',
      spotPnl: 45000,
      futuresPnl: -25000,
      combinedPnl: 20000,
      hedgeRatio: 50,
      effectiveness: 76.8,
    },
  ];

  const columns = [
    {
      title: '方案编号',
      dataIndex: 'schemeNo',
    },
    {
      title: '方案名称',
      dataIndex: 'schemeName',
    },
    {
      title: '现货盈亏',
      dataIndex: 'spotPnl',
      align: 'right' as const,
      render: (val: number) => (
        <span style={{ color: val >= 0 ? '#52c41a' : '#f5222d' }}>
          {formatMoney(val)}
        </span>
      ),
    },
    {
      title: '期货盈亏',
      dataIndex: 'futuresPnl',
      align: 'right' as const,
      render: (val: number) => (
        <span style={{ color: val >= 0 ? '#52c41a' : '#f5222d' }}>
          {formatMoney(val)}
        </span>
      ),
    },
    {
      title: '合并盈亏',
      dataIndex: 'combinedPnl',
      align: 'right' as const,
      render: (val: number) => (
        <span style={{ color: val >= 0 ? '#52c41a' : '#f5222d', fontWeight: 'bold' }}>
          {formatMoney(val)}
        </span>
      ),
    },
    {
      title: '套保比率',
      dataIndex: 'hedgeRatio',
      align: 'right' as const,
      render: (val: number) => formatPercent(val),
    },
    {
      title: '套保有效性',
      dataIndex: 'effectiveness',
      align: 'right' as const,
      render: (val: number) => (
        <Tag color={val >= 80 ? 'success' : val >= 60 ? 'warning' : 'error'}>
          {formatPercent(val)}
        </Tag>
      ),
    },
  ];

  const handleExport = () => {
    message.success('导出成功');
  };

  return (
    <div>
      {/* 套保效果指标 */}
      <Card title="套保效果分析" style={{ marginBottom: 24 }}>
        <Row gutter={24}>
          <Col span={6}>
            <Statistic title="平均套保比率" value={effectivenessData.hedgeRatio} suffix="%" />
          </Col>
          <Col span={6}>
            <Statistic
              title="套保有效性"
              value={effectivenessData.effectiveness}
              suffix="%"
              valueStyle={{ color: '#52c41a' }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="风险降低率"
              value={effectivenessData.riskReduction}
              suffix="%"
              valueStyle={{ color: '#52c41a' }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="基差影响"
              value={effectivenessData.basisImpact}
              formatter={(v) => formatMoney(Number(v))}
              valueStyle={{ color: effectivenessData.basisImpact >= 0 ? '#52c41a' : '#f5222d' }}
            />
          </Col>
        </Row>
        <Row gutter={24} style={{ marginTop: 24 }}>
          <Col span={6}>
            <Card size="small">
              <div>现货价格波动率</div>
              <div style={{ fontSize: 24, fontWeight: 'bold' }}>{effectivenessData.spotVolatility}%</div>
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <div>套保后波动率</div>
              <div style={{ fontSize: 24, fontWeight: 'bold', color: '#52c41a' }}>
                {effectivenessData.hedgedVolatility}%
              </div>
            </Card>
          </Col>
        </Row>
      </Card>

      {/* 分方案盈亏 */}
      <Card
        title="分方案盈亏分析"
        extra={
          <Space>
            <RangePicker
              value={dateRange}
              onChange={(dates) => dates && setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs])}
            />
            <Button type="primary" icon={<DownloadOutlined />} onClick={handleExport}>
              导出
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={schemePnlData}
          rowKey="id"
          loading={loading}
          pagination={false}
          summary={(data) => {
            const totalSpotPnl = data.reduce((sum, d) => sum + d.spotPnl, 0);
            const totalFuturesPnl = data.reduce((sum, d) => sum + d.futuresPnl, 0);
            const totalCombinedPnl = data.reduce((sum, d) => sum + d.combinedPnl, 0);
            return (
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={2}>
                  <strong>合计</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2} align="right">
                  <strong style={{ color: totalSpotPnl >= 0 ? '#52c41a' : '#f5222d' }}>
                    {formatMoney(totalSpotPnl)}
                  </strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={3} align="right">
                  <strong style={{ color: totalFuturesPnl >= 0 ? '#52c41a' : '#f5222d' }}>
                    {formatMoney(totalFuturesPnl)}
                  </strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={4} align="right">
                  <strong style={{ color: totalCombinedPnl >= 0 ? '#52c41a' : '#f5222d' }}>
                    {formatMoney(totalCombinedPnl)}
                  </strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={5} colSpan={2} />
              </Table.Summary.Row>
            );
          }}
        />
      </Card>
    </div>
  );
}
