import { isDirectory, isFile } from "@agacraft/fs";
import { DataBase } from "../../DataBase";
import { WagaResponse, WagaRequest, WagaNext } from 'waga/dist/types'
import { HTML_FILE, JS_PATH, LOGIN_FILE, REGISTER_FILE, STYLES_PATH } from "./consts";

function Static(path:string) {
  return (req:WagaRequest, res:WagaResponse, next: WagaNext) => {
    const  url = req.params['*'];
    const route = `${path}/${url}`;
    if(isFile(route)) res.sendFile(route)
    else if(isFile(`${route}.html`)) res.sendFile(`${route}.html`)
    else if(isDirectory(route) && isFile(`${route}/index.html`)) res.sendFile(`${route}/index.html`)
    else next()
  }
}

export default function (db:DataBase){
  return {
    default(req:WagaRequest, res:WagaResponse) {
      if(req.params.server === '@me') return res.send('Server @me is not implemented yet')
      res.sendFile(HTML_FILE)
    },
    login(req:WagaRequest, res:WagaResponse) {
      res.sendFile(LOGIN_FILE)
    },
    register(req:WagaRequest, res:WagaResponse) {
      res.sendFile(REGISTER_FILE)
    },
    js: Static(`${JS_PATH}/`),
    styles: Static(`${STYLES_PATH}/`),
    attachments(req:WagaRequest, res:WagaResponse, next:WagaNext) {
      let route = `${req.params['*']}`
      if(!route) return next()
      if(route === 'BOT') route = '817460175191146563/1049889649172156536/vot.PNG'
      else if(route === 'BOT-VERIFIED') route = '817460175191146563/1050237979223920670/vot.PNG'
      res.redirect(`https://cdn.discordapp.com/attachments/${route}`)
    },
    images(req:WagaRequest, res:WagaResponse, next:WagaNext) {
      let route = `${req.params['*']}`
      if(!route) return next()
      if(route === 'Global-Server') route = 'https://cdn-icons-png.flaticon.com/512/975/975645.png'
      else if(route === 'Add-Server') route = 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Medical_hospitalclinic_noemergency_beds.svg/120px-Medical_hospitalclinic_noemergency_beds.svg.png'
      else if(route === 'User-Default') route = 'https://discord.com//assets/1f0bfc0865d324c2587920a7d80c609b.png'
      else if(route === 'Server-Default') route = '/images/User-Default'
      res.redirect(route)
    }
  }
}