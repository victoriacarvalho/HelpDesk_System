/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { GoCheckCircleFill } from "react-icons/go";
import { AiFillCloseCircle } from "react-icons/ai";

const Dashboard = () => {
    const [chamados, setChamados] = useState([]);
  
    useEffect(() => {
        const fetchChamados = async () => {
          try {
            const { data } = await axios.get(
              "http://localhost:4000/api/v1/chamado/getall",
              { withCredentials: true }
            );
            setChamados(data.chamados);
          } catch (error) {
            setChamados([]);
          }
        };
        fetchChamados();
      }, []);

      const handleUpdateStatus = async (chamadoId, status) => {
        try {
          const { data } = await axios.put(
            `http://localhost:4000/api/v1/chamado/update/${chamadoId}`,
            { status },
            { withCredentials: true }
          );
          setChamados((prevChamado) =>
            prevChamado.map((chamado) =>
              chamado._id === chamadoId
                ? { ...chamado, status }
                : chamado
            )
          );
          toast.success(data.message);
        } catch (error) {
          toast.error(error.response.data.message);
        }
      };

      const { isAuthenticated, admin } = useContext(Context);
      if (!isAuthenticated) {
        return <Navigate to={"/login"} />;
      }

      return (
        <>
          <section className="dashboard page">
            <div className="banner">
              <div className="firstBox">
                <img src="/fotos/eu.jpeg" alt="tecImg" />
                <div className="content">
                  <div>
                    <p>Hello ,</p>
                    <h5>
                      {admin &&
                        `${admin.firstName} ${admin.lastName}`}{" "}
                    </h5>
                  </div>
                  <p>
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                    Facilis, nam molestias. Eaque molestiae ipsam commodi neque.
                    Assumenda repellendus necessitatibus itaque.
                  </p>
                </div>
              </div>
              <div className="secondBox">
                <p>Total de Tickets</p>
                <h3>1500</h3>
              </div>
              <div className="thirdBox">
                <p>Tecnicos registrados</p>
                <h3>10</h3>
              </div>
            </div>
            <div className="banner">
              <h5>Chamados</h5>
              <table>
                <thead>
                  <tr>
                    <th>Requerente</th>
                    <th>Data</th>
                    <th>Técnico</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {chamados && chamados.length > 0
                    ? chamados.map((chamado) => (
                        <tr key={chamado._id}>
                          <td>{`${chamado.firstName} ${chamado.lastName}`}</td>
                          <td>{chamado.chamado_date}</td>
                          <td>
                            <select
                              className={
                                chamado.status === "Pendente"
                                  ? "value-pending"
                                  : chamado.status === "Aberto"
                                  ? "value-accepted"
                                  : "value-rejected"
                              }
                              value={chamado.status}
                              onChange={(e) =>
                                handleUpdateStatus(chamado._id, e.target.value)
                              }
                            >
                              <option value="Pendente" className="value-pending">
                                Pendente
                              </option>
                              <option value="Aberto" className="value-accepted">
                                Aberto
                              </option>
                              <option value="Encerrado" className="value-rejected">
                                Encerrado
                              </option>
                            </select>
                          </td>
                        </tr>
                      ))
                    : "Sem tickets encontrado!"}
                </tbody>
              </table>
    
              {}
            </div>
          </section>
        </>
      );
    };
    
export default Dashboard;
