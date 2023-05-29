import { WagaResponse } from 'waga/dist/types';
import { DataBase } from '../../DataBase';
import { Bot, User, Server, Channel, Person } from '../../DataBase/types';
import { deleteKeys, makeError } from '../../utils/object';
import InternalErrors, { InternalError } from '../../utils/internalErrors';

type ErrorObject = InternalError & { id?: number };
type UserArg = User | ErrorObject;
type s = string;

export function getUser(res: WagaResponse, db: DataBase, credentials: User['#private']) {
	if (!credentials) return makeError(res, 400, InternalErrors.CREDENTIALS_NOT_DETECTED);
	if ((credentials as Bot['#private']).token) return getBot(res, db, (credentials as Bot['#private']).token);
	else if ((credentials as Person['#private']).email)
		return getPerson(res, db, (credentials as Person['#private']).email, (credentials as Person['#private']).password);
	else return makeError(res, 400, InternalErrors.CREDENTIALS_NOT_FOUND);
}

export function getBot(res: WagaResponse, db: DataBase, token: s) {
	const data = db.users.getBots().find(bot => bot['#private'].token === token) as Bot;
	if (!data) return makeError(res, 404, InternalErrors.BOT_NOT_FOUND);
	return deleteKeys(data, ['#private']) as Bot;
}

export function getPerson(res: WagaResponse, db: DataBase, email: s, password: s) {
	const data = db.users.getPersons().find(person => person['#private'].email === email && person['#private'].password === password);
	if (!data) return makeError(res, 404, InternalErrors.PERSON_NOT_FOUND);
	return deleteKeys(data, ['#private']) as Person;
}

export function getMessage(res: WagaResponse, db: DataBase, user: UserArg, server: s, channel: s, message: s) {
	const Channel = getChannel(res, db, user, server, channel);
	if ((Channel as ErrorObject).error) return Channel as ErrorObject;
	const Message = (Channel as Channel).messages.find(m => m.id === Number(message));
	if (!Message) return makeError(res, 404, InternalErrors.MESSAGE_NOT_FOUND);
	return Message;
}

export function getChannel(res: WagaResponse, db: DataBase, user: UserArg, server: s, channel: s) {
	const Server = getServer(res, db, user, server);
	if ((Server as ErrorObject).error) return Server as ErrorObject;
	const Category = (Server as Server).categories.find(category => category.channels.find(c => c.id === Number(channel)));
	if (!Category) return makeError(res, 404, InternalErrors.CHANNEL_NOT_FOUND);
	const Channel = Category.channels.find(c => c.id === Number(channel));
	if (!Channel) return makeError(res, 404, InternalErrors.CHANNEL_NOT_FOUND);
	const Member = (Server as Server).members.find(member => member.id === user.id);
	const isAuthorised =
		Channel.authorized['#default'] ||
		Channel.authorized.members.find(member => member === user.id) ||
		Channel.authorized.roles.find(role => Member.roles.find(r => r === role));
	if (!isAuthorised) return makeError(res, 404, InternalErrors.CHANNEL_NOT_FOUND);
	return Channel;
}

export function getServer(res: WagaResponse, db: DataBase, user: UserArg, server: s) {
	if (!user) return makeError(res, 400, InternalErrors.USER_NOT_FOUND);
	if ((user as unknown as ErrorObject).error) return user;
	const Server = db.servers.get(Number(server));
	if (!Server) return makeError(res, 404, InternalErrors.SERVER_NOT_FOUND);
	const isMember = Server.members.find(member => member.id === user.id);
	if (!isMember) return makeError(res, 404, InternalErrors.SERVER_NOT_FOUND);
	return Server;
}

export function getCategory(res: WagaResponse, db: DataBase, user: UserArg, server: s, category: s) {
	const Server = getServer(res, db, user, server);
	if ((Server as ErrorObject).error) return Server;
	const Category = (Server as Server).categories.find(c => c.id === Number(category));
	if (!Category) return makeError(res, 404, InternalErrors.CATEGORY_NOT_FOUND);
	return Category;
}

export function getMessages(res: WagaResponse, db: DataBase, user: UserArg, server: s, channel: s) {
	const Channel = getChannel(res, db, user, server, channel);
	if ((Channel as ErrorObject).error) return Channel as ErrorObject;
	return (Channel as Channel).messages;
}
