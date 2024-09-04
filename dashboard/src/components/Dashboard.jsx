/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { Navigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Table, Dropdown, Button, Menu, message, Layout, Breadcrumb, Card, Row, Col, Modal } from 'antd';
import { DownOutlined, DesktopOutlined, FileOutlined, PieChartOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { BarChart, Bar } from 'recharts';

const { Header, Content, Footer, Sider } = Layout;

const Dashboard = () => {
  const [chamados, setChamados] = useState([]);
  const [totalChamados, setTotalChamados] = useState(0);
  const [chamadosAbertos, setChamadosAbertos] = useState(0);
  const [chamadosFechados, setChamadosFechados] = useState(0);
  const [collapsed, setCollapsed] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [monthlyMetrics, setMonthlyMetrics] = useState([]);
  const [weeklyMetrics, setWeeklyMetrics] = useState([]);

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

  useEffect(() => {
    const fetchChamados = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/chamado/getall",
          { withCredentials: true }
        );
        setChamados(data.chamados);

        const countResponse = await axios.get(
          "http://localhost:4000/api/v1/chamado/count",
          { withCredentials: true }
        );
        setTotalChamados(countResponse.data.count);

        const abertosCount = data.chamados.filter(
          (chamado) => chamado.status === "Aberto"
        ).length;
        setChamadosAbertos(abertosCount);

        const fechadosCount = data.chamados.filter(
          (chamado) => chamado.status === "Encerrado"
        ).length;
        setChamadosFechados(fechadosCount);

        // Calculate monthly metrics
        const metrics = calculateMonthlyMetrics(data.chamados);
        setMonthlyMetrics(metrics);
        const metricsWeekly = calculateWeeklyMetrics(data.chamados);
        setWeeklyMetrics(metricsWeekly);
      } catch (error) {
        message.error("Erro ao carregar os chamados");
        setChamados([]);
        setTotalChamados(0);
        setChamadosAbertos(0);
      }
    };
    fetchChamados();
  }, []);

  const calculateMonthlyMetrics = (chamados) => {
    const monthlyData = {};
    chamados.forEach(chamado => {
      const date = new Date(chamado.chamado_date); // Use `chamado_date` for accurate date
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`; // Format as MM/YYYY
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = 0;
      }
      monthlyData[monthYear]++;
    });
    return Object.keys(monthlyData).map(monthYear => ({
      monthYear,
      count: monthlyData[monthYear]
    })).sort((a, b) => new Date(a.monthYear) - new Date(b.monthYear)); // Sort by date
  };

  const calculateWeeklyMetrics = (chamados) => {
    const weeklyData = {};
    chamados.forEach(chamado => {
      const date = new Date(chamado.chamado_date);
      const weekYear = `${date.getFullYear()}-W${Math.ceil((date.getDate() - date.getDay() + 1) / 7)}`; // Format as YYYY-WW
      if (!weeklyData[weekYear]) {
        weeklyData[weekYear] = 0;
      }
      weeklyData[weekYear]++;
    });
    return Object.keys(weeklyData).map(weekYear => ({
      weekYear,
      count: weeklyData[weekYear]
    })).sort((a, b) => new Date(a.weekYear) - new Date(b.weekYear)); // Sort by date
  };
  
  
  const handleMenuClick = async (e) => {
    if (e.key === 'Encerrado') {
      setSelectedRecord(e.record);
      setIsModalVisible(true);
    } else {
      const newStatus = e.key;
      try {
        const { data } = await axios.put(
          `http://localhost:4000/api/v1/chamado/update/${e.record._id}`,
          { status: newStatus },
          { withCredentials: true }
        );
        message.success(data.message);
        setChamados((prevChamados) =>
          prevChamados.map((chamado) =>
            chamado._id === e.record._id ? { ...chamado, status: newStatus } : chamado
          )
        );
        const abertosCount = chamados.filter(
          (chamado) => chamado.status === "Aberto"
        ).length;
        setChamadosAbertos(abertosCount);
      } catch (error) {
        message.error(
          error.response?.data?.message || "Erro ao atualizar o status"
        );
      }
    }
  };

  const handleOk = async () => {
    setIsModalVisible(false);
    try {
      const { data } = await axios.put(
        `http://localhost:4000/api/v1/chamado/update/${selectedRecord._id}`,
        { status: 'Encerrado' },
        { withCredentials: true }
      );
      message.success(data.message);
      setChamados((prevChamados) =>
        prevChamados.map((chamado) =>
          chamado._id === selectedRecord._id ? { ...chamado, status: 'Encerrado' } : chamado
        )
      );
      const abertosCount = chamados.filter(
        (chamado) => chamado.status === "Aberto"
      ).length;
      setChamadosAbertos(abertosCount);
    } catch (error) {
      message.error(
        error.response?.data?.message || "Erro ao atualizar o status"
      );
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const DropdownButton = ({ record }) => {
    const menu = (
      <Menu onClick={(e) => handleMenuClick({ ...e, record })}>
        <Menu.Item key="Pendente">Pendente</Menu.Item>
        <Menu.Item key="Aberto">Aberto</Menu.Item>
        <Menu.Item key="Encerrado">Encerrado</Menu.Item>
      </Menu>
    );

    return (
      <Dropdown overlay={menu} trigger={['click']}>
        <Button>
          {record.status} <DownOutlined />
        </Button>
      </Dropdown>
    );
  };

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  const chamadosNaoEncerrados = chamados.filter(
    (chamado) => chamado.status !== "Encerrado"
  );

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
    <Layout style={{ minHeight: '100vh' }} >
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
        <Header style={{ padding: 0, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <img src={"/logo.png"} alt="Logo" style={{ height: '200px', marginLeft: '150px', alignItems: 'center'}} />
        </Header>
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
            <Breadcrumb.Item>Chamados</Breadcrumb.Item>
          </Breadcrumb>
          <div style={{ padding: 24, minHeight: 360, background: '#fff', borderRadius: 8 }}>
            <Row gutter={16}>
            <Col span={8}>
            <Card style={{ height: '140px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '8px', marginBottom: '24px' }}>
              <p><h3>Chamados Fechados</h3></p>
              <h2 style={{ margin: 0 }}>{totalChamados}</h2>
              <Link to="/chamadosFechados">Ver detalhes</Link>
            </Card>
          </Col>
          <Col span={8}>
            <Card style={{ height: '140px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '8px', marginBottom: '24px' }}>
              <p><h3>Total de Chamados</h3></p>
              <h2 style={{ margin: 0 }}>{totalChamados}</h2>
            </Card>
          </Col>
          <Col span={8}>
            <Card style={{ height: '140px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '8px', marginBottom: '24px' }}>
              <p><h3>Chamados Abertos</h3></p>
              <h3>{chamadosAbertos}</h3>
            </Card>
          </Col>
            </Row>
            <div style={{ marginTop: 24 }}>
              <h3>Chamados</h3>
              <Table
              style={{ 
                marginBottom: 24, 
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', 
                borderRadius: '8px',
                border: '1px solid #e8e8e8',  // Adiciona borda ao redor da tabela
                overflow: 'hidden'  // Para garantir que o border-radius seja aplicado corretamente
              }}
              columns={[
                {
                  title: 'Requerente',
                  dataIndex: 'requerente',
                  key: 'requerente',
                  render: (_, { firstName, lastName, _id }) => (
                    <Link to={`/chamadoDetails/${_id}`}>
                      {`${firstName} ${lastName}`}
                    </Link>
                  ),
                },
                {
                  title: 'Data',
                  dataIndex: 'chamado_date',
                  key: 'chamado_date',
                },
                {
                  title: 'Status',
                  dataIndex: 'status',
                  key: 'status',
                  render: (status, record) => <DropdownButton record={record} />,
                },
              ]}
              dataSource={chamadosNaoEncerrados}
              rowKey="_id"
              pagination={false}  // Remove a paginação se não for necessária
              bordered
              size="middle"  // Ajusta o tamanho das células
              rowClassName="custom-table-row"  // Adiciona uma classe personalizada para as linhas
            />
            </div>
            <div style={{ marginTop: 24 }}>
          <h3>Métricas</h3>
          <Row gutter={16}>
            <Col span={12}>
            <Card title="Métricas Mensais" bordered={false} >
            <LineChart width={600} height={300} data={monthlyMetrics}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="monthYear" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: '#fff', borderColor: '#ddd' }} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#007bff" 
                strokeWidth={3} 
                dot={{ stroke: '#007bff', strokeWidth: 2, r: 4 }}
                activeDot={{ stroke: '#0056b3', strokeWidth: 2, r: 6 }}
              >
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#007bff" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#007bff" stopOpacity={0} />
                  </linearGradient>
                </defs>
              </Line>
            </LineChart>
          </Card>
            </Col>
            <Col span={12}>
            <Card title="Métricas Semanais" bordered={false}>
            <BarChart width={600} height={300} data={weeklyMetrics}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="weekYear" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: '#fff', borderColor: '#ddd' }} />
              <Legend />
              <Bar 
                dataKey="count" 
                fill="url(#colorCountBar)" 
                barSize={30}
              />
              <defs>
                <linearGradient id="colorCountBar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                </linearGradient>
              </defs>
            </BarChart>
          </Card>
            </Col>
          </Row>
        </div>
          </div>
        </Content>
      </Layout>
      <Modal
        title="Confirmar Encerramento"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Tem certeza de que deseja marcar este chamado como encerrado?</p>
      </Modal>
    </Layout>
  );
};

export default Dashboard;
