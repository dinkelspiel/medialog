import { MenuBook, Movie, Podcasts, Tv } from '@mui/icons-material'
import React from 'react'
import styles from "./media.module.css"

const MediaRowComponent = (props) => {
    function getCategoryIcon(category) {
        switch(category) {
          case "series":
            return <Tv />
          case "movie":
            return <Movie />
          case "podcast":
            return <Podcasts />
          case "book":
            return <MenuBook />
        }
    }

    return (
        <div key={props.media} className={styles.row} onClick={() => { props.setEditMedia(props.media); props.setSeasonState(0); props.setMobileState ? props.setMobileState(2) : () => {} }}>
            { props.editMedia == props.media ?
                <div className={styles.selected} />
                : ""
            }
            <img className={styles.image_spacer} src={props.editableData[props.media]["cover_url"] != undefined ? props.editableData[props.media]["cover_url"] : ""} height="64" width="64" />
            <div className={styles.name}>
                {props.editableData[props.media]["disname"]}
            </div>
            <div className={styles.studio}>
                {props.studio}
            </div>
            <div className={styles.rating}>
                {props.getAverageRating(props.media) != -1 ? props.getAverageRating(props.media) : ""}
            </div>
            <div className={styles.category}>
                {getCategoryIcon(props.editableData[props.media]["category"])}
            </div>
        </div>
    )
}

export default MediaRowComponent