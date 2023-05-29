import { URL } from "../types"

const defaultIMG:URL = 'https://cdn.discordapp.com/avatars/836361416020590642/11822b8039d7a3182a9cb464ccd0930d.webp'
export const SERVER = {
  NAME: 'My Server',
  ICON: defaultIMG,
}

export const ROL = {
  NAME: 'New Rol',
  COLOR: '#ff0000',
}

export const CATEGORY = {
  NAME: 'New Category',
}

export const CHANNEL = {
  NAME: 'New Channel',
  TYPE: 'TEXT' as 'TEXT',
  AUTHORIZED_DEFAULT: true,
}

export const USER = {
  AVATAR: defaultIMG,
}