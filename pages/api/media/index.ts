// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { get_data, set_data } from '../../../src/data'
import { Categories } from '../../../src/types';
import ReactJson from '@textea/json-viewer'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{[key: string]: Media}>
) {
  let data: {[key: string]: Media} = await get_data();

  if(req.method == "GET") {
    res.status(200).json(await get_data());
  } else if(req.method == "PUT") {
    if(req.body["name"] == undefined) {
      res.status(400).send("No media name provided in body")
    }
    if(req.body["category"] == undefined) {
      res.status(400).send("No category provided in body")
    }

    let mediaName: string = String(req.body["name"]).toLowerCase();
    let mediaDisplayName: string = String(req.body["name"]);

    let mediaCategory: string = String(req.body["category"]).toLowerCase();

    if(!Categories.includes(mediaCategory)) {
        res.status(400).send("Invalid category")
    }

    if(Object.keys(data).includes(mediaName)) {
      res.status(400).send(`Media '${mediaDisplayName}' already exists`)
    }

    data[mediaName] = {
      "disname": mediaDisplayName,
      "status": "planned",
      "category": mediaCategory,
      "seasons": {}
    }

    set_data(data);

    res.status(201).send("Added media");
  } else {
    res.status(400).send("Invalid method! Did you mean to supply an id? /api/media/xyzw")
  }
}
