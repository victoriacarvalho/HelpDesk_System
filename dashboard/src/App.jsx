/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useContext, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import DashboardTecnico from "./components/DashboardTecnico";
import Login from "./components/Login";
import LoginTecnico from "./components/LoginTecnico";
import AddNewTecnico from "./components/AddNewTecnico";
import Messages from "./components/Messages";
import Tecnico from "./components/Tecnico";
import Admins from "./components/Admins";
import { Context } from "./main";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddNewAdmin from "./components/AddNewAdmin";
import "./App.css";
import ChamadoDetails from "./components/ChamadoDetails";
import ChamadosFechados from "./components/ChamadosFechados";
import MessagesTec from "./components/MessagesTec";
import ChamadoDetailsTec from "./components/ChamadoDetailsTec";
import ChamadosFechadosTec from "./components/ChamadosFechadosTec";
import AdminsTec from "./components/AdminsTec";
import TecnicoTec from "./components/TecnicoTec";
import UserP from "./components/UserP";

const App = () => {
  const { isAuthenticated, setIsAuthenticated, admin, setAdmin } =
    useContext(Context);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/v1/user/admin/me",
          {
            withCredentials: true,
          }
        );
        setIsAuthenticated(true);
        setAdmin(response.data.user);
      } catch (error) {
        setIsAuthenticated(false);
        setAdmin({});
      }
    };
    fetchUser();
  }, [isAuthenticated]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboardTecnico" element={<DashboardTecnico />} />
        <Route path="/login" element={<Login />} />
        <Route path="/loginTecnico" element={<LoginTecnico />} />
        <Route path="/tecnico/addnew" element={<AddNewTecnico />} />
        <Route path="/admin/addnew" element={<AddNewAdmin />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/tecnico" element={<Tecnico />} />
        <Route path="/admins" element={<Admins/>} />
        <Route path="/chamadoDetails/:id" element={<ChamadoDetails/>}/>
        <Route path="/chamadosFechados" element={<ChamadosFechados />} />
        <Route path="/userP" element={<UserP/>}/>
        <Route path="/messagesTec" element={<MessagesTec />} />
        <Route path="/tecnicoTec" element={<TecnicoTec />} />
        <Route path="/adminsTec" element={<AdminsTec/>} />
        <Route path="/chamadoDetailsTec/:id" element={<ChamadoDetailsTec/>}/>
        <Route path="/chamadosFechadosTec" element={<ChamadosFechadosTec />} />
      </Routes>
      <ToastContainer position="top-center" />
    </Router>
  );
};

export default App;