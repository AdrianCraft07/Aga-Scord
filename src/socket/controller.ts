import { DataBase } from '../DataBase';
import { makeMessage, makeServer } from '../DataBase/makers/server';
import { Socket, SocketIO } from './types';

import { Message, URL, User } from '../DataBase/types';
import { getServersFromUser } from '../DataBase/utils/get';
import { getChannel, getMembers, getUser } from './utils/auth';
import { deleteKeys } from '../utils/object';

type MessageEvent = [number, number, Message];
type MessageEditEvent = [number, number, Message];
type MessageDeleteEvent = [number, number, Message];

function log<T>(a: T): T {
	console.log(a);
	return a;
}

export default function (db: DataBase, wsConnection: SocketIO) {
	function login(socket: Socket, user: User) {
		if (!user) return;
		socket.id = user.id;
		const servers = getServersFromUser(db, user);
		servers.forEach(server => {
			const ActiveMembers = server.members
				.map(member => wsConnection.getSocket(member.id))
				.filter(Boolean)
				.map(socket => socket.id);
			if (ActiveMembers.length) return;
			wsConnection.emit('member-connection', socketMember => ActiveMembers.includes(socketMember.id), socket.id);
		});
		wsConnection.emit('connected', socketMember => socketMember.uuid === socket.uuid, deleteKeys(user, ['#private']));
	}
	const data = {
		getMembers(socket: Socket, [server]: [number]) {
			if(!socket.id) return;
			const User = db.users.get(socket.id);
			if (!User) return;
			const Members = getMembers(db, wsConnection, User, server);
			if (!Members) return;
			wsConnection.emit('members', socketMember => Members.includes(socketMember.id), Members.map(member =>{
				const User = db.users.get(member);
				if(!User) return;
				const user = deleteKeys(User, ['#private']);
				user.active = Boolean(wsConnection.getSocket(member));
				return user;
			}));
		},
		newServer(socket: Socket, [name, icon]: [string, string]) {
			if (!socket.id) return;
			const server = makeServer(socket.id, name, icon as URL)
			db.servers.create(server);
			wsConnection.emit('add-server', socketMember => socketMember === socket, server);
		},
		login(socket: Socket, [credentials]: [User['#private']]) {
			const user = getUser(db, credentials);
			login(socket, user);
		},
		message(socket: Socket, [server, channel, message]: MessageEvent) {
			if (message.author !== socket.id) return;
			const User = db.users.get(message.author);
			if (!User) return;
			const Channel = getChannel(db, User, server, channel);
			if (!Channel) return;
			const msg = makeMessage(message.author, message.data, message.reply);
			Channel.messages.push(msg);
			db.servers.save(server);

			const Members = getMembers(db, wsConnection, User, server);
			if (!Members) return;
			wsConnection.emit('message', socketMember => Members.includes(socketMember.id), server, channel, msg);
		},
		messageEdit(socket: Socket, [server, channel, message]: MessageEditEvent) {
			if (message.author !== socket.id) return;
			const User = db.users.get(message.author);
			if (!User) return;
			const Channel = getChannel(db, User, server, channel);
			if (!Channel) return;
			const msg = Channel.messages.find(msg => msg.id === message.id);
			if (!msg) return;
			const oldData = msg.data;

			msg.data = message.data;
			msg.edited = true;

			db.servers.save(server);

			const Members = getMembers(db, wsConnection, User, server);
			if (!Members) return;
			wsConnection.emit('messageEdit', socketMember => Members.includes(socketMember.id), server, channel, { ...msg, data: oldData }, msg);
		},
		messageDelete(socket: Socket, [server, channel, message]: MessageDeleteEvent) {
			const User = db.users.get(socket.id);
			if (!User) return;
			const Channel = getChannel(db, User, server, channel);
			if (!Channel) return;
			const msg = Channel.messages.find(msg => msg.id === message.id);
			if (!msg) return;

			Channel.messages.splice(Channel.messages.indexOf(msg), 1);
			db.servers.save(server);

			const Members = getMembers(db, wsConnection, User, server);
			if (!Members) return;
			wsConnection.emit('messageDelete', socketMember => Members.includes(socketMember.id), server, channel, msg);
		},
		disconnection(socket: Socket) {
			const activeID = wsConnection.getSocket(socket.id);
			if (activeID) return;
			const User = db.users.get(socket.id);
			const servers = getServersFromUser(db, User);
			servers.forEach(server => {
				const ActiveMembers = getMembers(db, wsConnection, User, server.id);
				if (ActiveMembers.length) return;
				wsConnection.emit('member-disconnection', socketMember => ActiveMembers.includes(socketMember.id), socket.id);
			});
		},
	};
	return data;
}
