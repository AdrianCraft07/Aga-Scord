import {Router, redirect} from "waga";
import { DataBase } from "../../DataBase";
import routesCcontroller from "./controller";

const router = Router();

export default function(db: DataBase) {
  const controller = routesCcontroller(db);

  router.get('favicon.ico', redirect('https://agacraft.ga/src/img/icono.ico'))
  router.get('/', redirect('/channel/1668738825743'));
  router.get('/channel/:server', controller.default);
  router.get('/channel/:server/:channel', controller.default);

  router.get('/login', controller.login);
  router.get('/register', controller.register);

  router.get('/js/*', controller.js);
  router.get('/styles/*', controller.styles);
  
  router.get('/attachments/*', controller.attachments);
  router.get('/images/*', controller.images);

  return router;
}