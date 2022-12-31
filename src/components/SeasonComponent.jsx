import React from 'react'
import styles from "./seasons.module.css"
import { Delete, ExpandLess, ExpandMore } from '@mui/icons-material'
import { Button } from '@mui/material';

const SeasonComponent = (props) => {

    function handleCustomInput(e, subcategory, season) {
        let new_data = {}; new_data[props.editMedia] = props.editableData[props.editMedia];
        new_data[props.editMedia]["seasons"][season][subcategory] = e.target.value;
    
        props.setEditableData({...props.editableData, ...new_data})
    }

    function deleteSeason(media, season) {
        let new_data = JSON.parse(JSON.stringify(props.editableData))
        delete new_data[media]["seasons"][season]
        props.setEditableData(new_data)
        console.log("Deleted Season")
    }

    return (
        <div>
            <div className={styles.season_header} onClick={() => {props.expandedSeason != props.val ? props.setExpandedSeason(props.val) : props.setExpandedSeason("")}}>
                <input className={styles.season_title} value={props.editableData[props.editMedia]["seasons"][props.val]["disname"]} onInput={(e) => {handleCustomInput(e, "studio", props.val)}} />
                {
                    props.expandedSeason == props.val ?
                    <ExpandLess />
                    :
                    <ExpandMore />
                }
            </div>
            { 
                props.expandedSeason == props.val ?
                <div className={styles.info}>
                    <div className={styles.row}>
                        <div className={styles.identifier}>
                            Rating
                        </div>
                        <input className={styles.value} type="number" value={props.editableData[props.editMedia]["seasons"][props.val]["rating"]} onInput={(e) => {handleCustomInput(e, "rating", props.val)}} />
                    </div>
                    <div className={styles.row}>
                        <div className={styles.identifier}>
                            Studio
                        </div>
                        <input className={styles.value} value={props.editableData[props.editMedia]["seasons"][props.val]["studio"]} onInput={(e) => {handleCustomInput(e, "studio", props.val)}} />
                    </div>
                    <div className={styles.row}>
                        <div className={styles.identifier}>
                            Notes
                        </div>
                    </div>
                    <textarea className={styles.value} value={props.editableData[props.editMedia]["seasons"][props.val]["notes"]} onInput={(e) => {handleCustomInput(e, "notes", props.val)}} />
                    <Button className={styles.delete_button} startIcon={<Delete />} variant="outlined" onClick={() => deleteSeason(props.editMedia, props.val)}>Delete</Button>
                </div> : ""
            }
        </div>
    )
}

export default SeasonComponent