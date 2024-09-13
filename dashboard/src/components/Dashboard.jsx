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
import TecnicoDropdown from './TecnicoDropdown';
import moment from 'moment';

const { Header, Content, Footer, Sider } = Layout;

const Dashboard = () => {
  const [chamados, setChamados] = useState([]);
  const [tecnicos, setTecnicos] = useState([]);
  const [totalChamados, setTotalChamados] = useState(0);
  const [chamadosAbertos, setChamadosAbertos] = useState(0);
  const [chamadosFechados, setChamadosFechados] = useState(0);
  const [collapsed, setCollapsed] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [monthlyMetrics, setMonthlyMetrics] = useState([]);
  const [weeklyMetrics, setWeeklyMetrics] = useState([]);
  const [isAssignModalVisible, setIsAssignModalVisible] = useState(false);
  const [selectedChamado, setSelectedChamado] = useState(null);
  const [selectedTecnico, setSelectedTecnico] = useState(null);


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

  
const showAssignModal = (chamado) => {
  setSelectedChamado(chamado);
  setIsAssignModalVisible(true);
};

const handleAssignOk = async () => {
  if (!selectedChamado) return;

  try {
    await axios.put(
      `http://localhost:4000/api/v1/chamado/update/${selectedChamado._id}`,
      { tecnico: selectedChamado.tecnico },
      { withCredentials: true }
    );
    message.success("Técnico atribuído com sucesso!");
    setChamados((prevChamados) =>
      prevChamados.map((chamado) =>
        chamado._id === selectedChamado._id
          ? { ...chamado, tecnico: selectedChamado.tecnico }
          : chamado
      )
    );
    setSelectedTecnico(null); // Limpar seleção após atribuição
    setIsAssignModalVisible(false);
  } catch (error) {
    message.error(
      error.response?.data?.message || "Erro ao atribuir o técnico"
    );
  }
};


const handleAssignCancel = () => {
  setIsAssignModalVisible(false);
};

  useEffect(() => {

    const fetchTecnicos = async () => {
      try {
        const { data: tecnicoData } = await axios.get(
          'http://localhost:4000/api/v1/user/tecnico',
          { withCredentials: true } 
        );
        console.log('Dados dos técnicos:', tecnicoData.tecnicos); 
        setTecnicos(tecnicoData.tecnicos);
      } catch (error) {
          console.error('Erro ao buscar técnicos:', error);
      }
    };
  
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
    fetchTecnicos();
  }, []);

  const calculateMonthlyMetrics = (chamados) => {
    const monthlyData = {};
    chamados.forEach(chamado => {
      const date = new Date(chamado.chamado_date);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = 0;
      }
      monthlyData[monthYear]++;
    });
    return Object.keys(monthlyData).map(monthYear => ({
      monthYear,
      count: monthlyData[monthYear]
    })).sort((a, b) => new Date(a.monthYear) - new Date(b.monthYear));
  };

  const calculateWeeklyMetrics = (chamados) => {
    const weeklyData = {};
    chamados.forEach(chamado => {
      const date = new Date(chamado.chamado_date);
      const weekYear = `${date.getFullYear()}-W${Math.ceil((date.getDate() - date.getDay() + 1) / 7)}`;
      if (!weeklyData[weekYear]) {
        weeklyData[weekYear] = 0;
      }
      weeklyData[weekYear]++;
    });
    return Object.keys(weeklyData).map(weekYear => ({
      weekYear,
      count: weeklyData[weekYear]
    })).sort((a, b) => new Date(a.weekYear) - new Date(b.weekYear));
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
        <Button style={{ borderRadius: '4px', borderColor: '#00796b' }}>
          {record.status} <DownOutlined />
        </Button>
      </Dropdown>
    );
  };
  
  const handleTecnicoChange = (chamadoId, tecnicoId) => {
    const chamado = chamados.find(c => c._id === chamadoId);
    if (!chamado) return;
  
    const tecnico = tecnicos.find(t => t._id === tecnicoId); // Encontrar o técnico selecionado
    setSelectedTecnico(tecnico); // Atualizar o estado do técnico selecionado
    setSelectedChamado({ ...chamado, tecnico: tecnicoId });
    showAssignModal(chamado);
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
    { label: 'Adicionar', key: 'sub2', icon: <UserOutlined />, children: [
            { label: <Link to="/admin/addnew">Administrador</Link>, key: '4' },
      { label: <Link to="/tecnico/addnew">Técnico</Link>, key: '5' },
    ]},
    { label: <Link to="/messages">Mensagens</Link>, key: '6', icon: <TeamOutlined /> },
    { label: <span onClick={handleLogout}>Logout</span>, key: '7', icon: <FileOutlined /> },
  ];

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
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
          defaultSelectedKeys={['1']}
          mode="inline"
          items={menuItems}
          style={{
            background: "transparent",
            borderRight: 'none',
          }}
        />
      </Sider>
      <Layout>
        <Header style={{ background: '#ffffff', padding: 0, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
          <div style={{ padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
              <Breadcrumb.Item>Chamados</Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </Header>
        <Content style={{ margin: '0 16px' }}>
          <div style={{ padding: 24, minHeight: 360, background: '#ffffff', borderRadius: 8, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
            <Row gutter={16}>
              <Col span={8}>
                <Card
                  style={{
                    height: '180px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    borderRadius: '12px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    overflow: 'hidden',
                    background: '#00796b',
                    color: '#ffffff',
                    textAlign: 'center'
                  }}
                >
                  <h3 style={{ margin: '0 0 8px 0' }}>Chamados Fechados</h3>
                  <h2 style={{ margin: '0 0 16px 0' }}>{totalChamados}</h2>
                  <Link to="/chamadosFechados" style={{ color: '#ffffff', fontWeight: 'bold', textDecoration: 'underline' }}>Ver detalhes</Link>
                </Card>
              </Col>
              <Col span={8}>
                <Card
                  style={{
                    height: '180px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    borderRadius: '12px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    overflow: 'hidden',
                    background: '#00796b',
                    color: '#ffffff',
                    textAlign: 'center'
                  }}
                >
                  <h3 style={{ margin: '0 0 8px 0' }}>Total de Chamados</h3>
                  <h2 style={{ margin: '0' }}>{totalChamados}</h2>
                </Card>
              </Col>
              <Col span={8}>
                <Card
                  style={{
                    height: '180px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    borderRadius: '12px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    overflow: 'hidden',
                    background: '#00796b',
                    color: '#ffffff',
                    textAlign: 'center'
                  }}
                >
                  <h3 style={{ margin: '0 0 8px 0' }}>Chamados Abertos</h3>
                  <h2 style={{ margin: '0' }}>{chamadosAbertos}</h2>
                </Card>
              </Col>
            </Row>
  
            <div style={{ marginTop: 24 }}>
              <h3>Chamados</h3>
              <Table
                style={{
                  marginBottom: 24,
                  borderRadius: '8px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  background: '#ffffff',
                }}
                columns={[
                  {
                    title: 'Título',
                    dataIndex: 'title',
                    key: 'title',
                    render: (_, {title,_id }) => (
                      <Link to={`/chamadoDetails/${_id}`}>
                        {`${title}`}
                      </Link>
                    ),
                  },
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
                    render: (text) => moment(text).format('DD/MM/YYYY'),
                  },
                  {
                    title: "Técnico",
                    dataIndex: "tecnico",
                    key: "tecnico",
                    render: (text, record) => (
                      <TecnicoDropdown
                        tecnicos={tecnicos}
                        selectedTecnicoId={record.tecnico} // Passa o ID do técnico
                        onChange={(value) => handleTecnicoChange(record._id, value)}
                      />
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
                pagination={{ pageSize: 5 }}
                bordered
                size="middle"
                rowClassName="custom-table-row"
              />
            </div>
            <div style={{ marginTop: 24 }}>
            <h3>Métricas</h3>
              <Row gutter={16}>
                <Col span={12}>
                  <Card title="Métricas Mensais" bordered={false} style={{ borderRadius: '12px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
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
                      />
                    </LineChart>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card title="Métricas Semanais" bordered={false} style={{ borderRadius: '12px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                    <BarChart width={600} height={300} data={weeklyMetrics}>
                      <defs>
                        <linearGradient id="colorCountBar" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                        </linearGradient>
                      </defs>
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
                    </BarChart>
                  </Card>
                </Col>
              </Row>
            </div>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center', background: '#ffffff', padding: '16px 0', boxShadow: '0 -4px 8px rgba(0, 0, 0, 0.1)' }}>
          TICKET + ©2024
        </Footer>
      </Layout>
      <Modal
        title="Confirmar Encerramento"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Você tem certeza que deseja encerrar este chamado?</p>
      </Modal>
      <Modal
        title="Confirmar Atribuição de Técnico"
        visible={isAssignModalVisible}
        onOk={handleAssignOk}
        onCancel={handleAssignCancel}
      >
        <p>Você tem certeza que deseja atribuir o técnico {selectedTecnico ? selectedTecnico.nome : ''} ao chamado?</p>
      </Modal>

    </Layout>
  );
  
};
export default Dashboard;


