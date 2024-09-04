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
    { label: <Link to="/equipe">Equipe</Link>, key: '2', icon: <DesktopOutlined /> },
    { label: 'Adicionar', key: 'sub1', icon: <UserOutlined />, children: [
      { label: <Link to="/admin/addnew">Administrador</Link>, key: '3' },
      { label: <Link to="/tecnico/addnew">Técnico</Link>, key: '4' },
    ]},
    { label: <Link to="/messages">Mensagens</Link>, key: '5', icon: <TeamOutlined /> },
    { label: <span onClick={handleLogout}>Logout</span>, key: '6', icon: <FileOutlined /> },
  ];
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible style={{ backgroundColor: '#1c4529' }}>
        <div className="demo-logo-vertical" />
        <Menu theme="dark" defaultSelectedKeys={['3']} mode="inline" items={menuItems} style={{ backgroundColor: '#1c4529' }}/>
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
                <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                    ADICIONAR
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
