import http from 'http';
import ws from 'ws';
import { Socket } from '../types';

const FUNCTION_TRUE = () => true;

function uuid() {
	let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (count) {
			let Time = new Date().getTime();
			let random = (Time + Math.random() * 16) % 16 | 0;
			return (count === 'x' ? random : (random & 0x3) | 0x8).toString(16);
	});
	return uuid;
};

export function io(server: http.Server) {
	const sockets = new Set<Socket>();
	const events = new Map<string, Set<Function>>();

	const io = {
		on(event: string, callback: (socket: Socket, args: any[]) => void) {
			if (!events.has(event)) events.set(event, new Set());
			events.get(event).add(callback);
			return io;
		},
		emit(event: string, callback: (socket: Socket) => boolean, ...args: any[]) {
			sockets.forEach(socket => {
        callback = typeof callback === 'function' ? callback : FUNCTION_TRUE
				if (callback(socket)) socket.socket.send(JSON.stringify({ event, args }));
			});
			return io;
		},
		iemit(event: string, socket: Socket, ...args: any[]) {
			if (events.has(event)) events.get(event).forEach(callback => callback(socket, args));
			return io;
		},
    getSocket(id: number) {
      return getSocket(id, sockets);
    },
    get sockets(){
      return sockets;
    }
	};

	const wss = new ws.Server({ server });
	wss.on('connection', socket => {
		const s = { id: 0, socket, uuid: uuid() };
		sockets.add(s);
    socket.on('close', ()=>{
      sockets.delete(s);
      io.iemit('disconnection', s);
    })
    socket.on('message', (data: string) => {
      const { event, args } = JSON.parse(data);
      io.iemit(event, s, ...args);
    })
		io.iemit('connection', s);
	});
  return io;
}

export function getSocket(id: number, sockets: Set<Socket>) {
  return [...sockets].find(socket => socket.id === id);
}