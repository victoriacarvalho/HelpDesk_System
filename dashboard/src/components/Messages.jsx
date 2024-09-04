/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Context } from "../main";
import { Navigate, Link} from "react-router-dom";
import { Card, Descriptions, Typography, Empty, Layout, Breadcrumb, Menu, message } from "antd";
import { MessageOutlined, LogoutOutlined } from "@ant-design/icons";
import { DownOutlined, DesktopOutlined, FileOutlined, PieChartOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Content, Sider, Header } = Layout;

const Messages = () => {
  const [messages, setMessages] = useState([]);
 
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/v1/user/logout/admin", {
        withCredentials: true,
      });
      message.success(res.data.message);
      setIsAuthenticated(false);
    } catch (err) {
      message.error(err.response?.data?.message || "Erro ao sair");
    }
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/message/getall",
          { withCredentials: true }
        );
        setMessages(data.messages);
      } catch (error) {
        console.error("Erro ao carregar mensagens:", error);
      }
    };
    fetchMessages();
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const menuItems = [
    { label: <Link to="/">Dashboard</Link>, key: '1', icon: <PieChartOutlined /> },
    { label: 'Consultar', key: 'sub1', icon: <UserOutlined />, children: [
      { label: <Link to="/tecnico">Técnico</Link>, key: '2'},
      { label: <Link to="/admins">Administradores</Link>, key: '3' },
    ]},
    { label: 'Adicionar', key: 'sub1', icon: <UserOutlined />, children: [
      { label: <Link to="/admin/addnew">Administrador</Link>, key: '4' },
      { label: <Link to="/tecnico/addnew">Técnico</Link>, key: '5' },
    ]},
    { label: <Link to="/messages">Mensagens</Link>, key: '5', icon: <TeamOutlined /> },
    { label: <span onClick={handleLogout}>Logout</span>, key: '6', icon: <FileOutlined /> },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          style={{
            background: 'linear-gradient(180deg, #004d40 0%, #00796b 100%)',
            borderRight: '1px solid #004d40',
            boxShadow: '2px 0 8px rgba(0, 0, 0, 0.2)',
            borderRadius: '0 10px 10px 0',
          }}
        >
        <div className="demo-logo-vertical" style={{ padding: '16px' }}>
          {/* Logo or other content */}
        </div>
        <Menu
          theme="dark"
          defaultSelectedKeys={['1']}
          mode="inline"
          items={menuItems}
          style={{
            background: 'transparent',
            borderRight: 'none',
          }}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: '#fff', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }} />
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item><a href="/">Dashboard</a></Breadcrumb.Item>
            <Breadcrumb.Item>Mensagens</Breadcrumb.Item>
          </Breadcrumb>
          <div style={{ padding: 24, minHeight: 360, background: '#f9f9f9', borderRadius: 8 }}>
            <Title level={2} style={{ marginBottom: 20 }}>
              Mensagens
            </Title>
            {messages.length > 0 ? (
              <div className="messages-list">
                {messages.map((msg) => (
                  <Card
                    key={msg._id}
                    bordered={false}
                    style={{
                      marginBottom: 16,
                      borderRadius: 8,
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                      background: '#fff',
                    }}
                    title={
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <MessageOutlined style={{ fontSize: 24, marginRight: 16, color: '#00796b' }} />
                        <strong>{`Mensagem de ${msg.firstName} ${msg.lastName}`}</strong>
                      </div>
                    }
                  >
                    <Descriptions bordered size="small" column={1}>
                      <Descriptions.Item label="Primeiro Nome">{msg.firstName}</Descriptions.Item>
                      <Descriptions.Item label="Segundo Nome">{msg.lastName}</Descriptions.Item>
                      <Descriptions.Item label="E-mail">{msg.email}</Descriptions.Item>
                      <Descriptions.Item label="Celular">{msg.phone}</Descriptions.Item>
                      <Descriptions.Item label="Mensagem">
                        {msg.message}
                      </Descriptions.Item>
                    </Descriptions>
                  </Card>
                ))}
              </div>
            ) : (
              <Empty
                description={<span>Sem mensagens!</span>}
                style={{ marginTop: 50 }}
              />
            )}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Messages;