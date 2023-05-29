import { DataBase } from "..";
import { User } from "../types";

export function getServersFromUser(db:DataBase, user:User) {
  if(!user) return [];
  return db.servers.getAll().filter(server => server.members.find(member => member.id === user.id))
}