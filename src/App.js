
import React, { Component } from "react";
import Grid from "@mui/material/Grid";
import Calendar from "./components/calendar";
import Tasklist from "./components/tasklist";
import Container from "@mui/material/Container";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Typography } from "@mui/material";
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
          <Container maxWidth="xl" disableGutters={true}>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Calendar />
              </Grid>
              <Grid item xs={4}>
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
