import { useState, useEffect } from 'react';
import {
  Table, Card, Button, Space, Tag, Badge, Modal, Timeline, Select, message,
} from 'antd';
import { CheckOutlined, EyeOutlined } from '@ant-design/icons';
import type { RiskWarning } from '../../types';
import { WARNING_LEVELS, WARNING_TYPES, WARNING_STATUS } from '../../utils/constants';

const { Option } = Select;

export default function RiskWarnings() {
  const [warnings, setWarnings] = useState<RiskWarning[]>([]);
  const [loading, setLoading] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedWarning, setSelectedWarning] = useState<RiskWarning | null>(null);
  const [filters, setFilters] = useState({
    status: undefined,
    level: undefined,
  });

  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = async () => {
    try {
      setLoading(true);
      // 模拟数据
      const mockData: RiskWarning[] = [
        {
          id: '1',
          warningNo: 'W001',
          warningType: 'RISK',
          warningLevel: 2,
          title: '风险度预警',
          content: '账户A风险度达到65%，请关注',
          currentValue: 65,
          thresholdValue: 60,
          status: 0,
          notified: true,
          createdAt: '2026-02-24 10:23:00',
        },
        {
          id: '2',
          warningNo: 'W002',
          warningType: 'DELIVERY',
          warningLevel: 1,
          title: '交割提醒',
          content: 'CU2503合约即将进入交割月，请确认交割意向',
          currentValue: 15,
          thresholdValue: 15,
          status: 0,
          notified: true,
          createdAt: '2026-02-24 09:15:00',
        },
        {
          id: '3',
          warningNo: 'W003',
          warningType: 'QUOTA',
          warningLevel: 1,
          title: '额度使用提醒',
          content: '套保额度使用达到80%',
          currentValue: 80,
          thresholdValue: 80,
          status: 2,
          handledBy: '张三',
          handledAt: '2026-02-24 08:45:00',
          handleResult: '已关注，将申请增加额度',
          notified: true,
          createdAt: '2026-02-24 08:30:00',
        },
      ];
      setWarnings(mockData);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (record: RiskWarning) => {
    setSelectedWarning(record);
    setDetailVisible(true);
  };

  const handleProcess = async () => {
    try {
      message.success('处理成功');
      loadData();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleIgnore = async () => {
    try {
      message.success('已忽略');
      loadData();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const columns = [
    {
      title: '预警编号',
      dataIndex: 'warningNo',
      width: 110,
    },
    {
      title: '级别',
      dataIndex: 'warningLevel',
      width: 80,
      render: (level: number) => {
        const config = WARNING_LEVELS.find((l) => l.value === level);
        return <Badge color={config?.color} text={config?.label} />;
      },
    },
    {
      title: '类型',
      dataIndex: 'warningType',
      width: 100,
      render: (type: string) => WARNING_TYPES.find((t) => t.value === type)?.label,
    },
    {
      title: '标题',
      dataIndex: 'title',
      ellipsis: true,
    },
    {
      title: '当前值',
      dataIndex: 'currentValue',
      width: 100,
      render: (val: number, record: RiskWarning) => (
        <span>{val}{record.warningType === 'RISK' || record.warningType === 'QUOTA' ? '%' : ''}</span>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (status: number) => {
        const config = WARNING_STATUS.find((s) => s.value === status);
        return <Tag color={config?.color}>{config?.label}</Tag>;
      },
    },
    {
      title: '时间',
      dataIndex: 'createdAt',
      width: 160,
    },
    {
      title: '操作',
      width: 180,
      render: (_: any, record: RiskWarning) => (
        <Space>
          <Button type="link" icon={<EyeOutlined />} onClick={() => handleView(record)}>
            查看
          </Button>
          {record.status === 0 && (
            <>
              <Button type="primary" size="small" icon={<CheckOutlined />} onClick={handleProcess}>
                处理
              </Button>
              <Button type="link" danger onClick={handleIgnore}>
                忽略
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card
        title="风险预警管理"
        extra={
          <Space>
            <Select
              placeholder="级别"
              allowClear
              style={{ width: 100 }}
              value={filters.level}
              onChange={(v) => setFilters({ ...filters, level: v })}
            >
              {WARNING_LEVELS.map((l) => (
                <Option key={l.value} value={l.value}>{l.label}</Option>
              ))}
            </Select>
            <Select
              placeholder="状态"
              allowClear
              style={{ width: 100 }}
              value={filters.status}
              onChange={(v) => setFilters({ ...filters, status: v })}
            >
              {WARNING_STATUS.map((s) => (
                <Option key={s.value} value={s.value}>{s.label}</Option>
              ))}
            </Select>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={warnings}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* 详情弹窗 */}
      <Modal
        title="预警详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
        width={600}
      >
        {selectedWarning && (
          <Timeline>
            <Timeline.Item>
              <div>预警触发</div>
              <div style={{ color: '#999', fontSize: 12 }}>{selectedWarning.createdAt}</div>
              <div style={{ marginTop: 8 }}>
                <p><strong>预警类型:</strong> {WARNING_TYPES.find((t) => t.value === selectedWarning.warningType)?.label}</p>
                <p><strong>预警级别:</strong> <Badge color={WARNING_LEVELS.find((l) => l.value === selectedWarning.warningLevel)?.color} text={WARNING_LEVELS.find((l) => l.value === selectedWarning.warningLevel)?.label} /></p>
                <p><strong>预警内容:</strong> {selectedWarning.content}</p>
                <p><strong>当前值:</strong> {selectedWarning.currentValue}</p>
                <p><strong>阈值:</strong> {selectedWarning.thresholdValue}</p>
              </div>
            </Timeline.Item>
            {selectedWarning.handledAt && (
              <Timeline.Item>
                <div>已处理</div>
                <div style={{ color: '#999', fontSize: 12 }}>{selectedWarning.handledAt} by {selectedWarning.handledBy}</div>
                <div style={{ marginTop: 8 }}>
                  <p><strong>处理结果:</strong> {selectedWarning.handleResult}</p>
                </div>
              </Timeline.Item>
            )}
          </Timeline>
        )}
      </Modal>
    </div>
  );
}
