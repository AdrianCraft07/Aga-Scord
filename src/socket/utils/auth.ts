import { DataBase } from '../../DataBase';
import { Bot, Person, User } from '../../DataBase/types';
import { SocketIO } from '../types';

export function getMembers(db: DataBase, wsConnection: SocketIO, user: User, server: number) {
  const Server = getServer(db, user, server);
  if (!Server) return;
  return Server.members
					.map(member => wsConnection.getSocket(member.id))
					.filter(Boolean)
					.map(socket => socket.id)
}

export function getUser(db: DataBase, credentials: User['#private']) {
  if (!credentials) return;
  if ((credentials as Person['#private']).email) return getPerson(db, (credentials as Person['#private']).email, (credentials as Person['#private']).password);
  else if ((credentials as Bot['#private']).token) return getBot(db, (credentials as Bot['#private']).token);
  else return;
}

export function getPerson(db: DataBase, email: string, password: string) {
  return db.users.getPersons().find(user => user['#private'].email === email && user['#private'].password === password);
}

export function getBot(db: DataBase, token: string) {
  return db.users.getBots().find(bot => bot['#private'].token === token);
}

export function getCategory(db: DataBase, user: User, server: number, category: number) {
  const Server = getServer(db, user, server);
  if (!Server) return;
  const Category = Server.categories.find(c => c.id === Number(category));
  if (!Category) return;
  return Category;
}

export function getChannel(db: DataBase, user: User, server: number, channel: number) {
	const Server = getServer(db, user, server);
	if (!Server) return;
	const Category = Server.categories.find(category => category.channels.find(c => c.id === Number(channel)));
	if (!Category) return;
	const Channel = Category.channels.find(c => c.id === Number(channel));
	if (!Channel) return;
	return Channel;
}

export function getServer(db: DataBase, user: User, server: number) {
	const Server = db.servers.get(Number(server));
	if (!Server) return;
	const isMember = Server.members.find(member => member.id === user.id);
	if (!isMember) return;
	return Server;
}
