import React, { useState } from 'react';
import { MenuFoldOutlined, MenuUnfoldOutlined, UploadOutlined, UserOutlined, VideoCameraOutlined, BarChartOutlined, PieChartOutlined } from '@ant-design/icons';
import { Layout, Menu, Button, theme, Space, Avatar } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const { Header, Sider, Content } = Layout;

// Create a client
const queryClient = new QueryClient();

const DefaultLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const { isAuthenticated, logout, user } = useAuth();
  /* Check xem trang thai dang nhap */
  React.useEffect(()=>{
    if(!isAuthenticated){
      navigate('/login');
    }
  },[isAuthenticated,navigate])

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const menuItems = [
    {
      key: '',
      icon: <UserOutlined />,
      label: 'Dashboard',
    },
    {
      key: 'category',
      icon: <VideoCameraOutlined />,
      label: 'Categories Management',
    },
    {
      key: 'books',
      icon: <UploadOutlined />,
      label: 'Books Management',
    },
    {
      key: 'members',
      icon: <UploadOutlined />,
      label: 'Members Management',
    },
    {
      key: 'publishers',
      icon: <PieChartOutlined />,
      label: 'Publishers Management',
    },
    {
      key: 'employees',
      icon: <UploadOutlined />,
      label: 'Employees Management',
    },
    {
      key: 'orders',
      icon: <BarChartOutlined />,
      label: 'Orders Management',
    },
  ];
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div
            className="demo-logo-vertical"
            style={{
              color: 'white',
              whiteSpace: 'nowrap',
              fontSize: '20px',
              fontWeight: 'bold',
              padding: '10px 20px',
            }}
          >
            Admin
          </div>
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['1']}
            items={menuItems}
            onClick={({ key }) => {
              navigate('/' + key.split('-').join('/'));
              console.log(key);
            }}
          />
        </Sider>
        <Layout>
          <Header style={{ padding: 0, background: colorBgContainer }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,
              }}
            />
            <Space>
              <Avatar src={<img src='../../../../public/images/image-yellow.png' alt="avatar" />} />
              <strong>{user?.name}</strong>
              <Button
                type="primary"
                onClick={() => {
                  logout();
                }}
              >
                Logout
              </Button>
            </Space>
          </Header>
          <Content
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: 580,
              background: colorBgContainer,
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </QueryClientProvider>
  );
};

export default DefaultLayout;
