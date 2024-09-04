/* eslint-disable no-unused-vars */
import React, { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Context } from "../main";
import axios from "axios";
import { Input, Button, message, Card } from "antd";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registration, setRegistration] = useState("");

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
          message.success(res.data.message);
          setIsAuthenticated(true);
          navigateTo("/");
          setEmail("");
          setPassword("");
          setRegistration("");
        });
    } catch (error) {
      message.error(error.response.data.message);
    }
  };

  if (isAuthenticated) {
    return <Navigate to={"/"} />;
  }

  return (
    <div
      className="login-container"
      style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}
    >
      <Card
        title="BEM VINDO AO TICKET+"
        style={{ width: 400, padding: '20px' }} // Aumentando a largura e o preenchimento do card
      >
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <img src="/logo.png" alt="logo" style={{ width: "120px", height: "auto" }} />
        </div>
        <p style={{ textAlign: "center" }}>
          Somente administradores têm permissão para acessar esses recursos!
        </p>
        <form onSubmit={handleLogin}>
          <Input
            type="text"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ marginBottom: "1rem" }}
          />
          <Input.Password
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ marginBottom: "1rem" }}
          />
          <Input
            type="text"
            placeholder="Matrícula"
            value={registration}
            onChange={(e) => setRegistration(e.target.value)}
            style={{ marginBottom: "1rem" }}
          />
          <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
            Login
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Login;
