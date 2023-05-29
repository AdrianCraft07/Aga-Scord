import fs from 'fs'
import { isDirectory, isFile } from '@agacraft/fs'

const p = process as any;

function readPushConfig(path:string){
  const data = fs.readFileSync(path, 'utf8');
  const json = JSON.parse(data);
  const keys = Object.keys(json);
  for(const key of keys){
    p.proyectConfig[key] = json[key];
  }
}

export function loadConfig(configDir:string='..', name:string){
  p.proyectConfig = p.proyectConfig || {};
  if(!isDirectory(configDir)) return;
  if(isFile(`${configDir}/default.json`)) readPushConfig(`${configDir}/default.json`)
  if(isFile(`${configDir}/${name}.json`)) readPushConfig(`${configDir}/${name}.json`);
}