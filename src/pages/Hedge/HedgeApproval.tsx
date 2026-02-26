import { useState, useEffect } from 'react';
import {
  Table, Card, Button, Space, Tag, Modal, Descriptions, Timeline, Input, message,
} from 'antd';
import { CheckOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons';
import type { HedgeScheme } from '../../types';
import { SCHEME_STATUS } from '../../utils/constants';
import { formatQuantity, formatPercent, formatPrice } from '../../utils/format';

export default function HedgeApproval() {
  const [pendingList, setPendingList] = useState<HedgeScheme[]>([]);
  const [approvedList, setApprovedList] = useState<HedgeScheme[]>([]);
  const [loading, setLoading] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [approvalVisible, setApprovalVisible] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState<HedgeScheme | null>(null);
  const [comment, setComment] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // 模拟数据
      const mockPending: HedgeScheme[] = [
        {
          id: '1',
          schemeNo: 'HS2024004',
          schemeName: 'Q2套保方案',
          productType: 'CU',
          spotExposure: 800,
          hedgeRatio: 75,
          targetQuantity: 600,
          executedQuantity: 0,
          targetContract: 'CU2506',
          buildStrategy: 2,
          startDate: '2026-04-01',
          endDate: '2026-06-30',
          status: 1,
          createdAt: '2026-02-20',
          createdBy: '交易员A',
        },
      ];
      const mockApproved: HedgeScheme[] = [
        {
          id: '2',
          schemeNo: 'HS2024001',
          schemeName: 'Q1铜套保',
          productType: 'CU',
          spotExposure: 500,
          hedgeRatio: 80,
          targetQuantity: 400,
          executedQuantity: 320,
          targetContract: 'CU2504',
          buildStrategy: 2,
          startDate: '2026-01-01',
          endDate: '2026-03-31',
          status: 4,
          createdAt: '2026-01-05',
        },
      ];
      setPendingList(mockPending);
      setApprovedList(mockApproved);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      message.success('审批通过');
      setApprovalVisible(false);
      loadData();
    } catch (error) {
      message.error('审批失败');
    }
  };

  const handleReject = async () => {
    try {
      message.success('已拒绝');
      setApprovalVisible(false);
      loadData();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const openApproval = (record: HedgeScheme) => {
    setSelectedScheme(record);
    setComment('');
    setApprovalVisible(true);
  };

  const openDetail = (record: HedgeScheme) => {
    setSelectedScheme(record);
    setDetailVisible(true);
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
      title: '目标合约',
      dataIndex: 'targetContract',
    },
    {
      title: '提交人',
      dataIndex: 'createdBy',
    },
    {
      title: '提交时间',
      dataIndex: 'createdAt',
    },
    {
      title: '操作',
      width: 180,
      render: (_: any, record: HedgeScheme) => (
        <Space>
          <Button type="link" icon={<EyeOutlined />} onClick={() => openDetail(record)}>
            查看
          </Button>
          <Button type="primary" icon={<CheckOutlined />} onClick={() => openApproval(record)}>
            审批
          </Button>
        </Space>
      ),
    },
  ];

  const approvedColumns = [
    {
      title: '方案编号',
      dataIndex: 'schemeNo',
      width: 120,
    },
    {
      title: '方案名称',
      dataIndex: 'schemeName',
    },
    {
      title: '审批结果',
      render: () => <Tag color="success">已通过</Tag>,
    },
    {
      title: '审批人',
      dataIndex: 'approvedBy',
    },
    {
      title: '审批时间',
      dataIndex: 'approvedAt',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (status: number) => {
        const config = SCHEME_STATUS.find((s) => s.value === status);
        return <Tag color={config?.color}>{config?.label}</Tag>;
      },
    },
  ];

  return (
    <div>
      <Card title="待审批方案" style={{ marginBottom: 24 }}>
        <Table
          columns={columns}
          dataSource={pendingList}
          rowKey="id"
          loading={loading}
          pagination={false}
        />
      </Card>

      <Card title="已审批方案">
        <Table
          columns={approvedColumns}
          dataSource={approvedList}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* 审批弹窗 */}
      <Modal
        title="方案审批"
        open={approvalVisible}
        onCancel={() => setApprovalVisible(false)}
        footer={null}
        width={700}
      >
        {selectedScheme && (
          <div>
            <Descriptions bordered column={2} style={{ marginBottom: 24 }}>
              <Descriptions.Item label="方案编号">{selectedScheme.schemeNo}</Descriptions.Item>
              <Descriptions.Item label="方案名称">{selectedScheme.schemeName}</Descriptions.Item>
              <Descriptions.Item label="现货敞口">{formatQuantity(selectedScheme.spotExposure)}</Descriptions.Item>
              <Descriptions.Item label="套保比例">{formatPercent(selectedScheme.hedgeRatio)}</Descriptions.Item>
              <Descriptions.Item label="目标合约">{selectedScheme.targetContract}</Descriptions.Item>
              <Descriptions.Item label="建仓策略">
                {selectedScheme.buildStrategy === 1 ? '一次性' : '分批建仓'}
              </Descriptions.Item>
              <Descriptions.Item label="有效期" span={2}>
                {selectedScheme.startDate} ~ {selectedScheme.endDate}
              </Descriptions.Item>
            </Descriptions>
            <div style={{ marginBottom: 24 }}>
              <div style={{ marginBottom: 8 }}>审批意见</div>
              <Input.TextArea
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="请输入审批意见（可选）"
              />
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
        title="方案详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
        width={700}
      >
        {selectedScheme && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="方案编号">{selectedScheme.schemeNo}</Descriptions.Item>
            <Descriptions.Item label="方案名称">{selectedScheme.schemeName}</Descriptions.Item>
            <Descriptions.Item label="品种">{selectedScheme.productType}</Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag color={SCHEME_STATUS.find((s) => s.value === selectedScheme.status)?.color}>
                {SCHEME_STATUS.find((s) => s.value === selectedScheme.status)?.label}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="现货敞口">{formatQuantity(selectedScheme.spotExposure)}</Descriptions.Item>
            <Descriptions.Item label="套保比例">{formatPercent(selectedScheme.hedgeRatio)}</Descriptions.Item>
            <Descriptions.Item label="目标保值">{formatQuantity(selectedScheme.targetQuantity)}</Descriptions.Item>
            <Descriptions.Item label="已执行">{formatQuantity(selectedScheme.executedQuantity)}</Descriptions.Item>
            <Descriptions.Item label="目标合约">{selectedScheme.targetContract}</Descriptions.Item>
            <Descriptions.Item label="建仓策略">
              {selectedScheme.buildStrategy === 1 ? '一次性' : '分批建仓'}
            </Descriptions.Item>
            <Descriptions.Item label="价格区间" span={2}>
              {selectedScheme.priceRangeLow ? formatPrice(selectedScheme.priceRangeLow) : '-'} ~ 
              {selectedScheme.priceRangeHigh ? formatPrice(selectedScheme.priceRangeHigh) : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="有效期" span={2}>
              {selectedScheme.startDate} ~ {selectedScheme.endDate}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
}
