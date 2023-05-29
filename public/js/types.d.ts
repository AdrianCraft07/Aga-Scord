export type URL = `${'http' | 'https'}://${'example' | string}.${'com' | string}`;
export type ID = number;

export type Email = `${string}@${string}.${string}`;

export type Decimal = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
export type Haxadecimal = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'a' | 'b' | 'c' | 'd' | 'e' | 'f';

export type Color = `#${Haxadecimal}${Haxadecimal}${Haxadecimal}` | string;
export type ChannelType = 'TEXT' | 'VOICE';

export type PermissionsKeys = 'ADMINISTRATOR' | 'MANAGE_MESSAGES';

export interface Embed {
	title: string;
	description: string;
	color: Color;
	fields: {
		name: string;
		value: string;
		inline: Boolean;
	}[];
}
export interface Message {
	id: ID;
	author: User['id'];
	data: {
		content: string;
		embeds: Embed[];
		attachments: URL[];
	};
	edited: Boolean;
	reply: Message['id'] | null;
}
export interface Channel {
	name: string;
	type: ChannelType;
	id: ID;
	authorized: {
		'#default': Boolean;
		roles: Rol['id'][];
		members: Member['id'][];
	};
	messages: Message[];
}
export interface Category {
	name: string;
	id: ID;
	channels: Channel[];
}
export interface Rol {
	name: string;
	color: Color;
	id: ID;
	rank: number;
	permissions: Record<PermissionsKeys, Boolean>;
}
export interface Member {
	id: ID;
	roles: Rol['id'][];
}
export interface Server {
	name: string;
	icon: URL;
	author: User['id'];
	id: ID | '@me';
	categories: Category[];
	roles: Rol[];
	members: Member[];
}

export type Discriminator = `${Decimal}${Decimal}${Decimal}${Decimal}`;

export interface Bot {
	avatar: URL;
	name: string;
	bot: true;
	id: ID;
	discriminator: Discriminator;
	verified: boolean;
}
export interface Person {
	avatar: URL;
	name: string;
	bot: false;
	id: ID;
	discriminator: Discriminator;
}
export type User = Bot | Person;

export interface FuncionIO{
	'message': [Server['id'], Channel['id'], Message];
	'messageEdit': [Server['id'], Channel['id'], Message, Message];
	'messageDelete': [Server['id'], Channel['id'], Message];
	'member-connection': [User['id']];
	'member-disconnection': [User['id']];
	'new-server': [Server['name'], Server['icon']];
	'login': [{email: Email, password: string}];
	'connected': [User];
	'members':[(User & {active:boolean})[]];
	'get-members': [Server['id']];
	'add-server': [Server];
}
export interface IO {
	user: User;
	on<K extends keyof FuncionIO>(event: K, callback: (...args: FuncionIO[K]) => void): void;
	emit<K extends keyof FuncionIO>(event: K, ...args: FuncionIO[K]): void;
	iemit<K extends keyof FuncionIO>(event: K, ...args: FuncionIO[K]): void;
}
export interface MessageSend {
	author: Message['author'],
	reply: Message['reply'],
	data: {
		content: Message['data']['content'],
	}
}