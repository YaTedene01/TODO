import { Router } from "express";
import { HistoriqueController } from "../controllers/historiqueController.js";
const historiqueRouter = Router();
historiqueRouter.get("/", HistoriqueController.getAll);
historiqueRouter.post("/", HistoriqueController.create);
historiqueRouter.delete("/:id", HistoriqueController.delete);
historiqueRouter.put("/:id", HistoriqueController.update);
export default historiqueRouter;
//# sourceMappingURL=historiqueRoute.js.map