import React, { useState } from 'react'
import styles from "./seasons.module.css"

import SeasonCreateComponent from "./SeasonCreateComponent"
import SeasonEditComponent from "./SeasonEditComponent"
import { Button, IconButton, MenuItem, Select, TextField } from '@mui/material'
import { Delete, FormatListBulleted, Settings } from '@mui/icons-material'

const SeasonContainer = (props) => {

    let [name, setName] = useState("")
    let [category, setCategory] = useState("series")
    let [coverUrl, setCoverUrl] = useState("")
    let [error, setError] = useState("")

    return (
    <div>
        {
            props.editMedia != "" ?
            <div className={styles.season_container} ref={props.setRef}>
                <div className={styles.header}>
                <div className={styles.item}>
                    <div className={styles.icon_button}><IconButton onClick={() => {props.setSeasonState(0)}}><FormatListBulleted /></IconButton></div>
                    { props.seasonState == 0 ?
                    <div className={styles.selected_item} /> : ""
                    }
                </div>
                <div className={styles.item}>
                    <div className={styles.icon_button}><IconButton onClick={() => {props.setSeasonState(1); setName(props.editableData[props.editMedia]["disname"]); setCategory(props.editableData[props.editMedia]["category"]); setCoverUrl(props.editableData[props.editMedia]["cover_url"])}}><Settings /></IconButton></div>
                    { props.seasonState == 1 ?
                    <div className={styles.selected_item} /> : ""
                    }
                </div>
                </div>
                { props.seasonState == 0 ? <SeasonCreateComponent {...props} />
                : <SeasonEditComponent {...{...props, ...{name: name, setName: setName, category, setCategory, coverUrl, setCoverUrl, error, setError}}} />
                }
            </div> : <div className={styles.season_container}  ref={props.setRef}/>
        }
    </div>
  )
}

export default SeasonContainer