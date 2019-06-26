import React from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";

import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import deepOrange from '@material-ui/core/colors/deepOrange';

import { AuthRoot } from './views/AuthRoot';
import { AppRoot } from './views/AppRoot';

import './App.css';

const theme = createMuiTheme({
  palette: {
    primary: blue,
    secondary: deepOrange,
  },
  props: {
    MuiButtonBase: {
      disableRipple: true,
    },
  },
});

/*
 * Here we define and provide root level services including:
 * * Routing
 * * MUI Theme
 * * Mobx Store
 */
export const App: React.FC = () => {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <Switch>
          <Route path="/auth" component={AuthRoot} />
          <Route path="/app" component={AppRoot} />
          <Redirect to="/app" />
        </Switch>
      </ThemeProvider>
    </Router>
  );
}
