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
          toast.error(error.response.data.message);
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
              tecnicos.map((element) => {
                return (
                  <div className="card">
                    <img
                      src={element.tecAvatar && element.tecAvatar.url}
                      alt="tecnico avatar"
                    />
                    <h4>{`${element.firstName} ${element.lastName}`}</h4>
                    <div className="details">
                      <p>
                        E-mail: <span>{element.email}</span>
                      </p>
                      <p>
                        Celular: <span>{element.phone}</span>
                      </p>
                      <p>
                        Setor: <span>{element.sector.substring(0, 10)}</span>
                      </p>
                      <p>
                        Matrícula: <span>{element.registration}</span>
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <h1>Técnico não registrado!</h1>
            )}
          </div>
        </section>
      );
    };
    
    export default Tecnicos;