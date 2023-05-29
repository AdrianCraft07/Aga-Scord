import http from "http";
import { DataBase } from "../DataBase";
import { io } from "./utils/connection";
import controller from "./controller";

export default function (db: DataBase, server: http.Server) {
  const wsConnection = io(server);
  const data = controller(db, wsConnection);

  wsConnection.on('new-server', data.newServer);
  wsConnection.on('login', data.login);
  wsConnection.on('disconnection', data.disconnection);
  wsConnection.on('message', data.message);
  wsConnection.on('message-edit', data.messageEdit);
  wsConnection.on('message-delete', data.messageDelete);

  return wsConnection;
}