import { Category, Channel, Color, Member, Message, Rol, Server, URL } from '../types';
import { CATEGORY, CHANNEL, ROL, SERVER } from './consts';

export function makeServer(author: number, name: string = SERVER.NAME, icon: URL = SERVER.ICON): Server {
	return {
		name,
		icon,
		author,
		id: Date.now(),
		categories: [makeCategory()],
		roles: [],
		members: [makeMember(author)],
	};
}
export function makeMember(id: number): Member {
	return {
		id,
		roles: [],
	};
}
export function makeRol(name: string = ROL.NAME, color: Color = ROL.COLOR, rank: number): Rol {
	return {
		name,
		color,
		rank,
		permissions: {} as Rol['permissions'],
		id: Date.now(),
	};
}
export function makeCategory(name: string = CATEGORY.NAME): Category {
	return {
		name,
		id: Date.now(),
		channels: [makeChannel()],
	};
}
export function makeChannel(
	name: string = CHANNEL.NAME,
	type: Channel['type'] = CHANNEL.TYPE,
	authorizedDefault: boolean = CHANNEL.AUTHORIZED_DEFAULT
): Channel {
	return {
		name,
		type,
		authorized: {
			'#default': authorizedDefault,
			roles: [],
			members: [],
		},
		messages: [],
		id: Date.now(),
	};
}
export function makeMessage(author: number, data: Message['data'], reply: Message['id'] = null): Message {
	return {
		id: Date.now(),
		author,
		data: {
			content: data.content || '',
			embeds: data.embeds || [],
			attachments: data.attachments || [],
		},
		edited: false,
		reply,
	};
}
