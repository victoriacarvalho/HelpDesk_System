/* eslint-disable no-unused-vars */
import axios from "axios";
import { useState } from "react";
import React, { useEffect } from "react";
import { toast } from "react-toastify";

const ChamadoForm = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [sector, setSector] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [tecnicoFirstName, setTecnicoFirstName] = useState("");
    const [tecnicoLastName, setTecnicoLastName] = useState("");
    const [chamado_date, setChamadoDate] = useState("");

const [tecnicos, setTecnicos] = useState([]);
  useEffect(() => {
    const fetchTecnicos = async () => {
      const { data } = await axios.get(
        "http://localhost:4000/api/v1/user/tecnico",
        { withCredentials: true }
      );
      setTecnicos(data.tecnicos);
      console.log(data.tecnicos);
    };
    fetchTecnicos();
  }, []);

    const handleChamado = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(
                "http://localhost:4000/api/v1/chamado/post",
                {
                    firstName,
                    lastName,
                    email,
                    phone,
                    sector,
                    title,
                    chamado_date,
                    description
                },
                {
                    withCredentials: true,
                    headers: { "Content-Type": "application/json" },
                }
            );

            toast.success(data.message);
            setFirstName("");
            setLastName("");
            setEmail("");
            setPhone("");
            setSector("");
            setTitle("");
            setChamadoDate("");
            setDescription("");
            setTecnicoFirstName("");
            setTecnicoLastName("");
        } catch (error) {
            toast.error(error.response.data.message || "Falha ao enviar chamado.");
        }
    };

    return (
        <div className="container form-component appointment-form">
            <h2>Abertura de chamado</h2>
            <form onSubmit={handleChamado}>
                <div>
                    <input
                        type="text"
                        placeholder="Primeiro nome"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Último nome"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </div>
                <div>
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
                </div>
                <div>
                    <input
                        type="text"
                        placeholder="Setor"
                        value={sector}
                        onChange={(e) => setSector(e.target.value)}
                        style={{ width: "100%", marginTop: "10px" }}
                    />
                </div>
                <div>
                    <input
                            type="text"
                            placeholder="Título"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            style={{ width: "100%", marginTop: "10px" }}
                        />
                </div>
                <div>
                    <textarea
                        rows="10"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Descrição"
                        style={{ width: "100%", marginTop: "10px" }}
                        
                    />
                </div>
                <button style={{ margin: "0 auto" }}>Enviar</button>
            </form>
        </div>
    );
};

export default ChamadoForm;
