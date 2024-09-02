import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { Navigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const ClosedChamados = () => {
  const [chamados, setChamados] = useState([]);

  useEffect(() => {
    const fetchClosedChamados = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/chamado/getall",
          { withCredentials: true }
        );

        // Filtrar apenas os chamados com status "Encerrado"
        const closedChamados = data.chamados.filter(
          (chamado) => chamado.status === "Encerrado"
        );

        setChamados(closedChamados);
      } catch (error) {
        toast.error("Erro ao carregar os chamados fechados");
        setChamados([]);
      }
    };
    fetchClosedChamados();
  }, []);

  const { isAuthenticated, admin } = useContext(Context);

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  return (
    <section className="closed-chamados page">
      <div className="banner">
        <div className="firstBox">
          <div className="content">
            <div>
              <p>Olá,</p>
              <h5>{admin && `${admin.firstName} ${admin.lastName}`}</h5>
            </div>
            <p>
              Aqui estão todos os chamados que já foram encerrados.
            </p>
          </div>
        </div>
        <div className="secondBox">
          <p>Total de Chamados Fechados</p>
          <h3>{chamados.length}</h3>
        </div>
      </div>
      <div className="banner">
        <h5>Chamados Fechados</h5>
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
            {chamados.length > 0 ? (
              chamados.map((chamado) => (
                <tr key={chamado._id}>
                  <td>
                    <Link to={`/chamadoDetails/${chamado._id}`}>
                      {`${chamado.firstName} ${chamado.lastName}`}
                    </Link>
                  </td>
                  <td>{chamado.chamado_date}</td>
                  <td>
                    {chamado.tecnico
                      ? `${chamado.tecnico.firstName} ${chamado.tecnico.lastName}`
                      : "Sem Técnico"}
                  </td>
                  <td>{chamado.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">Sem chamados fechados encontrados!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ClosedChamados;
