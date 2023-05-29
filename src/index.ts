import { loadConfig } from './utils/config';
loadConfig(`${__dirname}/../config`, 'dev');

const CONFIG = (process as any).proyectConfig as Record<string, any>;

import App from './app';
import db from './DataBase';
import socketApi from './socket/api';

const app = App(db);
const server = app.listen(CONFIG.PORT, port => {
	// the port of the callback is used if the original is 0
	console.log(`Server running on port ${port}`);
});

const io = socketApi(db, server);
