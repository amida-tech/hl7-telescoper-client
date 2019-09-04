import React from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import { Provider } from 'mobx-react';

import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import { deepOrange, blueGrey } from '@material-ui/core/colors';

import { stores } from './stores';

import { AuthRoot } from './views/AuthRoot';
import { AppRoot } from './views/AppRoot';

import './App.css';

const theme = createMuiTheme({
  palette: {
    primary: blueGrey,
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
 * * Mobx Store
 * * Routing
 * * MUI Theme
 */
export const App: React.FC = () => {
  return (
    <Provider {...stores}>
      <Router>
        <ThemeProvider theme={theme}>
          <Switch>
            <Route path="/auth" component={AuthRoot} />
            <Route path="/app" component={AppRoot} />
            <Redirect to="/app" />
          </Switch>
        </ThemeProvider>
      </Router>
    </Provider>
  );
};
