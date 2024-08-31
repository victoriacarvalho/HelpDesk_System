import express from "express";
import {deleteChamado, getAllChamados, postChamado, updateChamadoStatus, countChamado, getChamadoById} from "../controller/chamadoController.js";
import {isAdminAuthenticated, isUserPadraoAuthenticated} from "../middlewares/auth.js";

const router = express.Router();

router.post("/post", isUserPadraoAuthenticated, postChamado);
router.get("/getall", isAdminAuthenticated, getAllChamados);
router.put("/update/:id", isAdminAuthenticated, updateChamadoStatus);
router.delete("/delete/:id", isAdminAuthenticated, deleteChamado);
router.get("/count", isAdminAuthenticated,countChamado);
router.get("/getDetails/:id", isAdminAuthenticated,getChamadoById);
 
export default router;