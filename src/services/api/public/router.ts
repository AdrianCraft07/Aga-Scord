import {Router} from "waga";
import { DataBase } from "../../../DataBase";
import apiController from "./controller";

const router = Router();

export default function(db: DataBase) {
  const controller = apiController(db);

  router.post('/user/:id', controller.user);

  return router;
}