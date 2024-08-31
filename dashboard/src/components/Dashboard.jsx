import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { Navigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [chamados, setChamados] = useState([]);
  const [totalChamados, setTotalChamados] = useState(0);
  const [chamadosAbertos, setChamadosAbertos] = useState(0);

  useEffect(() => {
    const fetchChamados = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/chamado/getall",
          { withCredentials: true }
        );
        setChamados(data.chamados);

        const countResponse = await axios.get(
          "http://localhost:4000/api/v1/chamado/count",
          { withCredentials: true }
        );
        setTotalChamados(countResponse.data.count);

        // Contar chamados abertos
        const abertosCount = data.chamados.filter(chamado => chamado.status === "Aberto").length;
        setChamadosAbertos(abertosCount);
      } catch (error) {
        toast.error("Erro ao carregar os chamados");
        setChamados([]);
        setTotalChamados(0);
        setChamadosAbertos(0);
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
      setChamados((prevChamados) =>
        prevChamados.map((chamado) =>
          chamado._id === chamadoId
            ? { ...chamado, status }
            : chamado
        )
      );
      toast.success(data.message);

      // Atualizar contagem de chamados abertos
      const abertosCount = chamados.filter(chamado => chamado.status === "Aberto").length;
      setChamadosAbertos(abertosCount);
    } catch (error) {
      toast.error(error.response?.data?.message || "Erro ao atualizar o status");
    }
  };

  const { isAuthenticated, admin } = useContext(Context);

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  return (
    <section className="dashboard page">
      <div className="banner">
        <div className="firstBox">
          <div className="content">
            <div>
              <p>Olá,</p>
              <h5>{admin && `${admin.firstName} ${admin.lastName}`}</h5>
            </div>
            <p>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit.
              Facilis, nam molestias. Eaque molestiae ipsam commodi neque.
              Assumenda repellendus necessitatibus itaque.
            </p>
          </div>
        </div>
        <div className="secondBox">
          <p>Total de Chamados</p>
          <h3>{totalChamados}</h3>
        </div>
        <div className="thirdBox">
          <p>Chamados Abertos</p>
          <h3>{chamadosAbertos}</h3>
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
                      <option value="Pendente">Pendente</option>
                      <option value="Aberto">Aberto</option>
                      <option value="Encerrado">Encerrado</option>
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">Sem chamados encontrados!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Dashboard;
