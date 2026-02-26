import { useState, useEffect } from 'react';
import {
  Table, Card, Button, Space, Tag, Progress, Input, Select, DatePicker,
  Modal, Form, InputNumber, Steps, message, Row, Col, Statistic, Tooltip,
} from 'antd';
import { PlusOutlined, EditOutlined, EyeOutlined, CheckCircleOutlined, StopOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { HedgeScheme } from '../../types';
import { SCHEME_STATUS, PRODUCT_TYPES, COPPER_CONTRACTS } from '../../utils/constants';
import { formatQuantity, formatPrice, formatPercent, formatMoney } from '../../utils/format';

const { Option } = Select;
const { RangePicker } = DatePicker;

export default function HedgeSchemes() {
  const [data, setData] = useState<HedgeScheme[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedScheme, setSelectedScheme] = useState<HedgeScheme | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // 模拟数据
      const mockData: HedgeScheme[] = [
        {
          id: '1',
          schemeNo: 'HS2024001',
          schemeName: 'Q1铜套保',
          productType: 'CU',
          spotExposure: 500,
          hedgeRatio: 80,
          targetQuantity: 400,
          executedQuantity: 320,
          targetContract: 'CU2504',
          buildStrategy: 2,
          priceRangeLow: 68000,
          priceRangeHigh: 69000,
          startDate: '2026-01-01',
          endDate: '2026-03-31',
          status: 4,
          actualQuantity: 320,
          avgPrice: 68650,
          createdAt: '2026-01-05',
        },
        {
          id: '2',
          schemeNo: 'HS2024002',
          schemeName: '3月销售套保',
          productType: 'CU',
          spotExposure: 300,
          hedgeRatio: 100,
          targetQuantity: 300,
          executedQuantity: 180,
          targetContract: 'CU2505',
          buildStrategy: 2,
          startDate: '2026-02-01',
          endDate: '2026-03-15',
          status: 4,
          actualQuantity: 180,
          avgPrice: 68800,
          createdAt: '2026-02-01',
        },
        {
          id: '3',
          schemeNo: 'HS2024003',
          schemeName: '库存保值',
          productType: 'CU',
          spotExposure: 200,
          hedgeRatio: 50,
          targetQuantity: 100,
          executedQuantity: 100,
          targetContract: 'CU2504',
          buildStrategy: 1,
          startDate: '2026-01-15',
          endDate: '2026-02-15',
          status: 5,
          actualQuantity: 100,
          avgPrice: 68500,
          
          closeAvgPrice: 68700,
          hedgeEffectiveness: 85.5,
          totalPnl: 150000,
          createdAt: '2026-01-10',
        },
      ];
      setData(mockData);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setCurrentStep(0);
    form.resetFields();
    setModalVisible(true);
  };

  const handleView = (record: HedgeScheme) => {
    setSelectedScheme(record);
    setDetailVisible(true);
  };

  const handleSubmit = async (values: any) => {
    try {
      const data = {
        ...values,
        startDate: values.dateRange?.[0]?.format('YYYY-MM-DD'),
        endDate: values.dateRange?.[1]?.format('YYYY-MM-DD'),
      };
      message.success('创建成功');
      setModalVisible(false);
      loadData();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleTerminate = (record: HedgeScheme) => {
    Modal.confirm({
      title: '终止方案',
      content: `确定要终止方案 ${record.schemeNo} 吗？`,
      onOk: () => {
        message.success('方案已终止');
        loadData();
      },
    });
  };

  const getProgress = (executed: number, target: number) => {
    return Math.min(Math.round((executed / target) * 100), 100);
  };

  const columns = [
    {
      title: '方案编号',
      dataIndex: 'schemeNo',
      width: 120,
    },
    {
      title: '方案名称',
      dataIndex: 'schemeName',
      ellipsis: true,
    },
    {
      title: '现货敞口',
      dataIndex: 'spotExposure',
      render: (val: number) => formatQuantity(val),
    },
    {
      title: '套保比例',
      dataIndex: 'hedgeRatio',
      render: (val: number) => formatPercent(val),
    },
    {
      title: '执行进度',
      render: (_: any, record: HedgeScheme) => (
        <Progress
          percent={getProgress(record.executedQuantity, record.targetQuantity)}
          size="small"
          status={record.status === 5 ? 'success' : 'active'}
        />
      ),
    },
    {
      title: '目标合约',
      dataIndex: 'targetContract',
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (status: number) => {
        const config = SCHEME_STATUS.find((s) => s.value === status);
        return <Tag color={config?.color}>{config?.label}</Tag>;
      },
    },
    {
      title: '操作',
      width: 180,
      render: (_: any, record: HedgeScheme) => (
        <Space>
          <Button type="link" icon={<EyeOutlined />} onClick={() => handleView(record)}>
            详情
          </Button>
          {record.status === 4 && (
            <Button type="link" danger icon={<StopOutlined />} onClick={() => handleTerminate(record)}>
              终止
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card
        title="套保方案管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新建方案
          </Button>
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

      {/* 新建方案 */}
      <Modal
        title="新建套保方案"
        open={modalVisible}
        onOk={() => form.submit()}
        onCancel={() => setModalVisible(false)}
        width={800}
      >
        <Steps current={currentStep} style={{ marginBottom: 24 }} items={[
          { title: '基本信息' },
          { title: '策略配置' },
          { title: '风险控制' },
        ]} />

        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item name="schemeName" label="方案名称" rules={[{ required: true }]}>
            <Input placeholder="请输入方案名称" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="productType" label="品种" rules={[{ required: true }]}>
                <Select>
                  {PRODUCT_TYPES.map((p) => (
                    <Option key={p.value} value={p.value}>{p.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="spotExposure" label="现货敞口(吨)" rules={[{ required: true }]}>
                <InputNumber style={{ width: '100%' }} min={0} precision={4} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="hedgeRatio" label="套保比例(%)" rules={[{ required: true }]}>
                <InputNumber style={{ width: '100%' }} min={0} max={100} precision={2} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="targetContract" label="目标合约" rules={[{ required: true }]}>
                <Select showSearch>
                  {COPPER_CONTRACTS.map((c) => (
                    <Option key={c} value={c}>{c}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="dateRange" label="有效期" rules={[{ required: true }]}>
            <RangePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="buildStrategy" label="建仓策略" rules={[{ required: true }]}>
            <Select>
              <Option value={1}>一次性建仓</Option>
              <Option value={2}>分批建仓</Option>
            </Select>
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="priceRangeLow" label="目标价格区间(低)">
                <InputNumber style={{ width: '100%' }} min={0} precision={2} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="priceRangeHigh" label="目标价格区间(高)">
                <InputNumber style={{ width: '100%' }} min={0} precision={2} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="remark" label="备注">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>

      {/* 方案详情 */}
      <Modal
        title="套保方案详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
        width={900}
      >
        {selectedScheme && (
          <div>
            <Row gutter={24} style={{ marginBottom: 24 }}>
              <Col span={6}>
                <Statistic title="现货敞口" value={selectedScheme.spotExposure} suffix="吨" />
              </Col>
              <Col span={6}>
                <Statistic title="目标保值" value={selectedScheme.targetQuantity} suffix="吨" />
              </Col>
              <Col span={6}>
                <Statistic title="已执行" value={selectedScheme.executedQuantity} suffix="吨" />
              </Col>
              <Col span={6}>
                <Statistic title="套保比例" value={selectedScheme.hedgeRatio} suffix="%" />
              </Col>
            </Row>
            <div style={{ marginBottom: 24 }}>
              <div style={{ marginBottom: 8 }}>执行进度</div>
              <Progress
                percent={getProgress(selectedScheme.executedQuantity, selectedScheme.targetQuantity)}
                status={selectedScheme.status === 5 ? 'success' : 'active'}
              />
            </div>
            {selectedScheme.status === 5 && (
              <Row gutter={24} style={{ marginBottom: 24 }}>
                <Col span={8}>
                  <Card size="small">
                    <Statistic
                      title="套保有效性"
                      value={selectedScheme.hedgeEffectiveness || 0}
                      suffix="%"
                      precision={2}
                    />
                  </Card>
                </Col>
                <Col span={8}>
                  <Card size="small">
                    <Statistic
                      title="建仓均价"
                      value={selectedScheme.avgPrice || 0}
                      formatter={(v) => formatPrice(Number(v))}
                    />
                  </Card>
                </Col>
                <Col span={8}>
                  <Card size="small">
                    <Statistic
                      title="总盈亏"
                      value={selectedScheme.totalPnl || 0}
                      formatter={(v) => formatMoney(Number(v))}
                      valueStyle={{ color: (selectedScheme.totalPnl || 0) >= 0 ? '#52c41a' : '#f5222d' }}
                    />
                  </Card>
                </Col>
              </Row>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
