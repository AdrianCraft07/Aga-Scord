import waga from 'waga';

import { DataBase } from './DataBase';
import apiRouter from './services/api/routes';
import pagesRouter from './services/pages/routes';

const app = waga();

export default function (db: DataBase) {
	return app
		.use(waga.json)
		.use('api', apiRouter(db))
		.use(pagesRouter(db));
}
