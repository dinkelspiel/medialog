// import Head from 'next/head'
// import Image from 'next/image'
// import { Inter } from '@next/font/google'
// import styles from '../styles/Home.module.css'
import ThumbsUpDownIcon from '@mui/icons-material/ThumbsUpDown';
import TvIcon from '@mui/icons-material/Tv';
import { Delete } from '@mui/icons-material';
import { Media, MediaSeason } from "../src/types"
import Image from 'next/image'

import styles from "./index.module.css"
import data from "../data/data.json"
import { Add, Check, Close, ExpandLess, ExpandMore, MenuBook, Movie, Podcasts, Tune, FormatListBulleted, Settings } from '@mui/icons-material';
import { useState } from 'react';
import { Button, Icon, IconButton, MenuItem, Select, Slider, Switch, TextField } from '@mui/material';

export default function Home() {

  let [editMedia, setEditMedia] = useState("");
  let [editMediaExpanded, setEditMediaExpanded] = useState("");

  let [editableData, setEditableData] = useState(JSON.parse(JSON.stringify(data)));

  let [filterName, setFilterName] = useState("");
  let [filterRating, setFilterRating] = useState([0, 100]);
  let [filterCategory, setFilterCategory] = useState([])
  let [filterHideUnwatched, setFilterHideUnwatched] = useState(false);
  let [filterHideWatched, setFilterHideWatched] = useState(false);

  let [optionsState, setOptionsState] = useState(1)
  let [seasonState, setSeasonState] = useState(0)

  let [createSeasonName, setCreateSeasonName] = useState("")
  let [createSeasonRating, setCreateSeasonRating] = useState(-1)
  let [createSeasonStudio, setCreateSeasonStudio] = useState("")
  let [createSeasonNotes, setCreateSeasonNotes] = useState("")

  let [createMediaName, setCreateMediaName] = useState("")
  let [createMediaCategory, setCreateMediaCategory] = useState("series")
  let [createMediaCoverURL, setCreateMediaCoverURL] = useState("")

  let [editMediaName, setEditMediaName] = useState("")
  let [editMediaCategory, setEditMediaCategory] = useState("series")
  let [editMediaCoverURL, setEditMediaCoverURL] = useState("")
  let [editMediaError, setEditMediaError] = useState("")

  function getAverageRating(media) {
    if(!Object.keys(editableData).includes(media)) {
      return -1;
    }

    let totalRating = 0;

    Object.keys(editableData[media]["seasons"]).forEach((season, idx) => {
      totalRating += parseInt(editableData[media]["seasons"][season]["rating"])
    })

    return String(totalRating / Object.keys(editableData[media]["seasons"]).length) == "NaN" ? -1 : parseInt((totalRating / Object.keys(editableData[media]["seasons"]).length).toString())
  }

  function getCategoryIcon(category) {
    switch(category) {
      case "series":
        return <TvIcon />
      case "movie":
        return <Movie />
      case "podcast":
        return <Podcasts />
      case "book":
        return <MenuBook />
    }
  }

  function handleCustomInput(e, subcategory, season) {
    let new_data = {}; new_data[editMedia] = editableData[editMedia];
    new_data[editMedia]["seasons"][season][subcategory] = e.target.value;

    setEditableData({...editableData, ...new_data})
  }

  async function set_data_from_editable() {
    let res = fetch('/api/data', {
      method: 'PUT',
      body: JSON.stringify({
        data: editableData
      })
    })
    console.log(await (await res).text())
  }

  const handleChangeRating = (event, newValue) => {
    setFilterRating(newValue);
  };

  function handleChangeName(event) {    setFilterName(event.target.value);  }

  function deleteSeason(media, season) {
    let new_data = JSON.parse(JSON.stringify(editableData))
    delete new_data[media]["seasons"][season]
    setEditableData(new_data)
    console.log("Deleted Season")
  }

  function createSeason(media) {
    let new_data = JSON.parse(JSON.stringify(editableData))
    new_data[media]["seasons"][createSeasonName.toLowerCase()] = {
      "disname": createSeasonName,
      "rating": createSeasonRating,
      "studio": createSeasonStudio,
      "notes": createSeasonNotes
    };
    setEditableData(new_data)
    console.log("Created Season")

    setCreateSeasonName("")
    setCreateSeasonNotes("")
    setCreateSeasonRating(-1)
    setCreateSeasonStudio("")
  }

  function createMedia() {
    let new_data = JSON.parse(JSON.stringify(editableData))
    new_data[createMediaName.toLowerCase()] = {
      "disname": createMediaName,
      "cover_url": createMediaCoverURL,
      "category": createMediaCategory,
      "seasons": {}
    };
    setEditableData(new_data)
    console.log("Created Media")

    setCreateMediaName("")
    setCreateMediaCoverURL("")
    setCreateMediaCategory("series")
  }

  function saveEditMedia() {
    let new_data = JSON.parse(JSON.stringify(editableData))
    if(Object.keys(new_data).includes(editMediaName.toLowerCase())) {
      setEditMediaError("Name already exists!");
    }

    // console.log(editMedia)
    // console.log(editMediaName.toLowerCase())

    new_data[editMediaName.toLowerCase()] = new_data[editMedia];
    new_data[editMediaName.toLowerCase()]["disname"] = editMediaName; 
    new_data[editMediaName.toLowerCase()]["category"] = editMediaCategory; 
    new_data[editMediaName.toLowerCase()]["cover_url"] = editMediaCoverURL;
    
    if(editMedia != editMediaName.toLowerCase()) {
      delete new_data[editMedia];
    }
    setEditMedia(editMediaName.toLowerCase())

    console.log(new_data)

    setEditableData(new_data)
    console.log("Edited Media")

    setEditMediaCategory("")
    setEditMediaCoverURL("")
    setEditMediaName("")
    setEditMediaError("")
    setSeasonState(0)
  }

  function deleteMedia(media) {
    let new_data = JSON.parse(JSON.stringify(editableData))
    delete new_data[media]
    setEditableData(new_data)
    console.log("Deleted Media")
    setEditMedia("")
  }

  return (
    <div className={styles.wrapper}>
      { JSON.stringify(data) != JSON.stringify(editableData) ?
        <div className={styles.change_container}>
          Update Saved Data? <IconButton onClick={async () => {await set_data_from_editable()}}><Check /></IconButton> <IconButton onClick={() => {setEditableData(JSON.parse(JSON.stringify(data)))}}><Close /></IconButton>
        </div> : ""
      }
      <div className={styles.options_container}>
        <div className={styles.header}>
          <div className={styles.item}>
            <div className={styles.icon_button}><IconButton onClick={() => {setOptionsState(0)}}><Add /></IconButton></div>
            { optionsState == 0 ?
              <div className={styles.selected_item} /> : ""
            }
          </div>
          <div className={styles.item}>
            <div className={styles.icon_button}><IconButton onClick={() => {setOptionsState(1)}}><Tune /></IconButton></div>
            { optionsState == 1 ?
              <div className={styles.selected_item} /> : ""
            }
          </div>
        </div>

        { optionsState == 1 ?
          <div>
            <div className={styles.title}>
              Name
            </div>
            <TextField className={styles.filter_input} placeholder="Breaking Bad" value={filterName} onChange={handleChangeName} />

            <div className={styles.title}>
              Rating
            </div>
            <div className={styles.filter_range}>
              <Slider value={filterRating} onChange={handleChangeRating}/>
            </div>

            <div className={styles.title}>
              Category
            </div>
            <Select 
              value={filterCategory}
              onChange={(e) => {setFilterCategory(e.target.value);}}
              multiple
              className={styles.filter_input}
            >
              <MenuItem value={"series"}>Series</MenuItem>
              <MenuItem value={"movie"}>Movie</MenuItem>
              <MenuItem value={"book"}>Book</MenuItem>
              <MenuItem value={"podcast"}>Podcast</MenuItem>
            </Select>

            <div className={styles.title}>
              Hide Unwatched
            </div>
            <div className={styles.filter_input}>
              <Switch checked={filterHideUnwatched} onChange={(e) => {setFilterHideUnwatched(e.target.checked)}}/>
            </div>

            <div className={styles.title}>
              Hide Watched
            </div>
            <div className={styles.filter_input}>
              <Switch checked={filterHideWatched} onChange={(e) => {setFilterHideWatched(e.target.checked)}}/>
            </div>
          </div>
          :
          <div>
            <div className={styles.title}>
              Name
            </div>
            <TextField className={styles.filter_input} placeholder="Breaking Bad" value={createMediaName} onChange={(e) => setCreateMediaName(e.target.value)} />

            <div className={styles.title}>
              Category
            </div>
            <Select
              value={createMediaCategory}
              onChange={(e) => setCreateMediaCategory(e.target.value)}
              className={styles.filter_input}
            >
              <MenuItem value={"series"}>Series</MenuItem>
              <MenuItem value={"movie"}>Movie</MenuItem>
              <MenuItem value={"book"}>Book</MenuItem>
              <MenuItem value={"podcast"}>Podcast</MenuItem>
            </Select>

            <div className={styles.title}>
              Cover url
            </div>
            <TextField className={styles.filter_input} placeholder="https://imgur..." value={createMediaCoverURL} onChange={(e) => setCreateMediaCoverURL(e.target.value)} />

            <Button className={styles.create_button} variant="outlined" size="large" startIcon={<Add />} onClick={() => createMedia()}>Create Media</Button>
          </div>
      }

      </div>
      <div className={styles.media_container}> 
        <div className={styles.header}>
          <div className={styles.image_spacer} />
          <div className={styles.name}>
            Name
          </div>
          <div className={styles.studio}>
            Studio
          </div>
          <div>
            <ThumbsUpDownIcon />
          </div>
          <div>
            <TvIcon />
          </div>
        </div>
        {
          Object.keys(editableData).map((media, idx) => {
            if(!filterCategory.includes(editableData[media]["category"]) && String(filterCategory) != "") {
              return;
            }

            if((getAverageRating(media) == -1 && filterHideUnwatched)) {
              return;
            }

            if(getAverageRating(media) != -1) {
              if((getAverageRating(media) < filterRating[0] || getAverageRating(media) > filterRating[1])) { 
                return;
              }
            }

            if(filterHideWatched && getAverageRating(media) != -1) {
              return;
            }

            if(!media.toLowerCase().includes(filterName.toLowerCase()) && filterName.toLowerCase() != "") {
              return;
            }

            let studio = ""

            if(Object.keys(editableData[media]["seasons"]).length >= 1) {
              try {
                studio = editableData[media]["seasons"][Object.keys(editableData[media]["seasons"])[0]]["studio"]
              } catch {
                studio = ""
              }
            }

            return(
              <div key={media} className={styles.row} onClick={() => { setEditMedia(media); setSeasonState(0) }}>
                { editMedia == media ?
                  <div className={styles.selected} />
                  : ""
                }
                <img className={styles.image_spacer} src={editableData[media]["cover_url"] != undefined ? editableData[media]["cover_url"] : ""} height="64" width="64" />
                <div className={styles.name}>
                  {editableData[media]["disname"]}
                </div>
                <div className={styles.studio}>
                  {studio}
                </div>
                <div className={styles.rating}>
                  {getAverageRating(media) != -1 ? getAverageRating(media) : ""}
                </div>
                <div className={styles.category}>
                  {getCategoryIcon(editableData[media]["category"])}
                </div>
              </div>
            )
          })
        }
      </div>

        {
          editMedia != "" ?
            <div className={styles.season_container}>
              <div className={styles.header}>
                <div className={styles.item}>
                  <div className={styles.icon_button}><IconButton onClick={() => {setSeasonState(0)}}><FormatListBulleted /></IconButton></div>
                  { seasonState == 0 ?
                    <div className={styles.selected_item} /> : ""
                  }
                </div>
                <div className={styles.item}>
                  <div className={styles.icon_button}><IconButton onClick={() => {setSeasonState(1); setEditMediaName(editableData[editMedia]["disname"]); setEditMediaCategory(editableData[editMedia]["category"]); setEditMediaCoverURL(editableData[editMedia]["cover_url"])}}><Settings /></IconButton></div>
                  { seasonState == 1 ?
                    <div className={styles.selected_item} /> : ""
                  }
                </div>
              </div>
              { seasonState == 0 ?
                <div>
                  <div className={styles.seasons}>
                    {/* {console.log(editableData[editMedia])} */}
                    {
                      Object.keys(editableData[editMedia]["seasons"]).map((val, idx) => {

                        return (
                          <div key={editMedia + val}>
                            <div className={styles.season_header} onClick={() => {editMediaExpanded != val ? setEditMediaExpanded(val) : setEditMediaExpanded("")}}>
                              <input className={styles.season_title} value={editableData[editMedia]["seasons"][val]["disname"]} onInput={(e) => {handleCustomInput(e, "studio", val)}} />
                              {
                                editMediaExpanded == val ?
                                  <ExpandLess />
                                  :
                                  <ExpandMore />
                              }
                            </div>
                            { editMediaExpanded == val ?
                              <div className={styles.info}>
                                <div className={styles.row}>
                                  <div className={styles.identifier}>
                                    Rating
                                  </div>
                                  <input className={styles.value} type="number" value={editableData[editMedia]["seasons"][val]["rating"]} onInput={(e) => {handleCustomInput(e, "rating", val)}} />
                                </div>
                                <div className={styles.row}>
                                  <div className={styles.identifier}>
                                    Studio
                                  </div>
                                  <input className={styles.value} value={editableData[editMedia]["seasons"][val]["studio"]} onInput={(e) => {handleCustomInput(e, "studio", val)}} />
                                </div>
                                <div className={styles.row}>
                                  <div className={styles.identifier}>
                                    Notes
                                  </div>
                                </div>
                                <textarea className={styles.value} value={editableData[editMedia]["seasons"][val]["notes"]} onInput={(e) => {handleCustomInput(e, "notes", val)}} />
                                <Button className={styles.delete_button} startIcon={<Delete />} variant="outlined" onClick={() => deleteSeason(editMedia, val)}>Delete</Button>
                              </div> : ""
                            }
                          </div>
                        )
                      })
                    }
                  </div>
                  <div>
                    <div className={styles.title}>
                      Name
                    </div>
                    <TextField className={styles.filter_input} placeholder="Season 1" value={createSeasonName} onChange={(e) => setCreateSeasonName(e.target.value)}/>

                    <div className={styles.title}>
                      Rating ({createSeasonRating})
                    </div>
                    <Slider value={createSeasonRating} onChange={(e) => setCreateSeasonRating(e.target.value)} min={-1}/>

                    <div className={styles.title}>
                      Studio
                    </div>
                    <TextField className={styles.filter_input} placeholder="Netflix" value={createSeasonStudio} onChange={(e) => setCreateSeasonStudio(e.target.value)}/>

                    <div className={styles.title}>
                      Notes
                    </div>
                    <TextField
                      multiline
                      rows={5}
                      fullWidth
                      className={styles.create_notes}
                      value={createSeasonNotes}
                      placeholder="I liked this because..."
                      onChange={(e) => setCreateSeasonNotes(e.target.value)}
                    />

                    <Button className={styles.create_button} startIcon={<Add />} variant="outlined" onClick={() => createSeason(editMedia)}>Create Season</Button>
                  </div>
                </div> :
                <div>
                    <div className={styles.title}>
                      Name
                    </div>
                    <TextField className={styles.filter_input} value={editMediaName} onChange={(e) => setEditMediaName(e.target.value)}/>

                    <div className={styles.title}>
                      Category
                    </div>
                    <Select 
                      value={editMediaCategory}
                      onChange={(e) => {setEditMediaCategory(e.target.value);}}
                      className={styles.filter_input}
                    >
                      <MenuItem value={"series"}>Series</MenuItem>
                      <MenuItem value={"movie"}>Movie</MenuItem>
                      <MenuItem value={"book"}>Book</MenuItem>
                      <MenuItem value={"podcast"}>Podcast</MenuItem>
                    </Select>

                    <div className={styles.title}>
                      Cover url
                    </div>
                    <TextField className={styles.filter_input} value={editMediaCoverURL} onChange={(e) => setEditMediaCoverURL(e.target.value)}/>

                    <div className={styles.error}>
                      {editMediaError}
                    </div>

                    <Button className={styles.create_button} style={{marginBottom: "20px"}} variant="outlined" onClick={() => saveEditMedia()}>Save</Button>
                    <Button className={styles.delete_button} startIcon={<Delete />} variant="outlined" onClick={() => deleteMedia(editMedia)}>Delete</Button>
                </div>
              }
            </div> : <div className={styles.season_container} />
        }
    </div>
  )
}
