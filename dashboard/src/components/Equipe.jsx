/* eslint-disable no-unused-vars */
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../main";
import { Navigate, Link } from "react-router-dom";
import { Layout, Card, Row, Col, Typography, Empty, Breadcrumb, Menu, message } from 'antd';
import { DesktopOutlined, FileOutlined, PieChartOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';

const { Content, Sider, Header } = Layout;
const { Title, Text } = Typography;

const Equipe = () => {
    const [tecnicos, setTecnicos] = useState([]);
    const [admins, setAdmins] = useState([]);
    const { isAuthenticated, setIsAuthenticated } = useContext(Context);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data: tecnicoData } = await axios.get(
                    "http://localhost:4000/api/v1/user/tecnico",
                    { withCredentials: true }
                );
                const { data: adminData } = await axios.get(
                    "http://localhost:4000/api/v1/user/adminAll",
                    { withCredentials: true }
                );
                setTecnicos(tecnicoData.tecnicos);
                setAdmins(adminData.admins);
            } catch (error) {
                message.error(error.response?.data?.message || "Erro ao buscar técnicos ou administradores");
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
                <Menu theme="dark" defaultSelectedKeys={['2']} mode="inline" items={menuItems} style={{ backgroundColor: '#1c4529' }}/>
            </Sider>
            <Layout>
                <Header style={{ padding: 0, background: '#fff' }} />
                <Content style={{ margin: '0 16px' }}>
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item><a href="/">Dashboard</a></Breadcrumb.Item>
                        <Breadcrumb.Item>Técnicos e Administradores</Breadcrumb.Item>
                    </Breadcrumb>
                    <div style={{ padding: 24, minHeight: 360, background: '#fff', borderRadius: 8 }}>
                        <Title level={1}>Técnicos e Administradores</Title>
                        <Title level={2}>Técnicos</Title>
                        {tecnicos && tecnicos.length > 0 ? (
                            <Row gutter={16}>
                                {tecnicos.map((tecnico) => (
                                    <Col span={8} key={tecnico._id}>
                                        <Card title={`${tecnico.firstName} ${tecnico.lastName}`} bordered={false}>
                                            <p>
                                                <Text strong>E-mail:</Text> <span>{tecnico.email}</span>
                                            </p>
                                            <p>
                                                <Text strong>Celular:</Text> <span>{tecnico.phone}</span>
                                            </p>
                                            <p>
                                                <Text strong>Setor:</Text> <span>{tecnico.sector.substring(0, 10)}</span>
                                            </p>
                                            <p>
                                                <Text strong>Matrícula:</Text> <span>{tecnico.registration}</span>
                                            </p>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        ) : (
                            <Empty description="Nenhum técnico registrado!" />
                        )}

                        <Title level={2}>Administradores</Title>
                        {admins && admins.length > 0 ? (
                            <Row gutter={16}>
                                {admins.map((admin) => (
                                    <Col span={8} key={admin._id}>
                                        <Card title={`${admin.firstName} ${admin.lastName}`} bordered={false}>
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

export default Equipe;
