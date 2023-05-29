import { WagaRequest, WagaResponse } from 'waga/dist/types';
import { DataBase } from '../../../DataBase';
import { User } from '../../../DataBase/types';

import { getUser } from '../../utils/auth';
import { getBody } from '../../utils/bodyData';
import { getServersFromUser } from '../../../DataBase/utils/get';
import { deleteKeys } from '../../../utils/object';
import InternalErrors, { InternalError } from '../../../utils/internalErrors';

type Credentials = User['#private'];
type CredentialsBody = { credentials: Credentials };

export default function (db: DataBase) {
  return {
    user(req: WagaRequest, res: WagaResponse) {
      const { credentials } = getBody(res, req.body) as CredentialsBody;
      const userId = req.params.id;
      if(!userId) return res.status(400).json(InternalErrors.USER_NOT_DETECTED);
      const User = db.users.get(+userId);
      if(!User) return res.status(404).json(InternalErrors.USER_NOT_FOUND);
      const LoginUser = getUser(res, db, credentials);
      if((LoginUser as InternalError).error) return res.json(LoginUser);
      const loginUser = LoginUser as User;
      if(loginUser.id === User.id) return res.json(loginUser);
      const Servers = getServersFromUser(db, loginUser).find(server => server.members.find(member => member.id === User.id));
      if(!Servers) return res.status(404).json(InternalErrors.USER_NOT_FOUND);
      res.json(deleteKeys(User, ['#private']));
    }
  }
}