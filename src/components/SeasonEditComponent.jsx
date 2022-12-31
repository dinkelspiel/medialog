import React from 'react'
import styles from "./seasons.module.css"
import { Button, IconButton, MenuItem, Select, TextField } from '@mui/material'
import { Delete, FormatListBulleted, Settings } from '@mui/icons-material'

const SeasonEditComponent = (props) => {
    

    function saveEditMedia() {
        let new_data = JSON.parse(JSON.stringify(props.editableData))
        if(Object.keys(new_data).includes(props.name.toLowerCase()) && props.name.toLowerCase() != props.editMedia) {
          props.setError("Name already exists!");
        }
    
        // console.log(editMedia)
        // console.log(editMediaName.toLowerCase())
    
        new_data[props.name.toLowerCase()] = new_data[props.editMedia];
        new_data[props.name.toLowerCase()]["disname"] = props.name; 
        new_data[props.name.toLowerCase()]["category"] = props.category; 
        new_data[props.name.toLowerCase()]["cover_url"] = props.coverUrl;
        
        if(props.editMedia != props.name.toLowerCase()) {
          delete new_data[props.editMedia];
        }
        props.setEditMedia(props.name.toLowerCase())
    
        console.log(new_data)
    
        props.setEditableData(new_data)
        console.log("Edited Media")
    
        props.setCategory("series")
        props.setCoverUrl("")
        props.setName("")
        props.setError("")
        props.setSeasonState(0)
      }
    
      function deleteMedia(media) {
            let new_data = JSON.parse(JSON.stringify(props.editableData))
            delete new_data[media]
            props.setEditableData(new_data)
            console.log("Deleted Media")
            props.setEditMedia("")
      }

    return (
        <div>
            <div className={styles.title}>
                Name
            </div>
            <TextField className={styles.filter_input} value={props.name} onChange={(e) => props.setName(e.target.value)}/>

            <div className={styles.title}>
                Category
            </div>
            <Select 
                value={props.category}
                onChange={(e) => {props.setCategory(e.target.value);}}
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
            <TextField className={styles.filter_input} value={props.coverUrl} onChange={(e) => props.setCoverUrl(e.target.value)}/>

            <div className={styles.error}>
                {props.error}
            </div>

            <Button className={styles.create_button} style={{marginBottom: "20px"}} variant="outlined" onClick={() => saveEditMedia()}>Save</Button>
            <Button className={styles.delete_button} startIcon={<Delete />} variant="outlined" onClick={() => deleteMedia(props.editMedia)}>Delete</Button>
        </div>
    )
}

export default SeasonEditComponent