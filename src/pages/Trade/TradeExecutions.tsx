import { useState, useEffect } from 'react';
import {
  Table, Card, Button, Space, Tag, Upload, message, Row, Col, Statistic, DatePicker, Select,
} from 'antd';
import { UploadOutlined, DownloadOutlined, CheckCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { TradeExecution } from '../../types';
import { DIRECTIONS } from '../../utils/constants';
import { formatPrice, formatMoney } from '../../utils/format';

const { RangePicker } = DatePicker;

export default function TradeExecutions() {
  const [data, setData] = useState<TradeExecution[]>([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([dayjs().subtract(7, 'day'), dayjs()]);

  useEffect(() => {
    loadData();
  }, [dateRange]);

  const loadData = async () => {
    try {
      setLoading(true);
      // 模拟数据
      const mockData: TradeExecution[] = [
        {
          id: '1',
          executionNo: 'EX2024028001',
          exchange: 'SHFE',
          contractCode: 'CU2505',
          direction: 2,
          quantity: 10,
          price: 68780,
          amount: 3439000,
          commission: 17.2,
          sourceType: 1,
          tradeDate: '2026-02-24',
          tradeTime: '09:35:00',
          status: 1,
          confirmed: true,
          createdAt: '2026-02-24 09:35:00',
        },
        {
          id: '2',
          executionNo: 'EX2024028002',
          exchange: 'SHFE',
          contractCode: 'CU2505',
          direction: 2,
          quantity: 6,
          price: 68790,
          amount: 2063700,
          commission: 10.3,
          sourceType: 1,
          tradeDate: '2026-02-24',
          tradeTime: '10:05:00',
          status: 1,
          confirmed: true,
          createdAt: '2026-02-24 10:05:00',
        },
        {
          id: '3',
          executionNo: 'EX2024027001',
          exchange: 'SHFE',
          contractCode: 'CU2504',
          direction: 2,
          quantity: 8,
          price: 68650,
          amount: 2746000,
          commission: 13.7,
          sourceType: 1,
          tradeDate: '2026-02-23',
          tradeTime: '14:20:00',
          status: 1,
          confirmed: true,
          createdAt: '2026-02-23 14:20:00',
        },
      ];
      setData(mockData);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = (info: any) => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} 导入成功`);
      loadData();
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 导入失败`);
    }
  };

  const handleExport = () => {
    message.success('导出成功');
  };

  const handleConfirm = async (id: string) => {
    try {
      message.success('确认成功');
      loadData();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const columns = [
    {
      title: '成交编号',
      dataIndex: 'executionNo',
      width: 130,
    },
    {
      title: '合约',
      dataIndex: 'contractCode',
      width: 100,
    },
    {
      title: '方向',
      dataIndex: 'direction',
      width: 80,
      render: (dir: number) => {
        const config = DIRECTIONS.find((d) => d.value === dir);
        return <span style={{ color: config?.color }}>{config?.label}</span>;
      },
    },
    {
      title: '数量(手)',
      dataIndex: 'quantity',
      align: 'right' as const,
    },
    {
      title: '成交价',
      dataIndex: 'price',
      align: 'right' as const,
      render: (val: number) => formatPrice(val),
    },
    {
      title: '成交金额',
      dataIndex: 'amount',
      align: 'right' as const,
      render: (val: number) => formatMoney(val),
    },
    {
      title: '手续费',
      dataIndex: 'commission',
      align: 'right' as const,
      render: (val: number) => formatMoney(val),
    },
    {
      title: '成交时间',
      dataIndex: 'tradeTime',
      width: 100,
    },
    {
      title: '来源',
      dataIndex: 'sourceType',
      width: 100,
      render: (type: number) => (
        <Tag color={type === 1 ? 'blue' : 'default'}>
          {type === 1 ? 'CTP导入' : '手工录入'}
        </Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'confirmed',
      width: 100,
      render: (confirmed: boolean) => (
        confirmed ? <Tag color="success">已确认</Tag> : <Tag>待确认</Tag>
      ),
    },
    {
      title: '操作',
      width: 120,
      render: (_: any, record: TradeExecution) => (
        !record.confirmed && (
          <Button type="link" icon={<CheckCircleOutlined />} onClick={() => handleConfirm(record.id)}>
            确认
          </Button>
        )
      ),
    },
  ];

  // 统计
  const todayData = data.filter((d) => d.tradeDate === dayjs().format('YYYY-MM-DD'));
  const todayCount = todayData.length;
  const todayVolume = todayData.reduce((sum, d) => sum + d.quantity, 0);
  const todayAmount = todayData.reduce((sum, d) => sum + d.amount, 0);
  const todayCommission = todayData.reduce((sum, d) => sum + d.commission, 0);

  return (
    <div>
      {/* 今日成交统计 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card><Statistic title="今日成交笔数" value={todayCount} /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="今日成交量" value={todayVolume} suffix="手" /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="今日成交额" value={todayAmount} formatter={(v) => formatMoney(Number(v))} /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="今日手续费" value={todayCommission} formatter={(v) => formatMoney(Number(v))} /></Card>
        </Col>
      </Row>

      <Card
        title="成交记录"
        extra={
          <Space>
            <RangePicker
              value={dateRange}
              onChange={(dates) => dates && setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs])}
            />
            <Upload
              accept=".csv,.xlsx"
              showUploadList={false}
              customRequest={({ onSuccess }) => setTimeout(() => onSuccess?.('ok'), 0)}
              onChange={handleImport}
            >
              <Button icon={<UploadOutlined />}>导入成交</Button>
            </Upload>
            <Button icon={<DownloadOutlined />} onClick={handleExport}>导出</Button>
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
