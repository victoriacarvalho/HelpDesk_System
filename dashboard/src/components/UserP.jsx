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

const UserP = () => {
    const [usuarios, setUsuarios] = useState([]);
    const { isAuthenticated, setIsAuthenticated } = useContext(Context);
    const [collapsed, setCollapsed] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data: userData } = await axios.get(
                    "http://localhost:4000/api/v1/user/userPAll",
                    { withCredentials: true }
                );
                setUsuarios(userData.users);
            } catch (error) {
                message.error(error.response?.data?.message || "Erro ao buscar usuários");
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
        return <Navigate to={"/loginTecnico"} />;
    }

    const menuItems = [
        { label: <Link to="/dashboardTecnico">Dashboard</Link>, key: '1', icon: <PieChartOutlined /> },
        { label: 'Consultar', key: 'sub1', icon: <UserOutlined />, children: [
            { label: <Link to="/tecnicoTec">Técnico</Link>, key: '2'},
          { label: <Link to="/adminsTec">Administradores</Link>, key: '3' },
          { label: <Link to="/userP">Usuários</Link>, key: '8' },
        ]},
        { label: <Link to="/messagesTec">Mensagens</Link>, key: '6', icon: <TeamOutlined /> },
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
          defaultSelectedKeys={['8']}
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
                        <Breadcrumb.Item>Usuários</Breadcrumb.Item>
                    </Breadcrumb>
                    <div style={{ padding: 24, minHeight: 360, background: '#fff', borderRadius: 8 }}>
                        <Title level={1}>Usuários </Title>
                        {usuarios && usuarios.length > 0 ? (
                            <Row gutter={16}>
                                {usuarios.map((usuario) => (
                                    <Col span={8} key={usuario._id}>
                                        <Card title={`${usuario.firstName} ${usuario.lastName}`} bordered={false}
                                        style={{ marginBottom: 24 , boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}>
                                            <p>
                                                <Text strong>E-mail:</Text> <span>{usuario.email}</span>
                                            </p>
                                            <p>
                                                <Text strong>Celular:</Text> <span>{usuario.phone}</span>
                                            </p>
                                            <p>
                                                <Text strong>Setor:</Text> <span>{usuario.sector.substring(0, 10)}</span>
                                            </p>
                                            <p>
                                                <Text strong>Matrícula:</Text> <span>{usuario.registration}</span>
                                            </p>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        ) : (
                            <Empty description="Nenhum usuário registrado!" />
                        )}
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default UserP;
