import React from 'react';
import { BrowserRouter as Router, Route, NavLink, Redirect, Switch } from "react-router-dom";

import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import deepOrange from '@material-ui/core/colors/deepOrange';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';

import './App.css';

const theme = createMuiTheme({
  palette: {
    primary: blue,
    secondary: deepOrange,
  },
});

const App: React.FC = () => {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <AppBar position="static">
          <Toolbar>
            <NavLink to="/upload">
              <Button color="inherit">
                Upload HL7
              </Button>
            </NavLink>
            <NavLink to="/explore">
              <Button color="inherit">
                Explore HL7
              </Button>
            </NavLink>
          </Toolbar>
        </AppBar>
        <Switch>
          <Route path="/upload">
            Uploading
          </Route>
          <Route path="/explore">
            Exploring
          </Route>
          <Redirect to="/explore" />
        </Switch>
      </ThemeProvider>
    </Router>
  );
}

export default App;
