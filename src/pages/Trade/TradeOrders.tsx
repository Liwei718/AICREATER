import { useState, useEffect } from 'react';
import {
  Table, Card, Button, Space, Tag, Modal, Form, Input, InputNumber, Select, Steps, message, Timeline,
} from 'antd';
import { PlusOutlined, EyeOutlined, CheckOutlined, CloseOutlined, StopOutlined } from '@ant-design/icons';
import type { TradeOrder } from '../../types';
import { ORDER_STATUS, ORDER_TYPES, DIRECTIONS, PRICE_TYPES, COPPER_CONTRACTS } from '../../utils/constants';
import { formatQuantity, formatPrice } from '../../utils/format';

const { Option } = Select;

export default function TradeOrders() {
  const [orders, setOrders] = useState<TradeOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [approvalVisible, setApprovalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<TradeOrder | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // 模拟数据
      const mockOrders: TradeOrder[] = [
        {
          id: '1',
          orderNo: 'TO2024028',
          orderType: 1,
          direction: 2,
          exchange: 'SHFE',
          contractCode: 'CU2504',
          productType: 'CU',
          quantity: 20,
          orderPriceType: 1,
          limitPrice: 68650,
          status: 1,
          requireApproval: true,
          executedQuantity: 0,
          createdAt: '2026-02-24 09:30:00',
          createdBy: '交易员A',
        },
        {
          id: '2',
          orderNo: 'TO2024027',
          orderType: 1,
          direction: 2,
          exchange: 'SHFE',
          contractCode: 'CU2505',
          productType: 'CU',
          quantity: 16,
          orderPriceType: 2,
          status: 5,
          requireApproval: true,
          approvedBy: '审批人A',
          approvedAt: '2026-02-24 10:00:00',
          executedQuantity: 16,
          avgPrice: 68780,
          executedAt: '2026-02-24 10:05:00',
          executedBy: '交易员B',
          createdAt: '2026-02-24 09:15:00',
        },
        {
          id: '3',
          orderNo: 'TO2024026',
          orderType: 2,
          direction: 1,
          exchange: 'SHFE',
          contractCode: 'CU2504',
          productType: 'CU',
          quantity: 10,
          orderPriceType: 1,
          limitPrice: 68700,
          status: 2,
          requireApproval: true,
          approvedBy: '审批人A',
          approvedAt: '2026-02-24 11:00:00',
          executedQuantity: 0,
          createdAt: '2026-02-24 10:45:00',
        },
      ];
      setOrders(mockOrders);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    form.resetFields();
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    try {
      message.success('指令创建成功');
      setModalVisible(false);
      loadData();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleApprove = async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    try {
      message.success('审批通过');
      setApprovalVisible(false);
      loadData();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleReject = async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    try {
      message.success('已拒绝');
      setApprovalVisible(false);
      loadData();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleCancel = async (record: TradeOrder) => {
    Modal.confirm({
      title: '撤销指令',
      content: '确定要撤销该指令吗？',
      onOk: async () => {
        message.success('指令已撤销');
        loadData();
      },
    });
  };

  const openApproval = (record: TradeOrder) => {
    setSelectedOrder(record);
    setApprovalVisible(true);
  };

  const openDetail = (record: TradeOrder) => {
    setSelectedOrder(record);
    setDetailVisible(true);
  };

  const getStatusStep = (status: number) => {
    if (status <= 1) return 0;
    if (status === 2 || status === 3) return 1;
    if (status === 4) return 2;
    if (status === 5) return 3;
    return 0;
  };

  const columns = [
    {
      title: '指令编号',
      dataIndex: 'orderNo',
      width: 120,
    },
    {
      title: '类型',
      dataIndex: 'orderType',
      width: 80,
      render: (type: number) => ORDER_TYPES.find((t) => t.value === type)?.label,
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
      title: '数量',
      dataIndex: 'quantity',
      align: 'right' as const,
      render: (val: number) => formatQuantity(val),
    },
    {
      title: '已成交',
      dataIndex: 'executedQuantity',
      align: 'right' as const,
      render: (val: number) => formatQuantity(val),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (status: number) => {
        const config = ORDER_STATUS.find((s) => s.value === status);
        return <Tag color={config?.color}>{config?.label}</Tag>;
      },
    },
    {
      title: '操作',
      width: 180,
      render: (_: any, record: TradeOrder) => (
        <Space>
          <Button type="link" icon={<EyeOutlined />} onClick={() => openDetail(record)}>
            详情
          </Button>
          {record.status === 1 && (
            <Button type="primary" size="small" onClick={() => openApproval(record)}>
              审批
            </Button>
          )}
          {(record.status === 1 || record.status === 2) && (
            <Button type="link" danger icon={<StopOutlined />} onClick={() => handleCancel(record)}>
              撤销
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card
        title="交易指令管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新建指令
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={orders}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* 新建指令 */}
      <Modal
        title="新建交易指令"
        open={modalVisible}
        onOk={() => form.submit()}
        onCancel={() => setModalVisible(false)}
        width={600}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item name="orderType" label="交易类型" rules={[{ required: true }]}>
            <Select>
              {ORDER_TYPES.map((t) => (
                <Option key={t.value} value={t.value}>{t.label}</Option>
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
          <Form.Item name="quantity" label="数量(手)" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} min={1} precision={0} />
          </Form.Item>
          <Form.Item name="orderPriceType" label="价格类型" rules={[{ required: true }]}>
            <Select>
              {PRICE_TYPES.map((t) => (
                <Option key={t.value} value={t.value}>{t.label}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="limitPrice" label="限价">
            <InputNumber style={{ width: '100%' }} min={0} precision={2} />
          </Form.Item>
          <Form.Item name="remark" label="备注">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>

      {/* 审批弹窗 */}
      <Modal
        title="指令审批"
        open={approvalVisible}
        onCancel={() => setApprovalVisible(false)}
        footer={null}
        width={500}
      >
        {selectedOrder && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <div>指令编号: {selectedOrder.orderNo}</div>
              <div>合约: {selectedOrder.contractCode}</div>
              <div>方向: {DIRECTIONS.find((d) => d.value === selectedOrder.direction)?.label}</div>
              <div>数量: {selectedOrder.quantity}手</div>
              <div>价格类型: {PRICE_TYPES.find((t) => t.value === selectedOrder.orderPriceType)?.label}</div>
              {selectedOrder.limitPrice && <div>限价: {formatPrice(selectedOrder.limitPrice)}</div>}
            </div>
            <div style={{ textAlign: 'right' }}>
              <Space>
                <Button onClick={() => setApprovalVisible(false)}>取消</Button>
                <Button danger icon={<CloseOutlined />} onClick={handleReject}>
                  拒绝
                </Button>
                <Button type="primary" icon={<CheckOutlined />} onClick={handleApprove}>
                  通过
                </Button>
              </Space>
            </div>
          </div>
        )}
      </Modal>

      {/* 详情弹窗 */}
      <Modal
        title="指令详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
        width={600}
      >
        {selectedOrder && (
          <div>
            <Steps current={getStatusStep(selectedOrder.status)} size="small" style={{ marginBottom: 24 }} items={[
            { title: '创建' },
            { title: '审批' },
            { title: '执行' },
            { title: '完成' },
          ]} />
            <Timeline>
              <Timeline.Item>
                <div>创建指令</div>
                <div style={{ color: '#999', fontSize: 12 }}>{selectedOrder.createdAt} by {selectedOrder.createdBy}</div>
              </Timeline.Item>
              {selectedOrder.approvedAt && (
                <Timeline.Item>
                  <div>审批通过</div>
                  <div style={{ color: '#999', fontSize: 12 }}>{selectedOrder.approvedAt} by {selectedOrder.approvedBy}</div>
                </Timeline.Item>
              )}
              {selectedOrder.executedAt && (
                <Timeline.Item>
                  <div>执行完成</div>
                  <div style={{ color: '#999', fontSize: 12 }}>{selectedOrder.executedAt} by {selectedOrder.executedBy}</div>
                </Timeline.Item>
              )}
            </Timeline>
          </div>
        )}
      </Modal>
    </div>
  );
}
