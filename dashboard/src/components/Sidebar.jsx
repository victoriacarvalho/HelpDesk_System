/* eslint-disable no-unused-vars */
import React, { useContext, useState } from "react";
import { TiHome } from "react-icons/ti";
import { CiLogout } from "react-icons/ci";
import { RiMessage2Line } from "react-icons/ri";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaUserGear } from "react-icons/fa6";
import { GrUserAdmin } from "react-icons/gr";
import { IoPersonAddSharp } from "react-icons/io5";
import axios from "axios";
import { toast } from "react-toastify";
import { Context } from "../main";
import { useNavigate } from "react-router-dom";


const Sidebar = () => {
    const [show, setShow] = useState(false);
  
    const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  
    const handleLogout = async () => {
      await axios
        .get("http://localhost:4000/api/v1/user/logout/admin", {
          withCredentials: true,
        })
        .then((res) => {
          toast.success(res.data.message);
          setIsAuthenticated(false);
        })
        .catch((err) => {
          toast.error(err.response.data.message);
        });
    };

    const navigateTo = useNavigate();

    const gotoHomePage = () => {
      navigateTo("/");
      setShow(!show);
    };
    const gotoTecnicosPage = () => {
      navigateTo("/tecnicos");
      setShow(!show);
    };
    const gotoMessagesPage = () => {
      navigateTo("/messages");
      setShow(!show);
    };
    const gotoAddNewTecnico = () => {
      navigateTo("/tecnico/addnew");
      setShow(!show);
    };
    const gotoAddNewAdmin = () => {
      navigateTo("/admin/addnew");
      setShow(!show);
    };
  
    return (
      <>
        <nav
          style={!isAuthenticated ? { display: "none" } : { display: "flex" }}
          className={show ? "show sidebar" : "sidebar"}
        >
          <div className="links">
            <TiHome onClick={gotoHomePage} />
            <FaUserGear onClick={gotoTecnicosPage} />
            <GrUserAdmin  onClick={gotoAddNewAdmin} />
            <IoPersonAddSharp onClick={gotoAddNewTecnico} />
            <RiMessage2Line  onClick={gotoMessagesPage} />
            <CiLogout onClick={handleLogout} />
          </div>
        </nav>
        <div
          className="wrapper"
          style={!isAuthenticated ? { display: "none" } : { display: "flex" }}
        >
          <GiHamburgerMenu className="hamburger" onClick={() => setShow(!show)} />
        </div>
      </>
    );
  };
  
  export default Sidebar;