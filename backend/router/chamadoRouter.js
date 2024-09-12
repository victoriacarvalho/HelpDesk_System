import express from "express";
import {getAllChamados, postChamado, updateChamadoStatus, countChamado, getChamadoById, assignTecnico} from "../controller/chamadoController.js";
import {isAdminAuthenticated, isUserPadraoAuthenticated} from "../middlewares/auth.js";

const router = express.Router();

router.post("/post", isUserPadraoAuthenticated, postChamado);
router.get("/getall", isAdminAuthenticated, getAllChamados);
router.put("/update/:id", isAdminAuthenticated, updateChamadoStatus);
router.get("/count", isAdminAuthenticated,countChamado);
router.get("/getDetails/:id", isAdminAuthenticated,getChamadoById);
router.put("/:id/assignTecnico", assignTecnico);
 
export default router;