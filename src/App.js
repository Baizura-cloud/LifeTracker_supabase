
import React, { Component } from "react";
import Grid from "@mui/material/Grid";
import Calendar from "./components/calendar";
import Tasklist from "./components/tasklist";
import Container from "@mui/material/Container";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Typography } from "@mui/material";
import { spacing } from '@mui/system';
import { flex } from '@mui/system';

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

class App extends Component {
  render() {
    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <main>
          <Typography variant="h3" align="center" sx={{margin:6}} gutterBottom={true}>
            LIFE TRACKER
          </Typography>
          <Container maxWidth="xl"  disableGutters={true}>
            <Grid container spacing={spacing(2)} sx={{ flex: 1 }}>
              <Grid item xs={12} md={8} sx={{ flex: 1, marginBottom:2}}  >
                <Calendar />
              </Grid>
              <Grid item xs={12} md={4} sx={{ flex: 2 }}  >
                <Tasklist />
              </Grid>
            </Grid>
          </Container>
        </main>
      </ThemeProvider>
    );
  }
}

export default App;
