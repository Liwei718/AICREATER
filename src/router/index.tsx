import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { Spin } from 'antd';
import { MainLayout } from '../components/Layout/MainLayout';
import { useAuthStore } from '../stores';

// 懒加载页面组件
const Login = lazy(() => import('../pages/Login'));
const Dashboard = lazy(() => import('../pages/Dashboard'));

// 头寸管理
const SpotPosition = lazy(() => import('../pages/Position/SpotPosition'));
const FuturesPosition = lazy(() => import('../pages/Position/FuturesPosition'));

// 套保方案
const HedgeSchemes = lazy(() => import('../pages/Hedge/HedgeSchemes'));
const HedgeApproval = lazy(() => import('../pages/Hedge/HedgeApproval'));

// 交易执行
const TradeOrders = lazy(() => import('../pages/Trade/TradeOrders'));
const TradeExecutions = lazy(() => import('../pages/Trade/TradeExecutions'));

// 风险监控
const RiskMonitor = lazy(() => import('../pages/Risk/RiskMonitor'));
const RiskWarnings = lazy(() => import('../pages/Risk/RiskWarnings'));

// 盈亏分析
const DailyReport = lazy(() => import('../pages/Report/DailyReport'));
const PerformanceReport = lazy(() => import('../pages/Report/PerformanceReport'));

// 财务报表
const ValuationReport = lazy(() => import('../pages/Finance/ValuationReport'));

// 合规管理
const QuotaManagement = lazy(() => import('../pages/Compliance/QuotaManagement'));

// 系统设置
const UserManagement = lazy(() => import('../pages/System/UserManagement'));
const RoleManagement = lazy(() => import('../pages/System/RoleManagement'));

// 加载中组件
const PageLoading = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <Spin size="large" tip="加载中..." />
  </div>
);

// 路由守卫
const RequireAuth = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

// 路由配置
export const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <Suspense fallback={<PageLoading />}>
        <Login />
      </Suspense>
    ),
  },
  {
    element: <RequireAuth />,
    children: [
      {
        path: '/',
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<PageLoading />}>
                <Dashboard />
              </Suspense>
            ),
          },
          // 头寸管理
          {
            path: 'position/spot',
            element: (
              <Suspense fallback={<PageLoading />}>
                <SpotPosition />
              </Suspense>
            ),
          },
          {
            path: 'position/futures',
            element: (
              <Suspense fallback={<PageLoading />}>
                <FuturesPosition />
              </Suspense>
            ),
          },
          // 套保方案
          {
            path: 'hedge/schemes',
            element: (
              <Suspense fallback={<PageLoading />}>
                <HedgeSchemes />
              </Suspense>
            ),
          },
          {
            path: 'hedge/approval',
            element: (
              <Suspense fallback={<PageLoading />}>
                <HedgeApproval />
              </Suspense>
            ),
          },
          // 交易执行
          {
            path: 'trade/orders',
            element: (
              <Suspense fallback={<PageLoading />}>
                <TradeOrders />
              </Suspense>
            ),
          },
          {
            path: 'trade/executions',
            element: (
              <Suspense fallback={<PageLoading />}>
                <TradeExecutions />
              </Suspense>
            ),
          },
          // 风险监控
          {
            path: 'risk/monitor',
            element: (
              <Suspense fallback={<PageLoading />}>
                <RiskMonitor />
              </Suspense>
            ),
          },
          {
            path: 'risk/warnings',
            element: (
              <Suspense fallback={<PageLoading />}>
                <RiskWarnings />
              </Suspense>
            ),
          },
          // 盈亏分析
          {
            path: 'report/daily',
            element: (
              <Suspense fallback={<PageLoading />}>
                <DailyReport />
              </Suspense>
            ),
          },
          {
            path: 'report/performance',
            element: (
              <Suspense fallback={<PageLoading />}>
                <PerformanceReport />
              </Suspense>
            ),
          },
          // 财务报表
          {
            path: 'finance/valuation',
            element: (
              <Suspense fallback={<PageLoading />}>
                <ValuationReport />
              </Suspense>
            ),
          },
          // 合规管理
          {
            path: 'compliance/quota',
            element: (
              <Suspense fallback={<PageLoading />}>
                <QuotaManagement />
              </Suspense>
            ),
          },
          // 系统设置
          {
            path: 'system/users',
            element: (
              <Suspense fallback={<PageLoading />}>
                <UserManagement />
              </Suspense>
            ),
          },
          {
            path: 'system/roles',
            element: (
              <Suspense fallback={<PageLoading />}>
                <RoleManagement />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
