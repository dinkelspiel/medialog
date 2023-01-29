import { Button, TextField } from '@mui/material'
import React, { useState } from 'react'
import styles from "../styles/login.module.css"

const Login = () => {
    let [value, setValue] = useState("");
  
    return (
        <div className={styles.main}>
            <div className={styles.container}>
                <TextField fullWidth onChange={(e) => setValue(e.target.value)} />
                <Button variant="outlined" fullWidth onClick={() => {
                    console.log(value);
                    localStorage.setItem("password", value);
                    window.location.replace("/")
                }}>Log in</Button>
            </div>
        </div>
  )
}

export default Login