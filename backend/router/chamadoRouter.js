import express from "express";
import {deleteChamado, getAllChamados, postChamado, updateChamadoStatus} from "../controller/chamadoController.js";
import {isAdminAuthenticated, isUserPadraoAuthenticated} from "../middlewares/auth.js";

const router = express.Router();

router.post("/post", isUserPadraoAuthenticated, postChamado);
router.get("/getall", isAdminAuthenticated, getAllChamados);
router.put("/update/:id", isAdminAuthenticated, updateChamadoStatus);
router.delete("/delete/:id", isAdminAuthenticated, deleteChamado);
 
export default router;