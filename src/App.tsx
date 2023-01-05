import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, RouteProps } from 'react-router-dom';
import { Provider } from 'mobx-react';

import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import { deepOrange, blueGrey } from '@material-ui/core/colors';

import { stores } from './stores';

import { AuthRoot } from './views/AuthRoot';
import { AppRoot } from './views/AppRoot';

import './App.css';

const theme = createTheme({
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
export const App: React.FC<RouteProps | any> = (props) => {
  return (
    <Provider {...stores}>
      <Router>
        <ThemeProvider theme={theme}>
          <Routes>
            <Route path="/auth/*" element={<AuthRoot {...props} />} />
            <Route path="/app/*" element={<AppRoot {...props} />} />
            <Route path="*" element={<Navigate to="/app/files" />} />
          </Routes>
        </ThemeProvider>
      </Router>
    </Provider>
  );
};
