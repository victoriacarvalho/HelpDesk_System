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
  
  
  // Adicione o estado para armazenar as métricas semanais

  
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
    { label: <Link to="/equipe">Equipe</Link>, key: '2', icon: <DesktopOutlined /> },
    { label: 'Adicionar', key: 'sub1', icon: <UserOutlined />, children: [
      { label: <Link to="/admin/addnew">Administrador</Link>, key: '3' },
      { label: <Link to="/tecnico/addnew">Técnico</Link>, key: '4' },
    ]},
    { label: <Link to="/messages">Mensagens</Link>, key: '5', icon: <TeamOutlined /> },
    { label: <span onClick={handleLogout}>Logout</span>, key: '6', icon: <FileOutlined /> },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }} >
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} style={{ backgroundColor: '#1c4529' }} >
        <div className="demo-logo-vertical" />
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={menuItems} style={{ backgroundColor: '#1c4529' }}/>
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
                <Card style={{ height: '150px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <p>Chamados Fechados</p>
                  <h3>{chamadosFechados}</h3>
                  <Link to="/chamadosFechados">Ver detalhes</Link>
                </Card>
              </Col>
              <Col span={8}>
                <Card style={{ height: '150px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <p>Total de Chamados</p>
                  <h3>{totalChamados}</h3>
                </Card>
              </Col>
              <Col span={8}>
                <Card style={{ height: '150px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <p>Chamados Abertos</p>
                  <h3>{chamadosAbertos}</h3>
                </Card>
              </Col>
            </Row>
            <div style={{ marginTop: 24 }}>
              <h5>Chamados</h5>
              <Table
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
                    title: 'Técnico',
                    dataIndex: 'tecnico',
                    key: 'tecnico',
                    render: (_, { tecnico }) => (
                      tecnico
                        ? `${tecnico.firstName} ${tecnico.lastName}`
                        : "Sem Técnico"
                    ),
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
              />
            </div>
            <div style={{ marginTop: 24 }}>
          <h5>Métricas</h5>
          <Row gutter={16}>
            <Col span={12}>
              <Card title="Métricas Mensais" bordered={false}>
                <LineChart width={600} height={300} data={monthlyMetrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="monthYear" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="count" stroke="#8884d8" />
                </LineChart>
              </Card>
            </Col>
            <Col span={12}>
              <Card title="Métricas Semanais" bordered={false}>
                <BarChart width={600} height={300} data={weeklyMetrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="weekYear" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#82ca9d" />
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
