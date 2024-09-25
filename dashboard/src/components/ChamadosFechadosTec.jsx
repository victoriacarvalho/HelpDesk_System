/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { Navigate, Link } from "react-router-dom";
import axios from "axios";
import { message, Table, Tag, Layout, Typography, Breadcrumb, Card, Menu } from 'antd';
import { PieChartOutlined, UserOutlined, TeamOutlined, FileOutlined } from '@ant-design/icons';

const { Content, Sider, Header } = Layout;
const { Title, Text } = Typography;

const ChamadosFechadosTec = () => {
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

  const [chamados, setChamados] = useState([]);

  useEffect(() => {
    const fetchClosedChamados = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/chamado/getall",
          { withCredentials: true }
        );

        // Filtrar apenas os chamados com status "Encerrado"
        const closedChamados = data.chamados.filter(
          (chamado) => chamado.status === "Encerrado"
        );

        setChamados(closedChamados);
      } catch (error) {
        message.error("Erro ao carregar os chamados fechados");
        setChamados([]);
      }
    };
    fetchClosedChamados();
  }, []);

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  const menuItems = [
    { label: <Link to="/dashboardTecnico">Dashboard</Link>, key: '1', icon: <PieChartOutlined /> },
    { label: 'Consultar', key: 'sub1', icon: <UserOutlined />, children: [
      { label: <Link to="/tecnicoTec">Técnico</Link>, key: '2'},
      { label: <Link to="/adminsTec">Administradores</Link>, key: '3' },
      { label: <Link to="/userPTec">Usuários</Link>, key: '8' },
    ]},
    { label: <Link to="/messagesTec">Mensagens</Link>, key: '6', icon: <TeamOutlined /> },
    { label: <span onClick={handleLogout}>Logout</span>, key: '7', icon: <FileOutlined /> },
  ];

  const columns = [
    {
      title: 'Requerente',
      dataIndex: 'requerente',
      key: 'requerente',
      render: (text, record) => (
        <Link to={`/chamadoDetailsTec/${record._id}`}>
          {`${record.firstName} ${record.lastName}`}
        </Link>
      ),
    },
    {
      title: 'Data',
      dataIndex: 'chamado_date',
      key: 'chamado_date',
    },
    {
      title: 'Técnico',
      dataIndex: 'tecnico',
      key: 'tecnico',
      render: (text, record) => (
        record.tecnico
          ? `${record.tecnico.firstName} ${record.tecnico.lastName}`
          : "Sem Técnico"
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: status => (
        <Tag color={status === "Encerrado" ? "red" : "default"}>
          {status}
        </Tag>
      ),
    },
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
          mode="inline"
          items={menuItems}
          style={{
            background: 'transparent',
            borderRight: 'none',
          }}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: '#fff', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
          <div style={{ padding: '0 24px', display: 'flex', alignItems: 'center' }}>
            <img src="/logo.png" alt="Logo" style={{ height: 120 }} />
          </div>
        </Header>
        <Content style={{ margin: '0 16px', background: '#f0f2f5' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item><Link to="/dashboardTecnico">Dashboard</Link></Breadcrumb.Item>
            <Breadcrumb.Item>Chamados Fechados</Breadcrumb.Item>
          </Breadcrumb>
          <div style={{ padding: 24, minHeight: 360, background: '#fff', borderRadius: 8, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
            <Card
              bordered={false}
              style={{ marginBottom: 24, textAlign: 'center', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
            >
              <Title level={4}>Chamados Fechados</Title>
              <Text>Total de Chamados Fechados: {chamados.length}</Text>
            </Card>
            <Table
              columns={columns}
              dataSource={chamados}
              rowKey="_id"
              pagination={{ pageSize: 5 }}
              style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}
              bordered
            />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default ChamadosFechadosTec;
