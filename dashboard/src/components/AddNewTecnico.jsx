/* eslint-disable no-unused-vars */
import React, { useContext, useState } from "react";
import { Navigate, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Context } from "../main";
import axios from "axios";
import { Form, Input, Button, Typography, Card, Layout, Breadcrumb, Space, message, Menu} from "antd";
import { PieChartOutlined, DesktopOutlined, UserOutlined, TeamOutlined, FileOutlined } from '@ant-design/icons';

const { Content, Sider, Header } = Layout;
const { Title } = Typography;

const AddNewTecnico = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  const navigateTo = useNavigate();

  const [collapsed, setCollapsed] = useState(false);
  const [form] = Form.useForm();

  const handleAddNewTecnico = async (values) => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/user/tecnico/addnewtecnico",
        values,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      message.success(response.data.message);
      setIsAuthenticated(true);
      navigateTo("/");
      form.resetFields();
    } catch (error) {
      toast.error(error.response?.data?.message || "Erro ao adicionar técnico");
    }
  };

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

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

  const menuItems = [
    { label: <Link to="/">Dashboard</Link>, key: '1', icon: <PieChartOutlined /> },
    { label: 'Consultar', key: 'sub1', icon: <UserOutlined />, children: [
      { label: <Link to="/tecnico">Técnico</Link>, key: '2' },
      { label: <Link to="/admins">Administradores</Link>, key: '3' },
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
          defaultSelectedKeys={['5']}
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
            <Breadcrumb.Item>Adicionar Técnico</Breadcrumb.Item>
          </Breadcrumb>
          <div style={{ padding: 24, minHeight: 360, background: '#fff', borderRadius: 8 }}>
            <Card
              className="add-tecnico-card"
              bordered={false}
              title={<Title level={4}>Registrar Novo Técnico</Title>}
              style={{ maxWidth: 800, margin: '0 auto', padding: '24px' }}
            >
              <Form
                form={form}
                layout="vertical"
                onFinish={handleAddNewTecnico}
                initialValues={{
                  firstName: '',
                  lastName: '',
                  email: '',
                  phone: '',
                  sector: '',
                  registration: '',
                  password: ''
                }}
              >
                <Form.Item
                  label="Primeiro Nome"
                  name="firstName"
                  rules={[{ required: true, message: 'Por favor, insira o primeiro nome!' }]}
                >
                  <Input placeholder="Primeiro nome" />
                </Form.Item>
                <Form.Item
                  label="Segundo Nome"
                  name="lastName"
                  rules={[{ required: true, message: 'Por favor, insira o segundo nome!' }]}
                >
                  <Input placeholder="Segundo nome" />
                </Form.Item>
                <Form.Item
                  label="E-mail"
                  name="email"
                  rules={[{ required: true, message: 'Por favor, insira o e-mail!' }, { type: 'email', message: 'O e-mail deve ser válido!' }]}
                >
                  <Input placeholder="E-mail" />
                </Form.Item>
                <Form.Item
                  label="Celular"
                  name="phone"
                  rules={[{ required: true, message: 'Por favor, insira o celular!' }]}
                >
                  <Input type="tel" placeholder="Celular" />
                </Form.Item>
                <Form.Item
                  label="Setor"
                  name="sector"
                  rules={[{ required: true, message: 'Por favor, insira o setor!' }]}
                >
                  <Input placeholder="Setor" />
                </Form.Item>
                <Form.Item
                  label="Matrícula"
                  name="registration"
                  rules={[{ required: true, message: 'Por favor, insira a matrícula!' }]}
                >
                  <Input type="number" placeholder="Matrícula" />
                </Form.Item>
                <Form.Item
                  label="Senha"
                  name="password"
                  rules={[{ required: true, message: 'Por favor, insira a senha!' }]}
                >
                  <Input.Password placeholder="Senha" />
                </Form.Item>
                <Form.Item>
                  <Space direction="vertical" style={{ width: '100%' }}>
                  <Button
                    htmlType="submit"
                    className="gradient-button"
                    style={{ width: '100%' }}
                  >
                    Registrar
                  </Button>
                  </Space>
                </Form.Item>
              </Form>
            </Card>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AddNewTecnico;
