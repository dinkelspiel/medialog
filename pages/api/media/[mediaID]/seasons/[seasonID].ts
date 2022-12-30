// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { get_data, set_data } from '../../../../../src/data'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{[key: string]: Media}>
) {
  let data: {[key: string]: Media} = await get_data();
  let { mediaID, seasonID } = req.query
  mediaID = String(mediaID).toLowerCase()
  seasonID = String(seasonID).toLowerCase()

  if(!Object.keys(data).includes(mediaID)) {
    res.status(400).send("Invalid mediaID")
  }

  if(!Object.keys(data[mediaID]["seasons"]).includes(seasonID)) {
    res.status(400).send("Invalid seasonID")
  }

  if(req.method == "GET") {
    res.status(200).json(data[mediaID]["seasons"][seasonID]);
  } else if(req.method == "PATCH") {

    let seasonName: string = req.body["name"];
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

    if(seasonName != undefined) {
        data[mediaID]["seasons"][seasonName.toLowerCase()] = data[mediaID]["seasons"][seasonID];
        delete data[mediaID]["seasons"][seasonID];
        let seasonID = seasonName.toLowerCase();
    }

    data[mediaID]["seasons"][seasonID] = {
        "disname": seasonName != undefined  ? seasonName : data[mediaID]["seasons"][seasonID]["disname"],
        "studio": seasonStudio != undefined ? seasonStudio : data[mediaID]["seasons"][seasonID]["studio"],
        "rating": seasonRating != undefined ? Number(seasonRating) : data[mediaID]["seasons"][seasonID]["rating"],
        "notes": seasonNotes != undefined   ? seasonNotes : data[mediaID]["seasons"][seasonID]["notes"]
    }

    set_data(data);

    res.status(201).send("Updated season");
  } else if(req.method == "DELETE") {
    delete data[mediaID][seasonID];
    res.status(200).send("Deleted season");
  } else {
    res.status(400).send("Invalid method")
  }
}
