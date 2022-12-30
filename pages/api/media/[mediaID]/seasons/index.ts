// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { get_data, set_data } from '../../../../../src/data'
import { Categories } from '../../../../../src/types';

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
    res.status(200).json(data[mediaID]["seasons"])
  } else if(req.method == "PUT") {

    if(req.body["name"] == undefined) {
        res.status(400).send("No season name provided in body")
    }
    
    let seasonName: string = String(req.body["name"]).toLowerCase();
    let seasonDisplayName: string = String(req.body["name"]);

    let seasonStudio: string = req.body["studio"];
    let seasonRating: string = req.body["rating"];
    let seasonNotes: string = req.body["notes"];

    if(seasonRating != undefined) {
        if(isNaN(seasonRating)) {
            res.status(400).send("Provided rating is not a number")
        }
        if(!(Number(seasonRating) >= 0 && Number(seasonRating) <= 100)) {
            res.status(400).send("Rating must be between 0 and 100 (inclusive)")
        }
    }

    if(Object.keys(data[mediaID]["seasons"]).includes(seasonName)) {
    res.status(400).send(`Season '${seasonDisplayName}' already exists`)
    }

    data[mediaID]["seasons"][seasonName] = {
        "disname": seasonDisplayName,
        "studio": seasonStudio != undefined ? seasonStudio : "",
        "rating": seasonRating != undefined ? Number(seasonRating) : 0,
        "notes": seasonNotes != undefined   ? seasonNotes : ""
    }

    set_data(data);

    res.status(201).send("Added season");
  } else {
    res.status(400).send("Invalid method! Did you mean to supply an id? /api/media/xyzw")
  }
}
