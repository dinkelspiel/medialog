// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { get_data, set_data } from '../../../../src/data'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{[key: string]: Media}>
) {
  let data: {[key: string]: Media} = await get_data();
  let { mediaID } = req.query
  mediaID = String(mediaID).toLowerCase()

  if(!Object.keys(data).includes(mediaID)) {
    res.status(400).send("Invalid mediaID")
  }

  if(req.method == "GET") {
    res.status(200).json(data[mediaID]);
  } else if(req.method == "PATCH") {
    let mediaName: string = String(req.body["name"]).toLowerCase();
    let mediaDisplayName: string = String(req.body["name"]);

    let mediaCategory: string = String(req.body["category"]).toLowerCase();

    let mediaStatus: string = String(req.body["status"]).toLowerCase();

    if(req.body["category"] != undefined) {
      data[mediaID]["category"] = mediaCategory;
    }

    if(req.body["status"] != undefined) {
      data[mediaID]["status"] = mediaStatus;
    } 

    if(req.body["name"] != undefined) {
      data[mediaName] = data[mediaID];
      data[mediaName]["disname"] = mediaDisplayName;
      delete data[mediaID];
    }

    res.status(200).send("Updated media");
  } else if(req.method == "DELETE") {
    delete data[mediaID];
    res.status(200).send("Deleted media");
  } else {
    res.status(400).send("Invalid method")
  }
}
