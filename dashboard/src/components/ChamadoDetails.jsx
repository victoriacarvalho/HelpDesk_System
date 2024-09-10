/* eslint-disable no-unused-vars */
import React, { useContext, useState, useEffect } from "react";
import axios from 'axios';
import { Context } from "../main";
import { Navigate,useParams, Link } from 'react-router-dom';
import { Card, Spin, Alert, Typography, Layout, Menu, Breadcrumb, message } from 'antd';
import { PieChartOutlined, DesktopOutlined, UserOutlined, TeamOutlined, FileOutlined } from '@ant-design/icons';

const { Content: AntdContent, Sider, Header } = Layout;
const { Title, Text } = Typography;

const ChamadoDetails = () => {
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

  const { id } = useParams();
  const [chamado, setChamado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const fetchChamado = async () => {
      try {
        const { data } = await axios.get(`http://localhost:4000/api/v1/chamado/getDetails/${id}`, { withCredentials: true });
        setChamado(data.chamado);
      } catch (err) {
        setError('Erro ao carregar detalhes do chamado.');
      } finally {
        setLoading(false);
      }
    };
    fetchChamado();
  }, [id]);

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }


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
  if (loading) return <Spin size="large" tip="Carregando..." />;

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
        <AntdContent style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item><a href="/">Dashboard</a></Breadcrumb.Item>
            <Breadcrumb.Item>Detalhes do Chamado</Breadcrumb.Item>
          </Breadcrumb>
          <div style={{ padding: 24, minHeight: 360, background: '#fff', borderRadius: 8 }}>
            {error && <Alert message={error} type="error" showIcon style={{ marginBottom: '20px' }} />}
            {chamado ? (
              <Card
                title={<Title level={4}>Detalhes do Chamado</Title>}
                bordered={false}
                hoverable
                style={{ width: '100%', maxWidth: '800px', margin: '0 auto', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
              >
                <div style={{ marginBottom: '16px' }}>
                  <Text strong>Título:</Text> <Text>{chamado.title}</Text>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <Text strong>Descrição:</Text> <Text>{chamado.description}</Text>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <Text strong>Requerente:</Text> <Text>{`${chamado.firstName} ${chamado.lastName}`}</Text>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <Text strong>Email:</Text> <Text>{chamado.email}</Text>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <Text strong>Telefone:</Text> <Text>{chamado.phone}</Text>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <Text strong>Setor:</Text> <Text>{chamado.sector}</Text>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <Text strong>Status:</Text> <Text>{chamado.status}</Text>
                </div>
                <div>
                  <Text strong>Data do Chamado:</Text> <Text>{new Date(chamado.chamado_date).toLocaleDateString()}</Text>
                </div>
              </Card>
            ) : (
              <Alert message="Chamado não encontrado." type="warning" showIcon />
            )}
          </div>
        </AntdContent>
      </Layout>
    </Layout>
  );
};

export default ChamadoDetails;
