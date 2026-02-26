import { useState, useEffect } from 'react';
import {
  Card, Button, Table, Space, Tag, Progress, Modal, Form, Input, InputNumber, DatePicker, message,
} from 'antd';
import { PlusOutlined, EditOutlined, FileOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { formatQuantity, formatPercent } from '../../utils/format';

interface QuotaRecord {
  id: string;
  quotaNo: string;
  quotaYear: number;
  productType: string;
  exchange: string;
  totalQuota: number;
  usedQuota: number;
  availableQuota: number;
  validFrom: string;
  validTo: string;
  status: number;
  approvalDoc?: string;
}

export default function QuotaManagement() {
  const [quotas, setQuotas] = useState<QuotaRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // 模拟数据
      const mockData: QuotaRecord[] = [
        {
          id: '1',
          quotaNo: 'QTA2024001',
          quotaYear: 2024,
          productType: 'CU',
          exchange: 'SHFE',
          totalQuota: 5000,
          usedQuota: 3200,
          availableQuota: 1800,
          validFrom: '2024-01-01',
          validTo: '2024-12-31',
          status: 1,
          approvalDoc: '批文2024-001.pdf',
        },
        {
          id: '2',
          quotaNo: 'QTA2024002',
          quotaYear: 2024,
          productType: 'CU',
          exchange: 'SHFE',
          totalQuota: 2000,
          usedQuota: 1800,
          availableQuota: 200,
          validFrom: '2024-01-01',
          validTo: '2024-12-31',
          status: 1,
          approvalDoc: '批文2024-002.pdf',
        },
      ];
      setQuotas(mockData);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    form.resetFields();
    setModalVisible(true);
  };

  const handleSubmit = async (values: any) => {
    try {
      message.success('创建成功');
      setModalVisible(false);
      loadData();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const columns = [
    {
      title: '额度编号',
      dataIndex: 'quotaNo',
    },
    {
      title: '年度',
      dataIndex: 'quotaYear',
      width: 80,
    },
    {
      title: '品种',
      dataIndex: 'productType',
      width: 80,
    },
    {
      title: '交易所',
      dataIndex: 'exchange',
      width: 120,
    },
    {
      title: '获批额度(吨)',
      dataIndex: 'totalQuota',
      align: 'right' as const,
      render: (val: number) => formatQuantity(val),
    },
    {
      title: '已用额度(吨)',
      dataIndex: 'usedQuota',
      align: 'right' as const,
      render: (val: number) => formatQuantity(val),
    },
    {
      title: '剩余额度(吨)',
      dataIndex: 'availableQuota',
      align: 'right' as const,
      render: (val: number) => formatQuantity(val),
    },
    {
      title: '使用率',
      render: (_: any, record: QuotaRecord) => (
        <Progress
          percent={Math.round((record.usedQuota / record.totalQuota) * 100)}
          size="small"
          status={record.usedQuota / record.totalQuota > 0.9 ? 'exception' : 'active'}
        />
      ),
    },
    {
      title: '有效期',
      render: (_: any, record: QuotaRecord) => `${record.validFrom} ~ ${record.validTo}`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 80,
      render: (status: number) => (
        <Tag color={status === 1 ? 'success' : 'default'}>
          {status === 1 ? '有效' : '过期'}
        </Tag>
      ),
    },
    {
      title: '操作',
      width: 120,
      render: (_: any, record: QuotaRecord) => (
        <Space>
          <Button type="link" icon={<EditOutlined />}>
            编辑
          </Button>
          {record.approvalDoc && (
            <Button type="link" icon={<FileOutlined />}>
              批文
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card
        title="套保额度管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增额度
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={quotas}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title="新增额度"
        open={modalVisible}
        onOk={() => form.submit()}
        onCancel={() => setModalVisible(false)}
        width={600}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item name="quotaYear" label="年度" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} min={2020} max={2030} />
          </Form.Item>
          <Form.Item name="productType" label="品种" rules={[{ required: true }]}>
            <Input placeholder="如：CU" />
          </Form.Item>
          <Form.Item name="exchange" label="交易所" rules={[{ required: true }]}>
            <Input placeholder="如：SHFE" />
          </Form.Item>
          <Form.Item name="totalQuota" label="获批额度(吨)" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} min={0} precision={4} />
          </Form.Item>
          <Form.Item name="validRange" label="有效期" rules={[{ required: true }]}>
            <DatePicker.RangePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="approvalDoc" label="批文文件">
            <Input placeholder="文件路径" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
