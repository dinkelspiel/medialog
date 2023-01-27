import { Button, TextField } from '@mui/material'
import React, { useState } from 'react'
import styles from "../styles/login.module.css"

const login = () => {
    let [value, setValue] = useState("");
  
    return (
    <div className={styles.main}>
        <TextField onChange={(e) => setValue(e.target.value)} />
        <Button variant="outlined" onClick={() => {
            console.log(value);
            localStorage.setItem("password", value);
            window.location.replace("/")
        }}>Log in</Button>
    </div>
  )
}

export default login