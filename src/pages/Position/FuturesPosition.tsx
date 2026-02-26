import { useState, useEffect } from 'react';
import {
  Table, Card, Button, Space, Tag, Select, Row, Col, Statistic,
  Modal, Form, Input, InputNumber, message, Descriptions,
} from 'antd';
import { PlusOutlined, EditOutlined, SyncOutlined, EyeOutlined } from '@ant-design/icons';
import { positionApi } from '../../api';
import type { FuturesPosition, FuturesAccount } from '../../types';
import { DIRECTIONS, EXCHANGES, COPPER_CONTRACTS } from '../../utils/constants';
import { formatQuantity, formatPrice, formatMoney, formatPercent } from '../../utils/format';

const { Option } = Select;

export default function FuturesPosition() {
  const [positions, setPositions] = useState<FuturesPosition[]>([]);
  const [accounts, setAccounts] = useState<FuturesAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<FuturesPosition | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadData();
    loadAccounts();
  }, []);

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
          marginOccupied: 205800,
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
          marginOccupied: 344000,
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

  const loadAccounts = async () => {
    // 模拟账户数据
    const mockAccounts: FuturesAccount[] = [
      {
        id: '1',
        accountNo: '88888888',
        accountName: '中信期货主账户',
        brokerName: '中信期货',
        exchange: 'SHFE',
        balance: 5230000,
        available: 2890000,
        marginOccupied: 2058000,
        frozenMargin: 0,
        riskRatio: 39.3,
      },
    ];
    setAccounts(mockAccounts);
  };

  const handleAdd = () => {
    form.resetFields();
    setModalVisible(true);
  };

  const handleView = (pos: FuturesPosition) => {
    setSelectedPosition(pos);
    setDetailVisible(true);
  };

  const handleSubmit = async () => {
    try {
      message.success('录入成功');
      setModalVisible(false);
      loadData();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleSync = async () => {
    try {
      message.success('同步成功');
      loadAccounts();
    } catch (error) {
      message.error('同步失败');
    }
  };

  const columns = [
    {
      title: '持仓编号',
      dataIndex: 'positionNo',
      width: 120,
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
      title: '持仓量',
      dataIndex: 'totalQuantity',
      align: 'right' as const,
      render: (val: number, record: FuturesPosition) => `${val}手 (${val * 5}吨)`,
    },
    {
      title: '开仓均价',
      dataIndex: 'openPrice',
      align: 'right' as const,
      render: (val: number) => formatPrice(val),
    },
    {
      title: '结算价',
      dataIndex: 'settlementPrice',
      align: 'right' as const,
      render: (val: number) => formatPrice(val),
    },
    {
      title: '浮动盈亏',
      dataIndex: 'positionProfit',
      align: 'right' as const,
      render: (val: number) => (
        <span style={{ color: val >= 0 ? '#52c41a' : '#f5222d' }}>
          {val >= 0 ? '+' : ''}{formatMoney(val)}
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
      title: '开仓日期',
      dataIndex: 'openDate',
      width: 110,
    },
    {
      title: '操作',
      width: 120,
      render: (_: any, record: FuturesPosition) => (
        <Button type="link" icon={<EyeOutlined />} onClick={() => {}}>
          详情
        </Button>
      ),
    },
  ];

  // 统计
  const totalLong = positions.filter((p) => p.direction === 1).reduce((sum, p) => sum + p.totalQuantity, 0);
  const totalShort = positions.filter((p) => p.direction === 2).reduce((sum, p) => sum + p.totalQuantity, 0);
  const netPosition = totalLong - totalShort;
  const totalProfit = positions.reduce((sum, p) => sum + p.totalProfit, 0);
  const totalMargin = positions.reduce((sum, p) => sum + p.marginOccupied, 0);

  return (
    <div>
      {/* 账户信息 */}
      {accounts.map((account) => (
        <Card key={account.id} style={{ marginBottom: 24 }}>
          <Row gutter={16} align="middle">
            <Col span={4}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 500 }}>{account.accountName}</div>
                <div style={{ color: '#999', fontSize: 12 }}>{account.accountNo}</div>
              </div>
            </Col>
            <Col span={4}><Statistic title="权益" value={account.balance} formatter={(v) => formatMoney(Number(v))} /></Col>
            <Col span={4}><Statistic title="可用资金" value={account.available} formatter={(v) => formatMoney(Number(v))} /></Col>
            <Col span={4}><Statistic title="占用保证金" value={account.marginOccupied} formatter={(v) => formatMoney(Number(v))} /></Col>
            <Col span={4}>
              <Statistic
                title="风险度"
                value={account.riskRatio}
                suffix="%"
                valueStyle={{ color: account.riskRatio > 80 ? '#f5222d' : '#52c41a' }}
              />
            </Col>
            <Col span={4} style={{ textAlign: 'right' }}>
              <Button icon={<SyncOutlined />} onClick={() => {}}>同步资金</Button>
            </Col>
          </Row>
        </Card>
      ))}

      {/* 持仓统计 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}><Card><Statistic title="净持仓" value={netPosition} suffix="手" /></Card></Col>
        <Col span={6}><Card><Statistic title="多头持仓" value={totalLong} suffix="手" /></Card></Col>
        <Col span={6}><Card><Statistic title="空头持仓" value={totalShort} suffix="手" /></Card></Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总盈亏"
              value={totalProfit}
              formatter={(v) => formatMoney(Number(v))}
              valueStyle={{ color: totalProfit >= 0 ? '#52c41a' : '#f5222d' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 持仓列表 */}
      <Card
        title="期货持仓列表"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            录入持仓
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={positions}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* 新增持仓弹窗 */}
      <Modal
        title="录入期货持仓"
        open={modalVisible}
        onOk={() => form.submit()}
        onCancel={() => setModalVisible(false)}
        width={600}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item name="accountId" label="交易账户" rules={[{ required: true }]}>
            <Select>
              {accounts.map((a) => (
                <Option key={a.id} value={a.id}>{a.accountName}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="contractCode" label="合约代码" rules={[{ required: true }]}>
            <Select showSearch>
              {COPPER_CONTRACTS.map((c) => (
                <Option key={c} value={c}>{c}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="direction" label="买卖方向" rules={[{ required: true }]}>
            <Select>
              {DIRECTIONS.map((d) => (
                <Option key={d.value} value={d.value}>{d.label}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="totalQuantity" label="持仓数量(手)" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} min={1} precision={0} />
          </Form.Item>
          <Form.Item name="openPrice" label="开仓均价" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} min={0} precision={2} />
          </Form.Item>
          <Form.Item name="hedgeType" label="持仓属性" rules={[{ required: true }]}>
            <Select>
              <Option value={1}>套保</Option>
              <Option value={2}>投机</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* 持仓详情 */}
      <Modal
        title="持仓详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
        width={700}
      >
        {selectedPosition && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="持仓编号">{selectedPosition.positionNo}</Descriptions.Item>
            <Descriptions.Item label="合约代码">{selectedPosition.contractCode}</Descriptions.Item>
            <Descriptions.Item label="买卖方向">
              {DIRECTIONS.find((d) => d.value === selectedPosition.direction)?.label}
            </Descriptions.Item>
            <Descriptions.Item label="持仓属性">
              {selectedPosition.hedgeType === 1 ? '套保' : '投机'}
            </Descriptions.Item>
            <Descriptions.Item label="持仓数量">{selectedPosition.totalQuantity}手</Descriptions.Item>
            <Descriptions.Item label="可用数量">{selectedPosition.availableQuantity}手</Descriptions.Item>
            <Descriptions.Item label="开仓均价">{formatPrice(selectedPosition.openPrice)}</Descriptions.Item>
            <Descriptions.Item label="结算价">{formatPrice(selectedPosition.settlementPrice || 0)}</Descriptions.Item>
            <Descriptions.Item label="浮动盈亏">
              <span style={{ color: selectedPosition.positionProfit >= 0 ? '#52c41a' : '#f5222d' }}>
                {selectedPosition.positionProfit >= 0 ? '+' : ''}{formatMoney(selectedPosition.positionProfit)}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="平仓盈亏">{formatMoney(selectedPosition.closeProfit)}</Descriptions.Item>
            <Descriptions.Item label="保证金占用">{formatMoney(selectedPosition.marginOccupied)}</Descriptions.Item>
            <Descriptions.Item label="开仓日期">{selectedPosition.openDate}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
}
