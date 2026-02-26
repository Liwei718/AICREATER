import { useState, useEffect } from 'react';
import {
  Card, DatePicker, Button, Table, Row, Col, Statistic, Space, Tag, message,
} from 'antd';
import { DownloadOutlined, PrinterOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { FuturesPosition } from '../../types';
import { formatMoney, formatPrice } from '../../utils/format';

export default function ValuationReport() {
  const [valuationDate, setValuationDate] = useState<dayjs.Dayjs>(dayjs());
  const [loading, setLoading] = useState(false);
  const [positions, setPositions] = useState<FuturesPosition[]>([]);

  useEffect(() => {
    loadData();
  }, [valuationDate]);

  const loadData = async () => {
    try {
      setLoading(true);
      // 模拟数据
      const mockPositions: FuturesPosition[] = [
        {
          id: '1',
          positionNo: 'FP2024001',
          accountId: '1',
          exchange: 'SHFE',
          contractCode: 'CU2504',
          productType: 'CU',
          direction: 2,
          totalQuantity: 60,
          availableQuantity: 60,
          frozenQuantity: 0,
          openPrice: 68800,
          settlementPrice: 68650,
          lastPrice: 68650,
          positionProfit: 45000,
          closeProfit: 0,
          totalProfit: 45000,
          marginOccupied: 2058000,
          hedgeType: 1,
          status: 1,
          openDate: "2026-02-10",
          deliveryIntent: false,
          deliveryStatus: 0,
          createdAt: '2026-02-10',
        },
        {
          id: '2',
          positionNo: 'FP2024002',
          accountId: '1',
          exchange: 'SHFE',
          contractCode: 'CU2505',
          productType: 'CU',
          direction: 2,
          totalQuantity: 100,
          availableQuantity: 100,
          frozenQuantity: 0,
          openPrice: 69000,
          settlementPrice: 68780,
          lastPrice: 68780,
          positionProfit: 110000,
          closeProfit: 0,
          totalProfit: 110000,
          marginOccupied: 3440000,
          hedgeType: 1,
          status: 1,
          openDate: "2026-02-10",
          deliveryIntent: false,
          deliveryStatus: 0,
          createdAt: '2026-02-15',
        },
      ];
      setPositions(mockPositions);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    message.success('导出成功');
  };

  const handlePrint = () => {
    window.print();
  };

  const columns = [
    {
      title: '合约',
      dataIndex: 'contractCode',
    },
    {
      title: '方向',
      dataIndex: 'direction',
      render: (dir: number) => dir === 1 ? '买入' : '卖出',
    },
    {
      title: '持仓量(手)',
      dataIndex: 'totalQuantity',
      align: 'right' as const,
    },
    {
      title: '成本价',
      dataIndex: 'openPrice',
      align: 'right' as const,
      render: (val: number) => formatPrice(val),
    },
    {
      title: '结算价',
      dataIndex: 'settlementPrice',
      align: 'right' as const,
      render: (val: number) => formatPrice(val || 0),
    },
    {
      title: '市值',
      align: 'right' as const,
      render: (_: any, record: FuturesPosition) => formatMoney(record.totalQuantity * 5 * (record.settlementPrice || 0)),
    },
    {
      title: '浮动盈亏',
      dataIndex: 'positionProfit',
      align: 'right' as const,
      render: (val: number) => (
        <span style={{ color: val >= 0 ? '#52c41a' : '#f5222d' }}>
          {formatMoney(val)}
        </span>
      ),
    },
    {
      title: '保证金',
      dataIndex: 'marginOccupied',
      align: 'right' as const,
      render: (val: number) => formatMoney(val),
    },
    {
      title: '属性',
      dataIndex: 'hedgeType',
      render: (type: number) => (
        <Tag color={type === 1 ? 'blue' : 'default'}>
          {type === 1 ? '套保' : '投机'}
        </Tag>
      ),
    },
  ];

  const totalMarketValue = positions.reduce((sum, p) => sum + p.totalQuantity * 5 * (p.settlementPrice || 0), 0);
  const totalUnrealizedPnl = positions.reduce((sum, p) => sum + p.positionProfit, 0);
  const totalMargin = positions.reduce((sum, p) => sum + p.marginOccupied, 0);

  return (
    <div>
      {/* 估值汇总 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic title="总市值" value={totalMarketValue} formatter={(v) => formatMoney(Number(v))} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="浮动盈亏"
              value={totalUnrealizedPnl}
              formatter={(v) => formatMoney(Number(v))}
              valueStyle={{ color: totalUnrealizedPnl >= 0 ? '#52c41a' : '#f5222d' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="占用保证金" value={totalMargin} formatter={(v) => formatMoney(Number(v))} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="持仓手数" value={positions.reduce((sum, p) => sum + p.totalQuantity, 0)} />
          </Card>
        </Col>
      </Row>

      {/* 估值明细 */}
      <Card
        title={`估值报表 - ${valuationDate.format('YYYY-MM-DD')}`}
        extra={
          <Space>
            <DatePicker
              value={valuationDate}
              onChange={(date) => date && setValuationDate(date)}
            />
            <Button icon={<PrinterOutlined />} onClick={handlePrint}>
              打印
            </Button>
            <Button type="primary" icon={<DownloadOutlined />} onClick={handleExport}>
              导出
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={positions}
          rowKey="id"
          loading={loading}
          pagination={false}
          summary={(data) => (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={5}>
                <strong>合计</strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1} align="right">
                <strong>{formatMoney(totalMarketValue)}</strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={2} align="right">
                <strong style={{ color: totalUnrealizedPnl >= 0 ? '#52c41a' : '#f5222d' }}>
                  {formatMoney(totalUnrealizedPnl)}
                </strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={3} align="right">
                <strong>{formatMoney(totalMargin)}</strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={4} />
            </Table.Summary.Row>
          )}
        />
      </Card>
    </div>
  );
}
