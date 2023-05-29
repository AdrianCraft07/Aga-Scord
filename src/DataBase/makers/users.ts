import {DataBase} from "..";
import { NoDiscriminatorFound } from "../../utils/Errors";
import { makeToken, randomNumber } from "../../utils/Random";
import { Bot, Person, User } from "../types";
import { USER } from "./consts";

const ValidDiscriminators = Array.from({length: 9999}, (_, i) => (i+1).toString().padStart(4, '0')); // ['0001', ..., '9999']

function searchValidDiscriminator(db: DataBase, name: string) {
  const discriminatorUsers = db.users.getAll().filter(u => u.name === name);
  const discriminator = ValidDiscriminators.find(d => !discriminatorUsers.some(u => u.discriminator === d));
  if(!discriminator) throw new NoDiscriminatorFound(`No discriminator found for ${name}`);
  return discriminator as User['discriminator'];
}
function getDiscriminator(db: DataBase, name: string, i = 0) {
  if(i > 10) return searchValidDiscriminator(db, name);
  const discriminatorUsers = db.users.getAll().filter(u => u.name === name);
  const random = Math.floor(Math.random() * 9999);
  if(random > 9999) return getDiscriminator(db, name, i + 1);
  const discriminator = random.toString().padStart(4, '0');
  if(discriminatorUsers.some(u => u.discriminator === discriminator)) return getDiscriminator(db, name, i + 1);
  return discriminator as User['discriminator'];
}

export function makePerson(db: DataBase, credentials: Person['#private'], name:string): Person {
  return {
    id: Date.now(),
    name,
    '#private': credentials,
    avatar: USER.AVATAR,
    discriminator: getDiscriminator(db, name),
    bot: false,
  }
}

export function makeBot(db: DataBase, author: number, name: string): Bot{
  return {
    id: Date.now(),
    name,
    '#private': {
      author,
      token: makeToken(50, randomNumber(1, 5), makeToken.charList),
    },
    avatar: USER.AVATAR,
    discriminator: '0000',
    bot: true,
    verified: false,
  }
}