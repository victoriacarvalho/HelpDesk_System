import axios from "axios";
import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../main";
import { Link, useNavigate, Navigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registration, setRegistration] = useState("");
  
  const navigateTo = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
          await axios
            .post(
              "http://localhost:4000/api/v1/user/login",
              { email, password, registration, role: "Padrao" },
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
      const errorMessage = error.response?.data?.message || "Erro desconhecido";
      toast.error(errorMessage);
    }
  };

  if (isAuthenticated) {
    return <Navigate to={"/"} />;
  }

  return (
    <>
    <div className="container form-component login-form">
      <h2>Login</h2>
      <p>
        Se você é um administrador ou apenas quer abrir um chamado, faça login no sistema para continuar
      </p>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Digite sua matrícula"
          value={registration}
          onChange={(e) => setRegistration(e.target.value)}
          required
        />
        <div
          style={{
            display: 'flex',
            gap: "10px",
            justifyContent: "flex-end",
            flexDirection: "row",
          }}
        >
          <p style={{ marginBottom: 0 }}>Não é registrado?</p>
          <Link
            to="/register"
            style={{ textDecoration: "none", color: "#271776ca" }}
          >
            Registre-se agora
          </Link>
        </div>
        <div style={{ justifyContent: "center", alignItems: "center" }}>
          <button type="submit" style={{ backgroundColor: "#FF025D", color: "#fff" }}>
            Login
          </button>
        </div>
      </form>
    </div>
    </>
  );
};

export default Login;
