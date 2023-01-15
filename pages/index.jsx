// import Head from 'next/head'
// import Image from 'next/image'
// import { Inter } from '@next/font/google'
// import styles from '../styles/Home.module.css'
import ThumbsUpDownIcon from '@mui/icons-material/ThumbsUpDown';
import TvIcon from '@mui/icons-material/Tv';
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import { Delete, Tv } from '@mui/icons-material';
import { Media, MediaSeason } from "../src/types"
import Image from 'next/image'

import styles from "./index.module.css"
import data from "../data/data.json"
import { Add, Check, Close, ExpandLess, ExpandMore, MenuBook, Movie, Podcasts, Tune, FormatListBulleted, Settings } from '@mui/icons-material';
import { useRef, useState, useEffect } from 'react';
import { Button, Icon, IconButton, MenuItem, Select, Slider, Switch, TextField } from '@mui/material';

import OptionsContainer from "../src/components/OptionsContainer"
import MediaContainer from "../src/components/MediaContainer"
import SeasonContainer from "../src/components/SeasonContainer"

import useWindowSize from "../src/size"

export default function Home() {

  let [editMedia, setEditMedia] = useState("");

  let [editableData, setEditableData] = useState(JSON.parse(JSON.stringify(data)));

  let [filterName, setFilterName] = useState("");
  let [filterRating, setFilterRating] = useState([0, 100]);
  let [filterCategory, setFilterCategory] = useState([])
  let [filterHideUnwatched, setFilterHideUnwatched] = useState(false);
  let [filterHideWatched, setFilterHideWatched] = useState(false);

  let [sortAfter, setSortAfter] = useState("name")
  let [sortReverse, setSortReverse] = useState(false)

  let [seasonState, setSeasonState] = useState(0)
  let [mobileState, setMobileState] = useState(1)

  async function set_data_from_editable() {
    let res = fetch('/api/data', {
      method: 'PUT',
      body: JSON.stringify({
        data: editableData
      })
    })
    console.log(await (await res).text())
  }

  function handleNavbar(clickedIcon) {
    if(size.width > 830) {
      window.scrollTo({
        top: clickedIcon == "options" ? optionsContainerRef.current.offsetTop - 20 : clickedIcon == "media" ? mediaContainerRef.current.offsetTop - 20 : clickedIcon == "seasons" ? seasonsContainerRef.current.offsetTop - 20 : 0,
        behavior: "smooth"
      });
    } else {
      switch(clickedIcon) {
        case "options":
          setMobileState(0)
          break
        case "media":
          setMobileState(1)
          break
        case "seasons":
          setMobileState(2)
          break
      }
    }
  }

  let seasonsContainerRef = useRef(null)
  let mediaContainerRef = useRef(null)
  let optionsContainerRef = useRef(null)

  let size = useWindowSize();
  
  return (
    <div>
      { JSON.stringify(data) != JSON.stringify(editableData) ?
        <div className={styles.change_container}>
          Update Saved Data? <IconButton onClick={async () => {await set_data_from_editable()}}><Check /></IconButton> <IconButton onClick={() => {setEditableData(JSON.parse(JSON.stringify(data)))}}><Close /></IconButton>
        </div> : ""
      }
      
      { size.width < 1370 ?
        <div className={styles.navbar}>
          <div className={styles.container}>
            <IconButton onClick={() => handleNavbar("options")} className={styles.button}><Add className={styles.icon} /></IconButton>
            <IconButton onClick={() => handleNavbar("media")} className={styles.button}><Tv className={styles.icon} /></IconButton>
            <IconButton onClick={() => handleNavbar("seasons")} className={styles.button}><Settings className={styles.icon} /></IconButton>
          </div>
        </div> : ""
      }

      { size.width > 830 ?
        <div className={styles.wrapper}>
          <OptionsContainer {...{
            filterProps: {
              filterName: filterName,
              setFilterName: setFilterName,

              filterRating: filterRating,
              setFilterRating: setFilterRating,

              filterCategory: filterCategory,
              setFilterCategory: setFilterCategory,

              filterHideUnwatched: filterHideUnwatched,
              setFilterHideUnwatched: setFilterHideUnwatched,

              filterHideWatched: filterHideWatched,
              setFilterHideWatched: setFilterHideWatched
            },
            createProps: {
              editableData: editableData,
              setEditableData: setEditableData
            },
            sortProps: {
              sortAfter: sortAfter,
              setSortAfter: setSortAfter,

              sortReverse: sortReverse,
              setSortReverse: setSortReverse
            },
            setRef: optionsContainerRef
          }}/>

          <MediaContainer {...{
            setRef: mediaContainerRef,

            filterName: filterName,
            filterCategory: filterCategory,
            filterHideUnwatched: filterHideUnwatched,
            filterHideWatched: filterHideWatched,
            filterRating: filterRating,

            editableData: editableData,

            editMedia: editMedia,
            setEditMedia: setEditMedia,

            setSeasonState: setSeasonState,

            sortAfter: sortAfter,
            sortReverse: sortReverse
          }} />

          <SeasonContainer {...{
            setRef: seasonsContainerRef,

            editMedia: editMedia,
            setEditMedia: setEditMedia,

            seasonState: seasonState,
            setSeasonState: setSeasonState,

            editableData: editableData,
            setEditableData: setEditableData
          }} />
        </div>
        :
        <div className={styles.wrapper}>
          {
            mobileState == 0 ?
              <OptionsContainer {...{
                filterProps: {
                  filterName: filterName,
                  setFilterName: setFilterName,
    
                  filterRating: filterRating,
                  setFilterRating: setFilterRating,
    
                  filterCategory: filterCategory,
                  setFilterCategory: setFilterCategory,
    
                  filterHideUnwatched: filterHideUnwatched,
                  setFilterHideUnwatched: setFilterHideUnwatched,
    
                  filterHideWatched: filterHideWatched,
                  setFilterHideWatched: setFilterHideWatched
                },
                createProps: {
                  editableData: editableData,
                  setEditableData: setEditableData
                },
                setRef: optionsContainerRef
              }}/> : mobileState == 1 ?  
              <MediaContainer {...{
                setRef: mediaContainerRef,
    
                filterName: filterName,
                filterCategory: filterCategory,
                filterHideUnwatched: filterHideUnwatched,
                filterHideWatched: filterHideWatched,
                filterRating: filterRating,
    
                editableData: editableData,
    
                editMedia: editMedia,
                setEditMedia: setEditMedia,
    
                setSeasonState: setSeasonState,

                setMobileState: setMobileState
              }} /> : mobileState == 2 ? <SeasonContainer {...{
                setRef: seasonsContainerRef,
    
                editMedia: editMedia,
                setEditMedia: setEditMedia,
    
                seasonState: seasonState,
                setSeasonState: setSeasonState,
    
                editableData: editableData,
                setEditableData: setEditableData
              }} /> : ""
          }
        </div>
      }

    </div>
  )
}