import fs from 'fs';

import { SERVERS_PATH, USERS_FILE } from './consts';
import { Bot, Person, Server, User } from './types';
import mailer from '../mailer';

const servers = fs.readdirSync(SERVERS_PATH).map(file => {
	const server = JSON.parse(fs.readFileSync(`${SERVERS_PATH}/${file}`, 'utf8')) as Server;
	return server;
});

const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8')) as User[];

export interface DataBase {
	servers: {
		get(id: Server['id']): Server | undefined;
		getAll(): Server[];
		create(server: Server): Server | undefined;
		update(server: Server): Server | undefined;
		delete(id: Server['id']): void;
		save(id: Server['id']): Server | undefined;
	};
	users: {
		get(id: User['id']): User | undefined;
		getAll(): User[];
		create(user: User): User | undefined;
		update(): DataBase['users'];
		delete(id: User['id']): void;
		getBots(): Bot[];
		getPersons(): Person[];
	};
	mailer: typeof mailer;
}

const db: DataBase = {
	servers: {
		save(id) {
			const server = db.servers.get(id);
			if (!server) return;
			return db.servers.update(server);
		},
		getAll() {
			return servers;
		},
		get(id) {
			return servers.find(server => server.id === id);
		},
		create(server) {
			if (!server) return;
			server.id = Date.now();
			fs.writeFileSync(`${SERVERS_PATH}/${server.id}.json`, JSON.stringify(server));
			servers.push(server);
			return server;
		},
		update(server) {
			if (!server) return;
			fs.writeFileSync(`${SERVERS_PATH}/${server.id}.json`, JSON.stringify(server));
			return server;
		},
		delete(id) {
			fs.unlinkSync(`${SERVERS_PATH}/${id}.json`);
			const index = servers.findIndex(server => server.id === id);
			servers.splice(index, 1);
		},
	},
	users: {
		getAll(){
			return users;
		},
		get(id: User['id']) {
			return users.find(user => user.id === id);
		},
		create(user: User) {
			if (!user) return;
			user.id = Date.now();
			users.push(user);
			fs.writeFileSync(USERS_FILE, JSON.stringify(users));
			return user;
		},
		update() {
			fs.writeFileSync(USERS_FILE, JSON.stringify(users));
			return db.users;
		},
		delete(id: User['id']) {
			const index = users.findIndex(user => user.id === id);
			users.splice(index, 1);
			fs.writeFileSync(USERS_FILE, JSON.stringify(users));
		},
		getBots() {
			return users.filter(user => user.bot) as Bot[];
		},
		getPersons() {
			return users.filter(user => !user.bot) as Person[];
		},
	},
	mailer
};

export default db;
