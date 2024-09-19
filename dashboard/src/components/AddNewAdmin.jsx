/* eslint-disable no-unused-vars */
import React, { useContext, useState } from "react";
import { Input, Button, message, Card, Layout, Breadcrumb, Typography, Menu } from "antd";
import { Context } from "../main";
import { Navigate, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { DownOutlined, DesktopOutlined, FileOutlined, PieChartOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';

const { Content, Sider, Header } = Layout;
const { Title } = Typography;

const AddNewAdmin = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);

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

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [sector, setSector] = useState("");
  const [registration, setRegistration] = useState("");
  const [collapsed, setCollapsed] = useState(false);

  const navigateTo = useNavigate();

  const handleAddNewAdmin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:4000/api/v1/user/administrador/addnew",
        { firstName, lastName, email, phone, password, sector, registration },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      message.success(res.data.message);
      setIsAuthenticated(true);
      navigateTo("/");
      clearForm();
    } catch (error) {
      message.error(error.response?.data?.message || "Erro ao adicionar admin");
    }
  };

  const clearForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setPassword("");
    setSector("");
    setRegistration("");
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const menuItems = [
    { label: <Link to="/">Dashboard</Link>, key: '1', icon: <PieChartOutlined /> },
    { label: 'Consultar', key: 'sub1', icon: <UserOutlined />, children: [
      { label: <Link to="/tecnico">Técnico</Link>, key: '2' },
      { label: <Link to="/admins">Administradores</Link>, key: '3' },
      { label: <Link to="/userP">Usuários</Link>, key: '8' },
    ]},
    { label: 'Adicionar', key: 'sub2', icon: <UserOutlined />, children: [
      { label: <Link to="/admin/addnew">Administrador</Link>, key: '4' },
      { label: <Link to="/tecnico/addnew">Técnico</Link>, key: '5' },
    ]},
    { label: <Link to="/messages">Mensagens</Link>, key: '6', icon: <TeamOutlined /> },
    { label: <span onClick={handleLogout}>Logout</span>, key: '7', icon: <FileOutlined /> },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        style={{
          background: "linear-gradient(180deg, #004d40 0%, #a5d6a7 100%)",
          borderRight: '1px solid #004d40',
          boxShadow: '2px 0 8px rgba(0, 0, 0, 0.2)',
          borderRadius: '0 10px 10px 0',
        }}
      >
        <div className="demo-logo-vertical" style={{ padding: '16px', textAlign: 'center' }}>
          <img src="/logo.png" alt="Logo" style={{ height: 120 }} />
        </div>
        <Menu
          theme="dark"
          defaultSelectedKeys={['4']}
          mode="inline"
          items={menuItems}
          style={{
            background: 'transparent',
            borderRight: 'none',
          }}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: '#fff' }} />
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item><a href="/">Dashboard</a></Breadcrumb.Item>
            <Breadcrumb.Item>Adicionar Admin</Breadcrumb.Item>
          </Breadcrumb>
          <div style={{ padding: 24, minHeight: 360, background: '#fff', borderRadius: 8 }}>
            <Card
              className="card-signup header-solid ant-card pt-0"
              title={<Title level={4}>Adicionar Novo Administrador</Title>}
              bordered={false}
              style={{ maxWidth: 800, margin: '0 auto', padding: '24px' }}
            >
              <form onSubmit={handleAddNewAdmin}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <Input
                      placeholder="Primeiro nome"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      style={{ flex: 1 }}
                    />
                    <Input
                      placeholder="Segundo nome"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      style={{ flex: 1 }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <Input
                      type="email"
                      placeholder="E-mail"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{ flex: 1 }}
                    />
                    <Input
                      type="number"
                      placeholder="Celular"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      style={{ flex: 1 }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <Input
                      placeholder="Setor"
                      value={sector}
                      onChange={(e) => setSector(e.target.value)}
                      style={{ flex: 1 }}
                    />
                    <Input
                      placeholder="Digite sua matrícula"
                      value={registration}
                      onChange={(e) => setRegistration(e.target.value)}
                      style={{ flex: 1 }}
                    />
                  </div>
                  <Input.Password
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ marginBottom: '20px' }}
                  />
                </div>
                <div style={{ textAlign: "center" }}>
                <Button
                    htmlType="submit"
                    className="gradient-button"
                    style={{ width: '100%' }}
                  >
                    Adicionar
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AddNewAdmin;
