import { useState, useEffect } from 'react';
import {
  Card, DatePicker, Button, Table, Row, Col, Statistic, Space, message,
} from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { DailyPnl } from '../../types';
import { formatMoney, formatPercent } from '../../utils/format';

const { RangePicker } = DatePicker;

export default function DailyReport() {
  const [data, setData] = useState<DailyPnl[]>([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([dayjs().subtract(30, 'day'), dayjs()]);
  const [summary, setSummary] = useState({
    totalSpotPnl: 0,
    totalFuturesPnl: 0,
    totalCombinedPnl: 0,
    avgHedgeRatio: 0,
    avgEffectiveness: 0,
  });

  useEffect(() => {
    loadData();
  }, [dateRange]);

  const loadData = async () => {
    try {
      setLoading(true);
      // 模拟数据
      const mockData: DailyPnl[] = [];
      let totalSpotPnl = 0;
      let totalFuturesPnl = 0;
      
      for (let i = 0; i < 30; i++) {
        const date = dayjs().subtract(i, 'day');
        const spotPnl = (Math.random() - 0.6) * 50000;
        const futuresPnl = (Math.random() - 0.4) * 80000;
        totalSpotPnl += spotPnl;
        totalFuturesPnl += futuresPnl;
        mockData.push({
          id: `d${i}`,
          recordDate: date.format('YYYY-MM-DD'),
          spotRealizedPnl: spotPnl * 0.3,
          spotUnrealizedPnl: spotPnl * 0.7,
          spotTotalPnl: spotPnl,
          futuresRealizedPnl: futuresPnl * 0.4,
          futuresUnrealizedPnl: futuresPnl * 0.6,
          futuresCommission: 500 + Math.random() * 1000,
          futuresTotalPnl: futuresPnl,
          combinedPnl: spotPnl + futuresPnl,
          hedgeRatio: 60 + Math.random() * 30,
          hedgeEffectiveness: 75 + Math.random() * 15,
          createdAt: date.format('YYYY-MM-DD'),
        });
      }
      
      setData(mockData);
      setSummary({
        totalSpotPnl,
        totalFuturesPnl,
        totalCombinedPnl: totalSpotPnl + totalFuturesPnl,
        avgHedgeRatio: 80,
        avgEffectiveness: 82.3,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    message.success('导出成功');
  };

  const columns = [
    {
      title: '日期',
      dataIndex: 'recordDate',
      width: 110,
    },
    {
      title: '现货盈亏',
      dataIndex: 'spotTotalPnl',
      align: 'right' as const,
      render: (val: number) => (
        <span style={{ color: val >= 0 ? '#52c41a' : '#f5222d' }}>
          {formatMoney(val)}
        </span>
      ),
    },
    {
      title: '期货盈亏',
      dataIndex: 'futuresTotalPnl',
      align: 'right' as const,
      render: (val: number) => (
        <span style={{ color: val >= 0 ? '#52c41a' : '#f5222d' }}>
          {formatMoney(val)}
        </span>
      ),
    },
    {
      title: '手续费',
      dataIndex: 'futuresCommission',
      align: 'right' as const,
      render: (val: number) => formatMoney(val),
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
      dataIndex: 'hedgeEffectiveness',
      align: 'right' as const,
      render: (val: number) => formatPercent(val),
    },
  ];

  return (
    <div>
      {/* 汇总统计 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="现货盈亏"
              value={summary.totalSpotPnl}
              formatter={(v) => formatMoney(Number(v))}
              valueStyle={{ color: summary.totalSpotPnl >= 0 ? '#52c41a' : '#f5222d' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="期货盈亏"
              value={summary.totalFuturesPnl}
              formatter={(v) => formatMoney(Number(v))}
              valueStyle={{ color: summary.totalFuturesPnl >= 0 ? '#52c41a' : '#f5222d' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="合并盈亏"
              value={summary.totalCombinedPnl}
              formatter={(v) => formatMoney(Number(v))}
              valueStyle={{ color: summary.totalCombinedPnl >= 0 ? '#52c41a' : '#f5222d' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="平均套保有效性" value={summary.avgEffectiveness} suffix="%" />
          </Card>
        </Col>
      </Row>

      {/* 明细表格 */}
      <Card
        title="日盈亏明细"
        extra={
          <Space>
            <RangePicker
              value={dateRange}
              onChange={(dates) => dates && setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs])}
            />
            <Button icon={<DownloadOutlined />} onClick={handleExport}>
              导出
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
}
