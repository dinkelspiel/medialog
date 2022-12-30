import path from 'path';
import { promises as fs } from 'fs';
import type { Media, MediaSeason } from "./types"

export async function get_data(): {[key: string]: Media} {
  const jsonDirectory = path.join(process.cwd(), 'data');
  const fileContents = await fs.readFile(jsonDirectory + '/data.json', 'utf8');
  return JSON.parse(fileContents)
}

export async function set_data(data: {[key: string]: Media}) {
  let date = new Date().toUTCString().substring(5, new Date().toUTCString().length - 4).replaceAll(" ", "-");

  const dataDirectory = path.join(process.cwd(), 'data');
  const backupDirectory = path.join(process.cwd(), 'data', 'backup');
  
  await fs.writeFile(backupDirectory + `/data-${date}.json`, JSON.stringify(await get_data()));
  await fs.writeFile(dataDirectory + '/data.json', JSON.stringify(data));
}