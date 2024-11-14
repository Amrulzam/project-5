import React,{useState} from 'react';
import { Stack, Box, IconButton } from '@mui/material';
import {ChatDots, Users, Phone, GearSix, UserCirclePlus, MagnifyingGlass} from "@phosphor-icons/react";


const SideBar = () => {

    const [selected, setSelected] = useState(1);

    const sidebtn= [
        {
            index:1,
            btn:<ChatDots size={22} color="#000" />
        },
        {
            index:2,
            btn:<Users size={22} color="#000" />
        },
        {
            index:3,
            btn:<Phone size={22} color="#000" />
        },
        {
            index:4,
            btn:<GearSix size={22} color="#000" />
        }
    ]

  return (
    <div className='side-bar-wrapper'>
         <Stack
            direction="column"
            sx={{
                width:"100%",
                justifyContent: "space-between",
                alignItems:"center",
                borderRight:0.3,
                height: "100vh",

             }}
        >
            <Box sx={{
                marginTop:"30px"
            }}>
                <Stack direction="column"
                spacing={5}
                sx={{
                    alignItems:"center"
                }}>
                    {
                        sidebtn.map((x)=>{
                            return (selected==x.index?<IconButton key={x.index}sx={{
                                borderRadius:1,
                                bgcolor:"lightBlue",
                                '&:hover':{
                                    bgcolor:"lightblue"
                                }
                            }} onClick={()=>{setSelected(x.index)}}>
                                {x.btn}
                                </IconButton>:<IconButton key={x.index}sx={{
                                borderRadius:1,
                                '&:hover':{
                                    bgcolor:"lightblue"
                                }
                            }} onClick={()=>{setSelected(x.index)}}>
                                {x.btn}
                                </IconButton>)
                        })
                    }
                </Stack>

            </Box>
            <Box sx={{
                marginBottom:"20px"
            }}>
                <IconButton><UserCirclePlus size={32} /></IconButton>
            </Box>
        </Stack>
    </div>
  )
}

export default SideBar

