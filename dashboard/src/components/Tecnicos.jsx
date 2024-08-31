/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-key */
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../main";
import { Navigate } from "react-router-dom";

const Tecnicos = () => {
    const [tecnicos, setTecnicos] = useState([]);
    const { isAuthenticated } = useContext(Context);

    useEffect(() => {
      const fetchTecnicos = async () => {
        try {
          const { data } = await axios.get(
            "http://localhost:4000/api/v1/user/tecnico",
            { withCredentials: true }
          );
          setTecnicos(data.tecnicos);
        } catch (error) {
          toast.error(error.response?.data?.message || "Erro ao buscar técnicos");
        }
      };
      fetchTecnicos();
    }, []);

    if (!isAuthenticated) {
        return <Navigate to={"/login"} />;
    }

    return (
        <section className="page tecnicos">
            <h1>TÉCNICOS</h1>
            <div className="banner">
                {tecnicos && tecnicos.length > 0 ? (
                    tecnicos.map((tecnico) => (
                        <div key={tecnico._id} className="card">
                            <h4>{`${tecnico.firstName} ${tecnico.lastName}`}</h4>
                            <div className="details">
                                <p>
                                    E-mail: <span>{tecnico.email}</span>
                                </p>
                                <p>
                                    Celular: <span>{tecnico.phone}</span>
                                </p>
                                <p>
                                    Setor: <span>{tecnico.sector.substring(0, 10)}</span>
                                </p>
                                <p>
                                    Matrícula: <span>{tecnico.registration}</span>
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <h1>Técnico não registrado!</h1>
                )}
            </div>
        </section>
    );
};

export default Tecnicos;
