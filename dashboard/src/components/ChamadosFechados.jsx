/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { Navigate, Link } from "react-router-dom";
import axios from "axios";
import { message, Table, Tag, Layout, Typography, Breadcrumb, Card, Menu } from 'antd';
import { PieChartOutlined, DesktopOutlined, UserOutlined, TeamOutlined, FileOutlined } from '@ant-design/icons';

const { Content, Sider, Header } = Layout;
const { Title, Text } = Typography;

const ClosedChamados = () => {
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

  const columns = [
    {
      title: 'Requerente',
      dataIndex: 'requerente',
      key: 'requerente',
      render: (text, record) => (
        <Link to={`/chamadoDetails/${record._id}`}>
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
      <Sider collapsible style={{ backgroundColor: '#1c4529' }} >
        <div className="logo" />
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" style={{ backgroundColor: '#1c4529' }}>
          <Menu.Item key="1" icon={<PieChartOutlined />}><Link to="/">Dashboard</Link></Menu.Item>
          <Menu.Item key="2" icon={<DesktopOutlined />}><Link to="/equipe">Equipe</Link></Menu.Item>
          <Menu.SubMenu key="sub1" icon={<UserOutlined />} title="Adicionar">
            <Menu.Item key="3"><Link to="/admin/addnew">Administrador</Link></Menu.Item>
            <Menu.Item key="4"><Link to="/tecnico/addnew">Técnico</Link></Menu.Item>
          </Menu.SubMenu>
          <Menu.Item key="5" icon={<TeamOutlined />}><Link to="/messages">Mensagens</Link></Menu.Item>
          <Menu.Item key="6" icon={<FileOutlined />}><a href="#" onClick={handleLogout}>Logout</a></Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: '#fff' }} />
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item><Link to="/">Dashboard</Link></Breadcrumb.Item>
            <Breadcrumb.Item>Chamados Fechados</Breadcrumb.Item>
          </Breadcrumb>
          <div style={{ padding: 24, minHeight: 360, background: '#fff', borderRadius: 8 }}>
            <Card
              className="banner"
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
            />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default ClosedChamados;
