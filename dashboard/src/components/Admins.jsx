/* eslint-disable no-unused-vars */
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { Navigate, Link } from "react-router-dom";
import { Layout, Card, Row, Col, Typography, Empty, Breadcrumb, Menu, message } from 'antd';
import { DesktopOutlined, FileOutlined, PieChartOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';

const { Content, Sider, Header } = Layout;
const { Title, Text } = Typography;

const Admins = () => {
    const [admins, setAdmins] = useState([]);
    const { isAuthenticated, setIsAuthenticated } = useContext(Context);
    const [collapsed, setCollapsed] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data } = await axios.get(
                    "http://localhost:4000/api/v1/user/adminAll",
                    { withCredentials: true }
                );
                // Filtra apenas os administradores da lista de técnicos
                const administradores = data.tecnicos.filter(tecnico => tecnico.role === "Administrador");
                setAdmins(administradores);
            } catch (error) {
                message.error(error.response?.data?.message || "Erro ao buscar administradores");
            }
        };
        fetchUsers();
    }, []);

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
                <Header style={{ padding: 0, background: '#fff' }} />
                <Content style={{ margin: '0 16px' }}>
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item><a href="/">Dashboard</a></Breadcrumb.Item>
                        <Breadcrumb.Item>Administradores</Breadcrumb.Item>
                    </Breadcrumb>
                    <div style={{ padding: 24, minHeight: 360, background: '#fff', borderRadius: 8 }}>
                        <Title level={1}>Administradores</Title>
                        {admins && admins.length > 0 ? (
                            <Row gutter={[32, 32]} justify="start"> {/* Adicionado mais espaçamento */}
                                {admins.map((admin) => (
                                    <Col span={8} key={admin._id}>
                                        <Card
                                            title={`${admin.firstName} ${admin.lastName}`}
                                            bordered={false}
                                            style={{ marginBottom: 24 , boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}>
                                            <p>
                                                <Text strong>E-mail:</Text> <span>{admin.email}</span>
                                            </p>
                                            <p>
                                                <Text strong>Celular:</Text> <span>{admin.phone}</span>
                                            </p>
                                            <p>
                                                <Text strong>Setor:</Text> <span>{admin.sector.substring(0, 10)}</span>
                                            </p>
                                            <p>
                                                <Text strong>Matrícula:</Text> <span>{admin.registration}</span>
                                            </p>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        ) : (
                            <Empty description="Nenhum administrador registrado!" />
                        )}
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default Admins;
