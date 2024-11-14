import React from 'react';
import { Stack, Box, IconButton,Icon, Typography } from '@mui/material';
import { MagnifyingGlass, Archive } from '@phosphor-icons/react';

import ChatCard from './chatCard/ChatCard';


const Chats = () => {
  return (
    <div className='chats-wrapper'>
        <Stack direction="column"
        sx={{
            width:"100%",
            borderRight:0.3,
            minWidth:"330px",
            height:"100vh",
            alignItems:"center",
            overflow:'auto',
        }}>
            <Box sx={{
                justifyContent:"flex-start",
                alignItems:'center',
                marginTop:"10px",
            }} >
                <p style={{fontSize:"min(5vw,1.9rem)",fontWeight:600,marginTop:0,marginBottom:"10px"}}>Chats</p>

                <Box sx={{ /* search input */
                    width:"100%",
                    marginInline:"auto",
                }} >
                    <Stack direction="row"
                    sx={{
                        width:"max-content",
                        border:0.3,
                        borderRadius:5,
                        height:"40px",
                        alignItems:"center",
                        justifyContent:"flex-start",
                        paddingLeft:"15px",
                        overflow:"hidden",
                    }} >
                        <MagnifyingGlass size={25} height="inherit"/>
                        <Box sx={{
                            height:"inherit",
                        }}>
                            <input type="text" style={{height:"inherit",border:"none",fontSize:"1.2rem",paddingLeft:"10px",backgroundColor:"trsnsperant",marginBottom:"10px"}} placeholder="Search" onFocus={(e)=>{e.target.style.outline="none"}}/>
                        </Box>
                    </Stack>
                </Box>

            </Box>
            <Box sx={{
                width:"90%",
                marginBottom:"10px",
            }}>
                <Stack direction="row" sx={{
                    alignItems:"center",
                }}>
                    <IconButton><Archive size={25} /></IconButton><Typography variant='subtitle2' sx={{cursor:"pointer"}}>Archives</Typography>
                </Stack>
            </Box>
            <Box sx={{
                width:"90%",
            }}>
                <Stack direction="column"
                sx={{
                    width:"100%",
                }}>
                    <ChatCard props={{
                    img:"assets/pic1.jpg",
                    name:"Ariana",
                    lastMsg:"How are you?",
                    msgCount:1,
                    time:"yesterday"
                    }} />
                    <ChatCard props={{
                    img:"assets/pic1.jpg",
                    name:"Ariana",
                    lastMsg:"How are you?",
                    msgCount:1,
                    time:"yesterday"
                    }} />
                    <ChatCard props={{
                    img:"assets/pic1.jpg",
                    name:"Ariana",
                    lastMsg:"How are you?",
                    msgCount:1,
                    time:"yesterday"
                    }} />
                    <ChatCard props={{
                    img:"assets/pic1.jpg",
                    name:"Ariana",
                    lastMsg:"How are you?",
                    msgCount:1,
                    time:"yesterday"
                    }} /><ChatCard props={{
                        img:"assets/pic1.jpg",
                        name:"Ariana",
                        lastMsg:"How are you?",
                        msgCount:1,
                        time:"yesterday"
                        }} />
                        <ChatCard props={{
                    img:"assets/pic1.jpg",
                    name:"Ariana",
                    lastMsg:"How are you?",
                    msgCount:1,
                    time:"yesterday"
                    }} />
                    <ChatCard props={{
                    img:"assets/pic1.jpg",
                    name:"Ariana",
                    lastMsg:"How are you?",
                    msgCount:1,
                    time:"yesterday"
                    }} />
                    <ChatCard props={{
                    img:"assets/pic1.jpg",
                    name:"Ariana",
                    lastMsg:"How are you?",
                    msgCount:1,
                    time:"yesterday"
                    }} />
                    <ChatCard props={{
                    img:"assets/pic1.jpg",
                    name:"Ariana",
                    lastMsg:"How are you?",
                    msgCount:1,
                    time:"yesterday"
                    }} />
                    <ChatCard props={{
                    img:"assets/pic1.jpg",
                    name:"Ariana",
                    lastMsg:"How are you?",
                    msgCount:1,
                    time:"yesterday"
                    }} />
                    <ChatCard props={{
                    img:"assets/pic1.jpg",
                    name:"Ariana",
                    lastMsg:"How are you?",
                    msgCount:1,
                    time:"yesterday"
                    }} />
                    <ChatCard props={{
                    img:"assets/pic1.jpg",
                    name:"Ariana",
                    lastMsg:"How are you?",
                    msgCount:1,
                    time:"yesterday"
                    }} />
                    <ChatCard props={{
                    img:"assets/pic1.jpg",
                    name:"Ariana",
                    lastMsg:"How are you?",
                    msgCount:1,
                    time:"yesterday"
                    }} />
                </Stack>
            </Box>
        </Stack>
    </div>
  )
}

export default Chats
