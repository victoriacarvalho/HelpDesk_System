import express from "express";
import { login, userPadraoRegister, addNewAdmin, getUserDetails, logoutPadrao, logoutAdmin, addNewTecnico, getAllAdmin, getAllTecnicos } from "../controller/userController.js";
import { isAdminAuthenticated, isUserPadraoAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/userP/register", userPadraoRegister);
router.post("/login", login);
router.post("/administrador/addnew", isAdminAuthenticated, addNewAdmin);
router.post("/tecnico/addnewtecnico", isAdminAuthenticated, addNewTecnico);
router.get("/tecnico", getAllTecnicos);
router.get("/adminAll", getAllAdmin);
router.get("/userP/me", isUserPadraoAuthenticated,getUserDetails);
router.get("/admin/me", isAdminAuthenticated, getUserDetails);
router.get("/logout/userP", isUserPadraoAuthenticated, logoutPadrao);
router.get("/logout/admin", isAdminAuthenticated, logoutAdmin);

export default router;