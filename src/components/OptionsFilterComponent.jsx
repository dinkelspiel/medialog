import React, { useState } from 'react'
import { Add, Tune } from '@mui/icons-material'
import { IconButton, MenuItem, Switch, TextField, Select, Button, Slider } from '@mui/material'
import styles from "./options.module.css"

const OptionsFilterComponent = (props) => {
  return (
    <div>
        <div className={styles.title}>
            Name
        </div>
        <TextField className={styles.filter_input} placeholder="Breaking Bad" value={props.filterName} onChange={(e) => props.setFilterName(e.target.value)} />

        <div className={styles.title}>
            Rating
        </div>
        <div className={styles.filter_range}>
            <Slider value={props.filterRating} onChange={(e) => props.setFilterRating(e.target.value)}/>
        </div>

        <div className={styles.title}>
            Category
        </div>
        <Select 
            value={props.filterCategory}
            onChange={(e) => {props.setFilterCategory(e.target.value);}}
            className={styles.filter_input}
        >
            <MenuItem value={"series"}>Series</MenuItem>
            <MenuItem value={"movie"}>Movie</MenuItem>
            <MenuItem value={"book"}>Book</MenuItem>
            <MenuItem value={"podcast"}>Podcast</MenuItem>
        </Select>

        <div className={styles.hide_watched}>
            <div>
                <div className={styles.title}>
                    Hide Unwatched
                </div>
                <div className={styles.filter_input}>
                    <Switch checked={props.filterHideUnwatched} onChange={(e) => {props.setFilterHideUnwatched(e.target.checked)}}/>
                </div>
            </div>

            <div>
                <div className={styles.title}>
                    Hide Watched
                </div>
                <div className={styles.filter_input}>
                    <Switch checked={props.filterHideWatched} onChange={(e) => {props.setFilterHideWatched(e.target.checked)}}/>
                </div>
            </div>
        </div>
    </div>
  )
}

export default OptionsFilterComponent