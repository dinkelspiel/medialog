import React from 'react'
import styles from "./media.module.css"
import MediaRowComponent from "./MediaRowComponent"

import { ThumbsUpDown, Tv } from '@mui/icons-material'

const MediaContainer = (props) => {

    function getAverageRating(media) {
        if(!Object.keys(props.editableData).includes(media)) {
          return -1;
        }
    
        let totalRating = 0;
    
        Object.keys(props.editableData[media]["seasons"]).forEach((season, idx) => {
          totalRating += parseInt(props.editableData[media]["seasons"][season]["rating"])
        })
    
        return String(totalRating / Object.keys(props.editableData[media]["seasons"]).length) == "NaN" ? -1 : parseInt((totalRating / Object.keys(props.editableData[media]["seasons"]).length).toString())
    }

    return (
        <div className={styles.media_container} ref={props.setRef}> 
            <div className={styles.header}>
                <div className={styles.image_spacer} />
                <div className={styles.name}>
                    Name
                </div>
                <div className={styles.studio}>
                    Studio
                </div>
                <div>
                    <ThumbsUpDown />
                </div>
                <div>
                    <Tv />
                </div>
            </div>
            {
                Object.keys(props.editableData).map((media, idx) => {
                    if(!props.filterCategory.includes(props.editableData[media]["category"]) && String(props.filterCategory) != "") {
                        return;
                    }

                    if((getAverageRating(media) == -1 && props.filterHideUnwatched)) {
                        return;
                    }

                    if(getAverageRating(media) != -1) {
                        if((getAverageRating(media) < props.filterRating[0] || getAverageRating(media) > props.filterRating[1])) { 
                            return;
                        }
                    }

                    if(props.filterHideWatched && getAverageRating(media) != -1) {
                        return;
                    }

                    if(!media.toLowerCase().includes(props.filterName.toLowerCase()) && props.filterName.toLowerCase() != "") {
                        return;
                    }

                    let studio = ""

                    if(Object.keys(props.editableData[media]["seasons"]).length >= 1) {
                        try {
                            studio = props.editableData[media]["seasons"][Object.keys(props.editableData[media]["seasons"])[0]]["studio"]
                        } catch {
                            studio = ""
                        }
                    }

                    return(
                        <MediaRowComponent key={media} {...{...props, ...{media: media, getAverageRating: getAverageRating}}} />
                    )
                })
            }
        </div>
    )
}

export default MediaContainer