import { useState } from 'react';
import { Layout, Menu, Badge, Avatar, Dropdown, Space, Typography, theme } from 'antd';
import {
  DashboardOutlined,
  DatabaseOutlined,
  SafetyOutlined,
  FileTextOutlined,
  BarChartOutlined,
  DollarOutlined,
  AuditOutlined,
  SettingOutlined,
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore, useRiskStore } from '../../stores';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

export const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { unreadCount } = useRiskStore();
  const { token } = theme.useToken();

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: '首页',
    },
    {
      key: 'position',
      icon: <DatabaseOutlined />,
      label: '头寸管理',
      children: [
        { key: '/position/spot', label: '现货头寸' },
        { key: '/position/futures', label: '期货头寸' },
      ],
    },
    {
      key: 'hedge',
      icon: <SafetyOutlined />,
      label: '套保方案',
      children: [
        { key: '/hedge/schemes', label: '方案管理' },
        { key: '/hedge/approval', label: '方案审批' },
      ],
    },
    {
      key: 'trade',
      icon: <FileTextOutlined />,
      label: '交易执行',
      children: [
        { key: '/trade/orders', label: '交易指令' },
        { key: '/trade/executions', label: '成交记录' },
      ],
    },
    {
      key: 'risk',
      icon: <BarChartOutlined />,
      label: '风险监控',
      children: [
        { key: '/risk/monitor', label: '实时监控' },
        { key: '/risk/warnings', label: '预警管理' },
      ],
    },
    {
      key: 'report',
      icon: <DollarOutlined />,
      label: '盈亏分析',
      children: [
        { key: '/report/daily', label: '日报' },
        { key: '/report/performance', label: '绩效分析' },
      ],
    },
    {
      key: 'finance',
      icon: <AuditOutlined />,
      label: '财务报表',
      children: [
        { key: '/finance/valuation', label: '估值报表' },
      ],
    },
    {
      key: 'compliance',
      icon: <SafetyOutlined />,
      label: '合规管理',
      children: [
        { key: '/compliance/quota', label: '额度管理' },
      ],
    },
    {
      key: 'system',
      icon: <SettingOutlined />,
      label: '系统设置',
      children: [
        { key: '/system/users', label: '用户管理' },
        { key: '/system/roles', label: '角色权限' },
      ],
    },
  ];

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人中心',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '系统设置',
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  const handleUserMenuClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      logout();
      navigate('/login');
    } else if (key === 'profile') {
      // TODO: 打开个人中心
    }
  };

  const getSelectedKeys = () => {
    const pathname = location.pathname;
    return [pathname];
  };

  const getOpenKeys = () => {
    const pathname = location.pathname;
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length > 0) {
      return [segments[0]];
    }
    return [];
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        theme="light"
        style={{
          boxShadow: '2px 0 8px rgba(0,0,0,0.05)',
        }}
      >
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          <Text strong style={{ fontSize: collapsed ? 14 : 18, color: token.colorPrimary }}>
            {collapsed ? '套保' : '套期保值管理'}
          </Text>
        </div>
        <Menu
          mode="inline"
          selectedKeys={getSelectedKeys()}
          defaultOpenKeys={getOpenKeys()}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ borderRight: 0 }}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: '0 24px',
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div
              onClick={() => setCollapsed(!collapsed)}
              style={{
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '4px',
                transition: 'background 0.3s',
              }}
            >
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </div>
          </div>
          <Space size={24}>
            <Badge count={unreadCount} size="small">
              <BellOutlined
                style={{ fontSize: 18, cursor: 'pointer' }}
                onClick={() => navigate('/risk/warnings')}
              />
            </Badge>
            <Dropdown menu={{ items: userMenuItems, onClick: handleUserMenuClick }} placement="bottomRight">
              <Space style={{ cursor: 'pointer' }}>
                <Avatar icon={<UserOutlined />} />
                {!collapsed && <Text>{user?.realName || user?.username}</Text>}
              </Space>
            </Dropdown>
          </Space>
        </Header>
        <Content
          style={{
            margin: 24,
            padding: 24,
            background: '#fff',
            borderRadius: 8,
            minHeight: 280,
            overflow: 'auto',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
