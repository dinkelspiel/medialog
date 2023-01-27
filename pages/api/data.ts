// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { get_data, set_data } from '../../src/data'
import { Categories } from '../../src/types';
import ReactJson from '@textea/json-viewer'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  let data = await get_data();

  if(req.method == "GET") {
    if(req.query.password == process.env.PASSWORD) {
      let obj = await get_data();
      res.status(200).json(obj);
    } else {
      res.status(400).send("Invalid Password")
    }
  } else if(req.method == "PUT") {
    if(req.query.password == process.env.PASSWORD) {
      if(JSON.parse(req.body)["data"] == undefined) {
          res.status(400).send("No data provided in body")
      }

      let new_data = JSON.parse(req.body)["data"];

      set_data(new_data);

      res.status(201).send("Set Data");
    } else {
      res.status(400).send("Invalid Password")
    }
  } else {
    res.status(400).send("Invalid method!")
  }
}
