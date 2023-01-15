import React from 'react'
import { Add, Tune } from '@mui/icons-material'
import { IconButton, MenuItem, Switch, TextField, Select, Button, Slider } from '@mui/material'
import styles from "./options.module.css"

const OptionsSortComponent = (props) => {
  return (
    <div>
        <div className={styles.title}>
            Sort After
        </div>
        <Select 
            value={props.sortAfter}
            onChange={(e) => {props.setSortAfter(e.target.value);}}
            className={styles.filter_input}
        >
            <MenuItem value={"name"}>Name</MenuItem>
            <MenuItem value={"studio"}>Studio</MenuItem>
            <MenuItem value={"rating"}>Rating</MenuItem>
            <MenuItem value={"category"}>Category</MenuItem>
        </Select>

        <div>
            <div className={styles.title}>
                Reverse
            </div>
            <div className={styles.filter_input}>
                <Switch checked={props.sortReverse} onChange={(e) => {props.setSortReverse(e.target.checked)}}/>
            </div>
        </div>
    </div>
  )
}

export default OptionsSortComponent