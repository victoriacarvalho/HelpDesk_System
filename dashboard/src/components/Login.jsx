/* eslint-disable no-unused-vars */
import React, { useContext, useState } from "react";
import { Navigate, useNavigate, Link } from "react-router-dom";
import { Context } from "../main";
import axios from "axios";
import {message} from "antd";
import { TextField, Button, Card, Typography, Switch } from "@mui/material";
import Box from "@mui/material/Box";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registration, setRegistration] = useState("");

  const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  const navigateTo = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:4000/api/v1/user/login",
        { email, password, registration },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
  
      // Log para verificar a resposta completa da API
      console.log('API Response:', res.data);
  
      // Verifique o papel do usuário no objeto `user`
      const { role } = res.data.user;
      const apiMessage = res.data.message;
  
      // Log para verificar o papel do usuário
      console.log('User Role:', role);
  
      if (role === 'Administrador') {
        message.success(apiMessage);
        setIsAuthenticated(true);
        navigateTo("/"); // Atualize para o caminho correto do dashboard do administrador
      } else if (role === 'Técnico') {
        message.success(apiMessage);
        setIsAuthenticated(true);
        navigateTo("/tecnicoDashboard"); // Atualize para o caminho correto do dashboard do técnico
      } else {
        message.error("Acesso restrito. Você deve usar a página de login apropriada.");
        navigateTo("/loginTecnico"); // Atualize se necessário
      }
  
      setEmail("");
      setPassword("");
      setRegistration("");
    } catch (error) {
      console.error('Login Error:', error); // Adicione este log para detalhes do erro
      message.error(error.response ? error.response.data.message : "Erro desconhecido");
    }
  };
  
    if (isAuthenticated) {
    return <Navigate to={"/"} />;
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "linear-gradient(180deg, #004d40 0%, #a5d6a7 100%)", // Dark green to light green
        padding: "20px",
      }}
    >
      <Card sx={{ width: 400, padding: 3, borderRadius: 2, boxShadow: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 2,
          }}
        >
          <img src="/logo.png" alt="logo" style={{ width: "180px", height: "auto" }} />
        </Box>
        <Typography variant="h5" fontWeight="medium" textAlign="center" mb={2}>
          BEM VINDO AO TICKET+
        </Typography>
        <Typography variant="body2" textAlign="center" color="text.secondary" mb={3}>
          Login Administrador
        </Typography>
        <form onSubmit={handleLogin}>
          <TextField
            fullWidth
            label="E-mail"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Senha"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Matrícula"
            variant="outlined"
            value={registration}
            onChange={(e) => setRegistration(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              mb: 3,
              background: "linear-gradient(180deg, #004d40 0%, #00796b 100%)",
              color: "#fff",
            }}
          >
            Login
          </Button>
          <Typography variant="body2" textAlign="center" color="text.secondary" mb={3}>
            Apenas administradores têm permissão para acessar estes recursos. Se você é um técnico, por favor, faça login na <Link to="/loginTecnico">página de login de técnicos</Link>.
          </Typography>
        </form>
      </Card>
    </Box>
  );
};

export default Login;
