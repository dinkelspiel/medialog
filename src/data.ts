import path from 'path';
import { promises as fs } from 'fs';

export async function get_data() {
  const jsonDirectory = path.join(process.cwd(), 'data');
  const fileContents = await fs.readFile(jsonDirectory + '/data.json', 'utf8');
  let parsed = {}
  try {
    parsed = JSON.parse(fileContents);
  } catch {
    parsed = {"err": "no"}
  }
  return parsed
}

export async function set_data(data: object) {
  let date = new Date().toUTCString().substring(5, new Date().toUTCString().length - 4).replaceAll(" ", "-");

  const dataDirectory = path.join(process.cwd(), 'data');
  const backupDirectory = path.join(process.cwd(), 'data', 'backup');

  await fs.writeFile(backupDirectory + `/data-${date}.json`, JSON.stringify(await get_data()));
  await fs.writeFile(dataDirectory + '/data.json', JSON.stringify(data));
}