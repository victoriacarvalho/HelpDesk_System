/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ChamadoDetails = () => {
  const { id } = useParams();
  const [chamado, setChamado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchChamado = async () => {
      try {
        const { data } = await axios.get(`http://localhost:4000/api/v1/chamado/getDetails/${id}`, { withCredentials: true });
        setChamado(data.chamado);
        setLoading(false);
      } catch (err) {
        setError('Erro ao carregar detalhes do chamado.');
        setLoading(false);
      }
    };
    fetchChamado();
  }, [id]);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <section className="page messages">
      <h2>Detalhes do Chamado</h2>
      {chamado ? (
        <div className="banner">
          <div className="card">
          <div className="details">
            <p><strong>Título:</strong> {chamado.title}</p>
          </div>
          <div className="detail-item">
            <p><strong>Descrição:</strong> {chamado.description}</p>
          </div>
          <div className="detail-item">
            <p><strong>Requerente:</strong> {`${chamado.firstName} ${chamado.lastName}`}</p>
          </div>
          <div className="detail-item">
            <p><strong>Email:</strong> {chamado.email}</p>
          </div>
          <div className="detail-item">
            <p><strong>Telefone:</strong> {chamado.phone}</p>
          </div>
          <div className="detail-item">
            <p><strong>Setor:</strong> {chamado.sector}</p>
          </div>
          <div className="detail-item">
            <p><strong>Status:</strong> {chamado.status}</p>
          </div>
          <div className="detail-item">
            <p><strong>Data do Chamado:</strong> {new Date(chamado.chamado_date).toLocaleDateString()}</p>
          </div>
        </div>
        </div>
      ) : (
        <div>Chamado não encontrado.</div>
      )}
    </section>
  );
};

export default ChamadoDetails;
