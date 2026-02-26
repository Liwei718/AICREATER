import { useState, useEffect } from 'react';
import {
  Table, Card, Button, Space, Tag, Input, Select, DatePicker,
  Modal, Form, InputNumber, message, Row, Col, Statistic,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { SpotPosition } from '../../types';
import { POSITION_TYPES, PRICING_TYPES, PRICING_STATUS, HEDGE_STATUS, PRODUCT_TYPES } from '../../utils/constants';
import { formatQuantity, formatDate } from '../../utils/format';

const { Option } = Select;
const { RangePicker } = DatePicker;

export default function SpotPosition() {
  const [data, setData] = useState<SpotPosition[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<SpotPosition | null>(null);
  const [form] = Form.useForm();
  const [filters, setFilters] = useState({
    positionType: undefined,
    status: undefined,
    keyword: '',
  });

  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = async () => {
    try {
      setLoading(true);
      // 模拟数据
      const mockData: SpotPosition[] = [
        {
          id: '1',
          positionNo: 'SP2024001',
          positionType: 1,
          productType: 'CU',
          quantity: 500,
          unitCost: 68000,
          totalCost: 34000000,
          warehouse: '上海仓库',
          qualityGrade: 'A级',
          pricingType: 1,
          pricingStatus: 2,
          pricedQuantity: 500,
          status: 1,
          hedgeStatus: 2,
          hedgedQuantity: 500,
          positionDate: '2026-02-01',
          createdAt: '2026-02-01',
        },
        {
          id: '2',
          positionNo: 'SP2024002',
          positionType: 2,
          productType: 'CU',
          quantity: 400,
          counterparty: '客户A',
          contractNo: 'SA2024001',
          deliveryDate: '2026-03-15',
          pricingType: 2,
          basePrice: 68500,
          premium: -200,
          pricingStatus: 0,
          pricedQuantity: 0,
          status: 1,
          hedgeStatus: 1,
          hedgedQuantity: 300,
          positionDate: '2026-02-10',
          createdAt: '2026-02-10',
        },
        {
          id: '3',
          positionNo: 'SP2024003',
          positionType: 3,
          productType: 'CU',
          quantity: 150,
          counterparty: '供应商B',
          contractNo: 'PA2024001',
          deliveryDate: '2026-03-01',
          pricingType: 1,
          finalPrice: 67900,
          pricingStatus: 2,
          pricedQuantity: 150,
          status: 1,
          hedgeStatus: 0,
          hedgedQuantity: 0,
          positionDate: '2026-02-15',
          createdAt: '2026-02-15',
        },
      ];
      setData(mockData);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: SpotPosition) => {
    setEditingRecord(record);
    form.setFieldsValue({
      ...record,
      deliveryDate: record.deliveryDate ? dayjs(record.deliveryDate) : undefined,
    });
    setModalVisible(true);
  };

  const handleDelete = async () => {
    Modal.confirm({
      title: '确认删除',
      content: '删除后数据将无法恢复，是否确认？',
      onOk: async () => {
        message.success('删除成功');
        loadData();
      },
    });
  };

  const handleSubmit = async (formValues: any) => {
    try {
      const data = {
        ...formValues,
        deliveryDate: formValues.deliveryDate?.format('YYYY-MM-DD'),
      };
      
      if (editingRecord) {
        message.success('更新成功');
      } else {
        message.success('创建成功');
      }
      setModalVisible(false);
      loadData();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const columns = [
    {
      title: '头寸编号',
      dataIndex: 'positionNo',
      width: 120,
    },
    {
      title: '类型',
      dataIndex: 'positionType',
      width: 100,
      render: (type: number) => {
        const config = POSITION_TYPES.find((t) => t.value === type);
        return <Tag color={config?.color}>{config?.label}</Tag>;
      },
    },
    {
      title: '数量(吨)',
      dataIndex: 'quantity',
      align: 'right' as const,
      render: (val: number) => formatQuantity(val),
    },
    {
      title: '方向',
      dataIndex: 'positionType',
      render: (type: number) => type === 2 ? <Tag color="green">空头</Tag> : <Tag color="red">多头</Tag>,
    },
    {
      title: '定价方式',
      dataIndex: 'pricingType',
      render: (type: number) => PRICING_TYPES.find((t) => t.value === type)?.label,
    },
    {
      title: '点价状态',
      dataIndex: 'pricingStatus',
      render: (status: number) => {
        const config = PRICING_STATUS.find((s) => s.value === status);
        return <Tag color={config?.color}>{config?.label}</Tag>;
      },
    },
    {
      title: '保值状态',
      dataIndex: 'hedgeStatus',
      render: (status: number) => {
        const config = HEDGE_STATUS.find((s) => s.value === status);
        return <Tag color={config?.color}>{config?.label}</Tag>;
      },
    },
    {
      title: '交货期',
      dataIndex: 'deliveryDate',
      render: (date: string) => formatDate(date),
    },
    {
      title: '操作',
      width: 150,
      render: (_: any, record: SpotPosition) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Button type="link" danger icon={<DeleteOutlined />} onClick={() => {}}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  // 统计数据
  const totalInventory = data.filter((d) => d.positionType === 1).reduce((sum, d) => sum + d.quantity, 0);
  const totalSales = data.filter((d) => d.positionType === 2).reduce((sum, d) => sum + d.quantity, 0);
  const totalPurchase = data.filter((d) => d.positionType === 3).reduce((sum, d) => sum + d.quantity, 0);
  const netExposure = totalInventory + totalPurchase - totalSales;

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card><Statistic title="总敞口" value={netExposure} suffix="吨" /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="库存" value={totalInventory} suffix="吨" /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="销售订单" value={totalSales} suffix="吨" /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="采购订单" value={totalPurchase} suffix="吨" /></Card>
        </Col>
      </Row>

      <Card
        title="现货头寸列表"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增头寸
          </Button>
        }
      >
        <Space style={{ marginBottom: 16 }}>
          <Select
            placeholder="头寸类型"
            allowClear
            style={{ width: 120 }}
            value={filters.positionType}
            onChange={(v) => setFilters({ ...filters, positionType: v })}
          >
            {POSITION_TYPES.map((t) => (
              <Option key={t.value} value={t.value}>{t.label}</Option>
            ))}
          </Select>
          <Select
            placeholder="状态"
            allowClear
            style={{ width: 120 }}
            value={filters.status}
            onChange={(v) => setFilters({ ...filters, status: v })}
          >
            <Option value={1}>有效</Option>
            <Option value={0}>已关闭</Option>
          </Select>
          <Input.Search
            placeholder="搜索编号/对手方"
            allowClear
            value={filters.keyword}
            onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
            style={{ width: 250 }}
          />
        </Space>

        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={editingRecord ? '编辑现货头寸' : '新增现货头寸'}
        open={modalVisible}
        onOk={() => form.submit()}
        onCancel={() => setModalVisible(false)}
        width={600}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item name="positionType" label="头寸类型" rules={[{ required: true }]}>
            <Select>
              {POSITION_TYPES.map((t) => (
                <Option key={t.value} value={t.value}>{t.label}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="productType" label="品种" rules={[{ required: true }]}>
            <Select>
              {PRODUCT_TYPES.map((t) => (
                <Option key={t.value} value={t.value}>{t.label}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="quantity" label="数量(吨)" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} min={0} precision={4} />
          </Form.Item>
          <Form.Item name="pricingType" label="定价方式" rules={[{ required: true }]}>
            <Select>
              {PRICING_TYPES.map((t) => (
                <Option key={t.value} value={t.value}>{t.label}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="deliveryDate" label="交货期">
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="remark" label="备注">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
