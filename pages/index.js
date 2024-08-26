'use client'
import * as React from 'react';
import { Box, CssBaseline, Stack, TextField, Button, Typography} from "@mui/material";
import { useState } from "react";
import { useTheme, ThemeProvider, createTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import SendIcon from '@mui/icons-material/Send';
import Link from 'next/link'

const ColorModeContext = React.createContext({ toggleColorMode: () => {} });

function Home() {
  const theme = useTheme();
  const colorMode = React.useContext(ColorModeContext);
  const [inputMsg, setInputMsg] = useState("");
  const [msgs, setMsgs] = useState([{
    role: 'Bot',
    content: "Hello, my name is John. I am an expert on the Olympics and can answer any questions, or inquiries you have. Don't hesitate! Give me a question.",
  }]);

  const handleSendMsg = async () => {
    console.log("Sending prompt to bot...");
    const response = await fetch('/api/route', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify([...msgs, { role: 'User', content: inputMsg }]),
    });

    if (response.ok) {
      const data = await response.json();
      setMsgs([...msgs,
        { role: 'User', content: inputMsg },
        { role: 'Bot', content: data.text },
      ]);
    } else {
      console.error("Failed to fetch the response from the AI bot :(");
    }

    setInputMsg('');
  };

  return(
    <Box
      sx={{
      width: '100%',
      bgcolor: 'background.default',
      color: 'text.primary',
      borderColor: 'background.default',
      borderRadius: 1,
      p: 3,
      }}>
        <Link href="/" legacyBehavior>
          <a style={{textDecoration: 'none'}} onClick={(e) => {
            e.preventDefault(); //should prevent the default action from happening, learning something new :)
            window.location.href = '/';}}>
            <Typography color="text.primary">
              Olympic Expert
            </Typography>
          </a>
        </Link>
        <IconButton sx={{position: "absolute", top: 0, right: 0, ml: 1 }} onClick={colorMode.toggleColorMode} color="inherit">
          {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
        <Box 
          width="100vw" 
          height="100vh" 
          display="flex" 
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          bgcolor="background.default"
          color="text.primary">
          <Stack 
            display="flex"
            alignItems='center'
            justifyContent='center'
            direction="column"
            width="600px"
            height="650px"
            border="1px solid"
            p={2}
            spacing={3}
            borderRadius={4}>
              <Stack 
                direction="column" 
                spacing={2}
                flexGrow={1}
                overflow="auto"
                maxHeight="100%">
                  {
                    msgs.map((msg, index) => (
                      <Box key={index} display="flex" justifyContent={msg.role === 'Bot' ? 'flex-start' : 'flex-end'}>
                        <Box bgcolor={msg.role === 'Bot' ? 'text.primary' : 'text.secondary'} color="background.default" borderRadius={16} p={3}>
                          {
                            msg.content
                          }
                        </Box>
                      </Box>
                    )
                  )}
              </Stack>
              <Stack
                display="flex"
                flexDirection="row"
                width="100%">
                  <TextField label="Message" fullWidth variant="outlined" value={inputMsg} onChange={(e) => setInputMsg(e.target.value)} placeholder="Enter your message here.."/>
                  <Button varient="contained" onClick={handleSendMsg}><SendIcon size='50px'/></Button>
              </Stack>
          </Stack>
        </Box>
  </Box>
)
};

export default function ToggleColorMode() {
const [mode, setMode] = React.useState('light');
const colorMode = React.useMemo(
  () => ({
    toggleColorMode: () => {
      setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    },
  }),
  [],
);

const theme = React.useMemo(
  () =>
    createTheme({
      palette: {
        mode,
      },
    }),
  [mode],
);

return (
  <ColorModeContext.Provider value={colorMode}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Home />
    </ThemeProvider>
  </ColorModeContext.Provider>
);
}
