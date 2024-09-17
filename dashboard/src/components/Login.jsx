/* eslint-disable no-unused-vars */
import React, { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Context } from "../main";
import axios from "axios";
import { TextField, Button, Card, Typography, Switch } from "@mui/material";
import Box from "@mui/material/Box";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registration, setRegistration] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  const navigateTo = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await axios
        .post(
          "http://localhost:4000/api/v1/user/login",
          { email, password, registration },
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        )
        .then((res) => {
          toast.success(res.data.message);
          setIsAuthenticated(true);
          navigateTo("/");
          setEmail("");
          setPassword("");
          setRegistration("");
        });
    } catch (error) {
      toast.error(error.response.data.message);
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
          Somente administradores têm permissão para acessar esses recursos!
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
        </form>
      </Card>
    </Box>
  );
};

export default Login;
