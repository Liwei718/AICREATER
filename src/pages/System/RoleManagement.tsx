import { useState, useEffect } from 'react';
import {
  Table, Card, Button, Space, Tag, Modal, Form, Input, Tree, message, Checkbox,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

interface Role {
  id: string;
  roleCode: string;
  roleName: string;
  description?: string;
  dataScope: number;
  status: number;
}

const mockPermissions = [
  {
    title: '头寸管理',
    key: 'position',
    children: [
      { title: '现货头寸', key: 'position:spot' },
      { title: '期货头寸', key: 'position:futures' },
    ],
  },
  {
    title: '套保方案',
    key: 'hedge',
    children: [
      { title: '方案管理', key: 'hedge:schemes' },
      { title: '方案审批', key: 'hedge:approval' },
    ],
  },
  {
    title: '交易执行',
    key: 'trade',
    children: [
      { title: '交易指令', key: 'trade:orders' },
      { title: '成交记录', key: 'trade:executions' },
    ],
  },
  {
    title: '风险监控',
    key: 'risk',
    children: [
      { title: '实时监控', key: 'risk:monitor' },
      { title: '预警管理', key: 'risk:warnings' },
    ],
  },
  {
    title: '系统设置',
    key: 'system',
    children: [
      { title: '用户管理', key: 'system:users' },
      { title: '角色权限', key: 'system:roles' },
    ],
  },
];

export default function RoleManagement() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [permissionVisible, setPermissionVisible] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [form] = Form.useForm();
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // 模拟数据
      const mockRoles: Role[] = [
        {
          id: '1',
          roleCode: 'admin',
          roleName: '系统管理员',
          description: '拥有所有权限',
          dataScope: 1,
          status: 1,
        },
        {
          id: '2',
          roleCode: 'trader',
          roleName: '交易员',
          description: '负责日常交易操作',
          dataScope: 2,
          status: 1,
        },
        {
          id: '3',
          roleCode: 'risk_manager',
          roleName: '风控员',
          description: '负责风险监控',
          dataScope: 2,
          status: 1,
        },
        {
          id: '4',
          roleCode: 'viewer',
          roleName: '只读用户',
          description: '仅可查看数据',
          dataScope: 3,
          status: 1,
        },
      ];
      setRoles(mockRoles);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingRole(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: Role) => {
    setEditingRole(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '删除后无法恢复，是否确认？',
      onOk: async () => {
        message.success('删除成功');
        loadData();
      },
    });
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingRole) {
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

  const handleSetPermission = (record: Role) => {
    setEditingRole(record);
    setSelectedPermissions(['position:*', 'hedge:*']);
    setPermissionVisible(true);
  };

  const handleSavePermission = async () => {
    try {
      message.success('权限设置成功');
      setPermissionVisible(false);
    } catch (error) {
      message.error('操作失败');
    }
  };

  const columns = [
    {
      title: '角色编码',
      dataIndex: 'roleCode',
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
    },
    {
      title: '描述',
      dataIndex: 'description',
      ellipsis: true,
    },
    {
      title: '数据范围',
      dataIndex: 'dataScope',
      render: (scope: number) => {
        const map: Record<number, string> = { 1: '全部', 2: '本部门', 3: '本人' };
        return map[scope] || '全部';
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (status: number) => (
        <Tag color={status === 1 ? 'success' : 'error'}>
          {status === 1 ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      width: 200,
      render: (_: any, record: Role) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Button type="link" onClick={() => handleSetPermission(record)}>
            权限
          </Button>
          <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card
        title="角色权限管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增角色
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={roles}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={editingRole ? '编辑角色' : '新增角色'}
        open={modalVisible}
        onOk={() => form.submit()}
        onCancel={() => setModalVisible(false)}
        width={600}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item name="roleCode" label="角色编码" rules={[{ required: true }]}>
            <Input disabled={!!editingRole} />
          </Form.Item>
          <Form.Item name="roleName" label="角色名称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="dataScope" label="数据范围" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="设置权限"
        open={permissionVisible}
        onOk={handleSavePermission}
        onCancel={() => setPermissionVisible(false)}
        width={600}
      >
        <Tree
          checkable
          treeData={mockPermissions}
          checkedKeys={selectedPermissions}
          onCheck={(checked) => setSelectedPermissions(checked as string[])}
        />
      </Modal>
    </div>
  );
}
