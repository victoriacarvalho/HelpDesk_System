/* eslint-disable no-unused-vars */
import React, { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Context } from "../main";
import axios from "axios";

const AddNewtecnico = () => {
    const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [sector, setSector] = useState("");
    const [registration, setRegistration] = useState("");
    const [tecAvatar, setTecAvatar] = useState("");
    const [tecAvatarPreview, setTecAvatarPreview] = useState("");
  
    const navigateTo = useNavigate();

    const handleAvatar = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        setTecAvatarPreview(reader.result);
        setTecAvatar(file);
    };
  };

  const handleAddNewTecnico = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("password", password);
      formData.append("sector", sector);
      formData.append("registration", registration);
      formData.append("tecAvatar", tecAvatar);
      await axios
        .post("http://localhost:4000/api/v1/user/tecnico/addnew", formData, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((res) => {
          toast.success(res.data.message);
          setIsAuthenticated(true);
          navigateTo("/");
          setFirstName("");
          setLastName("");
          setEmail("");
          setPhone("");
          setRegistration("");
          setSector("");
          setPassword("");
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
      <section className="container add-doctor-form">
        <img src="/logo.png" alt="logo" className="logo"/>
        <h1 className="form-title">REGISTRE UM </h1>
        <form onSubmit={handleAddNewTecnico}>
          <div className="first-wrapper">
            <div>
              <img
                src={
                  tecAvatarPreview ? `${tecAvatarPreview}` : "/docHolder.jpg"
                }
                alt="Técnico Avatar"
              />
              <input type="file" onChange={handleAvatar} />
            </div>
            <div>
              <input
                type="text"
                placeholder="Primeiro nome"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Segundo nome"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              <input
                type="text"
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
              <input
                type="text"
                placeholder="Setor"
                value={sector}
                onChange={(e) => setSector(e.target.value)}
              />
             <input
                type="number"
                placeholder="Matrícula"
                value={password}
                onChange={(e) => setRegistration(e.target.value)}
            />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              
              <button type="submit">Registrar novo técnico</button>
            </div>
          </div>
        </form>
      </section>
    </section>
  );
};

export default AddNewtecnico;

