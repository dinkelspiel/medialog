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
                Object.keys(props.editableData).sort((a, b) => {
                    // console.log(a)
                    const mediaA = a.toUpperCase(); // ignore upper and lowercase
                    const mediaB = b.toUpperCase(); // ignore upper and lowercase
                    switch(props.sortAfter) {
                    case "name":
                        if(props.sortReverse) {
                            if (mediaA < mediaB) {
                                return 1;
                            }
                            if (mediaA > mediaB) {
                                return -1;
                            }
                        } else {
                            if (mediaA < mediaB) {
                                return -1;
                            }
                            if (mediaA > mediaB) {
                                return 1;
                            }
                        }
                        break;
                    case "studio": 
                        let studioA = "";
                        if(Object.keys(props.editableData[mediaA.toLowerCase()]["seasons"]).length >= 1) {
                            try {
                                studioA = props.editableData[mediaA.toLowerCase()]["seasons"][Object.keys(props.editableData[mediaA.toLowerCase()]["seasons"])[0]]["studio"].toUpperCase()
                            } catch {
                                studioA = ""
                            }
                        }
                        let studioB = "";
                        if(Object.keys(props.editableData[mediaB.toLowerCase()]["seasons"]).length >= 1) {
                            try {
                                studioB = props.editableData[mediaB.toLowerCase()]["seasons"][Object.keys(props.editableData[mediaB.toLowerCase()]["seasons"])[0]]["studio"].toUpperCase()
                            } catch {
                                studioB = ""
                            }
                        }

                        if(props.sortReverse) {
                            if (studioA < studioB) {
                                return 1;
                            }
                            if (studioA > studioB) {
                                return -1;
                            }
                        } else {
                            if (studioA < studioB) {
                                return -1;
                            }
                            if (studioA > studioB) {
                                return 1;
                            }
                        }
                        break;
                    case "rating":
                        let ratingA = getAverageRating(mediaA.toLowerCase());
                        let ratingB = getAverageRating(mediaB.toLowerCase());
                        if(props.sortReverse) {
                            if (ratingA < ratingB) {
                                return 1;
                            }
                            if (ratingA > ratingB) {
                                return -1;
                            }
                        } else {
                            if (ratingA < ratingB) {
                                return -1;
                            }
                            if (ratingA > ratingB) {
                                return 1;
                            }
                        }
                        break;
                    case "category":
                        let categoryA = props.editableData[mediaA.toLowerCase()].category
                        let categoryB = props.editableData[mediaB.toLowerCase()].category

                        if(props.sortReverse) {
                            if (categoryA < categoryB) {
                                return 1;
                            }
                            if (categoryA > categoryB) {
                                return -1;
                            }
                        } else {
                            if (categoryA < categoryB) {
                                return -1;
                            }
                            if (categoryA > categoryB) {
                                return 1;
                            }
                        }
                        break;
                    }
                  
                    // names must be equal
                    return 0;
                  }).map((media, idx) => {
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
                        <MediaRowComponent key={media} {...{...props, ...{media: media, studio: studio, getAverageRating: getAverageRating}}} />
                    )
                })
            }
        </div>
    )
}

export default MediaContainer