/* eslint-disable no-unused-vars */
import React, { useContext, useState } from "react";
import { Context } from "../main";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const AddNewAdmin = () => {
    const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [sector, setSector] = useState("");
    const [registration, setRegistration] = useState("");

    const navigateTo = useNavigate();

    const handleAddNewAdmin = async (e) => {
        e.preventDefault();
        try {
          await axios
            .post(
              "http://localhost:4000/api/v1/user/administrador/addnew",
              { firstName, lastName, email, phone, password, sector, registration },
              {
                withCredentials: true,
                headers: { "Content-Type": "application/json" },
              }
            )
            .then((res) => {
              toast.success(res.data.message);
              setIsAuthenticated(true);
              navigateTo("/");
              setFirstName("");
              setLastName("");
              setEmail("");
              setPhone("");
              setSector("");
              setRegistration("");
            });
        } catch (error) {
          toast.error(error.response.data.message);
        }
      };    

      if (!isAuthenticated) {
        return <Navigate to={"/login"} />;
      }

      return (
        <section className="page">
          <section className="container form-component add-admin-form">
          <img src="/logo.png" alt="logo" className="logo"/>
            <h1 className="form-title">ADICIONAR NOVO ADMIN</h1>
            <form onSubmit={handleAddNewAdmin}>
              <div>
                <input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="E-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Celular"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Setor"
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Digite sua matrícula"
                  value={registration}
                  onChange={(e) => setRegistration(e.target.value)}
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div style={{ justifyContent: "center", alignItems: "center" }}>
                <button type="submit">ADDICIONAR</button>
              </div>
            </form>
          </section>
        </section>
      );
    };
    
    export default AddNewAdmin;