import { WagaRequest, WagaResponse } from 'waga/dist/types';
import { DataBase } from '../../DataBase';
import { Person, User } from '../../DataBase/types';

import { getMessage, getMessages, getUser } from '../utils/auth';
import { getBody } from '../utils/bodyData';
import { getServersFromUser } from '../../DataBase/utils/get';
import { makePerson } from '../../DataBase/makers/users';
import { NoDiscriminatorFound } from '../../utils/Errors';
import InternalErrors, { InternalError } from '../../utils/internalErrors';

type Credentials = User['#private'];
type CredentialsBody = { credentials: Credentials };

export default function (db: DataBase) {
	return {
		user(req: WagaRequest, res: WagaResponse) {
			const { credentials } = getBody(res, req.body) as CredentialsBody;
			const User = getUser(res, db, credentials);
			res.json(User);
		},
		message(req: WagaRequest, res: WagaResponse) {
			const { server, channel, message } = req.params;
			const { credentials } = getBody(res, req.body) as CredentialsBody;
			const User = getUser(res, db, credentials);
			const Message = getMessage(res, db, User, server, channel, message);
			res.json(Message);
		},
		messages(req: WagaRequest, res: WagaResponse) {
			const { server, channel } = req.params;
			const { credentials } = getBody(res, req.body) as CredentialsBody;
			const User = getUser(res, db, credentials);
			const Messages = getMessages(res, db, User, server, channel);
			res.json(Messages);
		},
		servers(req: WagaRequest, res: WagaResponse) {
			const { credentials } = getBody(res, req.body) as CredentialsBody;
			const User = getUser(res, db, credentials) as User;
			res.json(getServersFromUser(db, User));
		},
		register(req: WagaRequest, res: WagaResponse) {
			const { credentials, name } = getBody(res, req.body) as CredentialsBody & { name: string };
			const User = getUser(res, db, credentials);
			if ((User as InternalError).error) {
				try {
					db.users.create(makePerson(db, credentials as Person['#private'], name));
				} catch (error) {
					if (error instanceof NoDiscriminatorFound)
						return res.status(400).json(InternalErrors.DISCRIMINATOR_NOT_FOUND);
				}
			}
			res.json(User);
		},
	};
}
