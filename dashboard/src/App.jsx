/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useContext, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import AddNewTecnico from "./components/AddNewTecnico";
import Messages from "./components/Messages";
import Equipe from "./components/Equipe";
import { Context } from "./main";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddNewAdmin from "./components/AddNewAdmin";
import "./App.css";
import ChamadoDetails from "./components/ChamadoDetails";
import ChamadosFechados from "./components/ChamadosFechados";


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
        <Route path="/login" element={<Login />} />
        <Route path="/tecnico/addnew" element={<AddNewTecnico />} />
        <Route path="/admin/addnew" element={<AddNewAdmin />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/equipe" element={<Equipe />} />
        <Route path="/chamadoDetails/:id" element={<ChamadoDetails/>}/>
        <Route path="/chamadosFechados" element={<ChamadosFechados />} />
      </Routes>
      <ToastContainer position="top-center" />
    </Router>
  );
};

export default App;