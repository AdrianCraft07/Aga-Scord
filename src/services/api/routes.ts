import {Router} from "waga";
import { DataBase } from "../../DataBase";
import apiController from "./controller";
import publicApi from "./public/router";

const router = Router();

export default function(db: DataBase) {
  const controller = apiController(db);

  router.post('/user', controller.user);
  router.post('/message/:server/:channel/:message', controller.message);
  router.post('/messages/:server/:channel', controller.messages);
  router.post('/register', controller.register);
  router.post('/servers', controller.servers);

  router.use('/public', publicApi(db));

  return router;
}