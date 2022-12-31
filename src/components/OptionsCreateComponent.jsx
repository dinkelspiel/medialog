import { Add, Tune } from '@mui/icons-material'
import { IconButton, MenuItem, Switch, TextField, Select, Button } from '@mui/material'
import React, { useState } from 'react'
import styles from "./options.module.css"

const OptionsCreateComponent = (props) => {

    let [name, setName] = useState("");
    let [category, setCategory] = useState("series");
    let [coverUrl, setCoverUrl] = useState("");

    function createMedia() {
        let new_data = JSON.parse(JSON.stringify(props.editableData))
        new_data[name.toLowerCase()] = {
          "disname": name,
          "cover_url": coverUrl,
          "category": category,
          "seasons": {}
        };
        props.setEditableData(new_data)
        console.log("Created Media")
    
        setName("")
        setCoverUrl("")
        setCategory("series")
    }

    return (
        <div>
            <div className={styles.title}>
                Name
            </div>
            <TextField className={styles.filter_input} placeholder="Breaking Bad" value={name} onChange={(e) => setName(e.target.value)} />

            <div className={styles.title}>
                Category
            </div>
            <Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
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
            <TextField className={styles.filter_input} placeholder="https://imgur..." value={coverUrl} onChange={(e) => setCoverUrl(e.target.value)} />

            <Button className={styles.create_button} variant="outlined" size="large" startIcon={<Add />} onClick={() => createMedia()}>Create Media</Button>
        </div>
    )
}

export default OptionsCreateComponent