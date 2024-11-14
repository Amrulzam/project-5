import React from 'react';
import './Sender.css';
import {Box, Typography} from '@mui/material';

const Sender = ({props}) => {
  return (
    <div className='sender-wrapper'>
        <div className="sender-time">
            <p>{props.time}</p>
        </div>
         <Box sx={{
            maxwidth:"60%",
            width:"auto",
            marginTop:"15px",
            marginLeft:"10px",
            marginRight:"10px",
            padding:"7px",
            borderRadius:"8px",
            height:"fit-content",
            backgroundColor:"rgb(127, 148, 155)",
            color:"whitesmoke",
        }}>
            <Typography sx={{
            height: "auto",
            wordBreak: "break-word",
            overflowWrap: "break-word" /* Break lines within words */,
            whiteSpace: "pre-wrap",
          }}>{props.msg}</Typography>
        </Box>
        <div className="sender-img">
            <img src={props.img} alt="" />
        </div>
    </div>
  )
}

export default Sender

