import { Add, Tune, Sort } from '@mui/icons-material'
import { IconButton, MenuItem, Switch, TextField, Select, Button } from '@mui/material'
import React, { useState } from 'react'
import styles from "./options.module.css"
import OptionsFilterComponent from './OptionsFilterComponent'
import OptionsCreateComponent from './OptionsCreateComponent'
import OptionsSortComponent from './OptionsSortComponent'

const OptionsContainer = (props) => {
  let [state, setState] = useState(1)

  return (
    <div className={styles.options_container} ref={props.setRef}>
        <div className={styles.header}>
          <div className={styles.item}>
            <div className={styles.icon_button}><IconButton onClick={() => {setState(0)}}><Add /></IconButton></div>
            { state == 0 ?
              <div className={styles.selected_item} /> : ""
            }
          </div>
          <div className={styles.item}>
            <div className={styles.icon_button}><IconButton onClick={() => {setState(1)}}><Tune /></IconButton></div>
            { state == 1 ?
              <div className={styles.selected_item} /> : ""
            }
          </div>
          <div className={styles.item}>
            <div className={styles.icon_button}><IconButton onClick={() => {setState(2)}}><Sort /></IconButton></div>
            { state == 2 ?
              <div className={styles.selected_item} /> : ""
            }
          </div>
        </div>

        { state == 1 ?
          <OptionsFilterComponent {...props.filterProps} />
          : state == 0 ?
            <OptionsCreateComponent {...props.createProps} />
          :
            <OptionsSortComponent {...props.sortProps} />
      }

      </div>
  )
}

export default OptionsContainer
