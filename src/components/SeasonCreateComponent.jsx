import { Add } from '@mui/icons-material'
import { Button, Slider, TextField } from '@mui/material'
import React, { useState } from 'react'
import styles from "./seasons.module.css"

import SeasonComponent from "./SeasonComponent"

const SeasonCreateComponent = (props) => {

    let [name, setName] = useState("")
    let [studio, setStudio] = useState("")
    let [rating, setRating] = useState(0)
    let [notes, setNotes] = useState("")

    let [expandedSeason, setExpandedSeason] = useState("")

    function createSeason(media) {
        let new_data = JSON.parse(JSON.stringify(props.editableData))
        new_data[media]["seasons"][name.toLowerCase()] = {
            "disname": name,
            "rating": rating,
            "studio": studio,
            "notes": notes
        };
        props.setEditableData(new_data)
        console.log("Created Season")

        setName("")
        setNotes("")
        setRating(-1)
        setStudio("")
    }

    return (
        <div>
            <div className={styles.seasons}>
                {
                    Object.keys(props.editableData[props.editMedia]["seasons"]).map((val, idx) => {

                    return (
                        <div key={props.editMedia + val}>
                            <SeasonComponent {...{...props, ...{val: val, expandedSeason: expandedSeason, setExpandedSeason: setExpandedSeason}}} />
                        </div>
                    )
                    })
                }
                </div>
            <div className={styles.scontainer}>
                <div className={styles.title}>
                    Name
                </div>
                <TextField className={styles.filter_input} placeholder="Season 1" value={name} onChange={(e) => setName(e.target.value)}/>

                <div className={styles.title}>
                    Rating ({rating})
                </div>
                <Slider value={rating} onChange={(e) => setRating(e.target.value)} min={-1}/>

                <div className={styles.title}>
                    Studio
                </div>
                <TextField className={styles.filter_input} placeholder="Netflix" value={studio} onChange={(e) => setStudio(e.target.value)}/>

                <div className={styles.title}>
                    Notes
                </div>
                <TextField
                    multiline
                    rows={5}
                    fullWidth
                    className={styles.create_notes}
                    value={notes}
                    placeholder="I liked this because..."
                    onChange={(e) => setNotes(e.target.value)}
                />

                <Button className={styles.create_button} startIcon={<Add />} variant="outlined" onClick={() => createSeason(props.editMedia)}>Create Season</Button>
            </div>
        </div>
    )
}

export default SeasonCreateComponent